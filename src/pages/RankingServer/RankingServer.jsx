import React from 'react';
import { Breadcrumb } from 'antd';
import { OrderedListOutlined, TeamOutlined } from '@ant-design/icons';
import RankingServerTable from './components/RankingServerTable';

export default function RankingServer() {
  return (
    <div className="flex flex-col min-h-screen bg-blue-50">
      <div className="flex flex-1">
        <main className="flex-1 p-2">
          <Breadcrumb
            className="mb-4 text-sm"
            items={[
              {
                href: '/ranking-server',
                title: (
                  <>
                    <TeamOutlined />
                    <span> Xếp hạng máy chủ</span>
                  </>
                ),
              },
              {
                title: (
                  <>
                    <OrderedListOutlined />
                    <span className="font-semibold text-[#23408e]">Bảng xếp hạng</span>
                  </>
                ),
              },
            ]}
          />
          <div className=" shadow-md rounded-xl ">
            <RankingServerTable />
          </div>
        </main>
      </div>
    </div>
  );
}
