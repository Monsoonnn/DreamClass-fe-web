import React, { useState } from 'react';
import { Form, Input, InputNumber, Button, DatePicker, Select, Space, Card, Divider, Switch, Breadcrumb } from 'antd';
import { PlusOutlined, DeleteOutlined, HomeOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../services/api';
import dayjs from 'dayjs';
import { showLoading, closeLoading, showSuccess, showError } from '../../../utils/swalUtils';

const { RangePicker } = DatePicker;
const { Option } = Select;

export default function AddSpin() {
  const [form] = Form.useForm();
  const [items, setItems] = useState([{ itemId: '', rate: 0, isRare: false }]);
  const navigate = useNavigate();

  const addItem = () => {
    setItems([...items, { itemId: '', rate: 0, isRare: false }]);
  };

  const removeItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handleSubmit = async (values) => {
    try {
      // Validate items
      if (items.length === 0 || items.some((item) => !item.itemId || !item.rate)) {
        showError('Vui lòng điền đầy đủ thông tin các item!');
        return;
      }

      // Validate tổng rate = 1
      const totalRate = items.reduce((sum, item) => sum + Number(item.rate), 0);
      if (Math.abs(totalRate - 1) > 0.01) {
        showError(`Tổng tỉ lệ phải bằng 1 (hiện tại: ${totalRate.toFixed(2)})`);
        return;
      }

      const [start, end] = values.timeRange;

      const payload = {
        name: values.name,
        description: values.description || '',
        spinPrice: Number(values.spinPrice),
        currency: values.currency,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        items: items.map((it) => ({
          itemId: it.itemId,
          rate: Number(it.rate),
          isRare: !!it.isRare,
        })),
      };

      console.log('PAYLOAD SEND:', payload);

      showLoading();
      const response = await apiClient.post('/spin-wheels', payload);
      console.log('API Response:', response.data);

      closeLoading();
      await showSuccess('Tạo vòng quay thành công!');

      form.resetFields();
      setItems([{ itemId: '', rate: 0, isRare: false }]);
      navigate('/spin-mana');
    } catch (err) {
      console.error('Error details:', err.response?.data || err.message);
      closeLoading();
      showError(err.response?.data?.message || 'Lỗi tạo vòng quay!');
    }
  };

  return (
    <div className="">
      <div className="p-4">
        <Breadcrumb
          className=" text-sm"
          items={[
            {
              href: '/spin-mana',
              title: (
                <>
                  <HomeOutlined />
                  <span className="font-semibold text-[#23408e]">Danh sách vòng quay</span>
                </>
              ),
            },
            {
              title: (
                <>
                  <UnorderedListOutlined />
                  <span>Thêm vòng quay</span>
                </>
              ),
            },
          ]}
        />
      </div>
      <Card title="Thêm Vòng Quay Mới" className="rounded-none max-w-3xl mx-auto">
        <Form className="custom-form" layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item label="Tên vòng quay" name="name" rules={[{ required: true, message: 'Nhập tên vòng quay!' }]}>
            <Input placeholder="Nhập tên vòng quay..." />
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={2} placeholder="Nhập mô tả..." />
          </Form.Item>

          <Form.Item label="Giá quay" name="spinPrice" rules={[{ required: true, message: 'Nhập giá quay!' }]}>
            <InputNumber min={1} placeholder="Giá quay" className="w-full" />
          </Form.Item>

          <Form.Item label="Loại tiền tệ" name="currency" rules={[{ required: true, message: 'Chọn loại tiền!' }]}>
            <Select placeholder="Chọn currency">
              <Option value="gold">Gold</Option>
              <Option value="diamond">Diamond</Option>
              <Option value="point">Point</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Thời gian sự kiện" name="timeRange" rules={[{ required: true, message: 'Chọn thời gian!' }]}>
            <RangePicker showTime className="w-full" format="DD/MM/YYYY HH:mm:ss" placeholder={['Bắt đầu', 'Kết thúc']} />
          </Form.Item>

          <Divider orientation="left">
            Danh sách vật phẩm
            <span style={{ fontSize: '12px', color: '#999', marginLeft: '10px' }}>
              (Tổng tỉ lệ phải = 1.00: {items.reduce((sum, item) => sum + Number(item.rate), 0).toFixed(2)})
            </span>
          </Divider>

          {items.map((item, index) => (
            <Card key={index} className="rounded-none" size="small">
              <Space direction="vertical" className="w-full" size="middle">
                {/* Mã vật phẩm + nút xóa */}
                <div>
                  <label className="block text-sm font-medium mb-1">Mã vật phẩm</label>

                  <div className="flex items-center gap-1">
                    <Input placeholder="VD: CCT102025, GG001..." value={item.itemId} onChange={(e) => updateItem(index, 'itemId', e.target.value)} />

                    {items.length > 1 && (
                      <Button danger type="dashed" icon={<DeleteOutlined />} onClick={() => removeItem(index)}>
                        Xóa
                      </Button>
                    )}
                  </div>
                </div>

                {/* Tỉ lệ */}
                <div>
                  <label className="block text-sm font-medium mb-1">Tỉ lệ</label>
                  <InputNumber
                    placeholder="0 - 1"
                    min={0}
                    max={1}
                    step={0.01}
                    value={item.rate}
                    className="w-full"
                    onChange={(v) => updateItem(index, 'rate', v || 0)}
                    precision={2}
                  />
                </div>
              </Space>
            </Card>
          ))}

          <Button className="rounded-none" type="dashed" icon={<PlusOutlined />} onClick={addItem} block>
            Thêm Item
          </Button>

          <Divider />

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Tạo Vòng Quay
              </Button>
              <Button onClick={() => navigate('/spin-mana')}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
