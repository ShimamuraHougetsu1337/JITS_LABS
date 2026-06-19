/**
 * Day 4 - Bài 1: Mongoose Basics
 *
 * Mục tiêu:
 * - Kết nối Mongoose tới MongoDB
 * - Định nghĩa Schema và Model
 * - Thực hiện CRUD đầy đủ với Mongoose methods
 *
 * Cài dependencies trước:
 *   npm install mongoose dotenv
 *
 * Tạo file .env cùng thư mục:
 *   MONGO_URI=mongodb://localhost:27017/internship_day4
 *
 * Chạy:
 *   node index.js
 */

require("dotenv").config();
const mongoose = require("mongoose");

// ============================================================
// SCHEMA DEFINITION
// ============================================================

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // ẩn password trong queries mặc định
    },
    role: {
      type: String,
      enum: {
        values: ["user", "admin", "moderator"],
        message: "{VALUE} is not a valid role",
      },
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    age: {
      type: Number,
      min: [0, "Age cannot be negative"],
      max: [150, "Age seems unrealistic"],
    },
  },
  {
    timestamps: true, // tự động thêm createdAt và updatedAt
    versionKey: false, // bỏ __v field
  }
);

const User = mongoose.model("User", userSchema);

// ============================================================
// TODO 1.1 - Connect Mongoose và handle events
// ============================================================
// Yêu cầu:
// 1. Gọi mongoose.connect() với process.env.MONGO_URI
// 2. Lắng nghe event "connected" -> log "MongoDB connected to: <host>"
// 3. Lắng nghe event "error" -> log error message
// 4. Lắng nghe event "disconnected" -> log "MongoDB disconnected"
// 5. Xử lý SIGINT (Ctrl+C): đóng connection rồi process.exit(0)
//
// Gợi ý:
//   mongoose.connection.on("connected", () => { ... });
//   process.on("SIGINT", async () => { await mongoose.connection.close(); ... });

async function connectDB() {
  // TODO 1.1: Implement connection + events
  mongoose.connection.on("connected", () => {
    console.log(`MongoDB connected to: ${mongoose.connection.host}`);
  });

  mongoose.connection.on("error", (err) => {
    console.error(`MongoDB connection error: ${err.message}`);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
  });

  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection closed (app termination)");
    process.exit(0);
  });

  await mongoose.connect(process.env.MONGO_URI);
}

// ============================================================
// TODO 1.2 - Tạo users với Model.create()
// ============================================================
// Yêu cầu: Tạo 3 users với data sau (dùng User.create()):
//   - { name: "Alice", email: "alice@example.com", password: "Password123", role: "admin", age: 28 }
//   - { name: "Bob",   email: "bob@example.com",   password: "Password456", role: "user",  age: 24 }
//   - { name: "Carol", email: "carol@example.com", password: "Password789", role: "user",  age: 31 }
//
// Sau khi tạo, log ra: "Created user: <name> (id: <_id>)"
// Lưu ý: User.create() không trả về password (vì select: false)
//
// Gợi ý:
//   const user = await User.create({ name: "...", email: "...", ... });
//   console.log(`Created user: ${user.name} (id: ${user._id})`);
//
// Trả về: array của 3 users đã tạo (để dùng ở bài tiếp theo)

async function createUsers() {
  // TODO 1.2: Tạo 3 users bằng User.create()
  const users = await User.create([
    { name: "Alice", email: "alice@example.com", password: "Password123", role: "admin", age: 28 },
    { name: "Bob", email: "bob@example.com", password: "Password456", role: "user", age: 24 },
    { name: "Carol", email: "carol@example.com", password: "Password789", role: "user", age: 31 },
  ]);

  users.forEach(user => {
    console.log(`Created user: ${user.name} (id: ${user._id})`);
  });

  return users;
}

// ============================================================
// TODO 1.3 - Lấy tất cả users với Model.find()
// ============================================================
// Yêu cầu:
// 1. Gọi User.find() để lấy tất cả users
// 2. Log tổng số user: "Total users: <count>"
// 3. Log từng user: "- <name> (<email>) [<role>]"
//
// Gợi ý:
//   const users = await User.find();
//   users.forEach(u => console.log(`- ${u.name} (${u.email}) [${u.role}]`));

async function getAllUsers() {
  // TODO 1.3: Lấy tất cả users và log ra
  const users = await User.find();
  console.log(`Total users: ${users.length}`);

  users.forEach(u => {
    console.log(`- ${u.name} (${u.email}) [${u.role}]`);
  });
}

// ============================================================
// TODO 1.4 - Lấy user theo id với Model.findById()
// ============================================================
// Yêu cầu:
// 1. Nhận vào một userId
// 2. Gọi User.findById(userId)
// 3. Nếu không tìm thấy -> log "User not found: <userId>" và return null
// 4. Nếu tìm thấy -> log "Found user: <name> - created at <createdAt>" và return user
//
// Gợi ý:
//   const user = await User.findById(userId);
//   if (!user) { ... }

async function getUserById(userId) {
  // TODO 1.4: Tìm user theo id

  const user = await User.findById(userId);

  if (!user) {
    console.log(`User not found: ${userId}`);
    return null;
  } else {
    console.log(`Found user: ${user.name} - created at ${user.createdAt}`)
    return user;
  }
}

