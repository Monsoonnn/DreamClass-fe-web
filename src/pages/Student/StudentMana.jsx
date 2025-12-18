import React from 'react';
import { Breadcrumb } from 'antd';
import { HomeOutlined, TeamOutlined, UnorderedListOutlined } from '@ant-design/icons';
import StudentTable from './components/StudentTable';

export default function StudentMana() {
  return (
    <div className="flex flex-col min-h-screen bg-blue-50">
      <div className="flex flex-1">
        <main className="flex-1 p-2">
          <Breadcrumb
            className="mb-4 text-sm"
            items={[
              {
                href: '/student-mana',
                title: (
                  <>
                    <TeamOutlined />
                    <span>Quản lý học sinh</span>
                  </>
                ),
              },
              {
                title: (
                  <>
                    <UnorderedListOutlined />
                    <span className="font-semibold text-[#23408e]">Danh sách học sinh</span>
                  </>
                ),
              },
            ]}
          />
          <div className=" shadow-md rounded-xl ">
            <StudentTable />
          </div>
        </main>
      </div>
    </div>
  );
}
