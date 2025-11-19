import React from 'react';
import { Breadcrumb } from 'antd';
import { HomeOutlined, UserOutlined, UnorderedListOutlined } from '@ant-design/icons';
import StoreTable from './components/StoreTable';

export default function StoreMana() {
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
                    <UserOutlined />
                    <span>Quản lý cửa hàng</span>
                  </>
                ),
              },
              {
                title: (
                  <>
                    <UnorderedListOutlined />
                    <span className="font-semibold text-[#23408e]">Danh sách vật phẩm</span>
                  </>
                ),
              },
            ]}
          />
          <div className=" shadow-md rounded-xl ">
            <StoreTable />
          </div>
        </main>
      </div>
    </div>
  );
}
