/**
 * Day 5 - Exercise 02: Aggregation Pipeline
 *
 * Mục tiêu:
 *   - Viết aggregation pipeline với $match, $group, $project, $sort, $limit
 *   - Dùng $lookup để join collections (tương đương populate)
 *   - Dùng $unwind để tách array
 *   - Hiểu khi nào dùng aggregate() thay vì populate() + JS
 *
 * Chạy: node exercises/02-aggregation/index.js
 */

"use strict";

require("dotenv").config();
const mongoose = require("mongoose");

// ─── Models ───────────────────────────────────────────────────────────────────

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  role: { type: String, enum: ["author", "reader"], default: "reader" },
});

const postSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    category: {
      type: String,
      enum: ["tech", "lifestyle", "travel", "food", "business"],
    },
    tags: [String],
    viewCount: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isPublished: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const commentSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);
const Comment = mongoose.model("Comment", commentSchema);

// ─── Seed Data ────────────────────────────────────────────────────────────────

async function seedData() {
  await User.deleteMany({});
  await Post.deleteMany({});
  await Comment.deleteMany({});

  const users = await User.insertMany([
    { name: "Alice Nguyen", email: "alice@example.com", role: "author" },
    { name: "Bob Tran", email: "bob@example.com", role: "author" },
    { name: "Carol Le", email: "carol@example.com", role: "author" },
    { name: "Dave Pham", email: "dave@example.com", role: "reader" },
    { name: "Eve Hoang", email: "eve@example.com", role: "reader" },
  ]);

  const [alice, bob, carol, dave, eve] = users;

  // Ngày 30 ngày trước
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const posts = await Post.insertMany([
    {
      title: "Getting Started with Node.js",
      author: alice._id,
      category: "tech",
      tags: ["nodejs", "javascript", "backend"],
      viewCount: 1500,
      likes: [dave._id, eve._id, bob._id],
      publishedAt: new Date(),
    },
    {
      title: "MongoDB Aggregation Deep Dive",
      author: alice._id,
      category: "tech",
      tags: ["mongodb", "database", "aggregation"],
      viewCount: 2200,
      likes: [dave._id, eve._id],
      publishedAt: new Date(),
    },
    {
      title: "Top 10 Coffee Shops in Hanoi",
      author: bob._id,
      category: "lifestyle",
      tags: ["coffee", "hanoi", "lifestyle"],
      viewCount: 800,
      likes: [alice._id, carol._id, dave._id, eve._id],
      publishedAt: new Date(),
    },
    {
      title: "Backpacking Da Nang on a Budget",
      author: bob._id,
      category: "travel",
      tags: ["travel", "danang", "budget"],
      viewCount: 3100,
      likes: [alice._id],
      publishedAt: new Date(),
    },
    {
      title: "Pho Recipe: The Authentic Way",
      author: carol._id,
      category: "food",
      tags: ["food", "vietnamese", "recipe", "pho"],
      viewCount: 560,
      likes: [dave._id],
      publishedAt: new Date(),
    },
    {
      title: "Building Your First REST API",
      author: carol._id,
      category: "tech",
      tags: ["api", "rest", "nodejs", "backend"],
      viewCount: 1800,
      likes: [alice._id, bob._id, dave._id, eve._id],
      publishedAt: new Date(),
    },
    {
      title: "Startup Lessons from 2 Years of Failure",
      author: alice._id,
      category: "business",
      tags: ["startup", "business", "lessons"],
      viewCount: 4500,
      likes: [bob._id, carol._id, dave._id, eve._id],
      // Post cũ hơn 30 ngày — để test date filter
      publishedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
    },
  ]);

  const [post1, post2, post3, post4, post5, post6] = posts;

  await Comment.insertMany([
    { post: post1._id, author: dave._id, content: "Great intro!" },
    { post: post1._id, author: eve._id, content: "Very helpful, thanks!" },
    { post: post1._id, author: bob._id, content: "Bookmarked." },
    { post: post2._id, author: dave._id, content: "Mind blown." },
    { post: post2._id, author: carol._id, content: "Using this at work now." },
    { post: post3._id, author: alice._id, content: "Trying Hanoi next month!" },
    { post: post4._id, author: eve._id, content: "Done this trip, 10/10" },
    { post: post4._id, author: carol._id, content: "Added to my bucket list" },
    { post: post5._id, author: dave._id, content: "Making this tomorrow" },
    { post: post6._id, author: alice._id, content: "Clean example!" },
    { post: post6._id, author: bob._id, content: "Sharing with my team" },
    { post: post6._id, author: eve._id, content: "Step by step, love it" },
  ]);

  console.log("Seed data inserted:");
  console.log(`  Users: ${users.length}`);
  console.log(`  Posts: ${posts.length}`);
  console.log(`  Comments: 12`);
  console.log();

  return { users, posts };
}

