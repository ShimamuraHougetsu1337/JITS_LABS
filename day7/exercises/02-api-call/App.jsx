import { useState, useEffect } from "react";

// ============================================================
// Bài tập 2 — Gọi API với loading / error / retry
// ============================================================
// API: https://jsonplaceholder.typicode.com/posts
//
// Yêu cầu:
// 1. Fetch GET /posts khi component mount
// 2. Hiển thị "Đang tải..." trong lúc chờ
// 3. Hiển thị danh sách posts: title (h3) + body preview (100 ký tự đầu)
// 4. Nếu fetch fail → hiển thị "Lỗi: [message]" + button "Thử lại"
// 5. Button "Thử lại" trigger fetch lại (dùng retryCount trong deps)
//
// Lỗi phổ biến cần tránh:
// - Dùng async trực tiếp trong useEffect callback
//   SAI:  useEffect(async () => { await fetch(...) }, [])
//   ĐÚNG: useEffect(() => { async function f() {...}; f(); }, [])
//
// - Không check response.ok
//   fetch() KHÔNG throw error cho HTTP 4xx/5xx
//   Phải kiểm tra: if (!res.ok) throw new Error(...)
// ============================================================

// Skeleton hiển thị loading placeholder
function PostSkeleton() {
  return (
    <div style={{ border: "1px solid #ddd", padding: 16, marginBottom: 8, borderRadius: 4 }}>
      <div style={{ background: "#eee", height: 20, width: "60%", marginBottom: 8 }} />
      <div style={{ background: "#eee", height: 14, width: "90%" }} />
    </div>
  );
}

// TODO: Xây dựng PostList component
function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0); // tăng để trigger fetch lại

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("https://jsonplaceholder.typicode.com/posts");

        // TODO: check response.ok
        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [retryCount]); // tăng retryCount → effect chạy lại → fetch lại

  // TODO: Render loading state (dùng PostSkeleton x3)
  if (loading) {
    return (
      <div>
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </div>
    );
  }
  // TODO: Render error state + button retry
  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={() => setRetryCount((prev) => prev + 1)}>Retry</button>
      </div>
    );
  }
  // TODO: Render danh sách posts
  //       body preview: post.body.slice(0, 100) + "..."
  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.body.slice(0, 100) + "..."}</p>
        </div>
      ))}
    </div>
  );
}

function App() {
  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>
      <h1>Posts</h1>
      {/* TODO: Render PostList */}
      <PostList />
    </div>
  );
}

export default App;
