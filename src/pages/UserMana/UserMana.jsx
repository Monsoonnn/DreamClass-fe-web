import React from 'react';
import { Breadcrumb, Tabs } from 'antd';
import { UserSwitchOutlined, UnorderedListOutlined } from '@ant-design/icons';
import UserTable from './components/UserTable';
import TeacherTable from './components/TeacherTable';

export default function UserMana() {
  const tabItems = [
    {
      key: 'students',
      label: 'Danh sách học sinh',
      children: <UserTable />,
    },
    {
      key: 'teachers',
      label: 'Danh sách giáo viên',
      children: <TeacherTable />,
    },
  ];

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
                    <UserSwitchOutlined />
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

          <div className="shadow-md bg-white rounded-none p-3">
            <Tabs defaultActiveKey="students" items={tabItems} />
          </div>
        </main>
      </div>
    </div>
  );
}
