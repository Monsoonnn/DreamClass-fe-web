import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, DatePicker, Select, Space, Card, Divider, Breadcrumb, Spin, Image, TimePicker } from 'antd';
import { SaveOutlined, DeleteOutlined, SyncOutlined, EditOutlined, UnorderedListOutlined, PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../../services/api';
import dayjs from 'dayjs';
import { showLoading, closeLoading, showSuccess, showError } from '../../../utils/swalUtils';

const { Option } = Select;

export default function SpinUpdate() {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);
  const [allItems, setAllItems] = useState([]); // Stores all items from API
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch all items on component mount
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
  }, []); // Empty dependency array means this runs once on mount

  // 1. Fetch dữ liệu cũ (depends on allItems being available)
  useEffect(() => {
    const fetchSpinDetail = async () => {
      if (allItems.length === 0 && id) {
        // Only proceed if items are loaded or it's a new spin
        // If allItems are not yet loaded and it's an existing spin, wait for allItems
        return;
      }

      try {
        setLoading(true);
        const res = await apiClient.get(`/spin-wheels/${id}`);
        const data = res.data.data || res.data;

        form.setFieldsValue({
          name: data.name,
          description: data.description,
          spinPrice: data.spinPrice,
          currency: data.currency,
          startDate: data.startTime ? dayjs(data.startTime) : null,
          startTime: data.startTime ? dayjs(data.startTime) : null,
          endDate: data.endTime ? dayjs(data.endTime) : null,
          endTime: data.endTime ? dayjs(data.endTime) : null,
        });

        if (data.items && Array.isArray(data.items)) {
          setItems(
            data.items.map((item) => {
              const fullItem = allItems.find((ai) => ai.itemId === item.itemId);
              return {
                itemId: item.itemId,
                rate: item.rate,
                isRare: item.isRare,
                imageUrl: fullItem ? fullItem.imageUrl : '', // Add imageUrl
              };
            })
          );
        }
      } catch (error) {
        console.error('Error fetching spin detail:', error);
        showError('Không thể tải thông tin vòng quay!');
      } finally {
        setLoading(false);
      }
    };

    if (id && allItems.length > 0) {
      // Only fetch detail if id exists and allItems are loaded
      fetchSpinDetail();
    } else if (!id) {
      // If it's a new spin (no id), make sure loading is false if allItems are loaded
      setLoading(false);
    }
  }, [id, form, allItems]); // Added allItems to dependency array

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
      const selectedItem = allItems.find((item) => item.itemId === value); // Corrected to item.itemId
      updated[index].imageUrl = selectedItem ? selectedItem.imageUrl : '';
    }
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

      const startDateTime = values.startDate.hour(values.startTime.hour()).minute(values.startTime.minute()).second(values.startTime.second());

      const endDateTime = values.endDate.hour(values.endTime.hour()).minute(values.endTime.minute()).second(values.endTime.second());

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
                  <SyncOutlined />
                  <span className="font-semibold text-[#23408e]">Danh sách vòng quay</span>
                </>
              ),
            },
            {
              title: (
                <>
                  <EditOutlined />
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
        className="rounded-none max-w-4xl mx-auto"
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

          {/* New Start Time Selection */}
          <div className="flex gap-4">
            <Form.Item label="Ngày bắt đầu" name="startDate" className="flex-1" rules={[{ required: true, message: 'Chọn ngày bắt đầu!' }]}>
              <DatePicker className="w-full" format="DD/MM/YYYY" placeholder="Ngày bắt đầu" />
            </Form.Item>

            <Form.Item label="Giờ bắt đầu" name="startTime" className="flex-1" rules={[{ required: true, message: 'Chọn giờ bắt đầu!' }]}>
              <TimePicker className="w-full" format="HH:mm:ss" placeholder="Giờ bắt đầu" />
            </Form.Item>
          </div>

          {/* New End Time Selection */}
          <div className="flex gap-4">
            <Form.Item label="Ngày kết thúc" name="endDate" className="flex-1" rules={[{ required: true, message: 'Chọn ngày kết thúc!' }]}>
              <DatePicker className="w-full" format="DD/MM/YYYY" placeholder="Ngày kết thúc" />
            </Form.Item>

            <Form.Item label="Giờ kết thúc" name="endTime" className="flex-1" rules={[{ required: true, message: 'Chọn giờ kết thúc!' }]}>
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
            <Card key={index} className="rounded-none mb-3 bg-gray-50" size="small">
              <Space direction="vertical" className="w-full" size="middle">
                <div>
                  <label className="block text-sm font-medium mb-1">Tên vật phẩm</label>

                  <div className="flex items-center gap-2">
                    {' '}
                    {/* Changed gap from 1 to 2 */}
                    <Select
                      placeholder="Chọn vật phẩm"
                      value={item.itemId}
                      onChange={(value) => updateItem(index, 'itemId', value)}
                      className="flex-grow"
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {allItems.map((_item) => (
                        <Option key={_item.itemId} value={_item.itemId}>
                          {_item.name}
                        </Option>
                      ))}
                    </Select>
                    {item.imageUrl && <Image src={item.imageUrl} width={50} height={50} preview={false} />}
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
              <Button danger onClick={() => navigate(`/spin-mana/detail/${id}`)}>
                Hủy bỏ
              </Button>
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
