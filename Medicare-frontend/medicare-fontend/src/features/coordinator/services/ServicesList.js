import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faEdit, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import '../../../style/Services.css';
import { GetAllAsync, CreateAsync, UpdateAsync, DeleteAsync } from '../../../api/ServicesApi';
import { GetDoctorsAsync, GetSpecialtiesAsync } from '../../../api/ServicesDropdownApi';
import ServicesForm from './ServicesForm';  // Form to add/edit service
import ConfirmModal from '../../../components/ConfirmModal';  // Confirmation modal for delete
import ServicesDetail from './ServicesDetail';

const ServicesList = () => {
  // State management
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [services, setServices] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessageText, setSuccessMessageText] = useState('');
  const [showDetail, setShowDetail] = useState(false);
  const [detailService, setDetailService] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch initial data
  useEffect(() => {
    fetchServices();
  }, []);

  // Fetch services, specialties, and doctors
  const fetchServices = async () => {
    console.log('🔄 Fetching initial data...');
    setLoading(true);
    setError(null);
    try {
      const [servicesResponse, specialtiesResponse, doctorsResponse] = await Promise.all([
        GetAllAsync(),
        GetSpecialtiesAsync(),
        GetDoctorsAsync()
      ]);

      // Sort services by ID in descending order
      const sortedServices = (servicesResponse.data || []).sort((a, b) => 
        (b.serviceId || b.service_id) - (a.serviceId || a.service_id)
      );
      
      console.log('✅ Data fetched successfully:', {
        services: sortedServices.length,
        specialties: specialtiesResponse.data?.length,
        doctors: doctorsResponse.data?.length
      });

      setServices(sortedServices);
      setSpecialties(specialtiesResponse.data || []);
      setDoctors(doctorsResponse.data || []);
    } catch (err) {
      console.error('❌ Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const getSpecialtyNameById = (id) => {
    const specialty = specialties.find(s => s.specialtyId === id);
    return specialty?.specialtyName || 'N/A';
  };

  const getDoctorNameById = (id) => {
    // Hỗ trợ cả doctorId và doctor_id, fullName và doctorName
    const doctor = doctors.find(d => String(d.doctorId) === String(id) || String(d.doctor_id) === String(id));
    if (!doctor) {
      console.warn('Không tìm thấy bác sĩ với id:', id, 'Danh sách doctors:', doctors);
    }
    return doctor?.fullName || doctor?.doctorName || 'N/A';
  };

  // Filter services
  const filteredServices = services.filter(service => {
    const serviceName = service?.service_name || service?.serviceName || service?.name || '';
    const specialtyName = getSpecialtyNameById(service.specialtyId);
    const doctorName = getDoctorNameById(service.doctorId || service.doctor_id);
    const cost = service?.cost ? String(service.cost) : '';
    const duration = service?.duration ? String(service.duration) : '';
    const search = searchTerm.trim().toLowerCase();

    let matchesSearch = false;
    if (!search) {
      matchesSearch = true;
    } else if (!isNaN(Number(search))) {
      // Nếu là số, tìm theo giá tiền hoặc thời gian
      matchesSearch = cost.includes(search) || duration.includes(search);
    } else {
      matchesSearch =
        serviceName.toLowerCase().includes(search) ||
        specialtyName.toLowerCase().includes(search) ||
        doctorName.toLowerCase().includes(search);
    }

    const matchesFilter = 
      filterStatus === 'all' ? true :
      filterStatus === 'active' ? (service?.isActive !== false) :
      filterStatus === 'inactive' ? (service?.isActive === false) : true;
    return matchesSearch && matchesFilter;
  });

  // Pagination calculations
  const totalRecords = filteredServices.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const pagedServices = filteredServices.slice(startIndex, startIndex + pageSize);

  // Reset current page when filters change
  useEffect(() => { 
    setCurrentPage(1); 
  }, [pageSize, filterStatus, searchTerm]);

  // CRUD Operations
  const handleAddService = async (serviceData) => {
    console.log('➕ Adding new service:', serviceData);
    try {
      const response = await CreateAsync(serviceData);
      console.log('✅ Service added successfully:', response.data);
      
      // Add new service to the beginning of the list
      setServices(prev => [response.data, ...prev]);
      setShowSuccessMessage(true);
      setSuccessMessageText('Thêm dịch vụ khám thành công!');
      setTimeout(() => setShowSuccessMessage(false), 2500);
    } catch (error) {
      console.error('❌ Error adding service:', error);
      setSuccessMessageText('Thêm dịch vụ khám thất bại!');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 2500);
    }
  };

  const handleEditServiceSubmit = async (data) => {
    console.log('✏️ Updating service:', data);
    try {
      await UpdateAsync(data.serviceId, data);
      console.log('✅ Service updated successfully');
      
      // Update service in the list
      setServices(prev => prev.map(s => 
        s.serviceId === data.serviceId ? { ...s, ...data } : s
      ));
      
      setShowEditForm(false);
      setSuccessMessageText('Sửa dịch vụ khám thành công');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 2500);
    } catch (error) {
      console.error('❌ Error updating service:', error);
      setShowEditForm(false);
      setSuccessMessageText('Sửa dịch vụ khám thất bại!');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 2500);
    }
  };

  const handleDeleteService = (id) => {
    console.log('🗑️ Preparing to delete service:', id);
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    console.log('🗑️ Deleting service:', deleteId);
    try {
      await DeleteAsync(deleteId);
      console.log('✅ Service deleted successfully');
      
      // Remove service from the list
      setServices(prev => prev.filter(s => s.serviceId !== deleteId));
      setShowDeleteModal(false);
      setSuccessMessageText('Xóa dịch vụ khám thành công!');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 2500);
    } catch (error) {
      console.error('❌ Error deleting service:', error);
      setShowDeleteModal(false);
      setSuccessMessageText('Xóa dịch vụ khám thất bại!');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 2500);
    }
  };

  // Change filter status (active, inactive, all)
  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
  };

  // Handle editing a service
  const handleEditService = (id, service) => {
    setEditingService(service);
    setShowEditForm(true);
  };

  // Xem chi tiết dịch vụ
  const handleShowDetail = (service) => {
    setDetailService(service);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setDetailService(null);
  };

  if (loading) {
    return (
      <div className="services-list-container">
        <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>
          Đang tải dữ liệu dịch vụ...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="services-list-container">
        <div style={{ textAlign: 'center', padding: '50px', color: 'red', fontSize: '18px' }}>
          Lỗi: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="services-list-container">
      {/* Success message */}
      {showSuccessMessage && (
        <div className="success-toast">
          {typeof successMessageText === 'string' ? (
            <>
              <div className="success-icon-bg">
                <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
                  <circle cx="19" cy="19" r="19" fill="#32D53B"/>
                  <path d="M11 20.5L17 26.5L27 14.5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span>{successMessageText}</span>
            </>
          ) : (
            successMessageText
          )}
        </div>
      )}
      <div className="services-filter-card-full">
        <div className="services-filter-group-left">
          <label htmlFor="status-filter">Trạng thái:</label>
          <select 
            id="status-filter"
            className="status-filter"
            value={filterStatus}
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
        </div>
        <div className="services-search-group-right">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm dịch vụ khám"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            style={{ paddingLeft: '30px' }}
          />
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
        </div>
      </div>
      <div className="add-service-btn-row-full">
        <button className="add-service-btn-small" onClick={() => setShowAddForm(true)}>
          Thêm dịch vụ khám
        </button>
      </div>
      <div className="services-table-container services-table-container-light">
        <table className="services-table services-table-no-col-border">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên dịch vụ khám</th>
              <th>Chuyên khoa</th>
              <th>Bác sĩ phụ trách</th>
              <th>Chi phí</th>
              <th>Thời gian</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {pagedServices.length > 0 ? (
              pagedServices.map((service, index) => (
                <tr key={`${service.service_id || service.serviceId || 'row'}-${index}`}>
                  <td >{index + 1}</td>
                  <td className="text-left" >{service.serviceName || 'N/A'}</td>
                  <td className="text-left" >{getSpecialtyNameById(service.specialtyId)}</td>
                  <td className="text-left">{getDoctorNameById(service.doctorId || service.doctor_id)}</td>
                  <td className="text-left">
                    {service.cost ? service.cost.toLocaleString('vi-VN') + ' đ' : 'N/A'}
                  </td>
                  <td className="text-left">
                    {service.duration ? service.duration + ' phút' : 'N/A'}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn info-btn"
                        title="Xem chi tiết"
                        onClick={() => handleShowDetail(service)}
                      >
                        <FontAwesomeIcon icon={faInfoCircle} />
                      </button>
                      <button 
                        className="action-btn edit-btn"
                        onClick={() => handleEditService(service.service_id || service.serviceId, service)}
                        title="Chỉnh sửa"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteService(service.service_id || service.serviceId)}
                        title="Xóa"
                      >
                        <FontAwesomeIcon icon={faTrash} style={{color: '#e74c3c'}} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    {/* Pagination */}
    <div className="pagination-row">
      <div className="pagination-info">
        <span>Hiển thị <b>{Math.min(startIndex + pagedServices.length, totalRecords)}</b> bản ghi</span>
      </div>
      <div className="pagination-controls">
        <div className="page-size-selector">
          <select value={pageSize} onChange={handlePageSizeChange}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <button 
          disabled={currentPage === 1} 
          onClick={() => handlePageChange(currentPage - 1)} 
          className="pagination-btn"
        >
          Trước
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button 
            key={index + 1} 
            onClick={() => handlePageChange(index + 1)} 
            className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
          >
            {index + 1}
          </button>
        ))}
        <button 
          disabled={currentPage === totalPages} 
          onClick={() => handlePageChange(currentPage + 1)} 
          className="pagination-btn"
        >
          Sau
        </button>
      </div>
    </div>


      {showAddForm && <ServicesForm onClose={() => setShowAddForm(false)} onSubmit={handleAddService} />}
      {showEditForm && <ServicesForm onClose={() => setShowEditForm(false)} editingService={editingService} onSubmit={handleEditServiceSubmit} />}
      
      <ConfirmModal 
        isOpen={showDeleteModal}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa dịch vụ này?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
      {showDetail && detailService && (
        <ServicesDetail service={detailService} onClose={handleCloseDetail} doctors={doctors} specialties={specialties} />
      )}
    </div>
  );
};

export default ServicesList;
