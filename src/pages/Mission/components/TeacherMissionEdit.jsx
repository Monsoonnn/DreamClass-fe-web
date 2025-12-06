import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Select, Switch, message, InputNumber } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { apiClient } from '../../../services/api';

const { TextArea } = Input;

export default function TeacherMissionEdit({ visible, onClose, missionData, refreshMissions }) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [isDailyQuest, setIsDailyQuest] = useState(false);

  useEffect(() => {
    if (missionData) {
      setIsDailyQuest(missionData.isDailyQuest);

      form.setFieldsValue({
        questId: missionData.questId,
        name: missionData.name,
        description: missionData.description,
        rewardGold: missionData.rewardGold,
        point: missionData.point,
        dailyQuestType: missionData.dailyQuestType,
        isDailyQuest: missionData.isDailyQuest,
        prerequisiteQuestIds: missionData.prerequisiteQuestIds || [],
        steps: missionData.steps || [],
      });
    }
  }, [missionData]);

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);

      const payload = {
        name: values.name,
        description: values.description,
        rewardGold: values.rewardGold,
        point: values.point,
        isDailyQuest: values.isDailyQuest,
        dailyQuestType: values.isDailyQuest ? values.dailyQuestType : null, // Only send if it's a daily quest
      };

      const res = await apiClient.put(`/teacher/quest-templates/${missionData.questId}`, payload);

      message.success('Cập nhật thành công!');
      refreshMissions();
      onClose();
    } catch (err) {
      console.error(err);
      message.error('Không thể cập nhật nhiệm vụ: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Chỉnh sửa nhiệm vụ" open={visible} onCancel={onClose} footer={null} width={800} destroyOnClose>
      <Form className="custom-form" layout="vertical" form={form} onFinish={handleSubmit}>
        <h3 className="font-semibold">I. Thông tin nhiệm vụ</h3>

        {/* Quest ID */}
        <Form.Item label="Quest ID" name="questId">
          <Input disabled />
        </Form.Item>

        {/* Editable: Tên Quest */}
        <Form.Item label="Tên Quest" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên nhiệm vụ' }]}>
          <Input />
        </Form.Item>

        {/* Editable: Reward Gold */}
        <Form.Item label="Vàng thưởng" name="rewardGold">
          <InputNumber min={0} className="w-full" />
        </Form.Item>

        {/* Editable: Point */}
        <Form.Item label="Điểm thưởng" name="point">
          <InputNumber min={0} className="w-full" />
        </Form.Item>

        {/* Editable: isDailyQuest */}
        <Form.Item label="Là nhiệm vụ hàng ngày?" name="isDailyQuest" valuePropName="checked">
          <Switch onChange={(checked) => setIsDailyQuest(checked)} />
        </Form.Item>

        {/* Editable: dailyQuestType (conditional) */}
        {isDailyQuest && (
          <Form.Item label="Loại nhiệm vụ hàng ngày" name="dailyQuestType">
            <Select placeholder="Chọn loại Daily Quest">
              <Select.Option value="NPC_INTERACTION">NPC_INTERACTION</Select.Option>
              <Select.Option value="DAILY_TASK">DAILY_TASK</Select.Option>
            </Select>
          </Form.Item>
        )}

        {/* Editable: Description */}
        <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
          <TextArea rows={4} />
        </Form.Item>

        {/* Prerequisite - Still Disabled for teacher */}
        <h3 className="mt-2 font-bold">II. Nhiệm vụ tiên quyết</h3>
        <Form.Item label="Chọn nhiệm vụ yêu cầu trước" name="prerequisiteQuestIds">
          <Select mode="multiple" disabled placeholder="Không thể sửa">
            {missionData.allMissions?.map((m) => (
              <Select.Option key={m.questId} value={m.questId}>
                {m.questId} — {m.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Steps - Still Disabled for teacher */}
        <h3 className="mt-2 font-semibold">II. Các bước thực hiện</h3>

        <Form.List name="steps">
          {(fields) => (
            <>
              {fields.map(({ key, name, ...rest }) => (
                <div key={key} className="border p-3 mb-2 rounded bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <strong>Bước {name + 1}</strong>
                    <MinusCircleOutlined style={{ color: '#ccc' }} />
                  </div>

                  <Form.Item {...rest} label="Step ID" name={[name, 'stepId']}>
                    <Input disabled />
                  </Form.Item>

                  <Form.Item {...rest} label="Mô tả bước" name={[name, 'description']}>
                    <Input disabled />
                  </Form.Item>
                </div>
              ))}
              <Button type="dashed" block disabled icon={<PlusOutlined />}>
                Thêm bước
              </Button>
            </>
          )}
        </Form.List>

        {/* Footer */}
        <div className="flex justify-end mt-4 gap-2">
          <Button onClick={onClose}>Hủy</Button>
          <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
            Lưu
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
