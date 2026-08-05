import courseRepository from "./course.repository.js";
import studentRepository from "../student/student.repository.js";
import facultyRepository from "../faculty/faculty.repository.js";
import ApiError from "../../core/errors/ApiError.js";
import { HTTP_STATUS } from "../../core/constants/httpStatus.js";
import { ROLES } from "../../core/constants/roles.js";

class CourseService {

    async createCourse(data) {

        const existingCode = await courseRepository.findByCode(data.code);

        if (existingCode) {
            throw new ApiError(
                HTTP_STATUS.CONFLICT,
                "Course code already exists"
            );
        }

        return await courseRepository.create(data);
    }

    async getAllCourses() {
        return await courseRepository.findAll();
    }

    async getCourseById(id) {

        const course = await courseRepository.findById(id);

        if (!course) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Course not found");
        }

        return course;
    }

    async updateCourse(id, data) {

        const course = await courseRepository.findById(id);

        if (!course) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Course not found");
        }

        if (data.code && data.code !== course.code) {

            const existing = await courseRepository.findByCode(data.code);

            if (existing) {
                throw new ApiError(
                    HTTP_STATUS.CONFLICT,
                    "Course code already exists"
                );
            }
        }

        return await courseRepository.update(id, data);
    }

    async deleteCourse(id) {

        const course = await courseRepository.findById(id);

        if (!course) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Course not found");
        }

        const enrollments = await courseRepository.countEnrollments(id);

        if (enrollments > 0) {
            throw new ApiError(
                HTTP_STATUS.BAD_REQUEST,
                "Course has enrolled students and cannot be deleted"
            );
        }

        return await courseRepository.delete(id);
    }

    /**
     * Role-aware "my courses":
     * - FACULTY  -> courses they teach
     * - STUDENT  -> courses they're enrolled in
     */
    async getMyCourses(user) {

        if (user.role === ROLES.FACULTY) {

            const faculty = await facultyRepository.findByUserId(user.id);

            if (!faculty) {
                throw new ApiError(
                    HTTP_STATUS.NOT_FOUND,
                    "Faculty profile not found for this account"
                );
            }

            return await courseRepository.findByFacultyId(faculty.id);
        }

        if (user.role === ROLES.STUDENT) {

            const student = await studentRepository.findByUserId(user.id);

            if (!student) {
                throw new ApiError(
                    HTTP_STATUS.NOT_FOUND,
                    "Student profile not found for this account"
                );
            }

            const enrollments =
                await courseRepository.findEnrollmentsByStudentId(student.id);

            return enrollments.map((enrollment) => ({
                enrollmentId: enrollment.id,
                semester: enrollment.semester,
                enrolledAt: enrollment.createdAt,
                course: enrollment.course,
            }));
        }

        throw new ApiError(
            HTTP_STATUS.BAD_REQUEST,
            "My courses is only available for faculty and student accounts"
        );
    }

    /* ============ Self-service enrollment (STUDENT) ============ */

    async enrollSelf(userId, courseId) {

        const student = await studentRepository.findByUserId(userId);

        if (!student) {
            throw new ApiError(
                HTTP_STATUS.NOT_FOUND,
                "Student profile not found for this account"
            );
        }

        const course = await courseRepository.findById(courseId);

        if (!course) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Course not found");
        }

        const existing =
            await courseRepository.findEnrollment(student.id, courseId);

        if (existing) {
            throw new ApiError(
                HTTP_STATUS.CONFLICT,
                "Already enrolled in this course"
            );
        }

        return await courseRepository.createEnrollment(
            student.id,
            courseId,
            student.semester
        );
    }

    async unenrollSelf(userId, courseId) {

        const student = await studentRepository.findByUserId(userId);

        if (!student) {
            throw new ApiError(
                HTTP_STATUS.NOT_FOUND,
                "Student profile not found for this account"
            );
        }

        const existing =
            await courseRepository.findEnrollment(student.id, courseId);

        if (!existing) {
            throw new ApiError(
                HTTP_STATUS.NOT_FOUND,
                "You are not enrolled in this course"
            );
        }

        return await courseRepository.deleteEnrollment(student.id, courseId);
    }
}

export default new CourseService();
