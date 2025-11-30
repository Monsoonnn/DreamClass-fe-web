import React, { useState } from 'react';
import { Input, Button, Select, Switch, Space, Form, message, Breadcrumb } from 'antd';
import { ReadOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getMissions, addMission } from './MissionService';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { TextArea } = Input;

export default function AddMission() {
  const navigate = useNavigate();
  const missionList = getMissions(); // Dùng để load prerequisite

  const [form] = Form.useForm();
  const [isDailyQuest, setIsDailyQuest] = useState(false);

  const handleSubmit = (values) => {
    const newMission = {
      questId: values.questId,
      name: values.name,
      description: values.description,
      rewardGold: values.rewardGold,
      point: values.point,
      dailyQuestType: values.dailyQuestType || '',
      isDailyQuest: values.isDailyQuest,
      prerequisiteQuestIds: values.prerequisiteQuestIds || [],
      steps: values.steps || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addMission(newMission);

    message.success('Thêm nhiệm vụ thành công!');
    navigate('/mission-mana');
  };

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <Breadcrumb
        className="mb-4 text-sm"
        items={[
          {
            href: '/mission-mana',
            title: (
              <>
                <ReadOutlined />
                <span>Quản lý nhiệm vụ</span>
              </>
            ),
          },
          {
            title: (
              <>
                <UnorderedListOutlined />
                <span className="font-semibold text-[#23408e]">Thêm nhiệm vụ</span>
              </>
            ),
          },
        ]}
      />

      <div className="p-2 rounded-md flex justify-center">
        <div className="bg-white p-4 rounded shadow-md w-full max-w-3xl">
          <Form layout="vertical" form={form} onFinish={handleSubmit}>
            {/* I. Thông tin chung */}
            <h3 className="text-lg font-semibold mb-2">I. Thông tin chung</h3>
            <hr className="mb-4" />

            <Form.Item label="Quest ID" name="questId" rules={[{ required: true }]}>
              <Input placeholder="Nhập mã nhiệm vụ..." />
            </Form.Item>

            <Form.Item label="Tên Quest" name="name" rules={[{ required: true }]}>
              <Input placeholder="Nhập tên nhiệm vụ..." />
            </Form.Item>

            <Form.Item label="Nhập vàng" name="rewardGold" rules={[{ required: true }]}>
              <Input type="number" placeholder="Nhập vàng..." />
            </Form.Item>
            <Form.Item label="Điểm thưởng" name="point" rules={[{ required: true }]}>
              <Input type="number" placeholder="Nhập điểm thưởng..." />
            </Form.Item>

            <Form.Item label="Có phải quest hàng ngày không?" name="isDailyQuest" valuePropName="checked">
              <Switch onChange={setIsDailyQuest} />
            </Form.Item>

            <Form.Item label="Cách nhận quest" name="dailyQuestType" rules={[{ required: isDailyQuest }]}>
              <Select placeholder="Chọn loại cách nhận quest" disabled={!isDailyQuest}>
                <Select.Option value="NPC_INTERACTION">NPC_INTERACTION</Select.Option>
                <Select.Option value="DAILY_TASK">DAILY_TASK</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Mô tả" name="description" rules={[{ required: true }]}>
              <TextArea rows={4} placeholder="Nhập mô tả nhiệm vụ..." />
            </Form.Item>

            {/* II. Prerequisite Quest IDs */}
            <h3 className="text-lg font-semibold mt-6 mb-2">II. Nhiệm vụ tiên quyết</h3>
            <hr className="mb-4" />

            <Form.Item label="Chọn nhiệm vụ yêu cầu trước" name="prerequisiteQuestIds">
              <Select mode="multiple" placeholder="Chọn hoặc bỏ trống...">
                {missionList.map((m) => (
                  <Select.Option key={m.questId} value={m.questId}>
                    {m.questId} — {m.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {/* III. Steps */}
            <h3 className="text-lg font-semibold mt-6 mb-2">III. Các bước thực hiện</h3>
            <hr className="mb-4" />

            <Form.List name="steps">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...rest }) => (
                    <div key={key} className="border p-4 rounded mb-3">
                      <div className="flex justify-between items-center mb-2">
                        <strong>Step {name + 1}</strong>
                        <MinusCircleOutlined style={{ color: 'red', cursor: 'pointer' }} onClick={() => remove(name)} />
                      </div>

                      <Form.Item {...rest} label="Step ID" name={[name, 'stepId']} rules={[{ required: true }]}>
                        <Input placeholder="Nhập Step ID..." />
                      </Form.Item>

                      <Form.Item {...rest} label="Mô tả bước" name={[name, 'description']} rules={[{ required: true }]}>
                        <Input placeholder="Nhập mô tả bước..." />
                      </Form.Item>
                    </div>
                  ))}

                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    Thêm bước
                  </Button>
                </>
              )}
            </Form.List>

            {/* Footer buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <Button onClick={() => navigate(-1)}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                Lưu Quest
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
