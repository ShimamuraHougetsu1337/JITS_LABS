/**
 * Homework - TODO REST API
 * Day 2 - Bài tập về nhà
 *
 * Nâng cấp TODO app từ Day 1 thành REST API với Express.js
 *
 * ĐIỂM KHÁC BIỆT SO VỚI DAY 1:
 * - Thay vì hàm JavaScript thuần, giờ dùng HTTP endpoints
 * - Client giao tiếp qua HTTP request (Postman, curl, browser)
 * - Response trả về JSON với format nhất quán
 *
 * Endpoints cần implement:
 * GET    /api/todos              - Lấy danh sách (có filter)
 * POST   /api/todos              - Tạo todo mới
 * GET    /api/todos/:id          - Lấy todo theo id
 * PATCH  /api/todos/:id          - Cập nhật todo (title, priority, completed)
 * DELETE /api/todos/:id          - Xóa todo
 * PATCH  /api/todos/:id/complete - Đánh dấu hoàn thành (shortcut)
 *
 * Chạy: node todo-api.js
 * Test: curl http://localhost:3005/api/todos
 */

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.json());

// ============================================================
// Data Store (in-memory, giữ từ Day 1)
// ============================================================

let todos = [];
let nextId = 1;

const VALID_PRIORITIES = ["low", "medium", "high"];
const VALID_FILTERS = ["all", "active", "completed"];

// ============================================================
// Helper: Response format nhất quán
// ============================================================

/**
 * TODO: Implement 2 helper function
 *
 * successResponse(res, data, statusCode = 200, message = null)
 * -> res.status(statusCode).json({ success: true, data, message })
 *
 * errorResponse(res, message, statusCode = 400, code = "ERROR")
 * -> res.status(statusCode).json({ success: false, error: message, code })
 */

// TODO: implement successResponse
function successResponse(res, data, statusCode = 200, message = null) {
  // Implement ở đây
  // Hint: nếu message null thì không include vào response
  const body = { success: true, data };
  if (message) body.message = message;
  return res.status(statusCode).json(body);
}

// TODO: implement errorResponse
function errorResponse(res, message, statusCode = 400, code = "ERROR") {
  // Implement ở đây
  return res.status(statusCode).json({ success: false, error: message, code });
}

// ============================================================
// Middleware: Request Logger
// ============================================================

/**
 * TODO: Copy requestLogger middleware từ bài 3
 * hoặc viết lại theo cách của bạn
 */
