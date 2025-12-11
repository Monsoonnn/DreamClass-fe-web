import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { showLoading, closeLoading, showSuccess, showError } from '../../utils/swalUtils';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Use login from AuthContext
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Note: Redirection for already logged-in users is now handled by the PublicRoute wrapper in App.jsx

  const handleLogin = async () => {
    if (!email || !password) {
      showError('Vui lòng nhập tài khoản và mật khẩu!');
      return;
    }

    showLoading();

    try {
      // login() trong AuthContext trả về fullData gồm role
      const user = await login(email, password);

      closeLoading();
      await showSuccess('Đăng nhập thành công!');

      // Điều hướng theo role
      if (user?.role === 'student') {
        navigate('/student-study');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      closeLoading();
      showError(err.response?.data?.message || 'Sai tài khoản hoặc mật khẩu! Vui lòng thử lại.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLogin();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/images/background_login.jpg')" }}>
      {/* Form login */}
      <div className="bg-white/90 shadow-2xl rounded-2xl p-10 w-[400px] max-w-[90%] backdrop-blur-sm">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">ĐĂNG NHẬP</h1>
        <p className="text-center text-gray-500 mb-8">Xin chào! Vui lòng đăng nhập</p>

        <div className="space-y-4">
          {/* Email input */}
          <input
            type="text"
            placeholder="Nhập tài khoản"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />

          {/* Password input */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            </div>
          </div>

          <button onClick={handleLogin} className="w-full bg-[#23408E] text-white py-2 rounded-lg font-semibold hover:bg-[#304d9b] transition-colors">
            ĐĂNG NHẬP
          </button>
        </div>

        <div className="flex justify-between items-center mt-4 text-sm">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="accent-cyan-500" />
            <span>Ghi nhớ</span>
          </label>

          <span onClick={() => navigate('/forgot-password')} className="text-[#23408E] hover:underline cursor-pointer">
            Quên mật khẩu?
          </span>
        </div>
      </div>
    </div>
  );
}
