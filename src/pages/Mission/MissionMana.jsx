import React from 'react';
import { Breadcrumb } from 'antd';
import { SolutionOutlined, UnorderedListOutlined } from '@ant-design/icons';
import MissionTable from './components/MissonTable';

export default function MissonMana() {
  return (
    <div className="flex flex-col min-h-screen bg-blue-50">
      <div className="flex flex-1">
        <main className="flex-1 p-2">
          <Breadcrumb
            className="mb-4 text-sm"
            items={[
              {
                href: '/mission-mana',
                title: (
                  <>
                    <SolutionOutlined />
                    <span>Quản lý nhiệm vụ</span>
                  </>
                ),
              },
              {
                title: (
                  <>
                    <UnorderedListOutlined />
                    <span className="font-semibold text-[#23408e]">Danh sách nhiệm vụ</span>
                  </>
                ),
              },
            ]}
          />
          <div className=" shadow-md rounded-xl ">
            <MissionTable />
          </div>
        </main>
      </div>
    </div>
  );
}
