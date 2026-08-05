import prisma from "../../core/prisma/prisma.js";

const recordSelect = {
    id: true,
    date: true,
    status: true,
    createdAt: true,
    updatedAt: true,
    enrollment: {
        select: {
            id: true,
            studentId: true,
            courseId: true,
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
            course: {
                select: {
                    id: true,
                    code: true,
                    name: true,
                },
            },
        },
    },
    markedBy: {
        select: {
            id: true,
            user: {
                select: {
                    firstName: true,
                    lastName: true,
                },
            },
        },
    },
};

class AttendanceRepository {

    async findEnrollmentsByCourseId(courseId) {
        return prisma.enrollment.findMany({
            where: { courseId },
            select: {
                id: true,
                studentId: true,
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

    async upsertRecord(enrollmentId, date, status, markedById) {
        return prisma.attendanceRecord.upsert({
            where: {
                enrollmentId_date: {
                    enrollmentId,
                    date,
                },
            },
            update: {
                status,
                markedById,
            },
            create: {
                enrollmentId,
                date,
                status,
                markedById,
            },
            select: recordSelect,
        });
    }

    async findByCourseAndDate(courseId, date) {
        return prisma.attendanceRecord.findMany({
            where: {
                date,
                enrollment: { courseId },
            },
            select: recordSelect,
        });
    }

    async findByCourseId(courseId) {
        return prisma.attendanceRecord.findMany({
            where: {
                enrollment: { courseId },
            },
            select: recordSelect,
            orderBy: { date: "desc" },
        });
    }

    async findByStudentId(studentId) {
        return prisma.attendanceRecord.findMany({
            where: {
                enrollment: { studentId },
            },
            select: recordSelect,
            orderBy: { date: "desc" },
        });
    }
}

export default new AttendanceRepository();
