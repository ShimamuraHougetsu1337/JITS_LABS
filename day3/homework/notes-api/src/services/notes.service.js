const store = require("../data/store");

/**
 * TODO: Implement getUserNotes(userId, filter)
 *
 * - Lấy notes của userId (dùng store.notes.getAll({ userId, ...filter }))
 * - Nếu filter.q: lọc notes có title hoặc content chứa q (case-insensitive)
 * - Return array notes
 */
async function getUserNotes(userId, filter = {}) {
  let notes = store.notes.getAll({ userId, tag: filter.tag });
  if (filter.q) {
    const query = filter.q.toLowerCase();
    notes = notes.filter(
      (note) =>
        note.title?.toLowerCase().includes(query) ||
        note.content?.toLowerCase().includes(query)
    );
  }
  return notes;
}

/**
 * TODO: Implement getAllNotes(filter) - dành cho admin
 *
 * - Lấy tất cả notes (không filter theo userId)
 * - Áp dụng filter.tag nếu có
 * - Return array notes
 */
async function getAllNotes(filter = {}) {
  const notes = store.notes.getAll({ tag: filter.tag });
  return notes;
}

/**
 * TODO: Implement getNoteById(id, requestingUserId)
 *
 * - Tìm note theo id
 * - Nếu không tìm thấy -> throw 404
 * - Nếu note.userId !== requestingUserId -> throw 403 "Not authorized to access this note"
 * - Return note
 *
 * requestingUserId = null có nghĩa là admin, bỏ qua ownership check
 */
async function getNoteById(id, requestingUserId = null) {
  const note = store.notes.findById(id);
  if (!note) {
    const err = new Error("Note not found");
    err.statusCode = 404;
    throw err;
  }

  if (requestingUserId !== null && note.userId !== requestingUserId) {
    const err = new Error("Not authorized to access this note");
    err.statusCode = 403;
    throw err;
  }

  return note;
}

/**
 * TODO: Implement createNote({ userId, title, content, tags })
 *
 * - Gọi store.notes.create(...)
 * - Return note mới
 */
async function createNote({ userId, title, content, tags }) {
  const note = store.notes.create({ userId, title, content, tags });
  return note;
}

/**
 * TODO: Implement updateNote(id, data, requestingUserId)
 *
 * - Tìm note, 404 nếu không có
 * - Ownership check: note.userId !== requestingUserId -> 403
 * - Gọi store.notes.update(id, data)
 * - Return note đã update
 */
async function updateNote(id, data, requestingUserId) {
  const note = store.notes.findById(id);
  if (!note) {
    const err = new Error("Note not found");
    err.statusCode = 404;
    throw err;
  }

  if (note.userId !== requestingUserId) {
    const err = new Error("Not authorized to access this note");
    err.statusCode = 403;
    throw err;
  }

  const updatedNote = store.notes.update(id, data);
  return updatedNote;
}

/**
 * TODO: Implement deleteNote(id, requestingUserId)
 *
 * - Tìm note, 404 nếu không có
 * - Ownership check: note.userId !== requestingUserId -> 403
 * - Gọi store.notes.remove(id)
 * - Return true
 */
async function deleteNote(id, requestingUserId) {
  const note = store.notes.findById(id);
  if (!note) {
    const err = new Error("Note not found");
    err.statusCode = 404;
    throw err;
  }

  if (note.userId !== requestingUserId) {
    const err = new Error("Not authorized to access this note");
    err.statusCode = 403;
    throw err;
  }

  store.notes.remove(id);
  return true;
}

module.exports = {
  getUserNotes,
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};
