import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import APIError from "../utils/ApiError.js";

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    avatar: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      minlength: 8,
    },
    accessToken: {
      type: String,
      required: false,
    },
    refreshToken: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.generateAuthTokens = async function () {
  const access_token = jwt.sign(
    { _id: this._id, email: this.email.toString() },
    process.env.ACCESS_TOKEN_JWT_SECRET,
    { expiresIn: "1d" }
  );
  const refresh_token = jwt.sign(
    { _id: this._id, email: this.email },
    process.env.REFRESH_TOKEN_JWT_SECRET,
    { expiresIn: "15d" }
  );
  this.accessToken = access_token;
  this.refreshToken = refresh_token;

  await this.save();

  return { access_token, refresh_token };
};

userSchema.methods.setPassword = async function (password) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(password, salt);
  await this.save();
};

userSchema.statics.findUserByEmail = async function (email, password) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new APIError("Invalid Email ID", 404);
  }
  if (!user.password) {
    throw new APIError(
      "Password not set, Please login using google login.",
      400
    );
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new APIError("Invalid credentials", 401);
  }
  return user;
};

userSchema.statics.findUserByRefreshToken = async function (refreshToken) {
  try {
    const { _id, email } = jwt.verify(refreshToken);
    const user = await User.findById(_id);
    if (!user) {
      throw new APIError("Something went wrong, Please login again", 401);
    }
    return { user, _id, email };
  } catch (error) {
    throw new APIError("Something went wrong from our side.", 500);
  }
};

userSchema.statics.refreshAccessToken = async function (refreshToken) {
  const { user, email, _id } = await this.findUserByRefreshToken(refreshToken);

  if (!user) {
    throw new APIError("Something went wrong, Please login again", 401);
  }

  const access_token = jwt.sign(
    { _id, email },
    process.env.ACCESS_TOKEN_JWT_SECRET,
    { expiresIn: "1d" }
  );

  const new_refresh_token = jwt.sign(
    { _id, email },
    process.env.REFRESH_TOKEN_JWT_SECRET,
    { expiresIn: "15d" }
  );
  user.accessToken = access_token;
  user.refreshToken = new_refresh_token;
  await user.save();
  return { access_token, refresh_token: new_refresh_token };
};

const User = model("User", userSchema);

export default User;
