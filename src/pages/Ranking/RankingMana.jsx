import React from 'react';
import { Breadcrumb, Tabs } from 'antd';
import { OrderedListOutlined, TrophyOutlined, TeamOutlined } from '@ant-design/icons';
import RankingTable from './components/RankingTable';
import TeacherRankingGrade from './components/TeacherRankingGrade';

export default function RankingMana() {
  const items = [
    {
      key: 'class',
      label: (
        <span className="flex items-center gap-2">
          <TeamOutlined />
          Theo lớp
        </span>
      ),
      children: <RankingTable />,
    },
    {
      key: 'grade',
      label: (
        <span className="flex items-center gap-2">
          <TrophyOutlined />
          Theo khối
        </span>
      ),
      children: <TeacherRankingGrade />,
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
                    <span className="font-semibold text-[#23408e]">Quản lý bảng xếp hạng</span>
                  </>
                ),
              },
            ]}
          />
          <div className="bg-white shadow-md rounded-xl p-2">
            <Tabs defaultActiveKey="class" items={items} />
          </div>
        </main>
      </div>
    </div>
  );
}