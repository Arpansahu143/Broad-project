import prisma from "../../core/prisma/prisma.js";

const notificationSelect = {
    id: true,
    title: true,
    description: true,
    category: true,
    createdAt: true,
    createdBy: {
        select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
        },
    },
};

class NotificationRepository {

    async create(data) {
        return await prisma.notification.create({
            data,
            select: notificationSelect,
        });
    }

    async findAll() {
        return await prisma.notification.findMany({
            select: notificationSelect,
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    async findById(id) {
        return await prisma.notification.findUnique({
            where: { id },
            select: notificationSelect,
        });
    }

    async delete(id) {
        return await prisma.notification.delete({
            where: { id },
        });
    }
}

export default new NotificationRepository();
