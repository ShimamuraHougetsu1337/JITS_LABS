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

const UserSelector = () => {
  const [selectedId, setSelectedId] = useState("");
  const [user, setUser] = useState(null);
  const [postCount, setPostCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearState = () => {
    setUser(null);
    setPostCount(0);
    setError(null);
  };

  const handleSelectChange = (e) => {
    const id = e.target.value;
    setSelectedId(id);
    clearState();
    if (id) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedId) {
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        const userRequest = fetch(`https://jsonplaceholder.typicode.com/users/${selectedId}`, { signal });
        const postsRequest = fetch(`https://jsonplaceholder.typicode.com/users/${selectedId}/posts`, { signal });

        const [userRes, postsRes] = await Promise.all([userRequest, postsRequest]);

        if (!userRes.ok) throw new Error("User not found");
        if (!postsRes.ok) throw new Error("Posts not found");

        const [userData, postsData] = await Promise.all([userRes.json(), postsRes.json()]);

        setUser(userData);
        setPostCount(postsData.length);
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("Request canceled");
          return;
        }
        setError(err.message || "Failed to fetch data");
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [selectedId]);

  return (
    <div>
      <select value={selectedId} onChange={handleSelectChange}>
        <option value="">-- Select User --</option>
        {USER_IDS.map((id) => (
          <option key={id} value={id}>
            User {id}
          </option>
        ))}
      </select>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!loading && !error && user && (
        <div style={{ marginTop: 16 }}>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Company:</strong> {user.company?.name}</p>
          <p><strong>Posts:</strong> {postCount}</p>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: 24 }}>
      <h1>User Selector</h1>
      <UserSelector />
    </div>
  );
}

export default App;
