import studentRepository from "./student.repository.js";
import ApiError from "../../core/errors/ApiError.js";
import { HTTP_STATUS } from "../../core/constants/httpStatus.js";

class StudentService {
  async createStudent(data) {
    return await studentRepository.create(data);
  }

  async getAllStudents() {
    return await studentRepository.findAll();
  }

  async getStudentById(id) {
    const student = await studentRepository.findById(id);

    if (!student) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Student not found"
      );
    }

    return student;
  }

  async getMyProfile(userId) {
    const student = await studentRepository.findByUserId(userId);

    if (!student) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Student profile not found"
      );
    }

    return student;
  }

  async updateStudent(id, data) {
    const student = await studentRepository.findById(id);

    if (!student) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Student not found"
      );
    }

    return await studentRepository.update(id, data);
  }

  async deleteStudent(id) {
    const student = await studentRepository.findById(id);

    if (!student) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Student not found"
      );
    }

    return await studentRepository.delete(id);
  }
}

export default new StudentService();