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
    class: '10A1',
    dob: '2008-05-12',
    gender: 'Nam',
    phone: '0912345678',
    address: 'Hà Nội',
    status: 'Đang học',
    attempts: 12,
    totalScore: 920,
    rating: 'Tốt',
    note: 'Thành tích ổn định',
    avatar: 'https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-cute-3.jpg',
    username: 'hocsinh001',
    password: '123456',
  },
  {
    key: '2',
    studentCode: 'HS002',
    name: 'Trần Thị B',
    class: '10A2',
    dob: '2008-09-23',
    gender: 'Nữ',
    phone: '0912345678',
    address: 'Hà Nội',
    status: 'Nghỉ học',
    attempts: 9,
    totalScore: 720,
    rating: 'Khá',
    note: 'Cần cải thiện điểm kiểm tra',
    avatar: 'https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-cute-3.jpg',
    username: 'hocsinh002',
    password: '123456',
  },
  {
    key: '3',
    studentCode: 'HS003',
    name: 'Nguyễn Hữu A',
    class: '10A1',
    dob: '2008-05-11',
    gender: 'Nam',
    phone: '0912345678',
    address: 'Hà Nội',
    status: 'Đang học',
    attempts: 5,
    totalScore: 480,
    rating: 'Trung bình',
    note: 'Thường bỏ bài giữa chừng',
    avatar: 'https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-cute-3.jpg',
    username: 'hocsinh003',
    password: '123456',
  },
  {
    key: '4',
    studentCode: 'HS004',
    name: 'Trần Xuân B',
    class: '10A2',
    dob: '2008-01-23',
    gender: 'Nữ',
    phone: '0912345678',
    address: 'Hà Nội',
    status: 'Đang học',
    attempts: 10,
    totalScore: 860,
    rating: 'Tốt',
    note: 'Nỗ lực học tập',
    avatar: 'https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-cute-3.jpg',
    username: 'hocsinh004',
    password: '123456',
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
