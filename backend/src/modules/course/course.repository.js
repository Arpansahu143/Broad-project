import prisma from "../../core/prisma/prisma.js";

const courseSelect = {
    id: true,
    code: true,
    name: true,
    credits: true,
    departmentId: true,
    facultyId: true,
    createdAt: true,
    updatedAt: true,
    department: {
        select: {
            id: true,
            name: true,
            code: true,
        },
    },
    faculty: {
        select: {
            id: true,
            employeeId: true,
            user: {
                select: {
                    firstName: true,
                    lastName: true,
                },
            },
        },
    },
};

class CourseRepository {

    async create(data) {
        return prisma.course.create({
            data,
            select: courseSelect,
        });
    }

    async findAll() {
        return prisma.course.findMany({
            select: {
                ...courseSelect,
                _count: {
                    select: {
                        enrollments: true,
                    },
                },
            },
            orderBy: {
                code: "asc",
            },
        });
    }

    async findById(id) {
        return prisma.course.findUnique({
            where: { id },
            select: {
                ...courseSelect,
                enrollments: {
                    select: {
                        id: true,
                        semester: true,
                        student: {
                            select: {
                                id: true,
                                studentId: true,
                                user: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }

    async findByCode(code) {
        return prisma.course.findUnique({
            where: { code },
        });
    }

    async findByFacultyId(facultyId) {
        return prisma.course.findMany({
            where: { facultyId },
            select: {
                ...courseSelect,
                _count: {
                    select: {
                        enrollments: true,
                    },
                },
            },
            orderBy: { code: "asc" },
        });
    }

    async update(id, data) {
        return prisma.course.update({
            where: { id },
            data,
            select: courseSelect,
        });
    }

    async delete(id) {
        return prisma.course.delete({
            where: { id },
        });
    }

    async countEnrollments(id) {
        return prisma.enrollment.count({
            where: { courseId: id },
        });
    }

    /* ============ Enrollment ============ */

    async findEnrollmentsByStudentId(studentId) {
        return prisma.enrollment.findMany({
            where: { studentId },
            select: {
                id: true,
                semester: true,
                createdAt: true,
                course: {
                    select: courseSelect,
                },
            },
            orderBy: { createdAt: "desc" },
        });
    }

    async findEnrollment(studentId, courseId) {
        return prisma.enrollment.findUnique({
            where: {
                studentId_courseId: {
                    studentId,
                    courseId,
                },
            },
        });
    }

    async createEnrollment(studentId, courseId, semester) {
        return prisma.enrollment.create({
            data: {
                studentId,
                courseId,
                semester,
            },
        });
    }

    async deleteEnrollment(studentId, courseId) {
        return prisma.enrollment.delete({
            where: {
                studentId_courseId: {
                    studentId,
                    courseId,
                },
            },
        });
    }
}

export default new CourseRepository();
