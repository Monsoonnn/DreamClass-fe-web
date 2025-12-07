import React from 'react';
import { Breadcrumb } from 'antd';
import { HomeOutlined, UserOutlined, UnorderedListOutlined } from '@ant-design/icons';
import RewardTable from './components/RewardTable';

export default function RewardMana() {
  return (
    <div className="flex flex-col min-h-screen bg-blue-50">
      <div className="flex flex-1">
        <main className="flex-1 p-2">
          <Breadcrumb
            className="mb-4 text-sm"
            items={[
              {
                href: '/item-mana',
                title: (
                  <>
                    <HomeOutlined />
                    <span className="font-semibold text-[#23408e]">Quản lý phần thưởng</span>
                  </>
                ),
              },
              {
                title: (
                  <>
                    <UnorderedListOutlined />
                    <span>Danh sách phần thưởng</span>
                  </>
                ),
              },
            ]}
          />
          <div className=" shadow-md rounded-xl ">
            <RewardTable />
          </div>
        </main>
      </div>
    </div>
  );
}
