import facultyService from "./faculty.service.js";
import asyncHandler from "../../core/utils/asyncHandler.js";
import ApiResponse from "../../core/responses/ApiResponse.js";
import { HTTP_STATUS } from "../../core/constants/httpStatus.js";

class FacultyController {
  // Create Faculty
  create = asyncHandler(async (req, res) => {
    const faculty = await facultyService.createFaculty(req.body);

    res.status(HTTP_STATUS.CREATED).json(
      new ApiResponse(
        HTTP_STATUS.CREATED,
        "Faculty created successfully",
        faculty
      )
    );
  });

  // Get All Faculty
  getAll = asyncHandler(async (req, res) => {
    const faculty = await facultyService.getAllFaculty();

    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Faculty fetched successfully",
        faculty
      )
    );
  });

  // Get Faculty By ID
  getById = asyncHandler(async (req, res) => {
    const faculty = await facultyService.getFacultyById(req.params.id);

    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Faculty fetched successfully",
        faculty
      )
    );
  });

  // Get Logged In Faculty Profile
  getProfile = asyncHandler(async (req, res) => {
    const faculty = await facultyService.getMyProfile(req.user.id);

    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Faculty profile fetched successfully",
        faculty
      )
    );
  });

  // Update Faculty
  update = asyncHandler(async (req, res) => {
    const faculty = await facultyService.updateFaculty(
      req.params.id,
      req.body
    );

    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Faculty updated successfully",
        faculty
      )
    );
  });

  // Delete Faculty
  delete = asyncHandler(async (req, res) => {
    await facultyService.deleteFaculty(req.params.id);

    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Faculty deleted successfully"
      )
    );
  });
}

export default new FacultyController();
