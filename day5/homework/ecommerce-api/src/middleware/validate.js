/**
 * Validation middleware factory
 * Reused từ Day 3 pattern
 */

"use strict";

/**
 * Validate req.body, req.query, hoặc req.params với Joi schema.
 *
 * @param {import("joi").Schema} schema
 * @param {"body"|"query"|"params"} target
 */
const validate = (schema, target = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[target], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((d) => ({
        field: d.path.join("."),
        message: d.message,
      }));
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details,
      });
    }

    if (target === "query") {
      for (const key of Object.keys(req.query)) {
        delete req.query[key];
      }
      Object.assign(req.query, value);
    } else {
      req[target] = value; // gán lại giá trị đã sanitize
    }
    next();
  };
};

module.exports = validate;
