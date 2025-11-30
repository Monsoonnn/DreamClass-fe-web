// -------------------------------
// StudentService.js
// Lưu trữ dữ liệu học sinh bằng localStorage
// -------------------------------

const STORAGE_KEY = 'students_list';
const sampleStudents = [
  {
    key: '1',
    studentCode: 'HS001',
    name: 'Nguyễn Văn A',
    dob: '2008-08-12',
    gender: 'Nam',
    nation: 'Kinh',
    cccd: '038200123456',
    address: 'Nam Định',
    phone: '0912345678',
    email: 'a@gmail.com',
    class: '8A1',
    level: '8',
    avatar: 'https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-cute-3.jpg',
    attempts: 12,
    totalScore: 920,
    rating: 'Tốt',
    note: 'Thành tích ổn định',
    username: 'hocsinh001',
    password: '123456',
    role: 'student',
  },

  {
    key: '2',
    studentCode: 'HS002',
    name: 'Trần Thị B',
    dob: '2009-03-21',
    gender: 'Nữ',
    nation: 'Kinh',
    cccd: '038200654321',
    address: 'Hà Nam',
    phone: '0987654321',
    email: 'a@gmail.com',
    class: '7B2',
    level: '7',
    avatar: 'https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-cute-3.jpg',
    attempts: 9,
    totalScore: 720,
    rating: 'Khá',
    note: 'Cần cải thiện điểm kiểm tra',
    username: 'hocsinh002',
    password: '123456',
    role: 'student',
  },
  {
    key: '3',
    studentCode: 'HS003',
    name: 'Trần Thị Học Sinh',
    dob: '2009-03-21',
    gender: 'Nữ',
    nation: 'Kinh',
    cccd: '038200654321',
    address: 'Hà Nam',
    phone: '0987654321',
    email: 'a@gmail.com',
    class: '7B2',
    level: '7',
    avatar: 'https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-cute-3.jpg',
    attempts: 5,
    totalScore: 480,
    rating: 'Trung bình',
    note: 'Thường bỏ bài giữa chừng',
    username: 'hocsinh002',
    password: '123456',
    role: 'student',
  },
  {
    key: '4',
    studentCode: 'HS004',
    name: 'Lê Thị Học Sinh',
    dob: '2009-01-21',
    gender: 'Nữ',
    nation: 'Kinh',
    cccd: '038200653291',
    address: 'Hà Nội',
    phone: '0987654321',
    email: 'a@gmail.com',
    class: '7B2',
    level: '7',
    avatar: 'https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-cute-3.jpg',
    attempts: 5,
    totalScore: 700,
    rating: 'Khá',
    note: 'Cần cải thiện kỹ năng làm bài',
    username: 'hocsinh002',
    password: '123456',
    role: 'student',
  },
];

// 🟢 Lấy danh sách học sinh
export const getStudents = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : sampleStudents;
};

// 🟢 Thêm học sinh mới
export const addStudent = (student) => {
  const list = getStudents();
  const newStudent = {
    ...student,
    key: Date.now().toString(), // tạo ID tạm
  };

  const updatedList = [...list, newStudent];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));

  return newStudent;
};

// 🟢 Cập nhật học sinh
export const updateStudent = (id, newData) => {
  const list = getStudents();
  const updatedList = list.map((s) => (String(s.key) === String(id) ? { ...s, ...newData } : s));

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  return true;
};

// 🟢 Xóa học sinh
export const deleteStudent = (id) => {
  const list = getStudents();
  const updatedList = list.filter((s) => String(s.key) !== String(id));

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  return true;
};

// 🟢 Tìm theo ID
export const getStudentById = (id) => {
  const list = getStudents();
  return list.find((s) => String(s.key) === String(id)) || null;
};
