/**
 * Bài 3: Render List
 * Day 6 - React cơ bản
 *
 * Mục tiêu:
 *   - Render danh sách bằng .map() với key prop đúng
 *   - Xử lý empty state
 *   - Kết hợp .filter() + .map()
 *   - Hiểu tại sao key quan trọng và khi nào KHÔNG dùng index
 *
 * Chạy: npm run dev
 * Copy file này vào src/App.jsx để test
 */

// ─── Data mẫu ────────────────────────────────────────────────────────────────

const products = [
  { id: 1, name: "Laptop Dell XPS 13", price: 28000000, category: "laptop", rating: 4, inStock: true },
  { id: 2, name: "Chuột Logitech MX Master", price: 2500000, category: "peripheral", rating: 5, inStock: true },
  { id: 3, name: "Tai nghe Sony WH-1000XM5", price: 8000000, category: "audio", rating: 4, inStock: false },
  { id: 4, name: "Bàn phím Keychron K2", price: 2200000, category: "peripheral", rating: 3, inStock: true },
  { id: 5, name: "Màn hình LG 27UL850", price: 12000000, category: "monitor", rating: 4, inStock: false },
];

// ============================================================
// TODO 3.1: ProductCard component (reuse từ Bài 2 hoặc viết mới)
// ============================================================
//
// Nhận props: name, price, category, rating, inStock
//
// Yêu cầu:
//   - Format giá VND
//   - Hiển thị rating dạng sao: rating=4 → "★★★★☆"
//     Gợi ý: "★".repeat(rating) + "☆".repeat(5 - rating)
//   - Hiển thị trạng thái: inStock ? "Còn hàng" : "Hết hàng"
//   - Thêm style khác nhau cho còn hàng / hết hàng
//     Gợi ý: opacity: inStock ? 1 : 0.5

// TODO 3.1 — Implement ProductCard bên dưới:
const ProductCard = (props) => {
  const { name, price, category, rating, inStock } = props;
  const ratingStars = "★".repeat(rating) + "☆".repeat(5 - rating);
  return (
    <div className="product-card" style={{ opacity: inStock ? 1 : 0.5 }}>
      <h3>{name}</h3>
      <p className="price">{price.toLocaleString("vi-VN")} VND</p>
      <span className="category-badge">{category}</span>
      <p className="rating">{ratingStars}</p>
      <p className="status">{inStock ? "Còn hàng" : "Hết hàng"}</p>
    </div>
  );
}
// ============================================================
// TODO 3.2: ProductList component
// ============================================================
//
// Nhận props: products (array)
//
// Yêu cầu:
//   - Render danh sách ProductCard bằng .map()
//   - key prop dùng product.id (KHÔNG dùng index)
//   - Empty state: nếu products.length === 0, hiển thị:
//     <p>Không có sản phẩm nào.</p>
//
// Gợi ý:
//   function ProductList({ products }) {
//     if (products.length === 0) {
//       return <p>Không có sản phẩm nào.</p>;
//     }
//     return (
//       <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
//         {products.map(product => (
//           <ProductCard key={...} {...product} />
//         ))}
//       </div>
//     );
//   }

