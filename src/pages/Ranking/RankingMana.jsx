import React from 'react';
import { Breadcrumb } from 'antd';
import { OrderedListOutlined, TrophyOutlined } from '@ant-design/icons';
import RankingTable from './components/RankingTable';

export default function RankingMana() {
  return (
    <div className="flex flex-col min-h-screen bg-blue-50">
      <div className="flex flex-1">
        <main className="flex-1 p-2">
          <Breadcrumb
            className="mb-4 text-sm"
            items={[
              {
                href: '/ranking-mana',
                title: (
                  <>
                    <TrophyOutlined />
                    <span>Bảng xếp hạng</span>
                  </>
                ),
              },
              {
                title: (
                  <>
                    <OrderedListOutlined />
                    <span className="font-semibold text-[#23408e]">Bảng xếp hạng lớp</span>
                  </>
                ),
              },
            ]}
          />
          <div className=" shadow-md rounded-xl ">
            <RankingTable />
          </div>
        </main>
      </div>
    </div>
  );
}
