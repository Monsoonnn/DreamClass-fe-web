import { createContext, useContext, useState, useEffect } from 'react';
import { checkAuthAPI, loginAPI, logoutAPI } from '../services/authService';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const verifyUser = async () => {
      const token = Cookies.get('token');
      const savedUser = Cookies.get('user_data');

      // Nếu có user đã lưu, set ngay để không bị trắng trang/mất login
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error('Lỗi parse user_data', e);
        }
      }

      // Cleanup old localStorage data if exists
      localStorage.removeItem('token');
      localStorage.removeItem('user_data');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        console.log('Đang verify user với token:', token);
        const response = await checkAuthAPI();
        const userData = response.data?.data || response.data;

        // Cập nhật lại user mới nhất từ server
        setUser(userData);
        Cookies.set('user_data', JSON.stringify(userData), { expires: 7 });
      } catch (error) {
        console.log('Verify failed - Token có thể hết hạn hoặc server từ chối Header');
        // Nếu API báo lỗi 401, lúc đó mới logout hẳn
        if (error.response && error.response.status === 401) {
          Cookies.remove('token');
          Cookies.remove('user_data');
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = async (username, password) => {
    const response = await loginAPI(username, password);

    const data = response.data;
    const userData = data?.data || data;

    // Tìm token ở nhiều vị trí có thể
    const token = data?.token || data?.accessToken || userData?.token || userData?.accessToken;

    if (token) {
      Cookies.set('token', token, { expires: 7 });
    }

    if (userData) {
      Cookies.set('user_data', JSON.stringify(userData), { expires: 7 });
    }

    setUser(userData);
    return userData;
  };

  const logout = async () => {
    try {
      await logoutAPI();
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setUser(null);
      Cookies.remove('token');
      Cookies.remove('user_data');
    }
  };

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
