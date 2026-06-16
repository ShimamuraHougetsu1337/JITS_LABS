/**
 * Bài 4.2: CommonJS Module
 * Tạo calculator module và export các hàm
 */

// TODO: Viết các hàm sau và export chúng

// add(a, b) - cộng hai số
function add(a, b) {
    return a + b
}

// subtract(a, b) - trừ hai số
function subtract(a, b) {
    return a - b
}

// multiply(a, b) - nhân hai số
function multiply(a, b) {
    return a * b
}

// divide(a, b) - chia hai số, throw Error("Cannot divide by zero") nếu b === 0
function divide(a, b) {
    if (b === 0) {
        throw new Error("Cannot divide by zero")
    }
    return a / b
}

// Export tất cả dùng module.exports

module.exports = {
    add,
    subtract,
    multiply,
    divide
}
