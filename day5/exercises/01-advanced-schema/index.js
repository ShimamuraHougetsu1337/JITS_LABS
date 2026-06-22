/**
 * Day 5 - Exercise 01: Advanced Mongoose Schema
 *
 * Mục tiêu:
 *   - Viết pre("save") hook để auto-hash password
 *   - Implement instance method: comparePassword()
 *   - Implement static method: findByEmail()
 *   - Implement virtual: fullName
 *   - Hiểu khi nào dùng Mongoose validation vs Joi validation
 *
 * Yêu cầu: MongoDB đang chạy tại MONGODB_URI trong .env
 *
 * Chạy: node exercises/01-advanced-schema/index.js
 */

"use strict";

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// ─── Schema Definition ────────────────────────────────────────────────────────

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Email is not valid"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    loginCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    // Cần option này để virtuals xuất hiện khi res.json() / JSON.stringify()
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      }
    },
    toObject: { virtuals: true },
  }
);

// ─── TODO 1.1: pre("save") hook — auto hash password ─────────────────────────
//
// Yêu cầu:
//   - Chỉ hash khi password bị thay đổi (dùng this.isModified("password"))
//   - Dùng bcrypt.hash() với saltRounds = 10
//   - Gán hash vào this.password trước khi gọi next()
//   - Dùng function() không phải arrow function (cần "this")
//
// Gợi ý cấu trúc:
//   userSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) return next();
//     // ... hash ở đây
//     next();
//   });
//
// Câu hỏi: Tại sao pre("save") KHÔNG chạy khi dùng findByIdAndUpdate()?
// Trả lời bằng comment bên dưới trước khi code:
// YOUR ANSWER: findByIdAndUpdate() gửi câu lệnh trực tiếp đến MongoDB driver mà không thông qua cơ chế Mongoose Document lifecycle (không khởi tạo một instance model và gọi method .save() trên nó). Do pre("save") là document middleware nên nó sẽ không được kích hoạt.

// TODO 1.1 — Implement pre("save") hook bên dưới dòng này:
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ─── TODO 1.2: Instance method — comparePassword() ───────────────────────────
//
// Yêu cầu:
//   - Method tên: comparePassword(plaintext)
//   - Nhận plaintext password, so sánh với this.password (đã hash)
//   - Return: Promise<boolean> (true nếu khớp, false nếu không)
//   - Dùng bcrypt.compare()
//   - PHẢI dùng function() không phải arrow function
//
// Gợi ý:
//   userSchema.methods.comparePassword = async function (plaintext) {
//     return bcrypt.compare(plaintext, this.password);
//   };
//
// Câu hỏi: Tại sao không so sánh bcrypt.hash(plaintext) === this.password?
// YOUR ANSWER: Vì bcrypt sinh ra salt ngẫu nhiên mỗi lần thực hiện mã hóa, dẫn đến các chuỗi hash được tạo ra cho cùng một mật khẩu sẽ khác nhau. bcrypt.compare() cần giải mã salt từ chuỗi hash hiện có để mã hóa đúng cách plaintext mật khẩu mới so sánh được, đồng thời nó chống timing attack bằng thuật toán so sánh trong khoảng thời gian không đổi.

// TODO 1.2 — Implement instance method bên dưới:
userSchema.methods.comparePassword = async function (plaintext) {
  return bcrypt.compare(plaintext, this.password);
};

// ─── TODO 1.3: Static method — findByEmail() ─────────────────────────────────
//
// Yêu cầu:
//   - Method tên: findByEmail(email)
//   - Tìm user theo email (case-insensitive — convert về lowercase)
//   - Return: Promise<Document | null>
//   - Dùng this.findOne() (this = Model trong static)
//
// Gợi ý:
//   userSchema.statics.findByEmail = function (email) {
//     return this.findOne({ email: email.toLowerCase() });
//   };
//
// Câu hỏi: Tại sao đây là static method thay vì instance method?
// YOUR ANSWER: Vì phương thức này dùng để thực hiện truy vấn và tìm kiếm dữ liệu trong toàn bộ collection (tương tác ở cấp độ Model khi chưa có một document cụ thể). Còn instance method dùng để thực hiện các thao tác trên dữ liệu của một document cụ thể đã tồn tại.

