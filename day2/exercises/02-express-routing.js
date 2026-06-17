/**
 * Bài tập 2 - Express Routing
 * Day 2 - Express.js & REST API
 *
 * Mục tiêu:
 * - Dùng Express thay cho http module
 * - Đọc dữ liệu từ params, query string, body, headers
 * - Hiểu sự khác biệt giữa các cách truyền data
 * - Dùng express.Router() để nhóm routes
 *
 * Chạy: node 02-express-routing.js
 * Test: curl http://localhost:3002/...
 */

const express = require("express");
const app = express();
const PORT = 3002;

// Middleware parse JSON body
app.use(express.json());

// ============================================================
// 2.1: Route cơ bản
// ============================================================

/**
 * TODO: Implement các route sau:
 *
 * GET /ping
 * -> 200 { message: "pong", timestamp: new Date().toISOString() }
 *
 * GET /hello/:name
 * -> 200 { message: "Hello, <name>!" }
 * -> Nếu name là "error" -> 400 { error: "Name cannot be 'error'" }
 *
 * GET /math/add?a=5&b=3
 * -> 200 { result: 8, operation: "add" }
 * -> Validate: a và b phải là số hợp lệ
 * -> Nếu không hợp lệ -> 400 { error: "a and b must be valid numbers" }
 *
 * POST /echo
 * -> 200, echo lại body nhận được + thêm field "receivedAt": new Date()
 * -> Nếu không có body -> 400 { error: "Request body is required" }
 */

// TODO 2.1.1: GET /ping
app.get("/ping", (req, res) => {
  // Implement ở đây
  res.status(200).json({ message: "pong", timestamp: new Date().toISOString() });
});

// TODO 2.1.2: GET /hello/:name
app.get("/hello/:name", (req, res) => {
  // Implement ở đây
  // Hint: req.params.name
  const name = req.params.name
  if (name === "error") {
    res.status(400).json({ error: "Name cannot be 'error'" });
    return;
  }
  res.status(200).json({ message: `Hello, ${name}!` });
});

// TODO 2.1.3: GET /math/add?a=5&b=3
app.get("/math/add", (req, res) => {
  // Implement ở đây
  // Hint: req.query.a, req.query.b (đều là string, cần convert sang số)
  // Dùng Number() hoặc parseFloat() để convert
  // isNaN() để validate
  const a = Number(req.query.a)
  const b = Number(req.query.b)
  if (isNaN(a) || isNaN(b)) {
    res.status(400).json({ error: "a and b must be valid numbers" });
    return;
  }
  res.status(200).json({ result: a + b, operation: "add" });
});

// TODO 2.1.4: POST /echo
app.post("/echo", (req, res) => {
  // Implement ở đây
  // Hint: Object.keys(req.body).length === 0 để check body rỗng
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).json({ error: "Request body is required" });
    return;
  }
  res.status(200).json({
    ...req.body,
    receivedAt: new Date()
  });
});

// ============================================================
// 2.2: Route Params nâng cao
// ============================================================

/**
 * TODO: Implement các route xử lý params phức tạp hơn:
 *
 * GET /users/:userId/posts/:postId
 * -> 200 {
 *      userId: <number>,
 *      postId: <number>,
 *      message: "Fetching post <postId> of user <userId>"
 *    }
 * -> Validate cả userId và postId phải là số nguyên dương
 *
 * GET /files/*
 * -> 200 { path: <phần path sau /files/>, segments: <array các phần> }
 * -> Ví dụ: GET /files/images/2024/photo.jpg
 * ->        { path: "images/2024/photo.jpg", segments: ["images", "2024", "photo.jpg"] }
 */

// TODO 2.2.1: GET /users/:userId/posts/:postId
app.get("/users/:userId/posts/:postId", (req, res) => {
  // Implement ở đây
  const userId = Number(req.params.userId)
  const postId = Number(req.params.postId)
  if (!Number.isInteger(userId) || !Number.isInteger(postId) || userId <= 0 || postId <= 0) {
    res.status(400).json({ error: "userId and postId must be valid positive integers" });
    return;
  }
  res.status(200).json({ userId, postId, message: `Fetching post ${postId} of user ${userId}` });
});

// TODO 2.2.2: GET /files/* (wildcard route)
app.get("/files/*", (req, res) => {
  // Implement ở đây
  // Hint: req.params[0] chứa phần wildcard
  const path = req.params[0];
  const segments = path.split("/");
  res.status(200).json({ path, segments });
});

// ============================================================
// 2.3: Query String nâng cao
// ============================================================

/**
 * Data mẫu cho bài này:
 */
