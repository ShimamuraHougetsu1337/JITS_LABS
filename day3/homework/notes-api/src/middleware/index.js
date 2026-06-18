const jwt = require("jsonwebtoken");

/**
 * TODO: Implement validate middleware (copy từ bài tập 1)
 */
function validate(schema, source = "body") {
  return (req, res, next) => {
    // TODO: implement
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true
    });
    if (error) {
      const details = error.details.map(d => ({
        field: d.path.join("."),
        message: d.message
      }));
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details
      });
    }
    req[source] = value;
    next();
  };
}

/**
 * TODO: Implement authenticate middleware (copy từ bài tập 2)
 * - Đọc Authorization: Bearer <token>
 * - Verify JWT
 * - req.user = decoded
 */
function authenticate(req, res, next) {
  // TODO: implement
  const authHeader = req.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Authentication required.",
    });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          error: "Token expired. Please login again.",
        });
      }
      return res.status(401).json({
        success: false,
        error: "Invalid token.",
      });
    }
    req.user = decoded;
    next();
  });
}

/**
 * TODO: Implement authorize factory (copy từ bài tập 2)
 */
function authorize(...roles) {
  return (req, res, next) => {
    // TODO: implement
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized",
      });
    }
    next();
  };
}

function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.path}`,
  });
}

function errorHandler(err, req, res, next) {
  console.error("[ERROR]", err.message);

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, error: "Invalid JSON" });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

module.exports = { validate, authenticate, authorize, notFoundHandler, errorHandler };
