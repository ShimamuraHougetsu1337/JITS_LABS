import { useState, useEffect } from "react";

// ============================================================
// Bài tập 4 — Loading/Error state + AbortController
// ============================================================
// Tạo UserSelector:
// - Dropdown chọn userId từ 1-10
// - Fetch GET /users/:id và GET /users/:id/posts khi chọn
// - Hiển thị: name, email, company.name, số posts
// - Loading state khi đang fetch
// - Error state nếu fetch fail
// - AbortController: cancel request cũ khi chọn user mới
//
// Quan sát trong Network tab (DevTools):
// - Chọn user 1 → chọn nhanh sang user 2 trước khi user 1 load xong
// - Không có AbortController: có thể thấy kết quả user 1 flash lên rồi bị đè
// - Có AbortController: request user 1 bị cancel (status "canceled")
// ============================================================

const USER_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// TODO: Xây dựng UserSelector component
//
// State cần có:
//   const [selectedId, setSelectedId] = useState("");
//   const [user, setUser] = useState(null);
//   const [postCount, setPostCount] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//
// useEffect với [selectedId]:
//   - Nếu selectedId rỗng: clear state, return
//   - Tạo AbortController
//   - Fetch song song: Promise.all([fetch user, fetch posts])
//     URL user:  https://jsonplaceholder.typicode.com/users/${selectedId}
//     URL posts: https://jsonplaceholder.typicode.com/users/${selectedId}/posts
//   - Set state từ kết quả
//   - Bắt AbortError: return sớm (không phải lỗi thực)
//   - Return cleanup: controller.abort()
//
// Gợi ý Promise.all:
//   const [userRes, postsRes] = await Promise.all([
//     fetch(`...users/${selectedId}`, { signal: controller.signal }),
//     fetch(`...users/${selectedId}/posts`, { signal: controller.signal }),
//   ]);
//   if (!userRes.ok) throw new Error("User not found");
//   const [userData, postsData] = await Promise.all([userRes.json(), postsRes.json()]);
//   setUser(userData);
//   setPostCount(postsData.length);

function App() {
  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: 24 }}>
      <h1>User Selector</h1>
      {/* TODO: Render UserSelector */}
    </div>
  );
}

export default App;