// ─── TODO 2.1: Count posts by category ───────────────────────────────────────
//
// Viết aggregation pipeline đếm số posts theo category.
// Kết quả mong đợi (sorted by count desc):
//   [
//     { category: "tech", count: 3 },
//     { category: "travel", count: 1 },
//     { category: "business", count: 1 },
//     { category: "lifestyle", count: 1 },
//     { category: "food", count: 1 },
//   ]
//
// Stages cần dùng: $group, $sort
// Gợi ý:
//   - $group: _id là gì để group theo category?
//   - $sum: 1 dùng để làm gì?
//   - $sort: sort _id hay count?
//   - $project: đổi tên _id thành "category"

async function postsByCategory() {
  // TODO 2.1 — Implement aggregation pipeline:
  const result = await Post.aggregate([
    // Stage 1: $group — group by category, count posts
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
    // Stage 2: $sort — sort by count desc
    {
      $sort: { count: -1 },
    },
    // Stage 3: $project — rename _id to "category"
    {
      $project: {
        _id: 0,
        category: "$_id",
        count: 1,
      },
    },
  ]);

  console.log("=== 2.1: Posts by Category ===");
  console.log(result);
  console.log();
  return result;
}

// ─── TODO 2.2: Average viewCount by category ─────────────────────────────────
//
// Tính viewCount trung bình của posts theo category.
// Kết quả mong đợi (rounded, sorted by avgViews desc):
//   [
//     { category: "business", avgViews: 4500 },
//     { category: "travel", avgViews: 3100 },
//     { category: "tech", avgViews: 1833 },
//     ...
//   ]
//
// Stages: $group ($avg), $sort, $project ($round)
// Gợi ý: $round: [expression, decimal_places] — dùng 0 để làm tròn số nguyên

async function avgViewsByCategory() {
  // TODO 2.2 — Implement aggregation pipeline:
  const result = await Post.aggregate([
    // Stage 1: $group — _id: category, avgViews: $avg of viewCount
    {
      $group: {
        _id: "$category",
        avgViews: { $avg: "$viewCount" }
      }
    },
    // Stage 2: $sort — avgViews desc
    {
      $sort: {
        avgViews: -1
      }
    },
    // Stage 3: $project — rename fields, round avgViews
    {
      $project: {
        _id: 0,
        category: "$_id",
        avgViews: { $round: ["$avgViews", 0] },
      }
    }
  ]);

  console.log("=== 2.2: Average Views by Category ===");
  console.log(result);
  console.log();
  return result;
}

// ─── TODO 2.3: $lookup — join posts với authors ───────────────────────────────
//
// Lấy tất cả posts kèm thông tin author (name, email).
// Equivalent với: Post.find().populate("author", "name email")
// Nhưng làm bằng aggregation pipeline.
//
// Kết quả mong đợi — mỗi post có authorInfo: { name, email }:
//   [
//     { title: "...", category: "...", author: { name: "Alice", email: "alice@..." } },
//     ...
//   ]
//
// Stages: $lookup, $unwind, $project
// Gợi ý:
//   - $lookup: from="users", localField="author", foreignField="_id", as="authorInfo"
//   - $lookup trả về array -> dùng $unwind để lấy object đầu tiên
//   - $project: lấy title, category, viewCount; tạo author từ authorInfo

async function postsWithAuthors() {
  // TODO 2.3 — Implement aggregation pipeline:
  const result = await Post.aggregate([
    // Stage 1: $lookup — join với users collection
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "authorInfo"
      }
    },
    // Stage 2: $unwind — flatten authorInfo array
    {
      $unwind: {
        path: "$authorInfo"
      }
    },
    // Stage 3: $project — chọn title, category, viewCount, author (name+email)
    {
      $project: {
        _id: 0,
        title: 1,
        category: 1,
        viewCount: 1,
        author: {
          name: "$authorInfo.name",
          email: "$authorInfo.email"
        },
      },
    },
  ]);

  console.log("=== 2.3: Posts with Author Info ($lookup) ===");
  result.forEach((p) =>
    console.log(`  "${p.title}" by ${p.author?.name} (${p.author?.email})`)
  );
  console.log();
  return result;
}

// ─── TODO 2.4: Top 5 tags được dùng nhiều nhất ────────────────────────────────
//
// Mỗi post có array tags. Tìm 5 tags được dùng nhiều nhất.
// Kết quả mong đợi:
//   [
//     { tag: "nodejs", count: 2 },
//     { tag: "backend", count: 2 },
//     { tag: "javascript", count: 1 },
//     ...
//   ]
//
// Stages: $unwind (tags array), $group, $sort, $limit, $project
// Gợi ý:
//   - Vấn đề: tags là array. Cần $unwind để tách thành documents riêng lẻ
//     [{ tags: ["a","b"] }] -> [{ tags: "a" }, { tags: "b" }]
//   - Sau unwind: group theo tags, đếm

