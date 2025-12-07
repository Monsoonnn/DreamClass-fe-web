import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Card, Button, Typography, Tag, Modal, Divider, Spin } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { apiClient } from '../../../services/api';

const { Title, Paragraph } = Typography;

export default function StudentQuizResult() {
  const navigate = useNavigate();
  const { id: quizId } = useParams();
  const { state } = useLocation();

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [resultsWithDetails, setResultsWithDetails] = useState([]);

  useEffect(() => {
    if (state?.details && quizId) {
      fetchQuizData(quizId);
    } else {
      setLoading(false);
    }
  }, [state, quizId]);

  const fetchQuizData = async (id) => {
    try {
      const res = await apiClient.get(`/quizzes/${id}`);
      const quiz = res.data.data;

      if (state && state.details) {
        // Flatten tất cả questions từ chapters
        const allQuestions = quiz.chapters.flatMap((chapter) =>
          chapter.questions.map((q) => ({
            ...q,
            chapterName: chapter.name,
          }))
        );

        // Enhance details với thông tin câu hỏi đầy đủ
        const enhanced = state.details.map((detail) => {
          const question = allQuestions.find((q) => q._id === detail.questionId);
          return {
            ...detail,
            questionText: question?.questionText || 'N/A',
            options: question?.options || {},
            correctAnswerText: question?.options?.[detail.correctAnswer] || detail.correctAnswer,
            userAnswerText: detail.userAnswer ? question?.options?.[detail.userAnswer] : 'Không chọn',
            explanation: question?.explanation || '',
          };
        });

        setResultsWithDetails(enhanced);
      }
    } catch (err) {
      console.error('Error fetching quiz data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-5 text-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!state || !state.details) {
    return <div className="p-4 text-lg">Không có dữ liệu kết quả!</div>;
  }

  const { correctCount, totalQuestions, details } = state;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  const handleViewDetail = (item, index) => {
    const result = resultsWithDetails[index] || item;
    setSelectedQuestion({ ...result, questionNumber: index + 1 });
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedQuestion(null);
  };

  const navigateToQuestion = (direction) => {
    const currentIndex = selectedQuestion.questionNumber - 1;
    let newIndex;

    if (direction === 'next' && currentIndex < resultsWithDetails.length - 1) {
      newIndex = currentIndex + 1;
    } else if (direction === 'prev' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else {
      return;
    }

    const result = resultsWithDetails[newIndex];
    setSelectedQuestion({
      ...result,
      questionNumber: newIndex + 1,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-2 flex justify-center">
      <div className="max-w-4xl w-full">
        <Card className="shadow-2xl rounded-2xl border-0">
          {/* Header */}
          <div className="text-center mb-4">
            <Title level={2} className="!mb-2">
              Kết quả bài làm
            </Title>
            <Paragraph type="secondary">Hoàn thành bài kiểm tra của bạn</Paragraph>
          </div>

          {/* Score Summary */}
          <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-xl">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <Paragraph className="!text-lg !text-gray-800 !mb-1 font-bold">Câu Đúng</Paragraph>
                <Title level={3} className="!text-green-600 !mb-0">
                  {correctCount}
                </Title>
              </div>
              <div>
                <Paragraph className="!text-lg !text-gray-800 !mb-1 font-bold">Tổng số</Paragraph>
                <Title level={3} className="!text-gray-700 !mb-0">
                  {totalQuestions}
                </Title>
              </div>
              <div>
                <Paragraph className="!text-lg !text-gray-800 !mb-1 font-bold">Tỷ lệ Đạt</Paragraph>
                <Title level={3} className={`!mb-0 ${percentage >= 70 ? '!text-green-600' : percentage >= 50 ? '!text-orange-600' : '!text-red-600'}`}>
                  {percentage}%
                </Title>
              </div>
            </div>
          </div>

          <Divider />

          {/* Question Navigator */}
          <div className="mb-8">
            <Title level={4} className="!mb-4">
              Điều hướng câu hỏi
            </Title>
            <div className="grid grid-cols-6 md:grid-cols-10 gap-2">
              {resultsWithDetails.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleViewDetail(item, index)}
                  className={`
                    h-12 rounded-lg font-semibold text-sm transition-all duration-200
                    flex items-center justify-center transform hover:scale-110
                    ${item.isCorrect ? 'bg-green-500 text-white shadow-md hover:bg-green-600' : 'bg-red-500 text-white shadow-md hover:bg-red-600'}
                  `}
                  title={item.isCorrect ? 'Câu Đúng' : 'Câu sai'}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-500"></div>
                <span className="text-sm text-gray-700">Câu Đúng</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-500"></div>
                <span className="text-sm text-gray-700">Câu sai</span>
              </div>
            </div>
          </div>

          {/* Nút trở về danh sách */}
          <div className="flex gap-4">
            <Button type="primary" onClick={() => navigate('/student-quizz-list')} size="large" className="flex-1">
              Quay về danh sách Quiz
            </Button>
            <Button onClick={() => navigate('/student-quizz-list')} size="large" className="flex-1">
              Trang chủ
            </Button>
          </div>
        </Card>
      </div>

      {/* Modal Chi tiết câu hỏi */}
      <Modal
        title={`Câu ${selectedQuestion?.questionNumber}`}
        open={isModalVisible}
        onCancel={handleCloseModal}
        width={700}
        footer={[
          <Button key="prev" onClick={() => navigateToQuestion('prev')} disabled={selectedQuestion?.questionNumber === 1}>
            ← Câu trước
          </Button>,
          <Button key="next" type="primary" onClick={() => navigateToQuestion('next')} disabled={selectedQuestion?.questionNumber === totalQuestions}>
            Câu sau →
          </Button>,
          <Button key="close" onClick={handleCloseModal}>
            Đóng
          </Button>,
        ]}
        className="quiz-result-modal"
      >
        {selectedQuestion && (
          <div className="space-y-1">
            {/* Status Badge */}
            <div>
              {selectedQuestion.isCorrect ? (
                <Tag icon={<CheckCircleOutlined />} color="green" className="text-base py-1 px-3">
                  Trả lời Đúng
                </Tag>
              ) : (
                <Tag icon={<CloseCircleOutlined />} color="red" className="text-base py-1 px-3">
                  Trả lời sai
                </Tag>
              )}
            </div>

            <Divider className="!my-2" />

            {/* Question Text */}
            <div>
              <Paragraph strong className="!text-base !mb-2">
                Câu hỏi:
              </Paragraph>
              <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                <Paragraph className="!mb-0">{selectedQuestion.questionText || 'Không có nội dung câu hỏi'}</Paragraph>
              </div>
            </div>

            {/* All Options với highlight */}
            <div>
              <Paragraph strong className="!text-base !mb-2">
                Các lựa chọn:
              </Paragraph>
              <div className="space-y-2">
                {selectedQuestion.options &&
                  Object.entries(selectedQuestion.options).map(([key, value]) => {
                    const isUserAnswer = key === selectedQuestion.userAnswer;
                    const isCorrectAnswer = key === selectedQuestion.correctAnswer;

                    return (
                      <div
                        key={key}
                        className={`p-3 rounded-lg border-l-4 ${
                          isCorrectAnswer ? 'bg-green-50 border-green-500' : isUserAnswer && !selectedQuestion.isCorrect ? 'bg-red-50 border-red-500' : 'bg-gray-50 border-gray-300'
                        }`}
                      >
                        <div
                          className={`flex items-center gap-2 ${
                            isCorrectAnswer ? 'text-green-700 font-semibold' : isUserAnswer && !selectedQuestion.isCorrect ? 'text-red-700 font-semibold' : 'text-gray-600'
                          }`}
                        >
                          <span className="font-bold">{key}.</span>
                          <span>{value}</span>
                          {isCorrectAnswer && <CheckCircleOutlined className="ml-auto" />}
                          {isUserAnswer && !selectedQuestion.isCorrect && <CloseCircleOutlined className="ml-auto" />}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* User Answer Summary */}

            {/* Explanation */}
            {selectedQuestion.explanation && (
              <div>
                <Paragraph strong className="!text-base !mb-2">
                  📖 Giải thích:
                </Paragraph>
                <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500">
                  <Paragraph className="!mb-0 !text-amber-900">{selectedQuestion.explanation}</Paragraph>
                </div>
              </div>
            )}

            {/* Progress */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">
                  Tiến độ: {selectedQuestion.questionNumber}/{totalQuestions}
                </span>
                <span className="text-sm font-semibold text-blue-600">{Math.round((selectedQuestion.questionNumber / totalQuestions) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${(selectedQuestion.questionNumber / totalQuestions) * 100}%` }}></div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
