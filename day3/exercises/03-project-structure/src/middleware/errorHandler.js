/**
 * Centralized error handling middleware
 * Đặt CUỐI CÙNG trong app.js, sau tất cả routes
 */

function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.path}`,
    code: "NOT_FOUND",
  });
}

function errorHandler(err, req, res, next) {
  // - Log lỗi ra console
  console.error("[ERROR]", err.message);

  // - Nếu err.type === "entity.parse.failed" -> 400 Invalid JSON
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      error: "Invalid JSON in request body",
    });
  }

  // - Trả về err.statusCode (nếu có) hoặc 500
  // - Trong development: thêm stack vào response
  // - Không expose stack trong production
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

module.exports = { notFoundHandler, errorHandler };
