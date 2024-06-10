import APIError from "../utils/ApiError.js";

export const errorMiddleware = (err, req, res, next) => {
  if (err instanceof APIError) {
    return res.status(err.statusCode).json(err.toJSON());
  }
  console.error(err);
  res.status(500).json({ error: { message: "Internal Server Error" } });
};
