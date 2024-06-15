import User from "../models/user.model.js";
import APIError from "../utils/ApiError.js";
import APIResponse from "../utils/ApiResponse.js";

export async function registerUser(req, res, next) {
  const { username, email, password } = req.body;
  if (!username && !email) {
    return next(
      new APIError("Please provide email or username to register.", 401)
    );
  }
  try {
    const user = await User.create({ username, email, password });
    if (!user) {
      return next(
        new APIError("Error while registration, Please try again later", 500)
      );
    }

    const { access_token, refresh_token } = await user.generateAuthTokens();
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    };
    res.cookie("access_token", access_token, cookieOptions);
    res.cookie("refresh_token", refresh_token, cookieOptions);

    const createdUser = await User.findOne(user._id).select(
      "-password -accessToken -refreshToken -googleId"
    );

    res.status(200).json(new APIResponse(createdUser.toJSON(), 200));
  } catch (error) {
    if (error instanceof APIError) {
      return res.status(error.statusCode).json(error.toJSON());
    } else if (error.name == "ValidationError" && error.errors.password) {
      return next(
        new APIError("Password must be atleast 8 characters long.", 400)
      );
    }
    console.error(error);
    next(
      new APIError(
        "Something went wrong from our side. Please try again later",
        500
      )
    );
  }
}
