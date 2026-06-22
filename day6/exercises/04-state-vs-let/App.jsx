/**
 * Bài 4: useState vs let — Tại sao let không work trong React?
 * Day 6 - React Hooks cơ bản
 *
 * Mục tiêu:
 *   - Hiểu tại sao biến let KHÔNG trigger re-render
 *   - Hiểu cơ chế useState: React lưu state bên ngoài function
 *   - Phân biệt khi nào dùng useState vs let vs useRef
 *   - Hiểu immutable state (không mutate trực tiếp object/array)
 *
 * Chạy: npm run dev
 * Copy file này vào src/App.jsx để test
 */

import { useState, useRef } from "react";

// ============================================================
// TODO 4.1: CounterWithLet — chứng minh let KHÔNG work
// ============================================================
//
// Tạo component CounterWithLet:
//   - Khai báo: let count = 0;
//   - Button "Tăng": count += 1
//   - console.log("let count:", count) trong handleClick
//   - Hiển thị count trên UI
//
// Quan sát:
//   - Console log cho thấy count TĂNG (1, 2, 3...)
//   - Nhưng UI vẫn hiển thị 0 — TẠI SAO?
//
// Trả lời bằng comment trong component trước khi code:
// GIẢI THÍCH: Thay đổi biến 'let' không kích hoạt cơ chế re-render của React. Đồng thời, mỗi khi component re-render, biến 'let' sẽ bị khởi tạo lại về 0 do hàm component được gọi lại từ đầu.

// TODO 4.1 — Implement CounterWithLet bên dưới:

function CounterWithLet() {
  // TODO: khai báo let count = 0
  let count = 0;

  function handleClick() {
    // TODO: tăng count, console.log
    count += 1;
    console.log("let count:", count);
  }

  console.log("CounterWithLet rendered"); // để thấy component có re-render không

  return (
    <div style={{ border: "2px solid red", padding: 16, borderRadius: 8 }}>
      <h3>Counter với let (SAI)</h3>
      {/* TODO: hiển thị count và button */}
      <p>Count: {count}</p>
      <button onClick={handleClick}>Tăng</button>
      <p style={{ color: "red", fontSize: 12 }}>
        Mở Console để thấy giá trị thực — UI không cập nhật!
      </p>
    </div>
  );
}

// ============================================================
// TODO 4.2: CounterWithState — cách ĐÚNG
// ============================================================
//
// Tạo component CounterWithState:
//   - Dùng: const [count, setCount] = useState(0);
//   - Button "Tăng": setCount(count + 1)
//   - Button "Giảm": setCount(count - 1), nhưng không cho xuống dưới 0
//   - Button "Reset": setCount(0)
//   - console.log("state count:", count) trong handleClick
//
// Quan sát:
//   - Console log cho thấy count tăng
//   - UI CŨNG cập nhật — vì setState trigger re-render

// TODO 4.2 — Implement CounterWithState bên dưới:

