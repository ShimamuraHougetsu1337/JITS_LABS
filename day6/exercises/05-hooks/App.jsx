/**
 * Bài 5: Hooks Practice — useState, useRef, useMemo, useCallback
 * Day 6 - React Hooks cơ bản
 *
 * Mục tiêu:
 *   - Dùng useRef để truy cập DOM element
 *   - Dùng useMemo để cache kết quả filter/sort nặng
 *   - Dùng useCallback để tránh re-render child component
 *   - Kết hợp nhiều hooks trong một component thực tế
 *
 * Chạy: npm run dev
 * Copy file này vào src/App.jsx để test
 */

import { useState, useRef, useMemo, useCallback, useEffect } from "react";

// ─── Data mẫu ────────────────────────────────────────────────────────────────

const INITIAL_CONTACTS = [
  { id: 1, name: "Nguyen Van A", email: "a@example.com", phone: "0901234567", city: "HCM" },
  { id: 2, name: "Tran Thi B", email: "b@example.com", phone: "0912345678", city: "Hanoi" },
  { id: 3, name: "Le Van C", email: "c@example.com", phone: "0923456789", city: "Da Nang" },
  { id: 4, name: "Pham Thi D", email: "d@example.com", phone: "0934567890", city: "HCM" },
  { id: 5, name: "Hoang Van E", email: "e@example.com", phone: "0945678901", city: "Hanoi" },
  { id: 6, name: "Vo Thi F", email: "f@example.com", phone: "0956789012", city: "HCM" },
  { id: 7, name: "Dang Van G", email: "g@example.com", phone: "0967890123", city: "Da Nang" },
  { id: 8, name: "Bui Thi H", email: "h@example.com", phone: "0978901234", city: "Hanoi" },
];

// ============================================================
// TODO 5.1: useRef — Auto-focus search input
// ============================================================
//
// Tạo component SearchInput:
//   - Dùng useRef để tạo ref cho <input>
//   - Khi component mount (useEffect với []), auto-focus vào input
//   - Button "Focus" cũng gọi inputRef.current.focus()
//   - Nhận props: value, onChange, placeholder
//
// Gợi ý:
//   const inputRef = useRef(null);
//   useEffect(() => { inputRef.current.focus(); }, []);

// TODO 5.1 — Implement SearchInput bên dưới:

function SearchInput({ value, onChange, placeholder }) {
  // TODO: tạo ref, useEffect auto-focus

  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
      {/* TODO: thêm ref={inputRef} vào input */}
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ padding: 8, fontSize: 14, flex: 1 }}
      />
      <button onClick={() => {/* TODO: focus */}}>Focus</button>
    </div>
  );
}

// ============================================================
// TODO 5.2: useRef — Đếm số lần render
// ============================================================
//
// Tạo component RenderCounter:
//   - Dùng useRef để đếm số lần component render
//   - useRef KHÔNG gây re-render khi thay đổi → safe để đếm
//   - Hiển thị: "Component đã render {n} lần"
//
// Gợi ý:
//   const renderCount = useRef(0);
//   renderCount.current += 1;  // tăng mỗi lần render (function chạy lại)

// TODO 5.2 — Implement RenderCounter bên dưới:

function RenderCounter() {
  // TODO: implement

  return (
    <p style={{ color: "#888", fontSize: 12 }}>
      Component đã render ??? lần
    </p>
  );
}

// ============================================================
// TODO 5.3: ContactItem — child component (dùng với useCallback)
// ============================================================
//
// Tạo component ContactItem nhận props: contact, onRemove
//   - Hiển thị: name, email, phone, city
//   - Button "Xóa" gọi onRemove(contact.id)
//   - console.log("ContactItem rendered:", contact.name) — để thấy re-render
//
// QUAN TRỌNG: Export hoặc define TRƯỚC ContactList

// TODO 5.3 — Implement ContactItem bên dưới:

