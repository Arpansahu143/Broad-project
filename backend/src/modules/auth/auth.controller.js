import authService from "./auth.service.js";
import asyncHandler from "../../core/utils/asyncHandler.js";
import ApiResponse from "../../core/responses/ApiResponse.js";
import { HTTP_STATUS } from "../../core/constants/httpStatus.js";

class AuthController {
  register = asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);

    res.status(HTTP_STATUS.CREATED).json(
      new ApiResponse(
        HTTP_STATUS.CREATED,
        "User registered successfully",
        result
      )
    );
  });

  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Login successful",
        result
      )
    );
  });

  logout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    const result = await authService.logout(refreshToken);

    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        result.message
      )
    );
  });
}

export default new AuthController();