// TODO 3.2 — Implement ProductList bên dưới:
const ProductList = (props) => {
  const { products } = props;
  if (products.length === 0) {
    return <p>Không có sản phẩm nào.</p>;
  }
  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      {products.map(product => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}
// ============================================================
// TODO 3.3: FilteredProductList — filter + map
// ============================================================
//
// Nhận props: products (array), category (string | "all")
//
// Yêu cầu:
//   - Nếu category === "all": hiển thị tất cả
//   - Nếu category khác: chỉ hiển thị products có category trùng
//   - Dùng .filter() TRƯỚC .map()
//   - Hiển thị số lượng kết quả: "Hiển thị {n} sản phẩm"
//   - Empty state nếu filter ra 0 kết quả
//
// Gợi ý:
//   const filtered = category === "all"
//     ? products
//     : products.filter(p => p.category === category);

// TODO 3.3 — Implement FilteredProductList bên dưới:
const FilteredProductList = (props) => {
  const { products, category } = props;
  const filtered = category === "all"
    ? products
    : products.filter(p => p.category === category);

  return (
    <div>
      <p>Hiển thị {filtered.length} sản phẩm</p>
      {filtered.length === 0 ? (
        <p>Không có sản phẩm nào.</p>
      ) : (
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {filtered.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      )}
    </div>
  );
}
// ============================================================
// TODO 3.4: Sorted list
// ============================================================
//
// Nhận props: products (array), sortBy ("name" | "price" | "rating")
//
// Yêu cầu:
//   - Sort products TRƯỚC khi render (KHÔNG mutate mảng gốc!)
//   - Gợi ý: const sorted = [...products].sort(...)
//   - name: sort A-Z (localeCompare)
//   - price: sort thấp → cao
//   - rating: sort cao → thấp
//
// Câu hỏi: Tại sao phải dùng [...products].sort() thay vì products.sort()?
//           (Trả lời trong phần câu hỏi tư duy bên dưới)

// TODO 3.4 — Implement SortedProductList bên dưới:
const SortedProductList = (props) => {
  const { products, sortBy } = props
  if (sortBy === "name") {
    const sorted = [...products].sort((a, b) => a.name.localeCompare(b.name));
    return (
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {sorted.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    );
  } else if (sortBy === "price") {
    const sorted = [...products].sort((a, b) => a.price - b.price);
    return (
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {sorted.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    );
  } else if (sortBy === "rating") {
    const sorted = [...products].sort((a, b) => b.rating - a.rating);
    return (
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {sorted.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    );
  }
}
// ============================================================
// App — Render tất cả components để test
// ============================================================

function App() {
  return (
    <div style={{ padding: 20, fontFamily: "sans-serif", maxWidth: 1000, margin: "0 auto" }}>
      <h1>Day 6 — Exercise 03: Render List</h1>

      <h2>3.2 — ProductList (tất cả)</h2>
      <ProductList products={products} />

      <h2>3.2 — ProductList (empty)</h2>
      <ProductList products={[]} />

      <h2>3.3 — FilteredProductList (category: peripheral)</h2>
      <FilteredProductList products={products} category="peripheral" />

      <h2>3.3 — FilteredProductList (category: all)</h2>
      <FilteredProductList products={products} category="all" />

      <h2>3.3 — FilteredProductList (category: phone — empty)</h2>
      <FilteredProductList products={products} category="phone" />

      <h2>3.4 — SortedProductList (by price)</h2>
      <SortedProductList products={products} sortBy="price" />

      <h2>3.4 — SortedProductList (by rating)</h2>
      <SortedProductList products={products} sortBy="rating" />
    </div>
  );
}

export default App;

// ─────────────────────────────────────────────────────────────
// CÂU HỎI TƯ DUY (trả lời bằng comment trước khi nộp bài)
// ─────────────────────────────────────────────────────────────
//
// Q1: Tại sao KHÔNG dùng index làm key khi list có thể thay đổi thứ tự?
//     Cho ví dụ cụ thể bug xảy ra khi dùng index làm key.
//
//     YOUR ANSWER: Vì index của phần tử sẽ thay đổi khi danh sách xáo trộn, khiến React tái sử dụng nhầm State/DOM của phần tử khác. Ví dụ: Nếu xóa item đầu tiên của danh sách các <input> có lưu dữ liệu, ô nhập cuối cùng sẽ biến mất thay vì ô đầu tiên bị xóa.
//
// Q2: Tại sao products.sort() sai mà phải dùng [...products].sort()?
//     Gợi ý: mutable vs immutable — React so sánh reference
//
//     YOUR ANSWER: Hàm .sort() thay đổi trực tiếp (mutate) mảng gốc. Vì React so sánh theo tham chiếu (reference), nó thấy tham chiếu mảng không đổi nên sẽ không re-render. Dùng [...products].sort() để tạo mảng mới, đổi tham chiếu giúp React kích hoạt re-render.
//
// Q3: Nếu list có 1000 items và user filter bằng input text,
//     việc filter + map chạy MỖI LẦN gõ phím có vấn đề không?
//     Nếu có, dùng cái gì để tối ưu? (Gợi ý: đã học ở Phần 5)
//
//     YOUR ANSWER: Có vấn đề về hiệu năng (gây giật lag UI). Để tối ưu, ta sử dụng hook 'useMemo' để ghi nhớ (cache) kết quả, hoặc áp dụng kỹ thuật 'debounce' để hạn chế tần suất chạy bộ lọc khi user đang gõ phím.
//
// ─────────────────────────────────────────────────────────────
