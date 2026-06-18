/**
 * Data layer - In-memory store cho todos
 * Đây là nơi DUY NHẤT đọc/ghi dữ liệu
 * Service gọi store, không ai khác được trực tiếp thao tác mảng todos
 */

let todos = [];
let nextId = 1;

const getAll = (filter = {}) => {
  let result = [...todos];

  // TODO: implement filter logic
  // - filter.status: "all" | "active" | "completed"
  // - filter.priority: "low" | "medium" | "high"
  // - filter.search: tìm trong title (case-insensitive)

  const { status, priority, search, sort, order } = filter;
  const PRIORITY_MAP = { low: 1, medium: 2, high: 3 };


  if (status === "active") {
    result = result.filter((todo) => !todo.completed);
  }

  else if (status === "completed") {
    result = result.filter((todo) => todo.completed);
  }

  if (priority) {
    result = result.filter((todo) => todo.priority === priority);
  }

  if (search) {
    result = result.filter((todo) => todo.title.toLowerCase().includes(search.toLowerCase()));
  }

  result.sort((a, b) => {
    switch (sort) {
      case "createdAt":
        return order === "asc" ? a.createdAt - b.createdAt : b.createdAt - a.createdAt;
      case "priority":
        return order === "asc" ? PRIORITY_MAP[a.priority] - PRIORITY_MAP[b.priority] : PRIORITY_MAP[b.priority] - PRIORITY_MAP[a.priority];
      case "title":
        return order === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
      default:
        return 0;
    }
  })

  return result;
};

const getById = (id) => {
  // TODO: implement - trả về todo hoặc null
  const todo = todos.find((todo) => todo.id === Number(id));
  return todo ? todo : null;
};

const create = (data) => {
  // TODO: implement
  // data gồm: { title, priority }
  // tự thêm: id, completed: false, createdAt: new Date()
  // push vào todos, return todo mới

  const newTodo = {
    id: nextId,
    title: data.title,
    priority: data.priority,
    completed: false,
    createdAt: new Date(),
  };

  todos.push(newTodo);
  nextId++;
  return newTodo;
};

const update = (id, data) => {
  // TODO: implement
  // - Tìm index theo id
  // - Nếu không tìm thấy -> return null
  // - Merge data vào todo hiện tại (chỉ update field có trong data)
  // - Thêm updatedAt: new Date()
  // - Return todo đã update

  const index = todos.findIndex((todo) => todo.id === Number(id));

  if (index === -1) {
    return null;
  }

  const updateTodo = {
    ...todos[index],
    ...data,
    updatedAt: new Date()
  }
  todos[index] = updateTodo;
  return updateTodo;
};

const remove = (id) => {
  // TODO: implement  
  // - Tìm index theo id
  // - Nếu không tìm thấy -> return false
  // - splice khỏi mảng
  // - Return true
  const index = todos.findIndex((todo) => todo.id === Number(id))

  if (index === -1) {
    return false;
  }
  todos.splice(index, 1);
  return true;
};

module.exports = { getAll, getById, create, update, remove };
