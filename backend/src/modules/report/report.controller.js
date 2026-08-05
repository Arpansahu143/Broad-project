import reportService from "./report.service.js";
import asyncHandler from "../../core/utils/asyncHandler.js";
import ApiResponse from "../../core/responses/ApiResponse.js";
import { HTTP_STATUS } from "../../core/constants/httpStatus.js";

class ReportController {

    getSummary = asyncHandler(async (req, res) => {
        const summary = await reportService.getDashboardSummary();

        res.status(HTTP_STATUS.OK).json(
            new ApiResponse(
                HTTP_STATUS.OK,
                "Report summary fetched successfully",
                summary
            )
        );
    });
}

export default new ReportController();
