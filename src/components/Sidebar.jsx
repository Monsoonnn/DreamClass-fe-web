import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  UserOutlined,
  ReadOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  DashboardOutlined,
  DownOutlined,
  UpOutlined,
  GiftOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

// MENU CHO GIÁO VIÊN
const teacherMenu = [
  { key: 'dashboard', label: 'Dashboard', icon: <DashboardOutlined style={{ fontSize: 18 }} />, path: '/dashboard' },
  { key: 'student', label: 'Quản lý học sinh', icon: <UserOutlined style={{ fontSize: 18 }} />, path: '/student-mana' },
  { key: 'mission', label: 'Quản lý nhiệm vụ', icon: <ReadOutlined style={{ fontSize: 18 }} />, path: '/teacher-mission-mana' },
  { key: 'ranking', label: 'Bảng xếp hạng', icon: <TrophyOutlined style={{ fontSize: 18 }} />, path: '/ranking-mana' },
  { key: 'book', label: 'Quản lý sách', icon: <ReadOutlined style={{ fontSize: 18 }} />, path: '/book-mana' },
  { key: 'quizz', label: 'Quản lý câu hỏi', icon: <ReadOutlined style={{ fontSize: 18 }} />, path: '/quizz-mana' },
];

// MENU CHO ADMIN
const adminMenu = [
  { key: 'dashboard', label: 'Dashboard', icon: <DashboardOutlined style={{ fontSize: 18 }} />, path: '/dashboard' },
  { key: 'usermana', label: 'Quản lý người dùng', icon: <HomeOutlined style={{ fontSize: 18 }} />, path: '/user-mana' },
  {
    key: 'ranking',
    label: 'Bảng xếp hạng',
    icon: <TrophyOutlined style={{ fontSize: 18 }} />,
    children: [
      { key: 'rankingserver', label: 'Xếp hạng máy chủ', path: '/ranking-server' },
      { key: 'rankinggrade', label: 'Xếp hạng theo khối', path: '/ranking-grade' },
      { key: 'rankingclass', label: 'Xếp hạng theo lớp', path: '/ranking-class' },
    ],
  },
  {
    key: 'reward',
    label: 'Quản lý phần thưởng',
    icon: <GiftOutlined style={{ fontSize: 18 }} />,
    children: [
      { key: 'spin', label: 'Vòng quay', path: '/spin-mana' },
      { key: 'item', label: 'Vật phẩm', path: '/item-mana' },
    ],
  },

  { key: 'mission', label: 'Quản lý nhiệm vụ', icon: <ReadOutlined style={{ fontSize: 18 }} />, path: '/mission-mana' },
  { key: 'book', label: 'Quản lý sách', icon: <ReadOutlined style={{ fontSize: 18 }} />, path: '/book-mana' },
  { key: 'quizz', label: 'Quản lý câu hỏi', icon: <ReadOutlined style={{ fontSize: 18 }} />, path: '/quizz-mana' },
];
// MENU CHO HỌC SINH
const StudentMenu = [
  { key: 'dashboard', label: 'Dashboard', icon: <DashboardOutlined style={{ fontSize: 18 }} />, path: '/dashboard' },
  { key: 'study', label: 'Học tâp', icon: <ReadOutlined style={{ fontSize: 18 }} />, path: '/student-study' },
  { key: 'quizz', label: 'Làm bài quizz', icon: <ReadOutlined style={{ fontSize: 18 }} />, path: '/student-quizz-list' },
  {
    key: 'ranking',
    label: 'Bảng xếp hạng',
    icon: <TrophyOutlined style={{ fontSize: 18 }} />,
    children: [
      { key: 'rankingserver', label: 'Xếp hạng máy chủ', path: '/student-ranking-server' },
      { key: 'rankinggrade', label: 'Xếp hạng theo khối', path: '/student-ranking-grade' },
      { key: 'rankingclass', label: 'Xếp hạng theo lớp', path: '/student-ranking-class' },
    ],
  },
  { key: 'book', label: 'Xem sách', icon: <ReadOutlined style={{ fontSize: 18 }} />, path: '/student-book' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [open, setOpen] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState('');
  const [openDropdowns, setOpenDropdowns] = useState({}); // QUẢN LÝ DROPDOWN

  const role = user?.role || 'teacher';

  const menuItems = role === 'admin' ? adminMenu : role === 'student' ? StudentMenu : teacherMenu;

  // Đổi highlight menu theo URL
  useEffect(() => {
    // Tìm xem URL hiện tại thuộc menu chính hay submenu
    menuItems.forEach((item) => {
      if (item.children) {
        item.children.forEach((child) => {
          if (location.pathname.startsWith(child.path)) {
            setSelectedMenu(child.key);
            setOpenDropdowns((prev) => ({ ...prev, [item.key]: true }));
          }
        });
      } else if (location.pathname.startsWith(item.path)) {
        setSelectedMenu(item.key);
      }
    });
  }, [location.pathname, role]);

  const toggleDropdown = (key) => {
    setOpenDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleMenuClick = (item) => {
    if (item.children) {
      toggleDropdown(item.key);
    } else {
      setSelectedMenu(item.key);
      navigate(item.path);
    }
  };

  return (
    <aside
      className={`bg-[#23408E] text-white transition-all duration-300
      min-h-screen flex flex-col fixed md:relative top-0 left-0 z-40
      ${open ? 'w-64' : 'w-16'}
      ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
    >
      {/* HEADER */}
      <div className={`flex items-center h-14 px-3 bg-[#23408E] border-b border-[#1a2e6c] ${open ? 'justify-between' : 'justify-center'}`}>
        <div className="flex items-center">
          <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow">
            <span className="text-[#23408E] font-bold text-base">DC</span>
          </div>
          {open && <span className="font-bold text-lg ml-2 tracking-wide">DreamClass</span>}
        </div>

        {open && (
          <button
            className="absolute -right-2 top-3 bg-[#3b5fc0] hover:bg-[#23408E] text-white rounded-r-lg w-6 h-8 flex items-center justify-center shadow"
            onClick={() => setOpen(false)}
          >
            <MenuFoldOutlined style={{ fontSize: 14 }} />
          </button>
        )}
      </div>

      {/* MENU */}
      <div className="py-3 px-2 flex-1 overflow-y-auto">
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <div key={item.key}>
              {/* MENU CHÍNH */}
              <button
                onClick={() => handleMenuClick(item)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg w-full transition cursor-pointer
                  ${selectedMenu === item.key ? 'bg-white/90 text-[#23408E] shadow font-bold' : 'hover:bg-white/20 text-white'}`}
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  {open && <span>{item.label}</span>}
                </div>

                {/* ICON DROPDOWN */}
                {open && item.children && (openDropdowns[item.key] ? <UpOutlined style={{ fontSize: 12 }} /> : <DownOutlined style={{ fontSize: 12 }} />)}
              </button>

              {/* SUB-MENU */}
              {item.children && openDropdowns[item.key] && open && (
                <div className="ml-10 mt-1 flex flex-col gap-1">
                  {item.children.map((sub) => (
                    <button
                      key={sub.key}
                      onClick={() => navigate(sub.path)}
                      className={`text-left px-2 py-1 rounded-md transition
                        ${selectedMenu === sub.key ? 'bg-white text-[#23408E] font-bold' : 'text-white/80 hover:bg-white/20'}`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* NÚT MỞ SIDEBAR */}
      {!open && (
        <button
          className="absolute -right-6 top-3 bg-[#3b5fc0] hover:bg-[#23408E] text-white rounded-r-lg w-6 h-8 flex items-center justify-center shadow"
          onClick={() => setOpen(true)}
        >
          <MenuUnfoldOutlined style={{ fontSize: 14 }} />
        </button>
      )}
    </aside>
  );
}
