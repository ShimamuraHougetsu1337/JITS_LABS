/**
 * Bài 1: Biến & Kiểu dữ liệu
 * Day 1 - JavaScript Cơ bản
 */

// ============================================================
// Bài 1.1: Khai báo biến
// Tạo các biến sau và log kết quả ra console
// ============================================================

// TODO: Khai báo họ tên đầy đủ của bạn (dùng const)
const fullName = "Nguyen Ngoc Tuan Anh"
// TODO: Khai báo tuổi (dùng let)
let age = 21
// TODO: Khai báo có phải lập trình viên không (dùng const, kiểu boolean)
const isDeveloper = true
// TODO: Khai báo danh sách kỹ năng (dùng const, kiểu array)
const skills = ["Java", "Nodejs", "React"]
// ============================================================
// Bài 1.2: Template literals
// ============================================================

// TODO: Tạo string mô tả bản thân dùng template literal
// Ví dụ: "Tôi là Nguyen Van A, 22 tuổi, là lập trình viên"
const description = `Tôi là ${fullName}, ${age} tuổi, ${isDeveloper ? "là lập trình viên" : "không là lập trình viên"}`
console.log(description)
// ============================================================
// Bài 1.3: Phép toán cơ bản
// ============================================================

// TODO: Khai báo 2 số bất kỳ
const num1 = 12.3
const num2 = 23.2
// TODO: Tính và log: tổng, hiệu, tích, thương
console.log(+(num1 + num2).toFixed(2))
console.log(+(num1 - num2).toFixed(2))
console.log(+(num1 * num2).toFixed(2))
console.log(+(num1 / num2).toFixed(2))
// TODO: Dùng Math.round(), Math.floor(), Math.ceil() với số thập phân
const num3 = 12.5
console.log(Math.round(num3))
console.log(Math.floor(num3))
console.log(Math.ceil(num3))
// ============================================================
// Bài 1.4: Kiểm tra kiểu dữ liệu
// ============================================================

// TODO: Viết function checkType(value) nhận vào một giá trị
// Log ra kiểu dữ liệu của giá trị đó
// Xử lý đặc biệt: null phải log "null" (không phải "object")
//                 Array phải log "array" (không phải "object")

function checkType(value) {
  // TODO: implement
  if (value === null) {
    console.log("null")
  } else if (Array.isArray(value)) {
    console.log("array")
  } else {
    console.log(typeof value)
  }
}

// Test cases (sau khi viết xong, kết quả phải đúng):
// checkType("hello")   -> "string"
// checkType(42)        -> "number"
// checkType(true)      -> "boolean"
// checkType(null)      -> "null"
// checkType(undefined) -> "undefined"
// checkType([1,2,3])   -> "array"
// checkType({a: 1})    -> "object"

checkType("hello")
checkType(42)
checkType(true)
checkType(null)
checkType(undefined)
checkType([1, 2, 3])
checkType({ a: 1 })