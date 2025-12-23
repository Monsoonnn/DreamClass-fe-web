import React, { useState, useEffect, useCallback } from 'react';
import { Table, Tabs, Tag, Card } from 'antd';
import { FieldTimeOutlined, TrophyOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { historyService } from '../../../services/historyService';

export default function StudentHistory({ playerId, isMyHistory = false }) {
  return (
    <Card className="shadow-sm">
      <Tabs
        defaultActiveKey="quiz"
        items={[
          {
            key: 'quiz',
            label: (
              <span className='gap-2 flex items-center'>
                <FieldTimeOutlined />
                Lịch sử Quiz
              </span>
            ),
            children: <QuizHistoryTable playerId={playerId} isMyHistory={isMyHistory} />,
          },
          {
            key: 'quest',
            label: (
              <span className='gap-2 flex items-center'>
                <TrophyOutlined />
                Lịch sử Nhiệm vụ
              </span>
            ),
            children: <QuestHistoryTable playerId={playerId} isMyHistory={isMyHistory} />,
          },
        ]}
      />
    </Card>
  );
}

function QuizHistoryTable({ playerId, isMyHistory }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const fetchData = useCallback(async (page = 1, pageSize = 10) => {
    if (!isMyHistory && !playerId) return;
    setLoading(true);
    try {
      const res = await historyService.getQuizHistory(playerId, page, pageSize, isMyHistory);
      // API structure: { success: true, data: [...], pagination: { totalRecords: ... } }
      const list = res.data || [];
      const total = res.pagination?.totalRecords || res.pagination?.total || list.length;

      setData(list);
      setPagination((prev) => ({ ...prev, current: page, pageSize: pageSize, total }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [playerId, isMyHistory]);

  useEffect(() => {
    fetchData(1, 10);
  }, [fetchData]);

  const handleTableChange = (newPagination) => {
    fetchData(newPagination.current, newPagination.pageSize);
  };

  const columns = [
    {
      title: 'Tên Quiz',
      dataIndex: 'quizName',
      key: 'quizName',
      render: (text, record) => text || record.quizId?.name || 'N/A',
    },
    {
      title: 'Môn học',
      dataIndex: 'subject',
      key: 'subject',
      render: (text, record) => <Tag color="blue">{text || record.quizId?.subject || 'N/A'}</Tag>,
    },
    {
      title: 'Kết quả',
      key: 'result',
      render: (_, record) => {
        const isPass = record.isPassed;
        // Tính điểm thang 10 để tham khảo (nếu cần)
        const score = record.totalQuestions > 0 ? ((record.correctAnswersCount / record.totalQuestions) * 10).toFixed(1) : 0;
        
        return (
          <div className="flex flex-col items-start gap-1">
            <Tag color={isPass ? 'green' : 'red'}>
              {isPass ? 'Đạt' : 'Chưa đạt'}
            </Tag>
            <span className="text-xs text-gray-500">
              {record.correctAnswersCount}/{record.totalQuestions} câu đúng
            </span>
          </div>
        );
      },
    },
    {
      title: 'Thời gian nộp',
      dataIndex: 'completedAt',
      key: 'completedAt',
      render: (date) => (date ? dayjs(date).format('HH:mm DD/MM/YYYY') : 'N/A'),
    },
  ];

  return (
    <Table
      columns={columns}
      rowKey={(record) => record.attemptId || record._id}
      dataSource={data}
      pagination={pagination}
      loading={loading}
      onChange={handleTableChange}
      size="small"
    />
  );
}

function QuestHistoryTable({ playerId, isMyHistory }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const fetchData = useCallback(async (page = 1, pageSize = 10) => {
    if (!isMyHistory && !playerId) return;
    setLoading(true);
    try {
      const res = await historyService.getQuestHistory(playerId, page, pageSize, isMyHistory);
      // API structure: { success: true, data: [...], pagination: { totalRecords: ... } }
      const list = res.data || [];
      const total = res.pagination?.totalRecords || res.pagination?.total || list.length;

      setData(list);
      setPagination((prev) => ({ ...prev, current: page, pageSize: pageSize, total }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [playerId, isMyHistory]);

  useEffect(() => {
    fetchData(1, 10);
  }, [fetchData]);

  const handleTableChange = (newPagination) => {
    fetchData(newPagination.current, newPagination.pageSize);
  };

  const columns = [
    {
      title: 'Tên Nhiệm vụ',
      dataIndex: ['quest', 'name'],
      key: 'questName',
      render: (text, record) => <span className="font-medium">{text || record.questName || 'N/A'}</span>,
    },
    {
      title: 'Loại',
      key: 'type',
      render: (_, record) => {
        const isDaily = record.dailyQuest || record.quest?.type === 'daily' || record.quest?.type === 'dailyQuest';
        return isDaily ? (
          <Tag color="orange">Hàng ngày</Tag>
        ) : (
          <Tag color="purple">Thông thường</Tag>
        );
      },
    },
    {
      title: 'Thời gian hoàn thành',
      dataIndex: 'completedAt',
      key: 'completedAt',
      render: (date) => (date ? dayjs(date).format('HH:mm DD/MM/YYYY') : 'N/A'),
    },
    {
      title: 'Phần thưởng',
      key: 'rewards',
      render: (_, record) => (
        <div className="flex flex-wrap gap-1">
          {record.rewards?.gold && <Tag color="gold">+{record.rewards.gold} Vàng</Tag>}
          {record.rewards?.points && <Tag color="blue">+{record.rewards.points} Điểm</Tag>}
          {record.rewards?.items?.map((item, idx) => (
            <Tag key={idx} color="cyan">
              Vật phẩm: {item.itemId}
            </Tag>
          ))}
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      rowKey={(record) => record._id || record.id}
      dataSource={data}
      pagination={pagination}
      loading={loading}
      onChange={handleTableChange}
      size="small"
    />
  );
}