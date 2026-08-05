import notificationService from "./notification.service.js";
import asyncHandler from "../../core/utils/asyncHandler.js";
import ApiResponse from "../../core/responses/ApiResponse.js";
import { HTTP_STATUS } from "../../core/constants/httpStatus.js";

class NotificationController {

    create = asyncHandler(async (req, res) => {
        const notification = await notificationService.createNotification(
            req.user.id,
            req.body
        );

        res.status(HTTP_STATUS.CREATED).json(
            new ApiResponse(
                HTTP_STATUS.CREATED,
                "Notification created successfully",
                notification
            )
        );
    });

    getAll = asyncHandler(async (req, res) => {
        const notifications = await notificationService.getAllNotifications();

        res.status(HTTP_STATUS.OK).json(
            new ApiResponse(
                HTTP_STATUS.OK,
                "Notifications fetched successfully",
                notifications
            )
        );
    });

    delete = asyncHandler(async (req, res) => {
        await notificationService.deleteNotification(req.params.id);

        res.status(HTTP_STATUS.OK).json(
            new ApiResponse(
                HTTP_STATUS.OK,
                "Notification deleted successfully"
            )
        );
    });
}

export default new NotificationController();
