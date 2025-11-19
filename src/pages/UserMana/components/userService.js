// src/services/userService.js
// Data tạm thời người dùng
let users = [
  // ============================
  // HỌC SINH
  // ============================
  {
    key: '1',
    code: 'HS001',
    name: 'Nguyễn Văn A',
    dob: '2008-08-12',
    gender: 'Nam',
    nation: 'Kinh',
    cccd: '038200123456',
    address: 'Thôn Xuân Hòa, Nam Định',
    phone: '0912345678',
    class: '8A1',
    studyStatus: 'Đang học',
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
    code: 'HS002',
    name: 'Trần Thị B',
    dob: '2009-03-21',
    gender: 'Nữ',
    nation: 'Kinh',
    cccd: '038200654321',
    address: 'Phường Tân Phong, Hà Nam',
    phone: '0987654321',
    class: '7B2',
    studyStatus: 'Đang học',
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
    code: 'HS003',
    name: 'Trần Thị Học Sinh',
    dob: '2009-03-21',
    gender: 'Nữ',
    nation: 'Kinh',
    cccd: '038200654321',
    address: 'Phường Tân Phong, Hà Nam',
    phone: '0987654321',
    class: '7B2',
    studyStatus: 'Đang học',
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
    code: 'HS004',
    name: 'Lê Thị Học Sinh',
    dob: '2009-01-21',
    gender: 'Nữ',
    nation: 'Kinh',
    cccd: '038200653291',
    address: 'Phường Tân Phong, Hà Nội',
    phone: '0987654321',
    class: '7B2',
    studyStatus: 'Đang học',
    avatar: 'https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-cute-3.jpg',
    attempts: 5,
    totalScore: 700,
    rating: 'Khá',
    note: 'Cần cải thiện kỹ năng làm bài',
    username: 'hocsinh002',
    password: '123456',
    role: 'student',
  },
  // Giáo viên
  {
    key: '5',
    code: 'GV002',
    name: 'Phạm Minh C',
    dob: '1990-04-02',
    gender: 'Nam',
    nation: 'Kinh',
    cccd: '054321987600',
    address: 'Thành phố Hải Phòng',
    phone: '0978111222',
    class: 'Chủ nhiệm lớp 7B2',
    studyStatus: 'Đang công tác',
    avatar: 'https://velle.vn/wp-content/uploads/2025/04/avatar-vo-tri-8-1.jpg',
    note: 'Chuyên môn môn Toán.',
    username: 'giaovien02',
    password: '123456',
    role: 'teacher',
  },
];

export const getUsers = () => {
  return [...users]; // trả về bản sao
};

export const addUser = (user) => {
  const key = (users.length + 1).toString();
  users.push({ key, ...user });
  return { key, ...user };
};

export const updateUser = (key, updatedUser) => {
  users = users.map((u) => (u.key === key ? { ...u, ...updatedUser } : u));
};

export const deleteUser = (key) => {
  users = users.filter((u) => u.key !== key);
};
