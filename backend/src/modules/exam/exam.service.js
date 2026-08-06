import examRepository from "./exam.repository.js";
import courseRepository from "../course/course.repository.js";
import facultyRepository from "../faculty/faculty.repository.js";
import studentRepository from "../student/student.repository.js";
import ApiError from "../../core/errors/ApiError.js";
import { HTTP_STATUS } from "../../core/constants/httpStatus.js";
import { ROLES } from "../../core/constants/roles.js";

function normalizeDate(dateInput) {
    const datePart = String(dateInput).split("T")[0];
    return new Date(`${datePart}T00:00:00.000Z`);
}

class ExamService {

    /**
     * FACULTY creates an exam for their own course. ADMIN can create
     * for any course (override), same pattern as Attendance.
     */
    async createExam(user, { courseId, title, examType, maxMarks, examDate }) {

        const course = await courseRepository.findById(courseId);

        if (!course) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Course not found");
        }

        let createdById;

        if (user.role === ROLES.FACULTY) {

            const faculty = await facultyRepository.findByUserId(user.id);

            if (!faculty) {
                throw new ApiError(
                    HTTP_STATUS.NOT_FOUND,
                    "Faculty profile not found for this account"
                );
            }

            if (course.facultyId !== faculty.id) {
                throw new ApiError(
                    HTTP_STATUS.FORBIDDEN,
                    "You can only create exams for courses you teach"
                );
            }

            createdById = faculty.id;

        } else {
            if (!course.facultyId) {
                throw new ApiError(
                    HTTP_STATUS.BAD_REQUEST,
                    "This course has no faculty assigned yet — assign one before creating an exam"
                );
            }
            createdById = course.facultyId;
        }

        return await examRepository.create({
            courseId,
            title,
            examType,
            maxMarks,
            examDate: normalizeDate(examDate),
            createdById,
        });
    }

    async getCourseExams(user, courseId) {

        const course = await courseRepository.findById(courseId);

        if (!course) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Course not found");
        }

        if (user.role === ROLES.FACULTY) {
            const faculty = await facultyRepository.findByUserId(user.id);

            if (!faculty || course.facultyId !== faculty.id) {
                throw new ApiError(
                    HTTP_STATUS.FORBIDDEN,
                    "You can only view exams for courses you teach"
                );
            }
        }

        return await examRepository.findByCourseId(courseId);
    }

    /**
     * Bulk grade entry for one exam — same shape as bulk attendance
     * marking. Only the faculty who created the exam (or ADMIN) can
     * grade it, and only actually-enrolled students can be graded.
     */
    async enterGrades(user, examId, records) {

        const exam = await examRepository.findById(examId);

        if (!exam) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Exam not found");
        }

        let gradedById;

        if (user.role === ROLES.FACULTY) {

            const faculty = await facultyRepository.findByUserId(user.id);

            if (!faculty || exam.createdById !== faculty.id) {
                throw new ApiError(
                    HTTP_STATUS.FORBIDDEN,
                    "You can only grade exams you created"
                );
            }

            gradedById = faculty.id;

        } else {
            gradedById = exam.createdById;
        }

        const results = [];
        const errors = [];

        for (const record of records) {

            if (record.marksObtained > exam.maxMarks) {
                errors.push({
                    studentId: record.studentId,
                    reason: `marksObtained (${record.marksObtained}) exceeds maxMarks (${exam.maxMarks})`,
                });
                continue;
            }

            const enrollment = await examRepository.findEnrollment(
                record.studentId,
                exam.courseId
            );

            if (!enrollment) {
                errors.push({
                    studentId: record.studentId,
                    reason: "Student is not enrolled in this course",
                });
                continue;
            }

            const saved = await examRepository.upsertGrade(
                examId,
                enrollment.id,
                record.marksObtained,
                record.remarks || null,
                gradedById
            );

            results.push(saved);
        }

        return { saved: results, errors };
    }

    async getExamGrades(user, examId) {

        const exam = await examRepository.findByIdDetailed(examId);

        if (!exam) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Exam not found");
        }

        if (user.role === ROLES.FACULTY) {
            const faculty = await facultyRepository.findByUserId(user.id);

            if (!faculty || exam.createdBy.id !== faculty.id) {
                throw new ApiError(
                    HTTP_STATUS.FORBIDDEN,
                    "You can only view grades for exams you created"
                );
            }
        }

        const grades = await examRepository.findGradesByExamId(examId);

        return { exam, grades };
    }

    async getMyGrades(userId) {

        const student = await studentRepository.findByUserId(userId);

        if (!student) {
            throw new ApiError(
                HTTP_STATUS.NOT_FOUND,
                "Student profile not found for this account"
            );
        }

        const grades = await examRepository.findGradesByStudentId(student.id);

        // Group by course — same shape as attendance's "my attendance",
        // since a student thinks in terms of "how am I doing in this
        // course", not a flat list of exam rows.
        const byCourse = {};

        for (const grade of grades) {
            const courseId = grade.exam.course.id;

            if (!byCourse[courseId]) {
                byCourse[courseId] = {
                    course: grade.exam.course,
                    totalMaxMarks: 0,
                    totalObtained: 0,
                    grades: [],
                };
            }

            byCourse[courseId].totalMaxMarks += grade.exam.maxMarks;
            byCourse[courseId].totalObtained += grade.marksObtained;
            byCourse[courseId].grades.push({
                examId: grade.exam.id,
                title: grade.exam.title,
                examType: grade.exam.examType,
                examDate: grade.exam.examDate,
                maxMarks: grade.exam.maxMarks,
                marksObtained: grade.marksObtained,
                remarks: grade.remarks,
            });
        }

        return Object.values(byCourse).map((entry) => ({
            course: entry.course,
            percentage:
                entry.totalMaxMarks === 0
                    ? 0
                    : Math.round((entry.totalObtained / entry.totalMaxMarks) * 1000) / 10,
            grades: entry.grades,
        }));
    }
}

export default new ExamService();