// ============================================================
// TODO 1.5 - Update user với findByIdAndUpdate()
// ============================================================
// Yêu cầu:
// 1. Nhận vào userId và updateData (object)
// 2. Gọi User.findByIdAndUpdate() với options { new: true, runValidators: true }
// 3. Log "Updated: <name before> -> <name after>" (nếu name thay đổi)
// 4. Trả về updated user
//
// Test case: update Alice's name thành "Alice Smith" và age thành 29
//
// Gợi ý:
//   const updated = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });
//
// Câu hỏi tư duy:
//   - Nếu không có { new: true }, hàm trả về gì?
//   - Tại sao cần runValidators: true? Schema validation chạy khi nào mặc định?

async function updateUser(userId, updateData) {
  // TODO 1.5: Update user và trả về updated document
  const updated = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });

  if (!updated) {
    console.log("User not found");
    return null;
  } else {
    console.log(`Updated: ${updateData}`);
    return updated;
  }
}

// ============================================================
// TODO 1.6 - Xóa user với findByIdAndDelete()
// ============================================================
// Yêu cầu:
// 1. Nhận vào userId
// 2. Gọi User.findByIdAndDelete(userId)
// 3. Nếu không tìm thấy -> throw Error với message "User not found"
// 4. Nếu xóa thành công -> log "Deleted user: <name> (<email>)"
// 5. Confirm bằng cách log tổng số users còn lại
//
// Gợi ý:
//   const deleted = await User.findByIdAndDelete(userId);
//   if (!deleted) throw ...
//   const remaining = await User.countDocuments();

async function deleteUser(userId) {
  // TODO 1.6: Xóa user theo id
  const deleted = await User.findByIdAndDelete(userId);

  if (!deleted) {
    throw new Error("User not found");
  } else {
    console.log(`Deleted user: ${deleted.name} (${deleted.email})`);
    const remaining = await User.countDocuments();
    console.log(`Total users remaining: ${remaining}`);
    return deleted;
  }
}

// ============================================================
// TODO 1.7 - Câu hỏi tư duy (trả lời trong comment)
// ============================================================
// Sau khi hoàn thành bài 1-6, trả lời các câu hỏi sau TRONG CODE dưới dạng comment:
//
// Q1: ObjectId là gì? Tại sao MongoDB dùng ObjectId thay vì integer auto-increment?
//     A1: ObjectId là mã định danh duy nhất 12-byte (chứa timestamp, machine/process ID, counter). 
//         MongoDB dùng nó để hỗ trợ lưu trữ phân tán (sharding), giúp tạo ID duy nhất độc lập ở client/server mà không bị nghẽn cổ chai hay trùng lặp.
//
// Q2: Mongoose schema validation khác Joi validation ở điểm nào?
//     Khi nào dùng Mongoose validation, khi nào dùng Joi?
//     A2: Mongoose validation bảo vệ ở tầng database (kiểm tra trước khi save). 
//         Joi validate ở tầng HTTP/Controller (kiểm tra request body/params đầu vào). Dùng Joi làm middleware chặn lỗi sớm ở API, dùng Mongoose làm lá chắn cuối cùng bảo vệ cấu trúc DB.
//
// Q3: `select: false` trong schema có nghĩa gì?
//     Làm sao để lấy được field bị select: false khi cần (ví dụ: login)?
//     A3: `select: false` giúp ẩn trường đó đi, không trả về trong kết quả query mặc định.
//         Để lấy ra khi cần, sử dụng `.select("+fieldName")` (ví dụ: `.select("+password")`).
//
// Q4: Tại sao nên dùng `{ new: true }` trong findByIdAndUpdate?
//     Điều gì xảy ra nếu không có option này?
//     A4: `{ new: true }` giúp trả về document sau khi đã cập nhật. Nếu không có option này, hàm sẽ trả về document cũ trước khi cập nhật.

// ============================================================
// TEST RUNNER - Chạy tất cả bài theo thứ tự
// ============================================================

async function runTests() {
  console.log("=".repeat(50));
  console.log("Day 4 - Exercise 01: Mongoose Basics");
  console.log("=".repeat(50));

  // TODO 1.1: connect trước
  await connectDB();

  // Xóa data cũ để test idempotent
  await User.deleteMany({});
  console.log("Cleared existing users\n");

  // TODO 1.2
  console.log("--- TODO 1.2: Create Users ---");
  const users = await createUsers();
  console.log();

  // TODO 1.3
  console.log("--- TODO 1.3: Get All Users ---");
  await getAllUsers();
  console.log();

  // TODO 1.4
  console.log("--- TODO 1.4: Get User By Id ---");
  const alice = users[0];
  await getUserById(alice._id);
  await getUserById(new mongoose.Types.ObjectId()); // id không tồn tại -> should log "not found"
  console.log();

  // TODO 1.5
  console.log("--- TODO 1.5: Update User ---");
  const updated = await updateUser(alice._id, { name: "Alice Smith", age: 29 });
  console.log("Updated user:", updated?.name, updated?.age);
  console.log();

  // TODO 1.6
  console.log("--- TODO 1.6: Delete User ---");
  const carol = users[2];
  await deleteUser(carol._id);
  console.log();

  // Final state
  console.log("--- Final State ---");
  await getAllUsers();

  console.log("\nAll tests done. Closing connection...");
  await mongoose.connection.close();
}

runTests().catch((err) => {
  console.error("Test failed:", err.message);
  process.exit(1);
});