function ContactItem({ contact, onRemove }) {
  console.log("ContactItem rendered:", contact.name);

  return (
    <div style={{
      border: "1px solid #eee",
      padding: 12,
      borderRadius: 8,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}>
      <div>
        {/* TODO: hiển thị contact info */}
        <strong>{contact.name}</strong>
        <p style={{ margin: "4px 0", color: "#666", fontSize: 13 }}>
          {contact.email} | {contact.phone} | {contact.city}
        </p>
      </div>
      <button
        onClick={() => {/* TODO: gọi onRemove */}}
        style={{ color: "red", cursor: "pointer" }}
      >
        Xóa
      </button>
    </div>
  );
}

// ============================================================
// TODO 5.4: ContactList — kết hợp tất cả hooks
// ============================================================
//
// Tạo component ContactList — kết hợp useState, useRef, useMemo, useCallback:
//
// State:
//   - contacts: danh sách contacts (khởi tạo từ INITIAL_CONTACTS)
//   - search: giá trị search input
//   - filterCity: city đang filter ("all" | "HCM" | "Hanoi" | "Da Nang")
//
// useRef:
//   - Dùng SearchInput component (đã có auto-focus)
//
// useMemo — cache filteredContacts:
//   - Filter theo search (name hoặc email chứa keyword, case-insensitive)
//   - Filter theo filterCity (nếu không phải "all")
//   - Dependencies: [contacts, search, filterCity]
//   - console.log("Filtering contacts...") bên trong useMemo để thấy khi nào nó chạy
//
// useCallback — cache handleRemove:
//   - Xóa contact theo id: setContacts(prev => prev.filter(c => c.id !== id))
//   - Dependencies: [] (dùng functional update nên không cần contacts trong deps)
//   - Nhờ useCallback, ContactItem chỉ re-render khi props thực sự thay đổi
//
// Gợi ý cấu trúc:
//   function ContactList() {
//     const [contacts, setContacts] = useState(INITIAL_CONTACTS);
//     const [search, setSearch] = useState("");
//     const [filterCity, setFilterCity] = useState("all");
//
//     const filteredContacts = useMemo(() => {
//       console.log("Filtering contacts...");
//       return contacts
//         .filter(c => ... search ...)
//         .filter(c => ... city ...);
//     }, [contacts, search, filterCity]);
//
//     const handleRemove = useCallback((id) => {
//       setContacts(prev => prev.filter(c => c.id !== id));
//     }, []);
//
//     return (...);
//   }

// TODO 5.4 — Implement ContactList bên dưới:

function ContactList() {
  // TODO: khai báo state

  // TODO: useMemo cho filteredContacts

  // TODO: useCallback cho handleRemove

  const cities = ["all", "HCM", "Hanoi", "Da Nang"];

  return (
    <div>
      {/* TODO: SearchInput component */}
      {/* <SearchInput
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Tìm theo tên hoặc email..."
      /> */}

      {/* TODO: Filter buttons */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {cities.map(city => (
          <button
            key={city}
            onClick={() => {/* TODO: setFilterCity */}}
            style={{
              padding: "6px 12px",
              // TODO: active style khi filterCity === city
              backgroundColor: "#eee",
              border: "1px solid #ccc",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            {city === "all" ? "Tất cả" : city}
          </button>
        ))}
      </div>

      {/* TODO: Hiển thị số kết quả */}
      {/* <p>Hiển thị {filteredContacts.length} / {contacts.length} contacts</p> */}

      {/* TODO: Render list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {/* {filteredContacts.length === 0 ? (
          <p style={{ color: "#999" }}>Không tìm thấy contact nào.</p>
        ) : (
          filteredContacts.map(contact => (
            <ContactItem
              key={contact.id}
              contact={contact}
              onRemove={handleRemove}
            />
          ))
        )} */}
      </div>

      {/* TODO: RenderCounter */}
      {/* <RenderCounter /> */}
    </div>
  );
}

// ============================================================
// App — Render
// ============================================================

function App() {
  return (
    <div style={{ padding: 20, fontFamily: "sans-serif", maxWidth: 800, margin: "0 auto" }}>
      <h1>Day 6 — Exercise 05: Hooks Practice</h1>
      <p style={{ color: "#666" }}>Mở DevTools Console (F12) để theo dõi render và filter logs</p>

      <ContactList />
    </div>
  );
}

export default App;

// ─────────────────────────────────────────────────────────────
// CÂU HỎI TƯ DUY (trả lời bằng comment trước khi nộp bài)
// ─────────────────────────────────────────────────────────────
//
// Q1: Nếu KHÔNG dùng useMemo cho filteredContacts, chuyện gì xảy ra?
//     (Gợi ý: mỗi re-render → filter + sort chạy lại dù contacts không đổi)
//
//     YOUR ANSWER: ___________________________________________________________
//
// Q2: Nếu KHÔNG dùng useCallback cho handleRemove, chuyện gì xảy ra?
//     (Gợi ý: mỗi re-render → handleRemove là function MỚI → ContactItem re-render)
//
//     YOUR ANSWER: ___________________________________________________________
//
// Q3: handleRemove dùng setContacts(prev => prev.filter(...)) thay vì
//     setContacts(contacts.filter(...)). Tại sao?
//     (Gợi ý: nếu dùng contacts, deps phải có [contacts] → callback thay đổi mỗi render)
//
//     YOUR ANSWER: ___________________________________________________________
//
// Q4: useRef đếm render count — tại sao KHÔNG dùng useState để đếm?
//     (Gợi ý: setState → re-render → đếm tăng → setState → vòng lặp vô tận)
//
//     YOUR ANSWER: ___________________________________________________________
//
// ─────────────────────────────────────────────────────────────
