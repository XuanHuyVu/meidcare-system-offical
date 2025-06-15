import axios from 'axios';

// Tạo một instance dùng sẵn
const axiosInstance = axios.create({
  baseURL: 'http://localhost:7130',
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

export const createAppointment = async (appointmentData) => {
  try {
    const response = await axiosInstance.post('/appointments', appointmentData);
    return response.data; // Return the response data (e.g., success message)
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error; // Rethrow the error to handle it in the caller
  }
};

export default axiosInstance;