const books = [
  { id: 1, title: "Clean Code", author: "Robert Martin", genre: "tech", year: 2008, price: 350000 },
  { id: 2, title: "The Pragmatic Programmer", author: "David Thomas", genre: "tech", year: 1999, price: 420000 },
  { id: 3, title: "Sapiens", author: "Yuval Noah Harari", genre: "history", year: 2011, price: 280000 },
  { id: 4, title: "Atomic Habits", author: "James Clear", genre: "self-help", year: 2018, price: 230000 },
  { id: 5, title: "Dune", author: "Frank Herbert", genre: "fiction", year: 1965, price: 190000 },
];

/**
 * TODO: Implement GET /books với các query string sau:
 *
 * Các query params được hỗ trợ:
 * - genre    : lọc theo genre (ví dụ: ?genre=tech)
 * - minPrice : lọc giá >= minPrice
 * - maxPrice : lọc giá <= maxPrice
 * - sort     : sắp xếp theo field (title, year, price)
 * - order    : "asc" (mặc định) hoặc "desc"
 * - search   : tìm kiếm theo title (case-insensitive)
 *
 * Response:
 * {
 *   "data": [...],
 *   "total": <số lượng kết quả sau filter>,
 *   "filters": { <các filter đang áp dụng> }
 * }
 *
 * Ví dụ:
 * GET /books?genre=tech&sort=price&order=asc
 * GET /books?minPrice=200000&maxPrice=400000&sort=year&order=desc
 * GET /books?search=code
 */
app.get("/books", (req, res) => {
  // Implement ở đây
  // Bước 1: Lấy các query params
  const { genre, minPrice, maxPrice, sort, order, search } = req.query;

  let result = [...books];
  const filtersApplied = {};

  if (genre) {
    result = result.filter((book) => book.genre === genre);
    filtersApplied.genre = genre;
  }
  if (minPrice) {
    const min = Number(minPrice);
    if (!isNaN(min)) {
      result = result.filter((book) => book.price >= min);
      filtersApplied.minPrice = min;
    }
  }
  if (maxPrice) {
    const max = Number(maxPrice);
    if (!isNaN(max)) {
      result = result.filter((book) => book.price <= max);
      filtersApplied.maxPrice = max;
    }
  }
  if (search) {
    result = result.filter((book) => book.title.toLowerCase().includes(search.toLowerCase()));
    filtersApplied.search = search;
  }

  // Bước 3: Sort
  if (sort) {
    const isAsc = order !== "desc";
    result.sort((a, b) => {
      if (a[sort] < b[sort]) {
        return isAsc ? -1 : 1;
      }
      if (a[sort] > b[sort]) {
        return isAsc ? 1 : -1;
      }
      return 0;
    });
  }

  // Bước 4: Trả về response
  res.status(200).json({
    data: result,
    total: result.length,
    filters: filtersApplied,
  });
});

// ============================================================
// 2.4: Request Headers
// ============================================================

/**
 * TODO: Implement các route làm việc với headers:
 *
 * GET /headers/info
 * -> 200, trả về thông tin từ headers:
 *    {
 *      userAgent: req.headers["user-agent"],
 *      acceptLanguage: req.headers["accept-language"],
 *      customHeader: req.headers["x-custom-header"] || null,
 *      allHeaders: req.headers
 *    }
 *
 * GET /headers/accept
 * -> Check header "Accept":
 *    - Nếu client accept "application/json" -> res.json({ data: "JSON response" })
 *    - Nếu client accept "text/plain" -> res.type("text").send("Plain text response")
 *    - Khác -> 406 Not Acceptable
 *
 * POST /headers/auth
 * -> Check header "X-API-Key":
 *    - Nếu không có -> 401 { error: "Missing X-API-Key header" }
 *    - Nếu key === "secret123" -> 200 { message: "Authenticated!", key: key }
 *    - Khác -> 401 { error: "Invalid API key" }
 */

// TODO 2.4.1: GET /headers/info
app.get("/headers/info", (req, res) => {
  // Implement ở đây
  const userAgent = req.headers["user-agent"]
  const acceptLanguage = req.headers["accept-language"]
  const customHeader = req.headers["x-custom-header"] || null
  const allHeaders = req.headers
  res.status(200).json({ userAgent, acceptLanguage, customHeader, allHeaders });
});

// TODO 2.4.2: GET /headers/accept
app.get("/headers/accept", (req, res) => {
  // Implement ở đây
  // Hint: req.headers.accept hoặc req.get("Accept")
  // Hint: .includes("application/json")
  const acceptHeader = req.get('accept')
  if (acceptHeader?.includes("application/json")) {
    return res.json({ data: "JSON response" })
  }
  if (acceptHeader?.includes("text/plain")) {
    return res.type("text").send("Plain text response")
  }
  res.status(406).json({ error: "Not Acceptable" })
});

// TODO 2.4.3: POST /headers/auth
app.post("/headers/auth", (req, res) => {
  // Implement ở đây
  // Hint: req.get("X-API-Key") hoặc req.headers["x-api-key"]
  const apiKey = req.get("X-API-Key")
  if (!apiKey) {
    return res.status(401).json({ error: "Missing X-API-Key header" })
  }
  if (apiKey === 'secret123') {
    return res.status(200).json({ message: "Authenticated!", key: apiKey })
  }
  res.status(401).json({ error: "Invalid API key" })
});