// TODO 1.3 — Implement static method bên dưới:
userSchema.statics.findByEmail = function (email) {
  if (!email) return null;
  return this.findOne({ email: email.toLowerCase() });
};

// ─── TODO 1.4: Virtual — fullName ─────────────────────────────────────────────
//
// Yêu cầu:
//   - Virtual tên: fullName
//   - Getter: trả về `${firstName} ${lastName}`
//   - Virtual KHÔNG được lưu vào DB
//   - Dùng function() không phải arrow function
//
// Gợi ý:
//   userSchema.virtual("fullName").get(function () {
//     return `${this.firstName} ${this.lastName}`;
//   });
//
// Để verify: sau khi tạo user, log ra user.fullName và user.toJSON()
//   kiểm tra fullName có xuất hiện không
//
// Câu hỏi: Sự khác nhau giữa toJSON: { virtuals: true } và toObject: { virtuals: true }?
// YOUR ANSWER: toObject chuyển document sang một Plain JavaScript Object thuần túy (khi gọi .toObject()). toJSON được dùng tự động khi chuyển document sang định dạng chuỗi JSON (khi gọi .toJSON(), JSON.stringify() hoặc khi dùng res.json() của Express).

// TODO 1.4 — Implement virtual bên dưới:
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// ─── Model ────────────────────────────────────────────────────────────────────

const User = mongoose.model("User", userSchema);

// ─── TODO 1.5: Test cases ─────────────────────────────────────────────────────
//
// Viết code test các tính năng trên. Mỗi test cần log kết quả rõ ràng.
//
// Test 1: Tạo user mới
//   - Tạo user với password "password123"
//   - Log ra user.password — phải là bcrypt hash, KHÔNG phải "password123"
//   - Log ra user.fullName — phải là "firstName lastName"
//   - Log ra user.toJSON() — phải có fullName, KHÔNG có __v
//
// Test 2: comparePassword
//   - Dùng user.comparePassword("password123") -> phải trả true
//   - Dùng user.comparePassword("wrongpassword") -> phải trả false
//
// Test 3: Static method findByEmail
//   - Dùng User.findByEmail(email) -> phải tìm được user vừa tạo
//   - Dùng User.findByEmail("UPPERCASE@EMAIL.COM") -> vẫn tìm được (case insensitive)
//
// Test 4: Update password (hook phải chạy lại)
//   - Fetch user từ DB bằng User.findById()
//   - Gán user.password = "newpassword456"
//   - Gọi user.save()
//   - comparePassword("newpassword456") -> true
//   - comparePassword("password123") -> false (password cũ không còn dùng được)
//
// Test 5: Duplicate email
//   - Thử tạo user với email đã tồn tại
//   - Catch error và log err.code (phải là 11000)
//
// Gợi ý cấu trúc:
//   async function runTests() {
//     await mongoose.connect(process.env.MONGODB_URI);
//     await User.deleteMany({}); // clean slate
//
//     console.log("\n=== Test 1: Create User ===");
//     // ... test code
//
//     await mongoose.disconnect();
//   }
//   runTests().catch(console.error);

