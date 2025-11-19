import React from 'react';
import { Breadcrumb } from 'antd';
import { HomeOutlined, UserOutlined, UnorderedListOutlined } from '@ant-design/icons';
import UserTable from './components/UserTable';

export default function UserMana() {
  return (
    <div className="flex flex-col min-h-screen bg-blue-50">
      <div className="flex flex-1">
        <main className="flex-1 p-2">
          <Breadcrumb
            className="mb-4 text-sm"
            items={[
              {
                href: '/user-mana',
                title: (
                  <>
                    <UserOutlined />
                    <span>Quản lý người dùng</span>
                  </>
                ),
              },
              {
                title: (
                  <>
                    <UnorderedListOutlined />
                    <span className="font-semibold text-[#23408e]">Danh sách người dùng</span>
                  </>
                ),
              },
            ]}
          />
          <div className=" shadow-md rounded-xl ">
            <UserTable />
          </div>
        </main>
      </div>
    </div>
  );
}
