import notificationRepository from "./notification.repository.js";
import ApiError from "../../core/errors/ApiError.js";
import { HTTP_STATUS } from "../../core/constants/httpStatus.js";

class NotificationService {

    async createNotification(createdById, data) {
        return await notificationRepository.create({
            ...data,
            createdById,
        });
    }

    async getAllNotifications() {
        return await notificationRepository.findAll();
    }

    async deleteNotification(id) {
        const notification = await notificationRepository.findById(id);

        if (!notification) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Notification not found");
        }

        return await notificationRepository.delete(id);
    }
}

export default new NotificationService();
