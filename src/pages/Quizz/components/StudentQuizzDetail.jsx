import React, { useEffect, useState } from 'react';
import { Spin, Radio, Button, Typography, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../../services/api';

const { Title, Paragraph } = Typography;

export default function StudentQuizDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

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

  // Lấy tất cả câu hỏi từ tất cả chapters
  const getAllQuestions = () => {
    if (!quiz || !quiz.chapters) return [];
    return quiz.chapters.flatMap((chapter) =>
      chapter.questions.map((q) => ({
        ...q,
        chapterName: chapter.name,
        options: q.options || {},
      }))
    );
  };

  const allQuestions = getAllQuestions();
  const currentQuestion = allQuestions.length > 0 ? allQuestions[currentQuestionIndex] : null;
  const totalQuestions = allQuestions.length;

  // Khi học sinh chọn đáp án
  const handleSelect = (questionId, optionKey) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  // Chuyển sang câu tiếp theo
  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Quay lại câu trước
  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Nhảy đến câu hỏi cụ thể
  const handleJumpToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  // Nộp bài
  // Nộp bài
  const handleSubmit = async () => {
    try {
      const payload = {
        answers: Object.entries(answers).map(([questionId, selectedOption]) => ({
          questionId,
          selectedOption,
        })),
      };

      const res = await apiClient.post(`/quizzes/${id}/submit`, payload);

      navigate(`/student-quizz-result/${id}`, {
        state: res.data.data,
      });
    } catch (error) {
      console.error(error);
      message.error('Không thể nộp bài!');
    }
  };

  if (loading)
    return (
      <div className="p-5 text-center">
        <Spin size="large" />
      </div>
    );

  if (!quiz || allQuestions.length === 0) return <div className="p-4 text-lg">Không tìm thấy bài quiz</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-2">
          <Title level={2} className="!mb-2">
            {quiz.name}
          </Title>
          <Paragraph type="secondary" className="!mb-0">
            Môn học: {quiz.subject} • Khối: {quiz.grade}
          </Paragraph>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentQuestion && (
              <div className="bg-white rounded-xl shadow-lg p-4">
                {/* Question Box */}
                <div className="mb-8 pb-2 border-b border-gray-200">
                  <div className="inline-block px-3  bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-2">Câu {currentQuestionIndex + 1}</div>
                  <Paragraph strong className="!text-lg !mb-0">
                    {currentQuestion.questionText}
                  </Paragraph>
                </div>

                {/* Options */}
                <div className="mb-8">
                  <Radio.Group onChange={(e) => handleSelect(currentQuestion._id, e.target.value)} value={answers[currentQuestion._id] || ''} className="w-full">
                    <div className="space-y-3">
                      {currentQuestion.options &&
                        Object.entries(currentQuestion.options).map(([key, value]) => (
                          <div
                            key={key}
                            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
                            onClick={() => handleSelect(currentQuestion._id, key)}
                          >
                            <Radio value={key}>
                              <span className="font-semibold">{key}.</span> {value}
                            </Radio>
                          </div>
                        ))}
                    </div>
                  </Radio.Group>
                </div>

                {/* Explanation (if available) */}
                {currentQuestion.explanation && (
                  <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <Paragraph strong className="!text-amber-900 !mb-2">
                      Giải thích
                    </Paragraph>
                    <Paragraph className="!text-amber-800 !mb-0">{currentQuestion.explanation}</Paragraph>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 justify-between">
                  <Button onClick={handlePrev} disabled={currentQuestionIndex === 0} className="px-6">
                    Câu trước
                  </Button>
                  <Button onClick={handleNext} disabled={currentQuestionIndex === totalQuestions - 1} type="primary" className="px-6">
                    Câu tiếp theo
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Question Navigator */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              {/* Progress Info */}
              <div className="mb-6">
                <div className="text-sm text-gray-600 mb-2">
                  Câu hỏi <span className="font-bold text-blue-600">{currentQuestionIndex + 1}</span>
                  <span className="text-gray-400">/{totalQuestions}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}></div>
                </div>
              </div>

              {/* Help Button */}
              <button className="w-full mb-6 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Cần giúp đỡ?</button>

              {/* Question Navigator Grid */}
              <div>
                <Paragraph className="!text-sm !font-semibold !mb-3 !text-gray-700">Điều hướng câu hỏi</Paragraph>
                <div className="grid grid-cols-5 gap-2">
                  {allQuestions.map((q, index) => {
                    const isAnswered = answers[q._id] !== undefined;
                    const isCurrent = index === currentQuestionIndex;

                    return (
                      <button
                        key={index}
                        onClick={() => handleJumpToQuestion(index)}
                        className={`
                          h-10 rounded-lg font-medium text-sm transition-all
                          ${
                            isCurrent
                              ? 'bg-blue-600 text-white shadow-md'
                              : isAnswered
                              ? 'bg-blue-200 text-blue-700 hover:bg-blue-300'
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }
                        `}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded bg-blue-200"></div>
                  <span>Đã trả lời</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded bg-gray-200"></div>
                  <span>Chưa trả lời</span>
                </div>
              </div>

              {/* Submit Button */}
              <Button type="primary" size="large" onClick={handleSubmit} className="w-full mt-6" danger>
                Nộp bài
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
