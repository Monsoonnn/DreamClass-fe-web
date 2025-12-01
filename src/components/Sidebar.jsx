import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserOutlined, TeamOutlined, ReadOutlined, MenuFoldOutlined, MenuUnfoldOutlined, HomeOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

// MENU CHO GIÁO VIÊN
const teacherMenu = [
  { key: 'student', label: 'Quản lý học sinh', icon: <UserOutlined style={{ fontSize: 18 }} />, path: '/student-mana' },
  { key: 'mission', label: 'Quản lý nhiệm vụ', icon: <ReadOutlined style={{ fontSize: 18 }} />, path: '/mission-mana' },
  { key: 'ranking', label: 'Quản lý ranking', icon: <TeamOutlined style={{ fontSize: 18 }} />, path: '/ranking-mana' },
  { key: 'book', label: 'Quản lý sách', icon: <ReadOutlined style={{ fontSize: 18 }} />, path: '/book-mana' },
];

// MENU CHO ADMIN
const adminMenu = [
  { key: 'usermana', label: 'Quản lý người dùng', icon: <HomeOutlined style={{ fontSize: 18 }} />, path: '/user-mana' },
  { key: 'rankingserver', label: 'Quản lý Ranking Server', icon: <UserOutlined style={{ fontSize: 18 }} />, path: '/ranking-server' },
  { key: 'reward', label: 'Quản lý phần thưởng', icon: <HomeOutlined style={{ fontSize: 18 }} />, path: '/reward-mana' },
  { key: 'mission', label: 'Quản lý nhiệm vụ', icon: <ReadOutlined style={{ fontSize: 18 }} />, path: '/mission-mana' },
  { key: 'book', label: 'Quản lý sách', icon: <ReadOutlined style={{ fontSize: 18 }} />, path: '/book-mana' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [open, setOpen] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState('');
  
  const role = user?.role || 'teacher';

  // Chọn menu theo role
  const menuItems = role === 'admin' ? adminMenu : teacherMenu;

  // Đổi highlight menu theo URL
  useEffect(() => {
    const currentItem = menuItems.find((item) => location.pathname.startsWith(item.path));
    if (currentItem) setSelectedMenu(currentItem.key);
  }, [location.pathname, role]);

  const handleMenuClick = (item) => {
    setSelectedMenu(item.key);
    navigate(item.path);
  };

  return (
    <aside
      className={`bg-[#23408E] text-white z-40 transition-all duration-300
      min-h-screen flex flex-col fixed md:relative top-0 left-0
      ${open ? 'w-64' : 'w-16'}
      ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
    >
      {/* HEADER */}
      <div className={`flex items-center h-14 px-3 bg-[#23408E] border-b border-[#1a2e6c] ${open ? 'justify-between' : 'justify-center'}`}>
        <div className="flex items-center">
          <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow">
            <span className="text-[#23408E] font-bold text-base">DC</span>
          </div>
          {open && <span className="font-bold text-lg ml-2 tracking-wide select-none">DreamClass</span>}
        </div>

        {open && (
          <button
            className="absolute -right-2 top-3 bg-[#3b5fc0] hover:bg-[#23408E] text-white rounded-r-lg w-6 h-8 flex items-center justify-center shadow cursor-pointer"
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
            <button
              key={item.key}
              onClick={() => handleMenuClick(item)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition font-medium text-[15px] w-full cursor-pointer
                ${selectedMenu === item.key ? 'bg-white/90 text-[#23408E] shadow font-bold' : 'hover:bg-white/20 hover:text-white/90 text-white'}`}
            >
              {item.icon}
              {open && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* NÚT MỞ SIDEBAR */}
      {!open && (
        <button
          className="absolute -right-6 top-3 bg-[#3b5fc0] hover:bg-[#23408E] text-white rounded-r-lg w-6 h-8 flex items-center justify-center shadow cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <MenuUnfoldOutlined style={{ fontSize: 14 }} />
        </button>
      )}
    </aside>
  );
}
