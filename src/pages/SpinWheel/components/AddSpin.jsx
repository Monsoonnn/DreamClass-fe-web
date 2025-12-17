import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, DatePicker, Select, Space, Card, Divider, Switch, Breadcrumb, Image, TimePicker } from 'antd';
import { PlusOutlined, DeleteOutlined, HomeOutlined, UnorderedListOutlined } from '@ant-design/icons';

import { useNavigate } from 'react-router-dom';
import apiClient from '../../../services/api';
import dayjs from 'dayjs';
import { showLoading, closeLoading, showSuccess, showError } from '../../../utils/swalUtils';

const { Option } = Select;

export default function AddSpin() {
  const [form] = Form.useForm();
  const [items, setItems] = useState([{ itemId: undefined, rate: 0, isRare: false, imageUrl: '' }]); // Changed initial itemId to undefined and added imageUrl
  const [allItems, setAllItems] = useState([]); // Stores all items from API
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const res = await apiClient.get('/items'); // Assuming '/items' is the endpoint for all items
        setAllItems(res.data?.data || []);
      } catch (err) {
        console.error('Lỗi khi tải danh sách vật phẩm:', err);
        showError('Không thể tải danh sách vật phẩm!');
      }
    };
    fetchAllItems();
  }, []);

  const addItem = () => {
    setItems([...items, { itemId: undefined, rate: 0, isRare: false, imageUrl: '' }]);
  };

  const removeItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    if (field === 'itemId') {
      const selectedItem = allItems.find(item => item.itemId === value); // Corrected to item.itemId
      updated[index].imageUrl = selectedItem ? selectedItem.imageUrl : '';
    }
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

      const startDateTime = values.startDate
        .hour(values.startTime.hour())
        .minute(values.startTime.minute())
        .second(values.startTime.second());

      const endDateTime = values.endDate
        .hour(values.endTime.hour())
        .minute(values.endTime.minute())
        .second(values.endTime.second());

      const payload = {
        name: values.name,
        description: values.description || '',
        spinPrice: Number(values.spinPrice),
        currency: values.currency,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
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

          {/* New Start Time Selection */}
          <div className="flex gap-4">
             <Form.Item
              label="Ngày bắt đầu"
              name="startDate"
              className="flex-1"
              rules={[{ required: true, message: 'Chọn ngày bắt đầu!' }]}
            >
              <DatePicker className="w-full" format="DD/MM/YYYY" placeholder="Ngày bắt đầu" />
            </Form.Item>

             <Form.Item
              label="Giờ bắt đầu"
              name="startTime"
              className="flex-1"
              rules={[{ required: true, message: 'Chọn giờ bắt đầu!' }]}
            >
              <TimePicker className="w-full" format="HH:mm:ss" placeholder="Giờ bắt đầu" />
            </Form.Item>
          </div>

          {/* New End Time Selection */}
          <div className="flex gap-4">
            <Form.Item
              label="Ngày kết thúc"
              name="endDate"
              className="flex-1"
              rules={[{ required: true, message: 'Chọn ngày kết thúc!' }]}
            >
              <DatePicker className="w-full" format="DD/MM/YYYY" placeholder="Ngày kết thúc" />
            </Form.Item>

             <Form.Item
              label="Giờ kết thúc"
              name="endTime"
              className="flex-1"
              rules={[{ required: true, message: 'Chọn giờ kết thúc!' }]}
            >
              <TimePicker className="w-full" format="HH:mm:ss" placeholder="Giờ kết thúc" />
            </Form.Item>
          </div>

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

                  <div className="flex items-center gap-2">
                    <Select
                      placeholder="Chọn vật phẩm"
                      value={item.itemId}
                      onChange={(value) => updateItem(index, 'itemId', value)}
                      className="flex-grow"
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {allItems.map((_item) => (
                        <Option key={_item.itemId} value={_item.itemId}>
                          {_item.name}
                        </Option>
                      ))}
                    </Select>

                    {item.imageUrl && <Image src={item.imageUrl} width={50} height={50} preview={false} />}

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
