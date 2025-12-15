import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, DatePicker, Select, Space, Card, Divider, Breadcrumb, Spin } from 'antd';
import { SaveOutlined, DeleteOutlined, HomeOutlined, UnorderedListOutlined, PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../../services/api';
import dayjs from 'dayjs';
import { showLoading, closeLoading, showSuccess, showError } from '../../../utils/swalUtils';

const { RangePicker } = DatePicker;
const { Option } = Select;

export default function SpinUpdate() {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 1. Fetch dữ liệu cũ
  useEffect(() => {
    const fetchSpinDetail = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/spin-wheels/${id}`);
        const data = res.data.data || res.data;

        form.setFieldsValue({
          name: data.name,
          description: data.description,
          spinPrice: data.spinPrice,
          currency: data.currency,
          timeRange: [data.startTime ? dayjs(data.startTime) : null, data.endTime ? dayjs(data.endTime) : null],
        });

        if (data.items && Array.isArray(data.items)) {
          setItems(
            data.items.map((item) => ({
              itemId: item.itemId,
              rate: item.rate,
              isRare: item.isRare,
            }))
          );
        }
      } catch (error) {
        console.error('Error fetching spin detail:', error);
        showError('Không thể tải thông tin vòng quay!');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSpinDetail();
    }
  }, [id, form]);

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

  // 2. Xử lý Submit cập nhật
  const handleSubmit = async (values) => {
    try {
      // Validate items
      if (items.length === 0 || items.some((item) => !item.itemId)) {
        showError('Vui lòng điền đầy đủ thông tin các item!');
        return;
      }

      // Validate tổng rate
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

      showLoading();
      await apiClient.put(`/spin-wheels/${id}`, payload);

      closeLoading();
      await showSuccess('Cập nhật vòng quay thành công!');

      // ===> THAY ĐỔI Ở ĐÂY: Chuyển hướng về trang Detail <===
      navigate(`/spin-mana/detail/${id}`);
    } catch (err) {
      console.error('Error details:', err.response?.data || err.message);
      closeLoading();
      showError(err.response?.data?.message || 'Lỗi cập nhật vòng quay!');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  return (
    <div className="">
      <div className="p-4">
        <Breadcrumb
          className="text-sm"
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
                  <span>Sửa vòng quay</span>
                </>
              ),
            },
          ]}
        />
      </div>

      <Card
        title={
          <div className="flex items-center gap-2">
            <Button size="small" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}></Button>
            <span>Cập Nhật Vòng Quay</span>
          </div>
        }
        className="rounded-none max-w-3xl mx-auto"
      >
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
            <Card key={index} className="rounded-none mb-3 bg-gray-50" size="small">
              <Space direction="vertical" className="w-full" size="middle">
                {/* Mã vật phẩm + nút xóa */}
                <div>
                  <label className="block text-sm font-medium mb-1">Mã vật phẩm</label>

                  <div className="flex items-center gap-1">
                    <Input placeholder="VD: CCT102025, GG001..." value={item.itemId} onChange={(e) => updateItem(index, 'itemId', e.target.value)} />

                    {items.length > 1 && (
                      <Button type="dashed" danger icon={<DeleteOutlined />} onClick={() => removeItem(index)} className="border border-red-200 bg-white whitespace-nowrap">
                        Xóa
                      </Button>
                    )}
                  </div>
                </div>

                {/* Tỉ lệ */}
                <div>
                  <label className="block text-sm font-medium mb-1">Tỉ lệ (Rate)</label>
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

          <Button className="rounded-none border-dashed border-blue-400 text-blue-500" icon={<PlusOutlined />} onClick={addItem} block>
            Thêm Item Mới
          </Button>

          <Divider />

          <Form.Item>
            <Space className="w-full justify-end">
              <Button onClick={() => navigate(`/spin-mana/detail/${id}`)}>Hủy bỏ</Button>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                Lưu Thay Đổi
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
