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

class FacultyRepository {

    async create(data) {
        return await prisma.faculty.create({
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
        return await prisma.faculty.findMany({
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
        return await prisma.faculty.findUnique({
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
        return await prisma.faculty.findUnique({
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

    async findByEmployeeId(employeeId) {
        return await prisma.faculty.findUnique({
            where: {
                employeeId,
            },
        });
    }

    async update(id, data) {
        return await prisma.faculty.update({
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
        return await prisma.faculty.delete({
            where: {
                id,
            },
        });
    }
}

export default new FacultyRepository();
