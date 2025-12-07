import React, { useEffect, useState } from 'react';
import { Modal, Input, Button, Select, Switch, Form, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { apiClient } from '../../../services/api';

const { TextArea } = Input;

export default function EditMissionModal({ visible, onClose, missionData, refreshMissions }) {
  const [form] = Form.useForm();
  const [isDailyQuest, setIsDailyQuest] = useState(false);
  const [oldQuestId, setOldQuestId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (missionData) {
      setIsDailyQuest(missionData.isDailyQuest);
      setOldQuestId(missionData.questId);

      form.setFieldsValue({
        questId: missionData.questId,
        name: missionData.name,
        rewardGold: missionData.rewardGold,
        point: missionData.point,
        description: missionData.description,
        isDailyQuest: missionData.isDailyQuest,
        dailyQuestType: missionData.dailyQuestType,
        prerequisiteQuestIds: missionData.prerequisiteQuestIds,
        steps: missionData.steps,
      });
    }
  }, [missionData, form]);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        questId: values.questId,
        name: values.name,
        rewardGold: Number(values.rewardGold),
        point: Number(values.point),
        description: values.description,
        isDailyQuest: !!values.isDailyQuest,
        dailyQuestType: values.dailyQuestType || '',
        prerequisiteQuestIds: values.prerequisiteQuestIds || [],
        steps: values.steps || [],
      };

      console.log('Updating quest:', oldQuestId, 'with payload:', payload);

      const res = await apiClient.put(`/quests/admin/templates/${oldQuestId}`, payload);

      console.log('Quest updated successfully:', res.data);
      message.success('Cập nhật nhiệm vụ thành công!');

      refreshMissions?.();
      onClose();
    } catch (err) {
      console.error('Error updating quest:', err.response?.status, err.message);
      message.error(err.response?.data?.message || 'Lỗi khi cập nhật nhiệm vụ');
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

        {/* Tên Quest */}
        <Form.Item label="Tên Quest" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên nhiệm vụ' }]}>
          <Input />
        </Form.Item>

        {/* Reward Gold */}
        <Form.Item label="Điểm thưởng" name="rewardGold" rules={[{ required: true, message: 'Vui lòng nhập điểm thưởng' }]}>
          <Input type="number" />
        </Form.Item>

        {/* Điểm */}
        <Form.Item label="Điểm" name="point" rules={[{ required: true, message: 'Vui lòng nhập điểm' }]}>
          <Input type="number" />
        </Form.Item>

        {/* Loại Quest */}
        <Form.Item label="Có phải quest hàng ngày không?" name="isDailyQuest" valuePropName="checked">
          <Switch onChange={setIsDailyQuest} />
        </Form.Item>

        {/* Daily Type */}
        <Form.Item label="Cách nhận quest" name="dailyQuestType" rules={[{ required: isDailyQuest, message: 'Chọn loại Daily Quest' }]}>
          <Select disabled={!isDailyQuest} placeholder="Chọn loại Daily Quest">
            <Select.Option value="NPC_INTERACTION">Tương tác NPC</Select.Option>
            <Select.Option value="DAILY_TASK">Tự động</Select.Option>
          </Select>
        </Form.Item>

        {/* Mô tả */}
        <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
          <TextArea rows={4} />
        </Form.Item>

        {/* Prerequisite Quest IDs */}
        <h3 className="mt-2 font-bold">II. Nhiệm vụ tiên quyết</h3>
        <Form.Item label="Chọn nhiệm vụ yêu cầu trước" name="prerequisiteQuestIds">
          <Select mode="multiple" placeholder="Chọn hoặc bỏ trống...">
            {missionData.allMissions?.map((m) => (
              <Select.Option key={m.questId} value={m.questId}>
                {m.questId} — {m.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Steps */}
        <h3 className="mt-2 font-semibold">II. Các bước thực hiện</h3>
        <Form.List name="steps">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...rest }) => (
                <div key={key} className="border p-3 mb-2 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <strong>Bước {name + 1}</strong>
                    <MinusCircleOutlined onClick={() => remove(name)} style={{ color: 'red', cursor: 'pointer' }} />
                  </div>

                  <Form.Item {...rest} label="Step ID" name={[name, 'stepId']} rules={[{ required: true, message: 'Nhập Step ID' }]}>
                    <Input />
                  </Form.Item>

                  <Form.Item {...rest} label="Mô tả bước" name={[name, 'description']} rules={[{ required: true, message: 'Nhập mô tả bước' }]}>
                    <Input />
                  </Form.Item>
                </div>
              ))}

              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
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
