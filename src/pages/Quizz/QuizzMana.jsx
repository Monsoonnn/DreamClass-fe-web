import React from 'react';
import { Breadcrumb } from 'antd';
import { HomeOutlined, QuestionCircleOutlined, UnorderedListOutlined } from '@ant-design/icons';
import QuizzTable from './components/QuizzTable';

export default function QuizzMana() {
  return (
    <div className="flex flex-col min-h-screen bg-blue-50">
      <div className="flex flex-1">
        <main className="flex-1 p-2">
          <Breadcrumb
            className="mb-4 text-sm"
            items={[
              {
                href: '/quizz-mana',
                title: (
                  <>
                    <QuestionCircleOutlined />
                    <span>Quản lý quizz</span>
                  </>
                ),
              },
              {
                title: (
                  <>
                    <UnorderedListOutlined />
                    <span className="font-semibold text-[#23408e]">Danh sách quizz</span>
                  </>
                ),
              },
            ]}
          />
          <div className=" shadow-md rounded-xl ">
            <QuizzTable />
          </div>
        </main>
      </div>
    </div>
  );
}
