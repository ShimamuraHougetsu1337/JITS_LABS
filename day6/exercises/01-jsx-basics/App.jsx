/**
 * Bài 1: JSX Basics
 * Day 6 - React cơ bản
 *
 * Mục tiêu:
 *   - Viết JSX hợp lệ (className, htmlFor, self-closing tags)
 *   - Nhúng biểu thức JavaScript trong JSX bằng {}
 *   - Dùng conditional rendering (ternary, &&)
 *   - Dùng Fragment (<> </>) khi cần trả về nhiều element
 *
 * Chạy: npm run dev (trong thư mục day6-react)
 * Copy file này vào src/App.jsx để test
 */

// ============================================================
// TODO 1.1: ProfileCard component
// ============================================================
//
// Tạo component ProfileCard nhận props: name, title, bio, avatarUrl
//
// Yêu cầu:
//   - Dùng className (KHÔNG dùng class)
//   - Tag <img> phải self-closing: <img />
//   - Nếu avatarUrl không có (undefined), hiển thị ảnh mặc định:
//     "https://via.placeholder.com/100"
//   - Hiển thị bio, nếu bio dài hơn 100 ký tự thì cắt và thêm "..."
//
// Gợi ý cấu trúc:
//   function ProfileCard({ name, title, bio, avatarUrl }) {
//     return (
//       <div className="profile-card">
//         <img ... />
//         <h2>...</h2>
//         <p className="title">...</p>
//         <p className="bio">...</p>
//       </div>
//     );
//   }

// TODO 1.1 — Implement ProfileCard bên dưới:

// ============================================================
// TODO 1.2: Biểu thức trong JSX
// ============================================================
//
// Tạo component ScoreBoard nhận props: studentName, score (number 0-100)
//
// Yêu cầu:
//   - Hiển thị tên và điểm
//   - Dùng ternary: score >= 50 ? "Pass" : "Fail"
//   - Dùng &&: nếu score >= 90, hiển thị <span className="badge">Excellent!</span>
//   - Dùng style object: nếu Pass thì color "green", Fail thì "red"
//   - Hiển thị ngày hiện tại: new Date().toLocaleDateString("vi-VN")
//
// Kết quả mong đợi (score = 95):
//   Nguyen Van A — 95 điểm
//   Kết quả: Pass (màu xanh)
//   Excellent!
//   Ngày: 22/06/2026

// TODO 1.2 — Implement ScoreBoard bên dưới:

// ============================================================
// TODO 1.3: Fragment và conditional rendering
// ============================================================
//
// Tạo component UserStatus nhận props: name, isOnline (boolean), lastSeen (string)
//
// Yêu cầu:
//   - Dùng Fragment (<> </>) — KHÔNG wrap trong div thừa
//   - Nếu isOnline === true: hiển thị "🟢 Online"
//   - Nếu isOnline === false: hiển thị "⚫ Offline — Last seen: {lastSeen}"
//   - Nếu lastSeen không có (undefined), hiển thị "Unknown"
//
// Gợi ý:
//   return (
//     <>
//       <h3>{name}</h3>
//       {isOnline ? <p>...</p> : <p>...</p>}
//     </>
//   );

// TODO 1.3 — Implement UserStatus bên dưới:

// ============================================================
// App — Render tất cả components để test
// ============================================================

function App() {
  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Day 6 — Exercise 01: JSX Basics</h1>

      <h2>1.1 — ProfileCard</h2>
      {/* TODO: Uncomment sau khi implement ProfileCard */}
      {/* <ProfileCard
        name="Nguyen Van A"
        title="Frontend Developer"
        bio="Passionate about React and building great user experiences. Love learning new technologies and sharing knowledge with the community."
        avatarUrl="https://via.placeholder.com/100"
      /> */}
      {/* <ProfileCard
        name="Tran Thi B"
        title="Backend Developer"
        bio="Short bio"
      /> */}

      <h2>1.2 — ScoreBoard</h2>
      {/* TODO: Uncomment sau khi implement ScoreBoard */}
      {/* <ScoreBoard studentName="Nguyen Van A" score={95} /> */}
      {/* <ScoreBoard studentName="Tran Thi B" score={42} /> */}
      {/* <ScoreBoard studentName="Le Van C" score={50} /> */}

      <h2>1.3 — UserStatus</h2>
      {/* TODO: Uncomment sau khi implement UserStatus */}
      {/* <UserStatus name="Alice" isOnline={true} /> */}
      {/* <UserStatus name="Bob" isOnline={false} lastSeen="10 phút trước" /> */}
      {/* <UserStatus name="Charlie" isOnline={false} /> */}
    </div>
  );
}

export default App;

// ─────────────────────────────────────────────────────────────
// CÂU HỎI TƯ DUY (trả lời bằng comment trước khi nộp bài)
// ─────────────────────────────────────────────────────────────
//
// Q1: Tại sao JSX dùng className thay vì class?
//
//     YOUR ANSWER: ___________________________________________________________
//
// Q2: Trong JSX, {condition && <Component />} — nếu condition = 0,
//     UI sẽ hiển thị gì? Tại sao?
//     Gợi ý: thử <p>{0 && "hello"}</p> trong browser
//
//     YOUR ANSWER: ___________________________________________________________
//
// Q3: Khi nào dùng Fragment (<></>) thay vì <div>?
//     Cho ví dụ cụ thể Fragment giải quyết vấn đề div thừa.
//
//     YOUR ANSWER: ___________________________________________________________
//
// ─────────────────────────────────────────────────────────────
