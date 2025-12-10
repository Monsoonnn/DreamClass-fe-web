import React, { useState } from 'react';
import { Upload, Button, Table, Space, message, Divider } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { apiClient } from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../../utils/dateUtil';

export default function ImportStudent() {
  const [file, setFile] = useState(null);
  const [successData, setSuccessData] = useState([]);
  const [skippedData, setSkippedData] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const MAX_FILE_SIZE_MB = 2;

  // Chọn file
  const handleFileChange = (file) => {
    if (file.size / 1024 / 1024 > MAX_FILE_SIZE_MB) {
      message.error(`File quá lớn! Vui lòng chọn file <= ${MAX_FILE_SIZE_MB}MB`);
      return false;
    }
    setFile(file);
    return false;
  };

  // Import file lên backend
  const handleImport = async () => {
    if (!file) {
      message.error('Vui lòng chọn file Excel trước khi import');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post('/accounts/students/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const results = response.data.data?.results || {};
      const successList = results.success || [];
      const skippedList = results.skipped || [];

      // Lọc chỉ các trường cơ bản
      const filteredSuccess = successList.map((item, index) => ({
        key: index,
        stt: index + 1,
        name: item.name,
        gender: item.gender,
        dateOfBirth: formatDate(item.dateOfBirth),
        grade: item.grade || '',
        className: item.className || '',
        address: item.address || '',
        username: item.username,
        password: item.password,
        notes: item.notes || '',
      }));

      const filteredSkipped = skippedList.map((item, index) => ({
        key: index,
        stt: index + 1,
        username: item.username,
        email: item.email,
        reason: item.reason,
      }));

      setSuccessData(filteredSuccess);
      setSkippedData(filteredSkipped);

      message.success(`Import xong: ${filteredSuccess.length} thành công, ${filteredSkipped.length} bị bỏ qua`);
    } catch (err) {
      console.error('Lỗi import học sinh:', err);
      message.error('Không thể import học sinh. Vui lòng kiểm tra file hoặc session.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    navigate('/user-mana');
  };

  // Columns cho bảng thành công
  const successColumns = [
    { title: 'STT', dataIndex: 'stt', key: 'stt', align: 'center' },
    { title: 'Họ tên', dataIndex: 'name', key: 'name' },
    { title: 'Giới tính', dataIndex: 'gender', key: 'gender', align: 'center' },
    { title: 'Ngày sinh', dataIndex: 'dateOfBirth', key: 'dateOfBirth', align: 'center' },
    { title: 'Lớp', dataIndex: 'className', key: 'className', align: 'center' },
    { title: 'Khối', dataIndex: 'grade', key: 'grade', align: 'center' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
    { title: 'Tài khoản', dataIndex: 'username', key: 'username', align: 'center' },
    { title: 'Mật khẩu', dataIndex: 'password', key: 'password', align: 'center' },
    { title: 'Ghi chú', dataIndex: 'notes', key: 'notes' },
  ];

  // Columns cho bảng bỏ qua
  const skippedColumns = [
    { title: 'STT', dataIndex: 'stt', key: 'stt', align: 'center' },
    { title: 'Tài khoản', dataIndex: 'username', key: 'username' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Lý do', dataIndex: 'reason', key: 'reason' },
  ];

  return (
    <div className="bg-white shadow-lg p-4 rounded-lg">
      <Space direction="vertical" className="w-full">
        <Upload beforeUpload={handleFileChange} accept=".xlsx,.xls" maxCount={1}>
          <Button icon={<UploadOutlined />} type="primary" disabled={successData.length > 0}>
            Chọn file Excel
          </Button>
        </Upload>

        {file && successData.length === 0 && (
          <div className="flex gap-2 mt-4">
            <Button type="primary" loading={loading} onClick={handleImport}>
              Import và Sinh Tài Khoản
            </Button>
            <Button onClick={() => setFile(null)}>Hủy</Button>
          </div>
        )}

        {successData.length > 0 && (
          <>
            <Divider orientation="left">Học sinh tạo thành công</Divider>
            <Table dataSource={successData} columns={successColumns} pagination={{ pageSize: 5 }} bordered size="small" />

            {skippedData.length > 0 && (
              <>
                <Divider orientation="left">Học sinh bị bỏ qua / lỗi</Divider>
                <Table dataSource={skippedData} columns={skippedColumns} pagination={{ pageSize: 5 }} bordered size="small" />
              </>
            )}

            <div className="flex gap-2 justify-end mt-4">
              <Button type="primary" onClick={handleSave}>
                Hoàn tất
              </Button>
              <Button
                onClick={() => {
                  setSuccessData([]);
                  setSkippedData([]);
                  setFile(null);
                }}
              >
                Hủy
              </Button>
            </div>
          </>
        )}
      </Space>
    </div>
  );
}
