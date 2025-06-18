import axiosInstance from "./axiosInstance";
import { toast } from "react-toastify";
import dayjs from "dayjs";

class AppointmentProxyApi {
    constructor() {
        this.baseUrl = "/coordinator/appointments";
    }

    async validateAppointmentTime(appointment) {
        try {
            // Kiểm tra xem thời gian đặt lịch có hợp lệ không
            const selectedDate = dayjs(appointment.appointmentDate);
            const tomorrow = dayjs().add(1, 'day').startOf('day');
            
            if (selectedDate.isBefore(tomorrow)) {
                throw new Error("Không thể đặt lịch khám trong ngày hiện tại.");
            }

            return true;
        } catch (error) {
            toast.error(error.message);
            throw error;
        }
    }

    async createAppointment(data) {
        try {
            await this.validateAppointmentTime(data);
            const response = await axiosInstance.post(this.baseUrl, data);
            return response.data;
        } catch (error) {
            console.error("Error creating appointment:", error);
            if (error.response?.data) {
                // Hiển thị thông báo lỗi từ backend (bao gồm cả lỗi trùng lịch)
                const errorMessage = error.response.data;
                if (errorMessage.includes("trùng với lịch hẹn khác của bác sĩ")) {
                    throw new Error("Thời gian này đã bị trùng với lịch hẹn khác của bác sĩ. Vui lòng chọn thời gian khác.");
                }
                toast.error(errorMessage);
            } else {
                toast.error("Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại!");
            }
            throw error;
        }
    }

    async updateAppointment(id, data) {
        try {
            console.log("Proxy API - Updating appointment:", { id, data });
            await this.validateAppointmentTime(data);
            const response = await axiosInstance.put(`${this.baseUrl}/${id}`, data);
            console.log("Proxy API - Update response:", response);
            return response.data;
        } catch (error) {
            console.error("Error updating appointment:", error);
            if (error.response?.data) {
                const errorMessage = typeof error.response.data === 'string'
                    ? error.response.data
                    : JSON.stringify(error.response.data);
                toast.error(errorMessage);
                throw new Error(errorMessage);
            } else {
                toast.error("Có lỗi xảy ra khi cập nhật lịch. Vui lòng thử lại!");
            }
            throw error;
        }
    }

    async getAppointments() {
        try {
            const response = await axiosInstance.get(this.baseUrl);
            return response.data;
        } catch (error) {
            toast.error("Không thể lấy danh sách lịch hẹn");
            throw error;
        }
    }

    async getAppointmentById(id) {
        try {
            const response = await axiosInstance.get(`${this.baseUrl}/${id}`);
            return response.data;
        } catch (error) {
            toast.error("Không thể lấy thông tin lịch hẹn");
            throw error;
        }
    }

    async deleteAppointment(id) {
        try {
            await axiosInstance.delete(`${this.baseUrl}/${id}`);
            toast.success("Xóa lịch hẹn thành công!");
        } catch (error) {
            toast.error("Không thể xóa lịch hẹn");
            throw error;
        }
    }
}

export const appointmentProxyApi = new AppointmentProxyApi(); 