import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/api';
import { message, Modal, Button } from 'antd';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      message.warning('Vui lòng nhập email!');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/auth/reset-password', { email });
      setIsSuccessModalVisible(true);
    } catch (err) {
      // API có thể trả về lỗi nếu email không tìm thấy hoặc lỗi server
      console.error(err);
      // Vẫn hiện thông báo thành công để bảo mật (tránh dò email)
      setIsSuccessModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsSuccessModalVisible(false);
    navigate('/login');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/images/background_login.jpg')" }}>
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">QUÊN MẬT KHẨU</h1>
        <p className="text-slate-500 mb-6">Nhập email để lấy lại mật khẩu</p>

        <div className="space-y-4">
          <input 
            type="email" 
            placeholder="Nhập email" 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            disabled={loading}
          />
          
          <button 
            className={`w-full bg-[#23408E] text-white py-2 rounded-lg font-semibold hover:bg-[#304d9b] transition duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`} 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'ĐANG GỬI...' : 'GỬI YÊU CẦU'}
          </button>

          <div className="mt-4">
            <span 
              className="text-[#23408E] cursor-pointer hover:underline"
              onClick={() => navigate('/login')}
            >
              Quay lại đăng nhập
            </span>
          </div>
        </div>
      </div>

      {/* Declarative Modal */}
      <Modal
        title="Đã gửi yêu cầu!"
        open={isSuccessModalVisible}
        onOk={handleCloseModal}
        onCancel={handleCloseModal}
        footer={[
          <Button key="ok" type="primary" onClick={handleCloseModal} style={{ backgroundColor: '#23408E' }}>
            Đã hiểu
          </Button>
        ]}
        centered
      >
        <p>Nếu email này tồn tại trong hệ thống, chúng tôi đã gửi một liên kết đặt lại mật khẩu.</p>
        <p>Vui lòng kiểm tra hộp thư đến (hoặc thư rác).</p>
      </Modal>
    </div>
  );
}