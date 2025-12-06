import React from 'react';
import { Breadcrumb } from 'antd';
import { HomeOutlined, UserOutlined, UnorderedListOutlined } from '@ant-design/icons';
import SpinTable from './components/SpinTable';

export default function SpinMana() {
  return (
    <div className="flex flex-col min-h-screen bg-blue-50">
      <div className="flex flex-1">
        <main className="flex-1 p-2">
          <Breadcrumb
            className="mb-4 text-sm"
            items={[
              {
                href: '/spin-mana',
                title: (
                  <>
                    <HomeOutlined />
                    <span className="font-semibold text-[#23408e]">Quản lý vòng quay</span>
                  </>
                ),
              },
              {
                title: (
                  <>
                    <UnorderedListOutlined />
                    <span>Danh sách vòng quay</span>
                  </>
                ),
              },
            ]}
          />
          <div className=" shadow-md rounded-xl ">
            <SpinTable />
          </div>
        </main>
      </div>
    </div>
  );
}
