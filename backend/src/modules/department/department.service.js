import departmentRepository from "./department.repository.js";
import ApiError from "../../core/errors/ApiError.js";
import { HTTP_STATUS } from "../../core/constants/httpStatus.js";

class DepartmentService {

    async createDepartment(data) {

        const existingDepartment =
            await departmentRepository.findByName(data.name);

        if (existingDepartment) {
            throw new ApiError(
                HTTP_STATUS.CONFLICT,
                "Department name already exists"
            );
        }

        const existingCode =
            await departmentRepository.findByCode(data.code);

        if (existingCode) {
            throw new ApiError(
                HTTP_STATUS.CONFLICT,
                "Department code already exists"
            );
        }

        return await departmentRepository.create(data);
    }

    async getAllDepartments() {
        return await departmentRepository.findAll();
    }

    async getDepartmentById(id) {

        const department =
            await departmentRepository.findById(id);

        if (!department) {
            throw new ApiError(
                HTTP_STATUS.NOT_FOUND,
                "Department not found"
            );
        }

        return department;
    }

    async updateDepartment(id, data) {

        const department =
            await departmentRepository.findById(id);

        if (!department) {
            throw new ApiError(
                HTTP_STATUS.NOT_FOUND,
                "Department not found"
            );
        }

        if (data.name && data.name !== department.name) {

            const existing =
                await departmentRepository.findByName(data.name);

            if (existing) {
                throw new ApiError(
                    HTTP_STATUS.CONFLICT,
                    "Department name already exists"
                );
            }
        }

        if (data.code && data.code !== department.code) {

            const existing =
                await departmentRepository.findByCode(data.code);

            if (existing) {
                throw new ApiError(
                    HTTP_STATUS.CONFLICT,
                    "Department code already exists"
                );
            }
        }

        return await departmentRepository.update(id, data);
    }

    async deleteDepartment(id) {

        const department =
            await departmentRepository.findById(id);

        if (!department) {
            throw new ApiError(
                HTTP_STATUS.NOT_FOUND,
                "Department not found"
            );
        }

        const students =
            await departmentRepository.countStudents(id);

        if (students > 0) {

            throw new ApiError(
                HTTP_STATUS.BAD_REQUEST,
                "Department contains students and cannot be deleted"
            );
        }

        return await departmentRepository.delete(id);
    }

    async getDepartmentStatistics() {

        const departments =
            await departmentRepository.findAll();

        return departments.map((department) => ({
            id: department.id,
            name: department.name,
            code: department.code,
            totalStudents: department._count.students,
        }));
    }

}

export default new DepartmentService();