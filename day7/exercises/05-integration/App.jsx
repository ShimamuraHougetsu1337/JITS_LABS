import { useState, useEffect, useMemo, useCallback } from "react";

// ============================================================
// Bài tập 5 — Integration: PostManager
// ============================================================
// Kết hợp: useState + useEffect + useMemo + useCallback
//
// Chức năng:
// 1. Fetch và hiển thị 10 posts đầu (GET /posts?_limit=10)
// 2. Search theo title phía client — dùng useMemo
// 3. Click vào post → hiển thị comments (GET /posts/:id/comments)
// 4. Form tạo post mới (POST /posts) → thêm vào đầu danh sách
// 5. Button Xóa trên mỗi post (DELETE /posts/:id) → xóa khỏi UI
//
// Hook requirements:
//   useState:     posts, selectedPost, comments, commentsLoading, search, form, submitting
//   useEffect:    fetch posts (mount), fetch comments (selectedPost thay đổi)
//   useMemo:      filteredPosts = posts.filter theo search
//   useCallback:  handleDelete, handleCreate (truyền xuống child, tránh re-render)
//
// API base: https://jsonplaceholder.typicode.com
// ============================================================

// ---- Sub-components (implement bên dưới) ----

// PostItem: hiển thị 1 post, có button Xem comments + Xóa
// Props: post, onSelect, onDelete, isSelected
function PostItem({ post, onSelect, onDelete, isSelected }) {
  // TODO: implement
  return (
    <div style={{
      border: `2px solid ${isSelected ? "#007bff" : "#ddd"}`,
      padding: 12,
      marginBottom: 8,
      borderRadius: 4,
    }}>
      <h3 style={{ margin: 0 }}>{post.title}</h3>
      <p style={{ fontSize: 14, color: "#666" }}>{post.body.slice(0, 80)}...</p>
      <button onClick={() => onSelect(post)} style={{ marginRight: 8 }}>
        {isSelected ? "Ẩn comments" : "Xem comments"}
      </button>
      <button onClick={() => onDelete(post.id)} style={{ color: "red" }}>
        Xóa
      </button>
    </div>
  );
}

// CommentList: hiển thị comments của post đang chọn
// Props: comments, loading
function CommentList({ comments, loading }) {
  // TODO: implement
  if (loading) return <p>Đang tải comments...</p>;
  if (comments.length === 0) return <p>Không có comment.</p>;
  return (
    <ul>
      {comments.map((c) => (
        <li key={c.id}>
          <strong>{c.name}</strong> — {c.body.slice(0, 60)}...
        </li>
      ))}
    </ul>
  );
}

// ---- Main component ----

function PostManager() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");

  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // TODO: Effect 1 — Fetch posts khi mount
  // GET https://jsonplaceholder.typicode.com/posts?_limit=10

  // TODO: Effect 2 — Fetch comments khi selectedPost thay đổi
  // Nếu selectedPost null: setComments([]), return
  // GET https://jsonplaceholder.typicode.com/posts/${selectedPost.id}/comments

  // TODO: filteredPosts — useMemo
  // filter posts theo search (case-insensitive, theo title)
  const filteredPosts = useMemo(() => {
    // TODO: implement
    return posts;
  }, [posts, search]);

  // TODO: handleDelete — useCallback
  // DELETE /posts/:id → xóa post khỏi state
  // (JSONPlaceholder giả lập DELETE, không xóa thật — chỉ return {} với status 200)
  const handleDelete = useCallback((postId) => {
    // TODO: implement
    // fetch DELETE, rồi setPosts(prev => prev.filter(p => p.id !== postId))
  }, []);

  // TODO: handleCreate — useCallback
  // POST /posts với title = formTitle, body = "...", userId = 1
  // Thêm vào đầu posts: setPosts(prev => [newPost, ...prev])
  // Reset formTitle sau thành công
  const handleCreate = useCallback(async (e) => {
    e.preventDefault();
    // TODO: implement
  }, [formTitle]);

  // TODO: handleSelectPost — toggle: nếu click post đang chọn → bỏ chọn
  function handleSelectPost(post) {
    setSelectedPost((prev) => (prev?.id === post.id ? null : post));
  }

  if (loading) return <p>Đang tải posts...</p>;
  if (error)   return <p style={{ color: "red" }}>Lỗi: {error}</p>;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 24 }}>
      <h1>Post Manager</h1>

      {/* Form tạo post */}
      <form onSubmit={handleCreate} style={{ marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Tiêu đề post mới..."
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          style={{ padding: 8, width: "70%", marginRight: 8 }}
        />
        <button type="submit" disabled={submitting || !formTitle.trim()}>
          {submitting ? "Đang tạo..." : "Tạo post"}
        </button>
      </form>

      {/* Search */}
      <input
        type="text"
        placeholder="Tìm kiếm theo tiêu đề..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: 8, width: "100%", marginBottom: 16 }}
      />
      <p style={{ color: "#666" }}>Hiển thị {filteredPosts.length} / {posts.length} posts</p>

      {/* Danh sách posts */}
      {filteredPosts.length === 0
        ? <p>Không tìm thấy post nào.</p>
        : filteredPosts.map((post) => (
          <PostItem
            key={post.id}
            post={post}
            onSelect={handleSelectPost}
            onDelete={handleDelete}
            isSelected={selectedPost?.id === post.id}
          />
        ))
      }

      {/* Comments panel */}
      {selectedPost && (
        <div style={{ marginTop: 24, padding: 16, background: "#f9f9f9", borderRadius: 4 }}>
          <h2>Comments: {selectedPost.title}</h2>
          <CommentList comments={comments} loading={commentsLoading} />
        </div>
      )}
    </div>
  );
}

function App() {
  return <PostManager />;
}

export default App;
