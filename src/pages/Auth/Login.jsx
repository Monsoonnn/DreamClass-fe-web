import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState('teacher');

  const handleLogin = () => {
    // Lưu role tạm vào localStorage (vì chưa có backend)
    localStorage.setItem('role', role);

    // Điều hướng theo role
    if (role === 'teacher') navigate('/student-mana');
    else navigate('/user-mana');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/images/background_login.jpg')" }}>
      <div className="bg-white/90 shadow-2xl rounded-2xl p-10 w-[400px] max-w-[90%] backdrop-blur-sm">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">ĐĂNG NHẬP</h1>
        <p className="text-center text-gray-500 mb-8">Xin chào! Vui lòng đăng nhập</p>

        <div className="space-y-4">
          <input type="text" placeholder="Nhập tài khoản" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:[#23408E]" />
          <input type="password" placeholder="Nhập mật khẩu" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:[#23408E]" />

          {/* Chọn role giả lập */}
          <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
            <option value="teacher">Giáo viên</option>
            <option value="admin">Admin</option>
          </select>

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
