import prisma from "../../core/prisma/prisma.js";

const examSelect = {
    id: true,
    title: true,
    examType: true,
    maxMarks: true,
    examDate: true,
    courseId: true,
    createdAt: true,
    updatedAt: true,
    course: {
        select: {
            id: true,
            code: true,
            name: true,
        },
    },
    createdBy: {
        select: {
            id: true,
            user: {
                select: { firstName: true, lastName: true },
            },
        },
    },
};

const gradeSelect = {
    id: true,
    marksObtained: true,
    remarks: true,
    createdAt: true,
    updatedAt: true,
    enrollment: {
        select: {
            id: true,
            studentId: true,
            student: {
                select: {
                    id: true,
                    studentId: true,
                    user: {
                        select: { firstName: true, lastName: true },
                    },
                },
            },
        },
    },
};

class ExamRepository {

    async create(data) {
        return prisma.exam.create({
            data,
            select: examSelect,
        });
    }

    async findById(id) {
        return prisma.exam.findUnique({
            where: { id },
        });
    }

    async findByIdDetailed(id) {
        return prisma.exam.findUnique({
            where: { id },
            select: examSelect,
        });
    }

    async findByCourseId(courseId) {
        return prisma.exam.findMany({
            where: { courseId },
            select: {
                ...examSelect,
                _count: { select: { grades: true } },
            },
            orderBy: { examDate: "desc" },
        });
    }

    async findEnrollment(studentId, courseId) {
        return prisma.enrollment.findUnique({
            where: {
                studentId_courseId: { studentId, courseId },
            },
        });
    }

    async upsertGrade(examId, enrollmentId, marksObtained, remarks, gradedById) {
        return prisma.grade.upsert({
            where: {
                examId_enrollmentId: { examId, enrollmentId },
            },
            update: {
                marksObtained,
                remarks,
                gradedById,
            },
            create: {
                examId,
                enrollmentId,
                marksObtained,
                remarks,
                gradedById,
            },
            select: gradeSelect,
        });
    }

    async findGradesByExamId(examId) {
        return prisma.grade.findMany({
            where: { examId },
            select: gradeSelect,
        });
    }

    async findGradesByStudentId(studentId) {
        return prisma.grade.findMany({
            where: {
                enrollment: { studentId },
            },
            select: {
                id: true,
                marksObtained: true,
                remarks: true,
                createdAt: true,
                exam: {
                    select: examSelect,
                },
            },
            orderBy: { createdAt: "desc" },
        });
    }
}

export default new ExamRepository();
