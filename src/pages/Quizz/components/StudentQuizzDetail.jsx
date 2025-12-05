import React, { useEffect, useState, useMemo } from 'react';
import { Card, Spin, Radio, Button, Typography, message, Progress } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../../services/api';
import { CheckCircleOutlined, ClockCircleOutlined, BookOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

export default function StudentQuizDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});

  // Fetch quiz
  const fetchQuiz = async () => {
    try {
      const res = await apiClient.get(`/quizzes/${id}`);
      setQuiz(res.data.data);
    } catch (error) {
      console.error(error);
      message.error('Không tải được bài quiz!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const handleSelect = (questionId, optionKey) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  const handleSubmit = () => {
    console.log('Student Answers:', answers);
    message.success('Đã nộp bài thành công!');
    navigate('/student-quizz-list');
  };

  // Tính toán số lượng câu hỏi để hiển thị tiến độ (Logic UI only)
  const totalQuestions = useMemo(() => {
    return quiz?.chapters?.reduce((acc, curr) => acc + curr.questions.length, 0) || 0;
  }, [quiz]);

  const answeredCount = Object.keys(answers).length;
  const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spin size="large" tip="Đang tải đề thi..." />
      </div>
    );

  if (!quiz)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-500">Không tìm thấy bài thi</h3>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Quay lại
          </Button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans pb-20">
      {/* --- Sticky Header: Hiển thị tên bài và Tiến độ --- */}
      <div className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-gray-800 truncate max-w-md" title={quiz.name}>
              {quiz.name}
            </h1>
            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
              <span className="flex items-center">
                <BookOutlined className="mr-1" /> {quiz.subject}
              </span>
              <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">Khối {quiz.grade}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 min-w-[200px]">
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1 text-gray-500">
                <span>
                  Đã làm:{' '}
                  <b className="text-blue-600">
                    {answeredCount}/{totalQuestions}
                  </b>
                </span>
                <span>{progressPercent}%</span>
              </div>
              <Progress percent={progressPercent} showInfo={false} strokeColor="#2563eb" size="small" />
            </div>
            <Button type="primary" onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-500 font-medium shadow-md">
              Nộp bài
            </Button>
          </div>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8">
        {quiz.chapters.map((chapter, cIndex) => (
          <div key={chapter._id} className="animate-fade-in-up">
            {/* Tên chương */}
            <div className="flex items-center gap-2 mb-4 mt-6">
              <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
              <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide">{chapter.name}</h2>
            </div>

            <div className="space-y-6">
              {chapter.questions.map((q, qIndex) => {
                // Tính số thứ tự câu hỏi toàn cục (nếu cần logic phức tạp hơn thì tính ở ngoài, đây là demo hiển thị theo index mảng)
                const questionNumber = qIndex + 1;

                return (
                  <Card key={q._id} className="border-0 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300" bodyStyle={{ padding: '24px' }}>
                    <div className="flex gap-3 mb-4">
                      <div className="flex-none">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold text-sm border border-blue-100">
                          {questionNumber}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base md:text-lg font-medium text-gray-800 leading-relaxed">{q.questionText}</h3>
                      </div>
                    </div>

                    {/* Vùng chọn đáp án Custom */}
                    <div className="space-y-3 pl-0 md:pl-11">
                      {Object.entries(q.options).map(([key, value]) => {
                        const isSelected = answers[q._id] === key;
                        return (
                          <div
                            key={key}
                            onClick={() => handleSelect(q._id, key)}
                            className={`
                              group relative flex items-center p-3 md:p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                              ${isSelected ? 'border-blue-500 bg-blue-50/50' : 'border-gray-100 bg-white hover:border-blue-200 hover:bg-gray-50'}
                            `}
                          >
                            <div className="flex items-center h-5">
                              <Radio
                                checked={isSelected}
                                value={key}
                                className="mr-0"
                                style={{ pointerEvents: 'none' }} // Chặn sự kiện click của radio để div xử lý
                              />
                            </div>
                            <div className="ml-3 flex text-sm md:text-base">
                              <span className={`font-bold mr-2 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>{key}.</span>
                              <span className={`${isSelected ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>{value}</span>
                            </div>

                            {/* Icon check mark khi chọn */}
                            {isSelected && (
                              <div className="absolute right-4 text-blue-500">
                                <CheckCircleOutlined style={{ fontSize: '20px' }} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}

        {/* Nút nộp bài dự phòng ở cuối trang */}
        <div className="flex justify-center pt-8 pb-10">
          <Button
            size="large"
            type="primary"
            onClick={handleSubmit}
            className="h-12 px-12 text-lg rounded-full bg-gradient-to-r from-blue-600 to-blue-500 hover:to-blue-600 shadow-lg border-none"
            icon={<CheckCircleOutlined />}
          >
            Hoàn thành bài thi
          </Button>
        </div>
      </div>
    </div>
  );
}
