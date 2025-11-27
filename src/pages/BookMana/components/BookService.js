// BookService.js
const STORAGE_KEY = 'books_data';

// 🧩 Dữ liệu mẫu ban đầu
const initialBooks = [
  {
    key: '1',
    code: 'Book001',
    name: 'Sách vật lý 11',
    level: '11',
    description: 'Sách lớp 11 học',
    note: '',
    filePath: '', // đường dẫn file
  },
  {
    key: '2',
    code: 'Book002',
    name: 'Sách hóa 11',
    level: '11',
    description: 'Sách lớp 11 học',
    note: '',
    filePath: '',
  },
  {
    key: '3',
    code: 'Book003',
    name: 'Sách sinh học 11',
    level: '11',
    description: 'Sách lớp 11 học',
    note: '',
    filePath: '',
  },
];

// Hàm load sách từ localStorage, nếu chưa có thì dùng dữ liệu mẫu
export function loadBooks() {
  const books = localStorage.getItem(STORAGE_KEY);
  if (books) {
    return JSON.parse(books);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialBooks));
    return initialBooks;
  }
}

// Hàm lưu sách vào localStorage
export function saveBooks(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// Xem chi tiết sách theo key
export function getBookByKey(key) {
  const list = loadBooks();
  return list.find((book) => book.key === key);
}

// Thêm sách mới
export function addBook(bookData) {
  const list = loadBooks();
  const newBook = {
    key: Date.now().toString(), // tạo key duy nhất
    ...bookData,
  };
  list.push(newBook);
  saveBooks(list);
  return newBook;
}

// Cập nhật sách
export function updateBook(key, updatedData) {
  const list = loadBooks();
  const index = list.findIndex((book) => book.key === key);
  if (index !== -1) {
    list[index] = { ...list[index], ...updatedData };
    saveBooks(list);
    return list[index];
  }
  return null;
}

// Xóa sách
export function deleteBook(key) {
  const list = loadBooks();
  const newList = list.filter((book) => book.key !== key);
  saveBooks(newList);
  return newList;
}