async function topTags() {
  // TODO 2.4 — Implement aggregation pipeline:
  const result = await Post.aggregate([
    // Stage 1: $unwind — tách array tags
    {
      $unwind: "$tags"
    },
    // Stage 2: $group — group by tag, count
    {
      $group: {
        _id: "$tags",
        count: { $sum: 1 }
      }
    },
    // Stage 3: $sort — count desc
    {
      $sort: { count: -1 }
    },
    // Stage 4: $limit — top 5
    {
      $limit: 5
    },
    // Stage 5: $project — rename fields
    {
      $project: {
        _id: 0,
        tag: "$_id",
        count: 1
      }
    }
  ]);

  console.log("=== 2.4: Top 5 Tags ===");
  console.log(result);
  console.log();
  return result;
}

// ─── TODO 2.5: Top 3 posts nhiều likes nhất trong 30 ngày ────────────────────
//
// Lấy top 3 posts có nhiều likes nhất trong 30 ngày qua.
// "Số likes" = độ dài của mảng likes.
//
// Kết quả mong đợi (posts cũ hơn 30 ngày bị loại):
//   [
//     { title: "Building Your First REST API", likeCount: 4, publishedAt: ... },
//     { title: "Top 10 Coffee Shops in Hanoi", likeCount: 4, publishedAt: ... },
//     { title: "Getting Started with Node.js", likeCount: 3, publishedAt: ... },
//   ]
//
// Stages: $match (date filter), $addFields ($size of likes), $sort, $limit, $project
// Gợi ý:
//   - $match: publishedAt >= 30 ngày trước
//   - $addFields: thêm likeCount = $size: "$likes"
//   - Đặt $match đầu tiên để dùng index trên publishedAt

async function topPostsByLikes() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // TODO 2.5 — Implement aggregation pipeline:
  const result = await Post.aggregate([
    // Stage 1: $match — publishedAt >= thirtyDaysAgo
    {
      $match: {
        publishedAt: { $gte: thirtyDaysAgo }
      }
    },
    // Stage 2: $addFields — likeCount = $size of likes array
    {
      $addFields: {
        likeCount: {
          $cond: {
            if: { $isArray: "$likes" },
            then: { $size: "$likes" },
            else: 0
          }
        }
      }
    },
    // Stage 3: $sort — likeCount desc
    {
      $sort: { likeCount: -1 }
    },
    // Stage 4: $limit — top 3
    {
      $limit: 3
    },
    // Stage 5: $project — title, likeCount, category, publishedAt
    {
      $project: {
        _id: 0,
        title: 1,
        likeCount: 1,
        category: 1,
        publishedAt: 1
      }
    }
  ]);

  console.log("=== 2.5: Top 3 Posts by Likes (last 30 days) ===");
  result.forEach((p) =>
    console.log(`  "${p.title}" — ${p.likeCount} likes (${p.category})`)
  );
  console.log();
  return result;
}

// ─── TODO 2.6: User statistics ───────────────────────────────────────────────
//
// Thống kê cho mỗi user (có role "author"):
//   - Số posts đã viết
//   - Tổng views nhận được
//   - Số comments nhận được trên tất cả posts
//
// Kết quả mong đợi:
//   [
//     { author: "Alice Nguyen", postCount: 3, totalViews: 8200, commentCount: 5 },
//     { author: "Bob Tran", postCount: 2, totalViews: 3900, commentCount: 3 },
//     { author: "Carol Le", postCount: 2, totalViews: 2360, commentCount: 4 },
//   ]
//
// Cách làm — Chia làm 2 pipeline rồi merge, hoặc dùng $lookup với pipeline:
//
// Option A (đơn giản hơn, 2 bước):
//   Step 1: Aggregate posts -> { authorId, postCount, totalViews }
//   Step 2: Aggregate comments -> { authorId (của post), commentCount }
//   Step 3: Merge trong JS
//
// Option B (advanced — $lookup với pipeline):
//   Từ users -> $lookup posts -> $lookup comments trong pipeline posts
//
// Thực hiện theo Option A trước. Option B là bonus.
//
// Gợi ý Step 1:
//   Post.aggregate([
//     { $group: { _id: "$author", postCount: ..., totalViews: ... } },
//     { $lookup: { from: "users", ... } },
//     ...
//   ])
//
// Gợi ý Step 2:
//   Comment.aggregate([
//     { $lookup: join với posts để lấy author của post },
//     { $group: { _id: "$post.author", commentCount: ... } },
//   ])

