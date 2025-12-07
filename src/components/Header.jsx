import React from 'react';
import { Dropdown, Button, message } from 'antd';
import { DownOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    message.success('Đăng xuất thành công');
  };

  const handleProfile = () => {
    if (!user) return;

    switch (user.role) {
      case 'admin':
        navigate('/profile');
        break;
      case 'teacher':
        navigate('/teacher-profile');
        break;
      case 'student':
        navigate('/student-profile');
        break;
      default:
        navigate('/profile');
    }
  };

  const menuItems = [
    {
      key: 'profile',
      label: 'Trang cá nhân',
      icon: <UserOutlined />,
      onClick: handleProfile,
      style: { color: '#23408e' },
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
      style: { color: '#23408e' },
    },
  ];

  const capitalizeName = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };
  const headerTitle = user?.role === 'student' ? 'HỆ THỐNG HỌC TẬP' : 'HỆ THỐNG QUẢN LÝ';

  const username = user?.username || user?.name || '';
  const name = user?.name || '';
  const userAvatar = user?.avatar || 'https://www.svgrepo.com/show/446475/avatar.svg'; // Fallback default avatar

  return (
    <header className="h-12 flex items-center justify-between px-5 bg-white border-b border-gray-200 shadow text-[#23408e] font-bold tracking-wide uppercase">
      <span className="ml-2">{headerTitle}</span>

      <div className="flex items-center space-x-4 text-base font-normal capitalize">
        <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow getPopupContainer={() => document.body}>
          <Button type="text" className="text-[#23408e] font-medium lowercase flex items-center">
            <img src={userAvatar} className="w-10 h-10 rounded-full object-cover" alt="avatar" />
            <span className="text-[#23408e] font-semibold capitalize">
              {capitalizeName(name)} | <i>{capitalizeName(username)}</i>
            </span>
            <DownOutlined className="text-xs ml-1" style={{ color: '#23408e' }} />
          </Button>
        </Dropdown>
      </div>
    </header>
  );
}
