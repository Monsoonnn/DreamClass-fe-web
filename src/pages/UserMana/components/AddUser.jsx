import React, { useState } from 'react';
import { Select, Breadcrumb } from 'antd';
import { HomeOutlined, UserOutlined, UnorderedListOutlined } from '@ant-design/icons';
import StudentForm from './StudentForm';
import TeacherForm from './TeacherForm';
import ImportStudent from './ImportStudent';

export default function AddUserPage() {
  const [userType, setUserType] = useState(null);

  const renderForm = () => {
    switch (userType) {
      case 'student':
        return <StudentForm />;
      case 'teacher':
        return <TeacherForm />;
      case 'import-student':
        return <ImportStudent onCancel={() => setUserType(null)} />;

      default:
        return <div className="text-center text-gray-500 mt-10 text-lg">Vui lòng chọn loại người dùng để tiếp tục</div>;
    }
  };

  return (
    <div className="bg-blue-50 min-h-screen p-6 shadow-lg rounded-lg">
      <Breadcrumb
        className="mb-4 text-sm"
        items={[
          {
            href: '/user-mana',
            title: (
              <>
                <UserOutlined />
                <span>Quản lý người dùng</span>
              </>
            ),
          },
          {
            title: (
              <>
                <UnorderedListOutlined />
                <span className="font-semibold text-[#23408e]">Danh sách người dùng</span>
              </>
            ),
          },
        ]}
      />
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold">
          {userType === 'student' ? 'THÊM HỌC SINH' : userType === 'teacher' ? 'THÊM GIÁO VIÊN' : userType === 'admin' ? 'THÊM ADMIN' : 'THÊM NGƯỜI DÙNG'}
        </h2>

        <Select
          placeholder="Chọn người dùng"
          onChange={(value) => setUserType(value)}
          style={{ width: 250 }}
          options={[
            { value: 'student', label: 'Học sinh' },
            { value: 'teacher', label: 'Giáo viên' },
            { value: 'import-student', label: 'Import học sinh từ Excel' },
          ]}
        />
      </div>
      {renderForm()}
    </div>
  );
}