function requestLogger(req, res, next) {
  const start = Date.now();
  const timestamp = () => new Date().toISOString();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  req.id = requestId;
  res.set("X-Request-ID", requestId);
  console.log(`[${timestamp()}] --> ${req.method} ${req.path}`);
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[${timestamp()}] <-- ${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  next();
}

app.use(requestLogger);

// ============================================================
// GET /api/todos
// ============================================================

/**
 * TODO: Implement lấy danh sách todos
 *
 * Query params:
 * - filter  : "all" | "active" | "completed" (default: "all")
 * - priority: "low" | "medium" | "high" (lọc theo priority)
 * - search  : tìm kiếm trong title (case-insensitive)
 * - sort    : "createdAt" | "priority" | "title" (default: "createdAt")
 * - order   : "asc" | "desc" (default: "asc")
 *
 * Response 200:
 * {
 *   "success": true,
 *   "data": [...todos],
 *   "total": <số lượng sau filter>,
 *   "filters": { filter, priority, search }
 * }
 *
 * Validation:
 * - filter không hợp lệ -> 400 { error: "Invalid filter value" }
 * - priority không hợp lệ -> 400 { error: "Invalid priority value" }
 */
app.get("/api/todos", (req, res) => {
  // TODO: implement
  // 1. Lấy query params
  const { filter = "all", priority, search, sort = "createdAt", order = "asc" } = req.query;

  // 2. Validate filter
  if (!VALID_FILTERS.includes(filter)) {
    return errorResponse(res, "Invalid filter value");
  }

  // 3. Validate priority nếu có
  if (priority && !VALID_PRIORITIES.includes(priority)) {
    return errorResponse(res, "Invalid priority value");
  }

  // TODO: implement filter logic
  let result = [...todos];

  // TODO: filter by status (filter param)
  if (filter !== "all") {
    result = result.filter((todo) => todo.completed === (filter === "completed"));
  }

  // TODO: filter by priority
  if (priority) {
    result = result.filter((todo) => todo.priority === priority);
  }

  // TODO: search by title
  if (search) {
    result = result.filter((todo) => todo.title.toLowerCase().includes(search.toLowerCase()));
  }

  // TODO: sort
  result.sort((a, b) => {
    if (sort === "createdAt") {
      return order === "asc" ? a.createdAt - b.createdAt : b.createdAt - a.createdAt;
    }
    if (sort === "priority") {
      return order === "asc" ? VALID_PRIORITIES.indexOf(a.priority) - VALID_PRIORITIES.indexOf(b.priority) : VALID_PRIORITIES.indexOf(b.priority) - VALID_PRIORITIES.indexOf(a.priority);
    }
    if (sort === "title") {
      return order === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    }
    return 0;
  });

  return res.status(200).json({
    success: true,
    data: result,
    total: result.length,
    filters: { filter, priority: priority || null, search: search || null },
  });
});

// ============================================================
// POST /api/todos
// ============================================================

/**
 * TODO: Implement tạo todo mới
 *
 * Request body:
 * {
 *   "title": "Học Express.js",        <- bắt buộc, không rỗng, tối đa 200 ký tự
 *   "priority": "high"                <- tùy chọn, default "medium"
 * }
 *
 * Response 201:
 * {
 *   "success": true,
 *   "data": <todo mới>,
 *   "message": "Todo created successfully"
 * }
 *
 * Validation:
 * - Thiếu title -> 400
 * - title rỗng (sau trim) -> 400
 * - title quá 200 ký tự -> 400
 * - priority không hợp lệ -> 400
 */
app.post("/api/todos", (req, res) => {
  // TODO: implement
  const { title, priority = "medium" } = req.body;

  // TODO: validate title
  if (!title) {
    return errorResponse(res, "Title is required");
  }
  if (title.trim().length === 0) {
    return errorResponse(res, "Title cannot be empty");
  }
  if (title.trim().length > 200) {
    return errorResponse(res, "Title cannot be longer than 200 characters");
  }
  // TODO: validate priority
  if (priority && !VALID_PRIORITIES.includes(priority)) {
    return errorResponse(res, "Invalid priority value");
  }
  // TODO: tạo todo object với: id, title (trimmed), priority, completed: false, createdAt: new Date()
  const todo = {
    id: nextId++,
    title: title.trim(),
    priority,
    completed: false,
    createdAt: new Date(),
  };
  // TODO: push vào todos array
  todos.push(todo);
  // TODO: return 201
  return res.status(201).json({
    success: true,
    data: todo,
    message: "Todo created successfully",
  });
});

// ============================================================
// GET /api/todos/:id
// ============================================================

/**
 * TODO: Implement lấy todo theo id
 *
 * Response 200: { "success": true, "data": <todo> }
 * Response 400: ID không hợp lệ
 * Response 404: Todo không tồn tại
 */
app.get("/api/todos/:id", (req, res) => {
  // TODO: implement
  // 1. Parse và validate id (phải là số nguyên dương)
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return errorResponse(res, "Invalid todo ID");
  }
  // 2. Tìm todo theo id
  const todo = todos.find((todo) => todo.id === id);
  // 3. 404 nếu không tìm thấy
  if (!todo) {
    return errorResponse(res, "Todo not found");
  }
  return successResponse(res, todo);
});

// ============================================================
// PATCH /api/todos/:id
// ============================================================

/**
 * TODO: Implement cập nhật todo (PATCH - chỉ update field có trong body)
 *
 * Các field có thể update:
 * - title     : string, không rỗng, tối đa 200 ký tự
 * - priority  : "low" | "medium" | "high"
 * - completed : boolean
 *
 * Không cho phép update: id, createdAt
 *
 * Response 200: { "success": true, "data": <todo sau update>, "message": "Todo updated" }
 * Response 400: Body rỗng, hoặc validation lỗi
 * Response 404: Todo không tồn tại
 *
 * Ví dụ:
 * PATCH /api/todos/1 { "completed": true }           -> chỉ update completed
 * PATCH /api/todos/1 { "title": "New title" }        -> chỉ update title
 * PATCH /api/todos/1 { "priority": "high", "title": "Updated" }  -> update 2 fields
 */
