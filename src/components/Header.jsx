import React, { useEffect, useState } from 'react';
import { Dropdown, Button, message } from 'antd';
import { DownOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { logoutAPI } from '../services/authService';

export default function Header() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            setUsername(user.username || user.name || '');
        } catch (e) {
            console.error("Error parsing user from local storage", e);
        }
    } else {
        const savedUsername = localStorage.getItem('username');
        if (savedUsername) setUsername(savedUsername);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logoutAPI(); 
    } catch (error) {
      console.error('Logout API error (ignoring):', error);
    } finally {
      // Clear UI state. HttpOnly cookie is cleared by server response to logoutAPI
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      localStorage.removeItem('username');
      message.success('Đăng xuất thành công');
      navigate('/login');
    }
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