async function userStats() {
  // TODO 2.6 Step 1 — Post stats per author:
  const postStats = await Post.aggregate([
    // group by author: postCount và totalViews
    {
      $group: {
        _id: "$author",
        postCount: { $sum: 1 },
        totalViews: { $sum: "$viewCount" }
      }
    },
    // lookup users để lấy name
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "authorInfo"
      }
    },
    // unwind, project
    {
      $unwind: "$authorInfo"
    },
    {
      $project: {
        _id: 1,
        author: "$authorInfo.name",
        postCount: 1,
        totalViews: 1
      }
    }
  ]);

  // TODO 2.6 Step 2 — Comment count per post author:
  const commentStats = await Comment.aggregate([
    // lookup posts để biết post thuộc author nào
    {
      $lookup: {
        from: "posts",
        localField: "post",
        foreignField: "_id",
        as: "postInfo"
      }
    },
    // unwind posts
    {
      $unwind: "$postInfo"
    },
    // group by post.author, count comments
    {
      $group: {
        _id: "$postInfo.author",
        commentCount: { $sum: 1 }
      }
    }
  ]);

  // TODO 2.6 Step 3 — Merge kết quả trong JS:
  // Hint: Dùng Map để lookup commentStats nhanh
  const commentMap = new Map(commentStats.map(c => [c._id.toString(), c.commentCount]));
  const merged = postStats.map(p => ({
    author: p.author,
    postCount: p.postCount,
    totalViews: p.totalViews,
    commentCount: commentMap.get(p._id.toString()) || 0
  }));

  console.log("=== 2.6: User Statistics ===");
  console.log(merged);
  console.log();
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB\n");

    await seedData();

    await postsByCategory();
    await avgViewsByCategory();
    await postsWithAuthors();
    await topTags();
    await topPostsByLikes();
    await userStats();
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

main();

// ─────────────────────────────────────────────────────────────────────────────
// CÂUHỎI TƯ DUY
// ─────────────────────────────────────────────────────────────────────────────
//
// Q1: Aggregate vs Populate — khi nào dùng cái nào?
//
//     Dùng populate() khi: Cần lấy dữ liệu liên kết đơn giản từ collection khác cho mục đích hiển thị mà không đòi hỏi xử lý thống kê phức tạp (ví dụ: lấy thông tin tác giả của một bài viết).
//     Dùng aggregate() khi: Cần thực hiện các phép tính toán thống kê, phân tích dữ liệu chuyên sâu (tổng, trung bình, nhóm, đếm, lọc phức tạp) hoặc khi cần tối ưu hiệu năng bằng cách xử lý tất cả trực tiếp tại database server trong một truy vấn duy nhất.
//
// Q2: Pipeline stages chạy theo thứ tự — tại sao $match nên đặt ĐẦU TIÊN?
//
//     YOUR ANSWER: Đặt $match đầu tiên giúp tận dụng được database index để tìm kiếm và lọc dữ liệu nhanh chóng, đồng thời giảm thiểu tối đa số lượng tài liệu (documents) đi vào các giai đoạn xử lý nặng phía sau như $lookup, $unwind hay $group.
//
// Q3: $lookup trả về array. Tại sao cần $unwind sau $lookup?
//     Khi nào KHÔNG cần $unwind sau $lookup?
//
//     YOUR ANSWER: Cần $unwind để giải phẳng (flatten) mảng kết quả của $lookup thành một đối tượng (object) duy nhất cho các quan hệ 1-1 hoặc N-1, giúp dễ dàng truy cập và định dạng dữ liệu. KHÔNG cần $unwind khi quan hệ là 1-N hoặc N-N và ta muốn giữ nguyên danh sách các tài liệu liên kết dưới dạng một mảng (ví dụ: lấy post kèm theo mảng các comments).
//
// Q4: Nếu cần lấy top 10 posts mới nhất kèm author name và comment count,
//     bạn sẽ dùng aggregate hay populate + JS? Tại sao?
//
//     YOUR ANSWER: Dùng aggregate. Bởi vì aggregate cho phép kết hợp các bước sắp xếp, phân trang ($limit), join author ($lookup), và đếm số lượng comments trực tiếp tại database server rồi chỉ trả về đúng 10 bản ghi thành phẩm cho ứng dụng. Cách này tối ưu hơn nhiều về CPU, bộ nhớ của ứng dụng và băng thông truyền tải dữ liệu qua mạng so với việc load hàng loạt posts/comments lên ứng dụng rồi tự thực hiện populate/đếm thủ công bằng JavaScript.
//
// ─────────────────────────────────────────────────────────────────────────────
