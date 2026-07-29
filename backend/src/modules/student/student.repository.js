import prisma from "../../core/prisma/prisma.js";

const userSelect = {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    role: true,
    profileImage: true,
};

const departmentSelect = {
    id: true,
    name: true,
    code: true,
};

class StudentRepository {

    async create(data) {
        return await prisma.student.create({
            data,
            include: {
                user: {
                    select: userSelect,
                },
                department: {
                    select: departmentSelect,
                },
            },
        });
    }

    async findAll() {
        return await prisma.student.findMany({
            include: {
                user: {
                    select: userSelect,
                },
                department: {
                    select: departmentSelect,
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    async findById(id) {
        return await prisma.student.findUnique({
            where: {
                id,
            },
            include: {
                user: {
                    select: userSelect,
                },
                department: {
                    select: departmentSelect,
                },
            },
        });
    }

    async findByUserId(userId) {
        return await prisma.student.findUnique({
            where: {
                userId,
            },
            include: {
                user: {
                    select: userSelect,
                },
                department: {
                    select: departmentSelect,
                },
            },
        });
    }

    async findByStudentId(studentId) {
        return await prisma.student.findUnique({
            where: {
                studentId,
            },
        });
    }

    async update(id, data) {
        return await prisma.student.update({
            where: {
                id,
            },
            data,
            include: {
                user: {
                    select: userSelect,
                },
                department: {
                    select: departmentSelect,
                },
            },
        });
    }

    async delete(id) {
        return await prisma.student.delete({
            where: {
                id,
            },
        });
    }
}

export default new StudentRepository(); 