app.patch("/api/todos/:id", (req, res) => {
  // 1. Validate id
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return errorResponse(res, "Invalid todo ID");
  }

  // 2. Check body không rỗng
  if (!req.body || Object.keys(req.body).length === 0) {
    return errorResponse(res, "At least one field required for update");
  }

  // 3. Validate từng field có trong body nếu được truyền lên
  const { title, priority, completed } = req.body;

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim().length === 0) {
      return errorResponse(res, "Title cannot be empty");
    }
    if (title.trim().length > 200) {
      return errorResponse(res, "Title cannot be longer than 200 characters");
    }
  }

  if (priority !== undefined) {
    if (!VALID_PRIORITIES.includes(priority)) {
      return errorResponse(res, "Invalid priority value");
    }
  }

  if (completed !== undefined) {
    if (typeof completed !== "boolean") {
      return errorResponse(res, "Invalid completed value");
    }
  }

  // 4. Tìm todo, 404 nếu không tìm thấy
  const todo = todos.find((todo) => todo.id === id);
  if (!todo) {
    return errorResponse(res, "Todo not found");
  }

  // 5. Update chỉ các field có trong body
  if (title !== undefined) {
    todo.title = title.trim();
  }
  if (priority !== undefined) {
    todo.priority = priority;
  }
  if (completed !== undefined) {
    todo.completed = completed;
  }

  // 6. Thêm updatedAt: new Date() vào todo
  todo.updatedAt = new Date();

  return successResponse(res, todo, 200, "Todo updated");
});

// ============================================================
// PATCH /api/todos/:id/complete
// ============================================================

/**
 * TODO: Implement shortcut endpoint để đánh dấu hoàn thành
 *
 * Đây là "action endpoint" - không phải CRUD thuần túy
 * Nhưng chấp nhận được vì rõ ràng và tiện dùng
 *
 * Response 200: {
 *   "success": true,
 *   "data": <todo sau update>,
 *   "message": "Todo marked as completed"  hoặc  "Todo marked as active"
 * }
 *
 * Logic: toggle completed (true -> false, false -> true)
 *
 * Response 404: Todo không tồn tại
 */
app.patch("/api/todos/:id/complete", (req, res) => {
  // TODO: implement
  // Tìm todo, toggle completed, trả về kết quả
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return errorResponse(res, "Invalid todo ID");
  }
  const todo = todos.find((todo) => todo.id === id);
  if (!todo) {
    return errorResponse(res, "Todo not found");
  }
  todo.completed = !todo.completed;
  todo.updatedAt = new Date();
  return successResponse(res, todo, 200, "Todo updated");
});

// ============================================================
// DELETE /api/todos/:id
// ============================================================

/**
 * TODO: Implement xóa todo
 *
 * Response 200: { "success": true, "message": "Todo deleted successfully" }
 * Response 404: Todo không tồn tại
 */
app.delete("/api/todos/:id", (req, res) => {
  // TODO: implement
  // 1. Validate id
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return errorResponse(res, "Invalid todo ID");
  }
  // 2. Tìm index, 404 nếu không tìm thấy
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) {
    return errorResponse(res, "Todo not found");
  }
  // 3. Xóa khỏi mảng dùng splices
  todos.splice(index, 1);
  // 4. Return 200
  return successResponse(res, null, 200, "Todo deleted successfully");
});

// ============================================================
// BONUS: DELETE /api/todos/completed (xóa tất cả đã hoàn thành)
// ============================================================

/**
 * TODO (bonus): Implement xóa tất cả todos đã completed
 *
 * QUAN TRỌNG: Route này phải đặt TRƯỚC route /:id
 * Nếu không, Express hiểu "completed" là id -> 400 Invalid ID
 *
 * Hãy suy nghĩ: endpoint này nên đặt ở đâu trong file này?
 * -> Di chuyển lên TRƯỚC app.delete("/api/todos/:id", ...)
 *
 * Response 200: {
 *   "success": true,
 *   "message": "Deleted N completed todos",
 *   "deletedCount": N
 * }
 */