// TODO 1.5 — Implement test function bên dưới:
async function runTests() {
  await mongoose.connect(process.env.MONGODB_URI);
  await User.deleteMany({}); // clean slate

  console.log("\n=== Test 1: Create User ===");
  const userData = {
    firstName: "Hougetsu",
    lastName: "Shimamura",
    email: "hougetsu@example.com",
    password: "password123",
    role: "user"
  };
  const user = await User.create(userData);
  console.log("Original plain password:", userData.password);
  console.log("Saved hashed password in DB:", user.password);
  console.log("User full name:", user.fullName);
  console.log("User toJSON():", user.toJSON());

  console.log("\n=== Test 2: comparePassword ===");
  const isMatchCorrect = await user.comparePassword("password123");
  console.log("Compare with correct password (password123):", isMatchCorrect);
  const isMatchIncorrect = await user.comparePassword("wrongpassword");
  console.log("Compare with incorrect password (wrongpassword):", isMatchIncorrect);

  console.log("\n=== Test 3: Static method findByEmail ===");
  const foundByEmail = await User.findByEmail("hougetsu@example.com");
  console.log("Found by lowercase email:", foundByEmail ? foundByEmail.fullName : "Not found");
  const foundByUppercaseEmail = await User.findByEmail("HOUGETSU@EXAMPLE.COM");
  console.log("Found by uppercase email:", foundByUppercaseEmail ? foundByUppercaseEmail.fullName : "Not found");

  console.log("\n=== Test 4: Update password (hook phải chạy lại) ===");
  const fetchedUser = await User.findById(user._id);
  fetchedUser.password = "newpassword456";
  await fetchedUser.save();
  console.log("Updated hashed password in DB:", fetchedUser.password);
  const isNewMatch = await fetchedUser.comparePassword("newpassword456");
  console.log("Compare with new password (newpassword456):", isNewMatch);
  const isOldMatch = await fetchedUser.comparePassword("password123");
  console.log("Compare with old password (password123):", isOldMatch);

  console.log("\n=== Test 5: Duplicate email ===");
  try {
    await User.create({
      firstName: "Duplicate",
      lastName: "User",
      email: "hougetsu@example.com",
      password: "password789"
    });
    console.log("FAIL: Second user with duplicate email created successfully.");
  } catch (err) {
    console.log("SUCCESS: Duplicate email creation failed as expected.");
    console.log("Error code (must be 11000):", err.code);
  }

  await mongoose.disconnect();
}
runTests().catch(console.error);

// ─────────────────────────────────────────────────────────────────────────────
// CÂUHỎI TƯ DUY (trả lời bằng comment trước khi nộp bài)
// ─────────────────────────────────────────────────────────────────────────────
//
// Q1: Khi nào dùng Mongoose validation (schema level) vs Joi validation?
//     Gợi ý: Nghĩ về: layer nào chịu trách nhiệm, duplicate logic, performance
//
//     Mongoose validation: Chịu trách nhiệm ở database layer (schema level). Giúp đảm bảo dữ liệu khi ghi vào database luôn nhất quán và hợp lệ, là chốt chặn cuối cùng (last line of defense).
//     Joi validation: Chịu trách nhiệm ở request/API layer (controller level). Giúp kiểm tra cấu trúc dữ liệu đầu vào ngay tại cửa ngõ API trước khi thực hiện business logic hay truy vấn database, tối ưu hiệu năng (chặn payload lỗi sớm) và trả về lỗi chi tiết cho client.
//     Kết luận dùng cái nào khi nào: Dùng Joi ở tầng middleware của router/controller để validate các request payloads. Dùng Mongoose validation ở tầng schema để định nghĩa cấu trúc và ràng buộc chặt chẽ của database.
//
// Q2: Nếu một service gọi User.create() và Mongoose validation fail,
//     error đó có tự động reach error middleware không?
//     Phải làm gì trong controller/service để xử lý đúng?
//
//     YOUR ANSWER: Không tự động truyền vào Express error middleware. Trong controller/service, ta phải sử dụng khối try-catch để bắt lỗi (ValidationError) rồi chuyển tiếp lỗi qua next(err) sang error-handling middleware của Express (hoặc sử dụng các async handler wrapper).
//
// Q3: pre("save") chạy khi nào? Liệt kê các trường hợp:
//     - Chạy: Khi gọi phương thức .save() của một document instance, hoặc phương thức Model.create() (vì Model.create() thực hiện khởi tạo instance và gọi .save() dưới nền).
//     - KHÔNG chạy: Khi sử dụng các phương thức update trực tiếp của Model như updateOne(), updateMany(), findOneAndUpdate(), findByIdAndUpdate(), hoặc chèn hàng loạt bằng insertMany() (nếu không bật tùy chọn đặc biệt).
//
// ─────────────────────────────────────────────────────────────────────────────
