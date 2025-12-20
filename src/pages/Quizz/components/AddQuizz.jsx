import React, { useState, useRef } from 'react';
import { Button, Card, Input, Select, Form, Tag, Breadcrumb, message } from 'antd';
import { PlusOutlined, DeleteOutlined, FileExcelOutlined, UserOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../../services/api';
import { showLoading, closeLoading, showSuccess, showError } from '../../../utils/swalUtils';
import ExcelJS from 'exceljs';

export default function AddQuizz() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [form] = Form.useForm();

  const [questions, setQuestions] = useState([]);

  // --- LOGIC XỬ LÝ CÂU HỎI THỦ CÔNG (GIỮ NGUYÊN CHO UI) ---
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        answers: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
        ],
      },
    ]);
  };

  const handleDeleteQuestion = (index) => {
    const newQ = [...questions];
    newQ.splice(index, 1);
    setQuestions(newQ);
  };

  const handleChangeQuestion = (index, value) => {
    const newQ = [...questions];
    newQ[index].questionText = value;
    setQuestions(newQ);
  };

  const handleChangeAnswer = (qIndex, aIndex, value) => {
    const newQ = [...questions];
    newQ[qIndex].answers[aIndex].text = value;
    setQuestions(newQ);
  };

  const handleCorrectAnswer = (qIndex, aIndex) => {
    const newQ = [...questions];
    newQ[qIndex].answers.forEach((ans, idx) => {
      ans.isCorrect = idx === aIndex;
    });
    setQuestions(newQ);
  };

  // --- LOGIC IMPORT EXCEL (GIỮ NGUYÊN LOGIC ĐỌC MÀU) ---
  const handleTriggerFile = () => {
    fileInputRef.current.click();
  };

  const handleImportExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx')) {
      message.error('Vui lòng chọn file Excel định dạng .xlsx!');
      return;
    }

    try {
      showLoading();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(file);

      const worksheet = workbook.getWorksheet(1);
      const importedQuestions = [];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Bỏ qua Header

        const questionText = row.getCell(2).text || '';
        if (!questionText) return;

        const answers = [];
        // Duyệt cột 3->6 (A->D)
        for (let col = 3; col <= 6; col++) {
          const cell = row.getCell(col);
          const answerText = cell.text || '';

          let isCorrect = false;
          const fill = cell.fill;
          if (fill && fill.type === 'pattern' && fill.fgColor) {
            isCorrect = true;
          }

          answers.push({ text: answerText, isCorrect: isCorrect });
        }

        importedQuestions.push({ questionText, answers });
      });

      if (importedQuestions.length > 0) {
        setQuestions((prev) => [...prev, ...importedQuestions]);
        showSuccess(`Đã import ${importedQuestions.length} câu hỏi!`);
      } else {
        message.warning('File không có dữ liệu hợp lệ.');
      }
    } catch (error) {
      console.error(error);
      showError('Lỗi đọc file Excel.');
    } finally {
      closeLoading();
      e.target.value = null;
    }
  };

  // --- LOGIC SUBMIT (ĐÃ SỬA ĐỂ KHỚP VỚI API CHUẨN) ---
  const onFinish = async (values) => {
    // 1. Validate dữ liệu cơ bản
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) {
        message.error(`Câu hỏi số ${i + 1} thiếu nội dung!`);
        return;
      }
      if (!q.answers.some((a) => a.isCorrect)) {
        showError(`Câu hỏi số ${i + 1} chưa chọn đáp án đúng!`);
        return;
      }
    }

    // 2. Transform (Chuyển đổi) dữ liệu questions sang format API yêu cầu
    // Format UI: answers: [{text: 'A', isCorrect: true}, ...]
    // Format API: options: {"A": "...", "B": "..."}, correctAnswer: "A"

    const apiQuestions = questions.map((q) => {
      const options = {};
      const keys = ['A', 'B', 'C', 'D'];
      let correctAnswer = '';

      q.answers.forEach((ans, index) => {
        if (index < 4) {
          // Chỉ lấy 4 đáp án đầu
          const key = keys[index];
          options[key] = ans.text;
          if (ans.isCorrect) {
            correctAnswer = key;
          }
        }
      });

      return {
        questionText: q.questionText,
        options: options,
        correctAnswer: correctAnswer,
      };
    });

    // 3. Tạo payload chuẩn
    const payload = {
      name: values.name,
      subject: values.subject,
      grade: String(values.grade), // API ví dụ để chuỗi "11"
      chapters: [
        {
          name: values.chapter || 'Chương mới', // Lấy tên chương từ form
          questions: apiQuestions, // Đưa câu hỏi vào trong chapter
        },
      ],
    };

    console.log('Payload sending:', JSON.stringify(payload, null, 2));

    try {
      const response = await apiClient.post('/quizzes', payload);

      showSuccess('Tạo bộ câu hỏi thành công!');
      setTimeout(() => {
        navigate('/quizz-mana');
      }, 1000);
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Có lỗi xảy ra';
      showError(msg);
    }
  };

  return (
    <div className="p-2">
      <Breadcrumb
        className="mb-4 text-sm"
        items={[
          {
            href: '/quizz-mana',
            title: (
              <>
                <QuestionCircleOutlined />
                <span>Quản lý quizz</span>
              </>
            ),
          },
          {
            title: (
              <>
                <PlusOutlined />
                <span className="font-semibold text-[#23408e]">Thêm quizz</span>
              </>
            ),
          },
        ]}
      />
      <Form
        className="custom-form"
        layout="vertical"
        onFinish={onFinish}
        form={form}
        initialValues={{
          grade: 10,
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-1 gap-1 ">
          <Card title="Thông tin chung" bordered={false} className="shadow-sm rounded-none">
            <Form.Item label="Tên bộ câu hỏi" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
              <Input placeholder="Nhập tên bộ câu hỏi" />
            </Form.Item>

            <div className="grid grid-cols-2 gap-2">
              <Form.Item label="Môn học" name="subject" rules={[{ required: true, message: 'Chọn môn học!' }]}>
                <Select
                  options={[
                    { value: 'Toán Học', label: 'Toán Học' },
                    { value: 'Vật Lý', label: 'Vật Lý' },
                    { value: 'Hoá Học', label: 'Hoá Học' },
                    { value: 'Sinh Học', label: 'Sinh Học' },
                  ]}
                />
              </Form.Item>
              <Form.Item label="Khối lớp" name="grade" rules={[{ required: true, message: 'Chọn khối!' }]}>
                <Select
                  options={[
                    { value: '10', label: '10' },
                    { value: '11', label: '11' },
                    { value: '12', label: '12' },
                  ]}
                />
              </Form.Item>
            </div>

            <Form.Item label="Chương" name="chapter" rules={[{ required: true, message: 'Nhập tên chương!' }]}>
              <Input placeholder="Chương 1..." />
            </Form.Item>

            <Form.Item label="Ghi chú" name="note">
              <Input.TextArea rows={2} />
            </Form.Item>
          </Card>

          <Card
            title={
              <div className="flex justify-between items-center">
                <span>Danh sách câu hỏi ({questions.length})</span>
                <div>
                  <input type="file" accept=".xlsx" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImportExcel} />
                  <Button
                    icon={<FileExcelOutlined />}
                    onClick={handleTriggerFile}
                    type="dashed"
                    className="text-green-600 border-green-600 hover:text-green-500 hover:border-green-500"
                  >
                    Import Excel
                  </Button>
                </div>
              </div>
            }
            bordered={false}
            className={`shadow-sm rounded-none ${questions.length > 0 ? 'h-[500px] overflow-y-auto' : ''}`}
          >
            {questions.map((q, qIndex) => (
              <Card
                key={qIndex}
                className="mb-4 border-gray-300"
                size="small"
                title={
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-600">
                      Câu hỏi {qIndex + 1}:
                      {q.answers.some((a) => a.isCorrect) ? (
                        <Tag color="green" className="ml-2">
                          Đã có đáp án đúng
                        </Tag>
                      ) : (
                        <Tag color="red" className="ml-2">
                          Chưa chọn đáp án
                        </Tag>
                      )}
                    </span>
                    <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} onClick={() => handleDeleteQuestion(qIndex)} />
                  </div>
                }
              >
                <Input.TextArea placeholder="Nội dung câu hỏi" className="mb-2" rows={2} value={q.questionText} onChange={(e) => handleChangeQuestion(qIndex, e.target.value)} />

                {q.answers.map((a, aIndex) => (
                  <div key={aIndex} className="flex items-center gap-2 mb-2">
                    <span className="font-bold w-4">{String.fromCharCode(65 + aIndex)}</span>
                    <Input placeholder={`Đáp án ${String.fromCharCode(65 + aIndex)}`} value={a.text} onChange={(e) => handleChangeAnswer(qIndex, aIndex, e.target.value)} />
                    <Button
                      type={a.isCorrect ? 'primary' : 'default'}
                      onClick={() => handleCorrectAnswer(qIndex, aIndex)}
                      className={a.isCorrect ? 'bg-green-500 hover:bg-green-400' : ''}
                    >
                      {a.isCorrect ? 'Đúng' : 'Sai'}
                    </Button>
                  </div>
                ))}
              </Card>
            ))}

            <Button type="dashed" block icon={<PlusOutlined />} onClick={handleAddQuestion} className="mt-2 h-10">
              Thêm câu hỏi
            </Button>
          </Card>
        </div>

        <div className="flex justify-end gap-1 mt-2 ">
          <Button danger onClick={() => navigate('/quizz-mana')}>
            Hủy bỏ
          </Button>
          <Button type="primary" htmlType="submit" className="px-2">
            Lưu bộ câu hỏi
          </Button>
        </div>
      </Form>
    </div>
  );
}
