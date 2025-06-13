import axios from 'axios';

// Tạo một instance dùng sẵn
const axiosInstance = axios.create({
  baseURL: 'http://localhost:7130/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Gắn token vào mọi request nếu có
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Gửi token trong header:', token);
    } else {
      console.warn('⚠️ Không có token trong localStorage!');
    }

    return config;
  },
  (error) => {
    console.error('❌ Lỗi trong request interceptor:', error);
    return Promise.reject(error);
  }
);

// Interceptor: Xử lý lỗi từ response (tùy chọn)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('🚫 Lỗi 401: Không có quyền truy cập. Token sai hoặc hết hạn.');
      // Bạn có thể điều hướng đến trang đăng nhập hoặc thông báo cho người dùng
    } else {
      console.error('❌ Lỗi từ server:', error.response || error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
