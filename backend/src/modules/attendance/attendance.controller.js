import attendanceService from "./attendance.service.js";
import asyncHandler from "../../core/utils/asyncHandler.js";
import ApiResponse from "../../core/responses/ApiResponse.js";
import { HTTP_STATUS } from "../../core/constants/httpStatus.js";

class AttendanceController {

    mark = asyncHandler(async (req, res) => {

        const result = await attendanceService.markAttendance(
            req.user,
            req.body
        );

        res.status(HTTP_STATUS.OK).json(
            new ApiResponse(
                HTTP_STATUS.OK,
                "Attendance saved",
                result
            )
        );
    });

    getByCourse = asyncHandler(async (req, res) => {

        const records = await attendanceService.getCourseAttendance(
            req.user,
            req.params.courseId,
            req.query.date
        );

        res.status(HTTP_STATUS.OK).json(
            new ApiResponse(
                HTTP_STATUS.OK,
                "Attendance fetched successfully",
                records
            )
        );
    });

    getMy = asyncHandler(async (req, res) => {

        const summary = await attendanceService.getMyAttendance(req.user.id);

        res.status(HTTP_STATUS.OK).json(
            new ApiResponse(
                HTTP_STATUS.OK,
                "Your attendance fetched successfully",
                summary
            )
        );
    });

}

export default new AttendanceController();
