import prisma from "../../core/prisma/prisma.js";

const departmentSelect = {
    id: true,
    name: true,
    code: true,
    description: true,
    createdAt: true,
    updatedAt: true,
};

class DepartmentRepository {

    async create(data) {
        return prisma.department.create({
            data,
            select: departmentSelect,
        });
    }

    async findAll() {
        return prisma.department.findMany({
            select: {
                ...departmentSelect,
                _count: {
                    select: {
                        students: true,
                    },
                },
            },
            orderBy: {
                name: "asc",
            },
        });
    }

    async findById(id) {
        return prisma.department.findUnique({
            where: { id },
            select: {
                ...departmentSelect,
                students: {
                    select: {
                        id: true,
                        studentId: true,
                        semester: true,
                        cgpa: true,
                        attendance: true,
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });
    }

    async findByName(name) {
        return prisma.department.findUnique({
            where: {
                name,
            },
        });
    }

    async findByCode(code) {
        return prisma.department.findUnique({
            where: {
                code,
            },
        });
    }

    async update(id, data) {
        return prisma.department.update({
            where: {
                id,
            },
            data,
            select: departmentSelect,
        });
    }

    async delete(id) {
        return prisma.department.delete({
            where: {
                id,
            },
        });
    }

    async countStudents(id) {
        return prisma.student.count({
            where: {
                departmentId: id,
            },
        });
    }
}

export default new DepartmentRepository();