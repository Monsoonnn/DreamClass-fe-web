import React from 'react';
import { Descriptions, Tag, Card } from 'antd';

export default function StudentInfo({ student }) {
  return (
    <Card
      className="bg-white shadow border-0 w-full max-w-none"
      styles={{
        body: { padding: 0 },
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 p-2">
        <div className="md:col-span-1 flex flex-col items-start gap-2">
          <img src={student.avatar || '/avatar-default.png'} alt="avatar" className="w-24 h-24 rounded-full border-2 border-blue-200 object-cover shadow mb-2" />

          <div className="text-xl font-bold text-[#23408e] leading-tight">{student.name}</div>

          <div className="text-sm text-gray-500">Mã số: {student.studentCode}</div>

          <Tag
            color={student.role === 'teacher' ? 'blue' : 'green'}
            style={{
              fontWeight: 600,
              fontSize: 12,
              padding: '2px 12px',
              marginTop: 4,
            }}
          >
            {student.role === 'teacher' ? 'Giáo viên' : 'Học sinh'}
          </Tag>
        </div>

        <div className="md:col-span-3 w-full">
          <Descriptions
            column={1}
            bordered
            size="small"
            className="rounded-lg"
            styles={{
              label: {
                width: 120,
                fontWeight: 500,
                color: '#23408e',
                background: '#f4f8ff',
                fontSize: 15,
                padding: 6,
              },
              content: {
                background: '#fff',
                fontSize: 13,
                padding: 6,
              },
            }}
          >
            <Descriptions.Item label="Giới tính">{student.gender}</Descriptions.Item>
            <Descriptions.Item label="Ngày sinh">{student.dob}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">{student.address}</Descriptions.Item>
            <Descriptions.Item label="Lớp">{student.class || '—'}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{student.phone}</Descriptions.Item>
            <Descriptions.Item label="Tài khoản">{student.username}</Descriptions.Item>
            <Descriptions.Item label="Ghi chú">{student.note}</Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </Card>
  );
}
