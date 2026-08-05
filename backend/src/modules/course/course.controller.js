import courseService from "./course.service.js";
import asyncHandler from "../../core/utils/asyncHandler.js";
import ApiResponse from "../../core/responses/ApiResponse.js";
import { HTTP_STATUS } from "../../core/constants/httpStatus.js";

class CourseController {

    create = asyncHandler(async (req, res) => {

        const course = await courseService.createCourse(req.body);

        res.status(HTTP_STATUS.CREATED).json(
            new ApiResponse(
                HTTP_STATUS.CREATED,
                "Course created successfully",
                course
            )
        );
    });

    getAll = asyncHandler(async (req, res) => {

        const courses = await courseService.getAllCourses();

        res.status(HTTP_STATUS.OK).json(
            new ApiResponse(
                HTTP_STATUS.OK,
                "Courses fetched successfully",
                courses
            )
        );
    });

    getById = asyncHandler(async (req, res) => {

        const course = await courseService.getCourseById(req.params.id);

        res.status(HTTP_STATUS.OK).json(
            new ApiResponse(
                HTTP_STATUS.OK,
                "Course fetched successfully",
                course
            )
        );
    });

    update = asyncHandler(async (req, res) => {

        const course = await courseService.updateCourse(
            req.params.id,
            req.body
        );

        res.status(HTTP_STATUS.OK).json(
            new ApiResponse(
                HTTP_STATUS.OK,
                "Course updated successfully",
                course
            )
        );
    });

    delete = asyncHandler(async (req, res) => {

        await courseService.deleteCourse(req.params.id);

        res.status(HTTP_STATUS.OK).json(
            new ApiResponse(
                HTTP_STATUS.OK,
                "Course deleted successfully"
            )
        );
    });

    myCourses = asyncHandler(async (req, res) => {

        const courses = await courseService.getMyCourses(req.user);

        res.status(HTTP_STATUS.OK).json(
            new ApiResponse(
                HTTP_STATUS.OK,
                "Your courses fetched successfully",
                courses
            )
        );
    });

    enroll = asyncHandler(async (req, res) => {

        const enrollment = await courseService.enrollSelf(
            req.user.id,
            req.params.id
        );

        res.status(HTTP_STATUS.CREATED).json(
            new ApiResponse(
                HTTP_STATUS.CREATED,
                "Enrolled successfully",
                enrollment
            )
        );
    });

    unenroll = asyncHandler(async (req, res) => {

        await courseService.unenrollSelf(req.user.id, req.params.id);

        res.status(HTTP_STATUS.OK).json(
            new ApiResponse(
                HTTP_STATUS.OK,
                "Unenrolled successfully"
            )
        );
    });

}

export default new CourseController();
