import React, { useEffect, useState } from 'react';
import { Dropdown, Button, Badge } from 'antd';
import { DownOutlined, LogoutOutlined, BellFilled } from '@ant-design/icons';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const user = Cookies.get('username');
    if (user) setUsername(user);
  }, []);

  const notifications = [
    { id: 1, message: 'Thông báo hệ thống 1' },
    { id: 2, message: 'Thông báo hệ thống 2' },
  ];
  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('username');
    navigate('/');
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

  const notificationMenu = {
    items: notifications.map((noti) => ({
      key: noti.id,
      label: noti.message,
    })),
  };

  const capitalizeName = (name) => {
    return name
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  return (
    <header className="h-12 flex items-center justify-between px-5 bg-white border-b border-gray-200 shadow text-[#23408e] font-bold tracking-wide uppercase">
      <span className="ml-2">HỆ THỐNG QUẢN LÝ</span>

      <div className="flex items-center space-x-4 text-base font-normal capitalize">
        {/* Thông báo */}
        <Dropdown menu={notificationMenu} placement="bottomRight" arrow trigger={['click']} getPopupContainer={() => document.body}>
          <Badge count={notifications.length} size="small" offset={[-2, 2]}>
            <BellFilled className="text-lg cursor-pointer" style={{ color: '#23408e' }} />
          </Badge>
        </Dropdown>

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
