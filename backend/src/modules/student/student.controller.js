import studentService from "./student.service.js";
import asyncHandler from "../../core/utils/asyncHandler.js";
import ApiResponse from "../../core/responses/ApiResponse.js";
import { HTTP_STATUS } from "../../core/constants/httpStatus.js";

class StudentController {
  // Create Student
  create = asyncHandler(async (req, res) => {
    const student = await studentService.createStudent(req.body);

    res.status(HTTP_STATUS.CREATED).json(
      new ApiResponse(
        HTTP_STATUS.CREATED,
        "Student created successfully",
        student
      )
    );
  });

  // Get All Students
  getAll = asyncHandler(async (req, res) => {
    const students = await studentService.getAllStudents();

    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Students fetched successfully",
        students
      )
    );
  });

  // Get Student By ID
  getById = asyncHandler(async (req, res) => {
    const student = await studentService.getStudentById(req.params.id);

    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Student fetched successfully",
        student
      )
    );
  });

  // Get Logged In Student Profile
  getProfile = asyncHandler(async (req, res) => {
    const student = await studentService.getMyProfile(req.user.id);

    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Student profile fetched successfully",
        student
      )
    );
  });

  // Update Student
  update = asyncHandler(async (req, res) => {
    const student = await studentService.updateStudent(
      req.params.id,
      req.body
    );

    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Student updated successfully",
        student
      )
    );
  });

  // Delete Student
  delete = asyncHandler(async (req, res) => {
    await studentService.deleteStudent(req.params.id);

    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Student deleted successfully"
      )
    );
  });
}

export default new StudentController();