import axiosInstance from './axiosInstance';

//export const GetAllAsync = () => axiosInstance.get('/api/services');
//export const GetByIdAsync = (id) => axiosInstance.get(`/api/services/${id}`);
//export const CreateAsync = (data) => axiosInstance.post('/api/services', data);
//export const UpdateAsync = (id, data) => axiosInstance.put(`/api/services/${id}`, data);
//export const DeleteAsync = (id) => axiosInstance.delete(`/api/services/${id}`);


export const GetAllAsync = () => axiosInstance.get('/coordinator/Services');
export const GetByIdAsync = (id) => axiosInstance.get(`/coordinator/Services/${id}`);
export const CreateAsync = (service) => axiosInstance.post('/coordinator/Services', service);
export const UpdateAsync = (id, service) => axiosInstance.put(`/coordinator/Services/${id}`, service);
export const DeleteAsync = (id) => axiosInstance.delete(`/coordinator/Services/${id}`);
//export const GetByDoctorIdAsync = (doctorId) => axiosInstance.get(`/coordinator/workschedules/doctors/${doctorId}`);
//export const GetBySpecialtyIdAsync = (specialtyId) => axiosInstance.get(`/coordinator/workschedules/specialties/${specialtyId}`);
