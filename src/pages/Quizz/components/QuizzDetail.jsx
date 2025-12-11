import React, { useEffect, useState } from 'react';
import { Card, Tag, Breadcrumb, Button, Spin, message } from 'antd';
import { UserOutlined, EyeOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../../services/api';

export default function QuizzDetail() {
  const { quizzId } = useParams(); // <-- lấy id từ URL
  const [quizz, setQuizz] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ===== Fetch API chi tiết quizz =====
  const fetchQuizzDetail = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/quizzes/${quizzId}`);
      const data = res.data?.data;

      if (!data) {
        message.error('Không tìm thấy dữ liệu quizz');
        return;
      }

      // Map dữ liệu backend -> frontend UI
      const mapped = {
        name: data.name,
        subject: data.subject,
        grade: data.grade,
        chapters: data.chapters || [],
      };

      setQuizz(mapped);
    } catch (error) {
      message.error('Lỗi tải chi tiết quizz');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzDetail();
  }, [quizzId]);

  if (loading || !quizz) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-2">
      {/* BREADCRUMB */}
      <Breadcrumb
        className="mb-4 text-sm"
        items={[
          {
            href: '/quizz-mana',
            title: (
              <>
                <UserOutlined />
                <span>Quản lý quizz</span>
              </>
            ),
          },
          {
            title: (
              <>
                <EyeOutlined />
                <span className="font-semibold text-[#23408e]">Chi tiết quizz</span>
              </>
            ),
          },
        ]}
      />

      {/* KHUNG CHÍNH */}
      <div className="mx-auto bg-white p-4 rounded-xl shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{quizz.name}</h2>
          <Button type="primary" onClick={() => navigate(`/quizz-mana/update/${quizzId}`)}>
            Chỉnh sửa
          </Button>
        </div>

        {/* THÔNG TIN CHUNG */}
        <div>
          <p>
            <b>Môn học:</b> {quizz.subject}
          </p>
          <p>
            <b>Khối:</b> {quizz.grade}
          </p>
          <p>
            <b>Số chương:</b> {quizz.chapters.length}
          </p>
        </div>

        {/* HIỂN THỊ CÁC CHƯƠNG & CÂU HỎI */}
        {quizz.chapters.map((chapter, chapterIndex) => (
          <div key={chapterIndex} className="mt-4">
            <h3 className="font-semibold text-lg mb-2">
              Chương {chapterIndex + 1}: {chapter.name}
            </h3>

            {chapter.questions.map((q, qIndex) => (
              <Card key={q._id} className="mb-2 border rounded-none">
                <div>
                  <b>Câu {qIndex + 1}:</b> {q.questionText}
                </div>

                {/* OPTIONS A/B/C/D */}
                {Object.entries(q.options).map(([key, value]) => (
                  <div key={key}>
                    <span>
                      <b>{key}.</b> {value}
                    </span>
                    {q.correctAnswer === key && (
                      <Tag color="green" className="ml-2">
                        Đúng
                      </Tag>
                    )}
                  </div>
                ))}
              </Card>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
