import facultyRepository from "./faculty.repository.js";
import ApiError from "../../core/errors/ApiError.js";
import { HTTP_STATUS } from "../../core/constants/httpStatus.js";

class FacultyService {
  async createFaculty(data) {
    return await facultyRepository.create(data);
  }

  async getAllFaculty() {
    return await facultyRepository.findAll();
  }

  async getFacultyById(id) {
    const faculty = await facultyRepository.findById(id);

    if (!faculty) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Faculty not found"
      );
    }

    return faculty;
  }

  async getMyProfile(userId) {
    const faculty = await facultyRepository.findByUserId(userId);

    if (!faculty) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Faculty profile not found"
      );
    }

    return faculty;
  }

  async updateFaculty(id, data) {
    const faculty = await facultyRepository.findById(id);

    if (!faculty) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Faculty not found"
      );
    }

    return await facultyRepository.update(id, data);
  }

  async deleteFaculty(id) {
    const faculty = await facultyRepository.findById(id);

    if (!faculty) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Faculty not found"
      );
    }

    return await facultyRepository.delete(id);
  }
}

export default new FacultyService();
