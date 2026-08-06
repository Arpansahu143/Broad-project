import examService from "./exam.service.js";
import asyncHandler from "../../core/utils/asyncHandler.js";
import ApiResponse from "../../core/responses/ApiResponse.js";
import { HTTP_STATUS } from "../../core/constants/httpStatus.js";

class ExamController {

    create = asyncHandler(async (req, res) => {
        const exam = await examService.createExam(req.user, req.body);

        res.status(HTTP_STATUS.CREATED).json(
            new ApiResponse(HTTP_STATUS.CREATED, "Exam created successfully", exam)
        );
    });

    getByCourse = asyncHandler(async (req, res) => {
        const exams = await examService.getCourseExams(req.user, req.params.courseId);

        res.status(HTTP_STATUS.OK).json(
            new ApiResponse(HTTP_STATUS.OK, "Exams fetched successfully", exams)
        );
    });

    enterGrades = asyncHandler(async (req, res) => {
        const result = await examService.enterGrades(
            req.user,
            req.params.examId,
            req.body.records
        );

        res.status(HTTP_STATUS.OK).json(
            new ApiResponse(HTTP_STATUS.OK, "Grades saved", result)
        );
    });

    getGrades = asyncHandler(async (req, res) => {
        const result = await examService.getExamGrades(req.user, req.params.examId);

        res.status(HTTP_STATUS.OK).json(
            new ApiResponse(HTTP_STATUS.OK, "Grades fetched successfully", result)
        );
    });

    getMy = asyncHandler(async (req, res) => {
        const summary = await examService.getMyGrades(req.user.id);

        res.status(HTTP_STATUS.OK).json(
            new ApiResponse(HTTP_STATUS.OK, "Your grades fetched successfully", summary)
        );
    });

}

export default new ExamController();