// ============================================================
// 2.5: express.Router()
// ============================================================

/**
 * TODO: Refactor các route /books thành một Router riêng
 * và các route /users/:id thành một Router riêng
 *
 * Cấu trúc:
 * - booksRouter: GET /, GET /:id, POST /, DELETE /:id
 * - usersRouter: GET /, GET /:id, POST /
 *
 * Mount tại: /api/v2/books và /api/v2/users
 */

const booksRouter = express.Router();
const usersRouter = express.Router();

// In-memory data
const users = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
];

// TODO 2.5.1: booksRouter
// GET /      -> lấy tất cả books (copy logic filter từ 2.3)
booksRouter.get("/", (req, res) => {
  // Bước 1: Lấy các query params
  const { genre, minPrice, maxPrice, sort, order, search } = req.query;

  let result = [...books];

  if (genre) {
    result = result.filter((book) => book.genre === genre);
  }
  if (minPrice) {
    const min = Number(minPrice);
    if (!isNaN(min)) {
      result = result.filter((book) => book.price >= min);
    }
  }
  if (maxPrice) {
    const max = Number(maxPrice);
    if (!isNaN(max)) {
      result = result.filter((book) => book.price <= max);
    }
  }
  if (search) {
    result = result.filter((book) => book.title.toLowerCase().includes(search.toLowerCase()));
  }

  // Bước 3: Sort
  if (sort) {
    const isAsc = order !== "desc";
    result.sort((a, b) => {
      if (a[sort] < b[sort]) {
        return isAsc ? -1 : 1;
      }
      if (a[sort] > b[sort]) {
        return isAsc ? 1 : -1;
      }
      return 0;
    });
  }
  res.json({ data: result });
});

// GET /:id   -> lấy book theo id, 404 nếu không tìm thấy
booksRouter.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const book = books.find((book) => book.id === id);
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  res.json(book);
});

// POST /     -> tạo book mới (validate: title và author là bắt buộc)
booksRouter.post("/", (req, res) => {
  const bookNew = req.body;
  if (!bookNew.title || !bookNew.author) {
    return res.status(400).json({ error: "Title and author are required" });
  }
  bookNew.id = books.length + 1;
  books.push(bookNew);
  res.status(201).json(bookNew);
});

// DELETE /:id -> xóa book, 404 nếu không tìm thấy
booksRouter.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const bookIndex = books.findIndex((book) => book.id === id);
  if (bookIndex === -1) {
    return res.status(404).json({ error: "Book not found" });
  }
  books.splice(bookIndex, 1);
  res.status(204).send();
});

// TODO 2.5.2: usersRouter
// GET /      -> lấy tất cả users
usersRouter.get("/", (req, res) => {
  res.json(users);
});

// GET /:id   -> lấy user theo id
usersRouter.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((user) => user.id === id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

// POST /     -> tạo user mới (validate: name và email bắt buộc, email phải có @)
usersRouter.post("/", (req, res) => {
  const userNew = req.body;
  if (!userNew.name || !userNew.email) {
    return res.status(400).json({ error: "Name and email are required" });
  }
  if (!userNew.email.includes("@")) {
    return res.status(400).json({ error: "Email must contain @" });
  }
  userNew.id = users.length + 1;
  users.push(userNew);
  res.status(201).json(userNew);
});

// Mount routers
app.use("/api/v2/books", booksRouter);
app.use("/api/v2/users", usersRouter);

// ============================================================
// 404 và Error Handler
// ============================================================

app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ error: err.message || "Internal Server Error" });
});

// ============================================================
// Start server
// ============================================================

app.listen(PORT, () => {
  console.log(`Express Routing server running on http://localhost:${PORT}`);
  console.log("\nTest các endpoint sau:");
  console.log(`  curl http://localhost:${PORT}/ping`);
  console.log(`  curl http://localhost:${PORT}/hello/Alice`);
  console.log(`  curl "http://localhost:${PORT}/math/add?a=5&b=3"`);
  console.log(`  curl -X POST http://localhost:${PORT}/echo -H "Content-Type: application/json" -d '{"key":"value"}'`);
  console.log(`  curl http://localhost:${PORT}/users/1/posts/42`);
  console.log(`  curl http://localhost:${PORT}/files/images/2024/photo.jpg`);
  console.log(`  curl "http://localhost:${PORT}/books?genre=tech&sort=price&order=asc"`);
  console.log(`  curl http://localhost:${PORT}/headers/info`);
  console.log(`  curl -X POST http://localhost:${PORT}/headers/auth -H "X-API-Key: secret123"`);
  console.log(`  curl http://localhost:${PORT}/api/v2/books`);
  console.log(`  curl http://localhost:${PORT}/api/v2/users`);
});
