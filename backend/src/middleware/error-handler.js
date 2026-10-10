export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    status: false,
    message: err.message || "Something went wrong try again later",
  });
};