// ============================================================
// 404 & Error Handler
// ============================================================

app.use((req, res) => {
  errorResponse(res, `Cannot ${req.method} ${req.path}`, 404, "NOT_FOUND");
});

app.use((err, req, res, next) => {
  console.error("[ERROR]", err.message);

  if (err.type === "entity.parse.failed") {
    return errorResponse(res, "Invalid JSON in request body", 400, "INVALID_JSON");
  }

  errorResponse(res, err.message || "Internal Server Error", err.statusCode || 500, "INTERNAL_ERROR");
});

// ============================================================
// Start Server
// ============================================================

loadData()

app.listen(PORT, () => {
  console.log(`\nTODO API running on http://localhost:${PORT}`);
  console.log("\n--- Hướng dẫn test ---");
  console.log(`\n# 1. Tạo vài todos:`);
  console.log(`curl -X POST http://localhost:${PORT}/api/todos \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -d '{"title":"Học Express.js","priority":"high"}'`);
  console.log(`\ncurl -X POST http://localhost:${PORT}/api/todos \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -d '{"title":"Làm bài tập REST API","priority":"high"}'`);
  console.log(`\ncurl -X POST http://localhost:${PORT}/api/todos \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -d '{"title":"Đọc tài liệu middleware"}'`);
  console.log(`\n# 2. Lấy danh sách:`);
  console.log(`curl http://localhost:${PORT}/api/todos`);
  console.log(`curl "http://localhost:${PORT}/api/todos?filter=active&priority=high"`);
  console.log(`curl "http://localhost:${PORT}/api/todos?search=express"`);
  console.log(`\n# 3. Lấy todo theo id:`);
  console.log(`curl http://localhost:${PORT}/api/todos/1`);
  console.log(`\n# 4. Đánh dấu hoàn thành:`);
  console.log(`curl -X PATCH http://localhost:${PORT}/api/todos/1/complete`);
  console.log(`\n# 5. Cập nhật todo:`);
  console.log(`curl -X PATCH http://localhost:${PORT}/api/todos/2 \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -d '{"title":"Làm bài tập REST API (đã update)","priority":"medium"}'`);
  console.log(`\n# 6. Xóa todo:`);
  console.log(`curl -X DELETE http://localhost:${PORT}/api/todos/3`);
  console.log(`\n# 7. Test validation error:`);
  console.log(`curl -X POST http://localhost:${PORT}/api/todos -H "Content-Type: application/json" -d '{}'`);
  console.log(`curl -X POST http://localhost:${PORT}/api/todos -H "Content-Type: application/json" -d '{"title":"","priority":"invalid"}'`);
  console.log(`\n# 8. Test 404:`);
  console.log(`curl http://localhost:${PORT}/api/todos/999`);
  console.log(`curl -X DELETE http://localhost:${PORT}/api/todos/999`);
});

// ============================================================
// BONUS: Lưu vào file JSON (nếu đã hoàn thành phần trên)
// ============================================================

/**
 * TODO (bonus): Thêm tính năng persistence
 *
 * Khi server khởi động: đọc data từ todos.json (nếu có)
 * Khi tạo/sửa/xóa todo: ghi lại vào todos.json
 *
 * Dùng fs.promises (đã học Day 1)
 * Đặt file: todos.json cùng thư mục với file này
 *
 * Gợi ý:
 * - Tạo async function loadData() và saveData()
 * - Gọi loadData() trước khi start server
 * - Gọi saveData() sau mỗi operation thay đổi data
 *
 * Lưu ý: await không dùng được ở top-level trong CommonJS
 * Cách xử lý:
 *
 * async function startServer() {
 *   await loadData();
 *   app.listen(PORT, () => { ... });
 * }
 * startServer();
 */

const fs = require("fs").promises;
const path = require("path");
const DATA_FILE = path.join(__dirname, "todos.json");

async function loadData() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(data);
    todos = parsed.todos || [];
    nextId = parsed.nextId || 1;
    console.log(`Loaded ${todos.length} todos from file`);
  } catch {
    console.log("No existing data file, starting fresh");
  }
}

async function saveData() {
  await fs.writeFile(DATA_FILE, JSON.stringify({ todos, nextId }, null, 2));
}
