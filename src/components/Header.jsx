import React from 'react';
import { Dropdown, Button, message } from 'antd';
import { DownOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    message.success('Đăng xuất thành công');
    // Redirection is handled by ProtectedRoute (redirects to /login when user becomes null)
  };

  const menuItems = [
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

  const username = user?.username || user?.name || '';

  return (
    <header className="h-12 flex items-center justify-between px-5 bg-white border-b border-gray-200 shadow text-[#23408e] font-bold tracking-wide uppercase">
      <span className="ml-2">HỆ THỐNG QUẢN LÝ</span>

      <div className="flex items-center space-x-4 text-base font-normal capitalize">
        {/* Thông tin người dùng */}
        <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow getPopupContainer={() => document.body}>
          <Button type="text" className="text-[#23408e] font-medium lowercase flex items-center">
            <img src="https://www.svgrepo.com/show/446475/avatar.svg" className="w-10 h-10" alt="avatar" />
            <span className="text-[#23408e] font-semibold capitalize">
              Nguyễn Văn A | <i>{capitalizeName(username)}</i>
            </span>
            <DownOutlined className="text-xs ml-1" style={{ color: '#23408e' }} />
          </Button>
        </Dropdown>
      </div>
    </header>
  );
}
