/**
 * Posts Service
 * Business logic cho CRUD posts + publish/unpublish
 *
 * Key Mongoose patterns trong file này:
 * - find() với filter, sort, skip, limit, populate, lean
 * - findById() với populate
 * - create() với author reference
 * - findByIdAndUpdate() với { new: true, runValidators: true }
 * - findByIdAndDelete()
 * - countDocuments() cho pagination
 * - Promise.all() để chạy song song find + count
 */

const Post = require("../models/post.model");

// ============================================================
// TODO: getAllPosts
// ============================================================
// Yêu cầu:
// 1. Nhận vào { page, limit, sort, tag, published } từ query params
// 2. Build filter object (chỉ thêm field nếu có giá trị):
//    - tag: { tags: tag }
//    - published !== undefined: { published }
// 3. Dùng Promise.all để chạy song song:
//    - Post.find(filter).sort(sort).skip(skip).limit(limit).populate(...).lean()
//    - Post.countDocuments(filter)
// 4. Trả về { data, pagination: { page, limit, total, totalPages, hasNext, hasPrev } }
//
// Hint populate:
//   .populate({ path: "author", select: "name email" })
//   -> Chỉ lấy name và email của author, không trả password hay role
//
// Hint pagination:
//   const skip = (page - 1) * limit;
//   const [posts, total] = await Promise.all([...]);
//   const totalPages = Math.ceil(total / limit);

async function getAllPosts({ page = 1, limit = 10, sort = "-createdAt", tag, published } = {}) {
  // TODO: implement getAllPosts với pagination và populate author
  throw new Error("TODO: implement getAllPosts service");
}

// ============================================================
// TODO: getPostById
// ============================================================
// Yêu cầu:
// 1. Nhận vào postId
// 2. Dùng Post.findById(postId).populate({ path: "author", select: "name email" })
// 3. Nếu không tìm thấy -> throw error statusCode 404 "Post not found"
// 4. Trả về post
//
// Hint: const post = await Post.findById(postId).populate("author", "name email");
//       if (!post) { const err = new Error("Post not found"); err.statusCode = 404; throw err; }

async function getPostById(postId) {
  // TODO: implement getPostById, populate author
  throw new Error("TODO: implement getPostById service");
}

// ============================================================
// TODO: createPost
// ============================================================
// Yêu cầu:
// 1. Nhận vào { title, content, tags, published } và authorId (từ req.user.userId)
// 2. Tạo post mới với Post.create({ title, content, tags, published, author: authorId })
// 3. Populate author (name, email) trước khi trả về
//    (vì Post.create() chỉ trả về ObjectId, cần populate để có full author object)
//
// Hint: const post = await Post.create({ ...data, author: authorId });
//       await post.populate({ path: "author", select: "name email" });
//       return post;
//
// Câu hỏi: tại sao cần populate AFTER create thay vì dùng .lean() rồi query lại?

async function createPost(authorId, { title, content, tags, published }) {
  // TODO: implement createPost với author reference
  throw new Error("TODO: implement createPost service");
}

// ============================================================
// TODO: updatePost
// ============================================================
// Yêu cầu:
// 1. Nhận vào postId, updateData, currentUserId, currentUserRole
// 2. Tìm post để check ownership:
//    const post = await Post.findById(postId)
// 3. Nếu không tìm thấy -> throw 404
// 4. Check ownership: post.author.toString() !== currentUserId.toString()
//    Nếu không phải owner VÀ không phải admin -> throw 403 "You can only edit your own posts"
// 5. Update: Post.findByIdAndUpdate(postId, updateData, { new: true, runValidators: true })
// 6. Populate author rồi trả về
//
// Hint toString(): ObjectId cần .toString() để so sánh string với string
//   post.author.toString() === currentUserId.toString()
//
// Hint: const updated = await Post.findByIdAndUpdate(
//   postId,
//   { $set: updateData },   // dùng $set để chỉ update fields được gửi
//   { new: true, runValidators: true }
// ).populate("author", "name email");

async function updatePost(postId, updateData, currentUserId, currentUserRole) {
  // TODO: implement updatePost với ownership check
  throw new Error("TODO: implement updatePost service");
}

// ============================================================
// TODO: deletePost
// ============================================================
// Yêu cầu:
// 1. Nhận vào postId, currentUserId, currentUserRole
// 2. Tìm post, check tồn tại
// 3. Check ownership (giống updatePost)
// 4. Xóa post: Post.findByIdAndDelete(postId)
// 5. Bonus: xóa cả comments của post này (import Comment model, Comment.deleteMany({ post: postId }))
// 6. Trả về { message: "Post deleted successfully" }
//
// Hint: const deleted = await Post.findByIdAndDelete(postId);

async function deletePost(postId, currentUserId, currentUserRole) {
  // TODO: implement deletePost với ownership check
  // Bonus: xóa comments liên quan
  throw new Error("TODO: implement deletePost service");
}

// ============================================================
// TODO: publishPost / unpublishPost
// ============================================================
// Yêu cầu:
// 1. Nhận vào postId, currentUserId, currentUserRole, published (boolean)
// 2. Check post tồn tại và ownership
// 3. Update: Post.findByIdAndUpdate(postId, { published }, { new: true })
// 4. Trả về updated post
//
// Hint: Tách riêng hàm này thay vì gộp vào updatePost
//       -> Route PATCH /posts/:id/publish dễ đọc hơn PUT /posts/:id

async function setPublished(postId, published, currentUserId, currentUserRole) {
  // TODO: implement setPublished (publish/unpublish)
  throw new Error("TODO: implement setPublished service");
}

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  setPublished,
};
