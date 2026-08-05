import attendanceRepository from "./attendance.repository.js";
import courseRepository from "../course/course.repository.js";
import facultyRepository from "../faculty/faculty.repository.js";
import studentRepository from "../student/student.repository.js";
import ApiError from "../../core/errors/ApiError.js";
import { HTTP_STATUS } from "../../core/constants/httpStatus.js";
import { ROLES } from "../../core/constants/roles.js";

function normalizeDate(dateInput) {
    // Store attendance as a date-only value (midnight UTC) so the
    // @@unique([enrollmentId, date]) constraint means "one record per
    // student per course per day", regardless of what time it was marked.
    const datePart = String(dateInput).split("T")[0];
    return new Date(`${datePart}T00:00:00.000Z`);
}

class AttendanceService {

    /**
     * FACULTY marks attendance for their own course, in bulk, for one day.
     * ADMIN can mark for any course (override).
     */
    async markAttendance(user, { courseId, date, records }) {

        const course = await courseRepository.findById(courseId);

        if (!course) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Course not found");
        }

        let markedById;

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
                    "You can only mark attendance for courses you teach"
                );
            }

            markedById = faculty.id;

        } else {
            // ADMIN override — attributes the record to the course's
            // assigned faculty if one exists, otherwise rejects (a record
            // must be attributable to a faculty member).
            if (!course.facultyId) {
                throw new ApiError(
                    HTTP_STATUS.BAD_REQUEST,
                    "This course has no faculty assigned yet — assign one before marking attendance"
                );
            }
            markedById = course.facultyId;
        }

        const normalizedDate = normalizeDate(date);

        const results = [];
        const errors = [];

        for (const record of records) {

            const enrollment = await attendanceRepository.findEnrollment(
                record.studentId,
                courseId
            );

            if (!enrollment) {
                errors.push({
                    studentId: record.studentId,
                    reason: "Student is not enrolled in this course",
                });
                continue;
            }

            const saved = await attendanceRepository.upsertRecord(
                enrollment.id,
                normalizedDate,
                record.status,
                markedById
            );

            results.push(saved);
        }

        return { saved: results, errors };
    }

    async getCourseAttendance(user, courseId, date) {

        const course = await courseRepository.findById(courseId);

        if (!course) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Course not found");
        }

        if (user.role === ROLES.FACULTY) {

            const faculty = await facultyRepository.findByUserId(user.id);

            if (!faculty || course.facultyId !== faculty.id) {
                throw new ApiError(
                    HTTP_STATUS.FORBIDDEN,
                    "You can only view attendance for courses you teach"
                );
            }
        }

        if (date) {
            return await attendanceRepository.findByCourseAndDate(
                courseId,
                normalizeDate(date)
            );
        }

        return await attendanceRepository.findByCourseId(courseId);
    }

    async getMyAttendance(userId) {

        const student = await studentRepository.findByUserId(userId);

        if (!student) {
            throw new ApiError(
                HTTP_STATUS.NOT_FOUND,
                "Student profile not found for this account"
            );
        }

        const records = await attendanceRepository.findByStudentId(student.id);

        // Group by course and compute a percentage — the actual thing a
        // student cares about, not a raw list of rows.
        const byCourse = {};

        for (const record of records) {
            const courseId = record.enrollment.course.id;

            if (!byCourse[courseId]) {
                byCourse[courseId] = {
                    course: record.enrollment.course,
                    total: 0,
                    present: 0,
                    records: [],
                };
            }

            byCourse[courseId].total += 1;
            if (record.status === "PRESENT" || record.status === "LATE") {
                byCourse[courseId].present += 1;
            }
            byCourse[courseId].records.push({
                date: record.date,
                status: record.status,
            });
        }

        return Object.values(byCourse).map((entry) => ({
            course: entry.course,
            totalClasses: entry.total,
            attended: entry.present,
            percentage:
                entry.total === 0
                    ? 0
                    : Math.round((entry.present / entry.total) * 1000) / 10,
            records: entry.records,
        }));
    }
}

export default new AttendanceService();
