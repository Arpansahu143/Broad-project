import departmentService from "./department.service.js";
import asyncHandler from "../../core/utils/asyncHandler.js";
import ApiResponse from "../../core/responses/ApiResponse.js";
import { HTTP_STATUS } from "../../core/constants/httpStatus.js";

class DepartmentController {

    create = asyncHandler(async (req, res) => {

        const department = await departmentService.createDepartment(req.body);

        res.status(HTTP_STATUS.CREATED).json(
            new ApiResponse(
                HTTP_STATUS.CREATED,
                "Department created successfully",
                department
            )
        );
    });

    getAll = asyncHandler(async (req, res) => {

        const departments = await departmentService.getAllDepartments();

        res.status(HTTP_STATUS.OK).json(
            new ApiResponse(
                HTTP_STATUS.OK,
                "Departments fetched successfully",
                departments
            )
        );
    });

    getById = asyncHandler(async (req, res) => {

        const department = await departmentService.getDepartmentById(
            req.params.id
        );

        res.status(HTTP_STATUS.OK).json(
            new ApiResponse(
                HTTP_STATUS.OK,
                "Department fetched successfully",
                department
            )
        );
    });

    update = asyncHandler(async (req, res) => {

        const department = await departmentService.updateDepartment(
            req.params.id,
            req.body
        );

        res.status(HTTP_STATUS.OK).json(
            new ApiResponse(
                HTTP_STATUS.OK,
                "Department updated successfully",
                department
            )
        );
    });

    delete = asyncHandler(async (req, res) => {

        await departmentService.deleteDepartment(req.params.id);

        res.status(HTTP_STATUS.OK).json(
            new ApiResponse(
                HTTP_STATUS.OK,
                "Department deleted successfully"
            )
        );
    });

    statistics = asyncHandler(async (req, res) => {

        const statistics =
            await departmentService.getDepartmentStatistics();

        res.status(HTTP_STATUS.OK).json(
            new ApiResponse(
                HTTP_STATUS.OK,
                "Department statistics fetched successfully",
                statistics
            )
        );
    });

}

export default new DepartmentController();