function CounterWithState() {
  // TODO: const [count, setCount] = useState(0);
  const [count, setCount] = useState(0);

  console.log("CounterWithState rendered"); // để thấy re-render xảy ra

  return (
    <div style={{ border: "2px solid green", padding: 16, borderRadius: 8 }}>
      <h3>Counter với useState (ĐÚNG)</h3>
      {/* TODO: hiển thị count và 3 buttons */}
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Tăng</button>
      <button onClick={() => setCount(count > 0 ? count - 1 : 0)}>Giảm</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// ============================================================
// TODO 4.3: Functional update — setCount(prev => prev + 1)
// ============================================================
//
// Tạo component DoubleCounter:
//   - Button "Tăng 2 (SAI)": gọi setCount(count + 1) HAI LẦN liên tiếp
//   - Button "Tăng 2 (ĐÚNG)": gọi setCount(prev => prev + 1) HAI LẦN
//   - Hiển thị count
//
// Quan sát:
//   - "Tăng 2 (SAI)" chỉ tăng 1 — vì count là stale value trong cùng render
//   - "Tăng 2 (ĐÚNG)" tăng 2 — vì prev luôn là giá trị mới nhất
//
// Giải thích:
//   React batch updates trong cùng event handler.
//   setCount(count + 1) dùng count TẠI THỜI ĐIỂM RENDER → cả 2 lần đều count + 1
//   setCount(prev => prev + 1) dùng giá trị mới nhất → lần 2 dùng kết quả lần 1

// TODO 4.3 — Implement DoubleCounter bên dưới:

function DoubleCounter() {
  // TODO: implement
  const [count, setCount] = useState(0);

  return (
    <div style={{ border: "2px solid blue", padding: 16, borderRadius: 8 }}>
      <h3>Double Counter — Functional Update</h3>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Tăng 2 (SAI — sẽ chỉ tăng 1)</button>
      <button onClick={() => setCount(prev => prev + 1)}>Tăng 2 (ĐÚNG — tăng thật sự 2)</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// ============================================================
// TODO 4.4: Immutable state — object & array
// ============================================================
//
// Tạo component UserProfile:
//   - State: const [user, setUser] = useState({ name: "Alice", age: 25, city: "HCM" })
//   - Button "Tăng tuổi (SAI)": user.age += 1; setUser(user);
//     → UI không cập nhật vì cùng reference
//   - Button "Tăng tuổi (ĐÚNG)": setUser({ ...user, age: user.age + 1 });
//     → UI cập nhật vì object mới
//   - Input đổi tên: setUser({ ...user, name: e.target.value })
//
// Tạo component TodoMini:
//   - State: const [todos, setTodos] = useState(["Học React", "Làm bài tập"])
//   - Input + Button "Thêm": setTodos([...todos, newTodo])  (ĐÚNG)
//   - Button "Xóa" mỗi item: setTodos(todos.filter((_, i) => i !== index))
//   - KHÔNG dùng push/splice — phải tạo array mới

// TODO 4.4 — Implement UserProfile bên dưới:

function UserProfile() {
  const [user, setUser] = useState({ name: "Alice", age: 25, city: "HCM" });

  const handleIncreaseAgeWrong = () => {
    user.age += 1;
    setUser(user);
    console.log("UserProfile wrong increment age:", user.age);
  };

  const handleIncreaseAgeRight = () => {
    setUser({ ...user, age: user.age + 1 });
  };

  return (
    <div style={{ border: "2px solid purple", padding: 16, borderRadius: 8 }}>
      <h3>User Profile — Immutable Object State</h3>
      <p>Tên: {user.name}</p>
      <p>Tuổi: {user.age}</p>
      <p>Thành phố: {user.city}</p>
      <div style={{ display: "flex", gap: 8, margin: "8px 0" }}>
        <button onClick={handleIncreaseAgeWrong}>Tăng tuổi (SAI)</button>
        <button onClick={handleIncreaseAgeRight}>Tăng tuổi (ĐÚNG)</button>
      </div>
      <div>
        <label>
          Đổi tên:{" "}
          <input
            type="text"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
        </label>
      </div>
    </div>
  );
}

// TODO 4.4 — Implement TodoMini bên dưới:

function TodoMini() {
  const [todos, setTodos] = useState(["Học React", "Làm bài tập"]);
  const [newTodo, setNewTodo] = useState("");

  const handleAddTodo = () => {
    if (newTodo.trim() !== "") {
      setTodos([...todos, newTodo]);
      setNewTodo("");
    }
  };

  const handleRemoveTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <div style={{ border: "2px solid orange", padding: 16, borderRadius: 8 }}>
      <h3>Todo Mini — Immutable Array State</h3>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Thêm việc cần làm..."
        />
        <button onClick={handleAddTodo}>Thêm</button>
      </div>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            {todo}{" "}
            <button onClick={() => handleRemoveTodo(index)} style={{ marginLeft: 8 }}>
              Xóa
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================
// App — Render tất cả components để test
// ============================================================

function App() {
  return (
    <div style={{ padding: 20, fontFamily: "sans-serif", maxWidth: 800, margin: "0 auto" }}>
      <h1>Day 6 — Exercise 04: useState vs let</h1>
      <p style={{ color: "#666" }}>Mở DevTools Console (F12) để theo dõi log</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <CounterWithLet />
        <CounterWithState />
        <DoubleCounter />
        <UserProfile />
        <TodoMini />
      </div>
    </div>
  );
}

export default App;

// ─────────────────────────────────────────────────────────────
// CÂU HỎI TƯ DUY (trả lời bằng comment trước khi nộp bài)
// ─────────────────────────────────────────────────────────────
//
// Q1: React re-render component bằng cách nào?
//     (Gợi ý: gọi lại function component → let bị reset)
//
//     YOUR ANSWER: Gọi lại chính hàm component đó. Toàn bộ code chạy lại từ đầu, khiến các biến cục bộ 'let' bị reset về giá trị ban đầu.
//
// Q2: Tại sao setUser(user) không gây re-render khi user.age đã thay đổi?
//     (Gợi ý: React dùng Object.is() để so sánh state cũ và mới)
//
//     YOUR ANSWER: React dùng Object.is() so sánh tham chiếu (reference). Do 'user' vẫn trỏ đến vùng nhớ cũ, React coi như state không đổi nên bỏ qua re-render.
//
// Q3: Viết 3 dòng tóm tắt khi nào dùng:
//     - let: Tính toán tạm thời bên trong các hàm cục bộ và không cần giữ giá trị sau re-render.
//     - useState: Lưu dữ liệu muốn cập nhật lên giao diện (kích hoạt re-render UI khi thay đổi).
//     - useRef: Lưu dữ liệu qua các lần render nhưng KHÔNG muốn kích hoạt re-render UI, hoặc trỏ đến DOM.
//
// ─────────────────────────────────────────────────────────────
