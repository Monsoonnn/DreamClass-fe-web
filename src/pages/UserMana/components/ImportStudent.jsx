import React, { useState } from 'react';
import { Upload, Button, Table, Space, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { addUser, getUsers } from './userService';
import { useNavigate } from 'react-router-dom';

export default function ImportStudent() {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const MAX_FILE_SIZE_MB = 2;
  const removeVietnameseTones = (str) => {
    if (!str) return '';
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/\s+/g, '');
    return str;
  };
  const generateUsername = (fullName, dob) => {
    if (!fullName || !dob) return '';
    const nameParts = fullName.trim().split(' ');
    const lastName = nameParts[nameParts.length - 1];
    const dobDate = new Date(dob);
    const dd = String(dobDate.getDate()).padStart(2, '0');
    const mm = String(dobDate.getMonth() + 1).padStart(2, '0');
    const yyyy = dobDate.getFullYear();
    return `${removeVietnameseTones(lastName)}${dd}${mm}${yyyy}`;
  };

  const generatePassword = (dob) => {
    if (!dob) return '';
    const d = new Date(dob);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}${mm}${yyyy}`;
  };

  const handleFileChange = (file) => {
    if (file.size / 1024 / 1024 > MAX_FILE_SIZE_MB) {
      message.error(`File quá lớn! Vui lòng chọn file <= ${MAX_FILE_SIZE_MB}MB`);
      return false;
    }
    setFile(file);
    readExcel(file);
    return false;
  };

  const readExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { defval: '' }).map((row) => {
        const dobRaw = row['Ngày Sinh'] ? new Date(row['Ngày Sinh']) : null;
        const dobStr = dobRaw ? dobRaw.toISOString().split('T')[0] : '';
        const usernameTemp = generateUsername(row['Họ Tên'], dobStr);
        const passwordTemp = generatePassword(dobStr);

        return {
          code: row['Mã số'] || '',
          name: row['Họ Tên'] || '',
          dob: dobStr,
          gender: row['Giới Tính'] || '',
          address: row['Địa chỉ'] || '',
          level: row['Khối'] || '',
          class: row['Lớp'] || '',
          phone: row['Số điện thoại'] || '',
          email: row['Email'] || '',
          note: row['Ghi chú'] || '',
          username: usernameTemp,
          password: passwordTemp,
        };
      });
      setPreviewData(json);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSave = () => {
    if (!previewData.length) {
      message.error('Không có dữ liệu để lưu');
      return;
    }

    setLoading(true);

    previewData.forEach((item) => {
      if (!item.name || !item.dob) return;
      addUser({
        ...item,
        role: 'student',
      });
    });

    localStorage.setItem('users', JSON.stringify(getUsers()));

    message.success(`Đã thêm ${previewData.length} học sinh`);
    setPreviewData([]);
    setFile(null);
    setLoading(false);

    navigate('/user-mana');
  };

  const columns = previewData[0]
    ? Object.keys(previewData[0]).map((key) => ({
        title: key,
        dataIndex: key,
        key,
        ellipsis: true,
      }))
    : [];

  return (
    <div className="bg-white shadow-lg p-4 rounded-lg">
      <Space direction="vertical" className="w-full">
        <Upload beforeUpload={handleFileChange} accept=".xlsx,.xls" maxCount={1}>
          <Button icon={<UploadOutlined />} type="primary">
            Chọn file Excel
          </Button>
        </Upload>

        {previewData.length > 0 && (
          <div className="overflow-x-auto mt-4">
            <Table dataSource={previewData.map((row, index) => ({ ...row, key: index }))} columns={columns} pagination={{ pageSize: 5 }} bordered size="small" />
          </div>
        )}

        {previewData.length > 0 && (
          <div className="flex gap-2 justify-end mt-4">
            <Button
              onClick={() => {
                setPreviewData([]);
                setFile(null);
              }}
            >
              Hủy
            </Button>
            <Button type="primary" loading={loading} onClick={handleSave}>
              Lưu
            </Button>
          </div>
        )}
      </Space>
    </div>
  );
}
