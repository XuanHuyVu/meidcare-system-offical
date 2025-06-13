import React, { useState } from 'react';
import ServicesForm from './ServicesForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import '../../../style/Services.css';
import ConfirmModal from '../../../components/ConfirmModal';
import ErrorModal from '../../../components/ErrorModal';

const ServicesList = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [services, setServices] = useState([
    {
      id: 1,
      name: 'Chụp CT phổi liều thấp',
      department: 'Hô Hấp',
      doctor: 'BS.Đỗ Thị Hiền Lương',
      price: '1,000,000 đ',
      duration: '20 phút',
      isActive: true
    }
  ]);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  const handleAddService = () => {
    setShowAddForm(true);
    setShowEditForm(false);
    setEditingService(null);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setEditingService(null);
  };

  const handleSubmitForm = (formData) => {
    if (editingService) {
      setServices(prev =>
        prev.map(service =>
          service.id === editingService.id ? { ...service, ...formData } : service
        )
      );
    } else {
      const newId = Math.max(...services.map(s => s.id), 0) + 1;
      const newService = {
        id: newId,
        name: formData.name,
        department: formData.department,
        doctor: formData.doctor,
        price: formData.price + ' đ',
        duration: formData.duration + ' phút',
        isActive: true
      };
      setServices(prev => [...prev, newService]);
    }
    handleCloseForm();
  };

  const handleViewService = (id) => {
    console.log('Xem chi tiết dịch vụ:', id);
  };

  const handleEditService = (id) => {
    const serviceToEdit = services.find(service => service.id === id);
    setEditingService(serviceToEdit);
    setShowEditForm(true);
    setShowAddForm(false);
  };

  const handleDeleteService = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' ? true :
      filterStatus === 'active' ? service.isActive :
      filterStatus === 'inactive' ? !service.isActive : true;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="services-list-container">
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
          <input
            type="text"
            placeholder="Tìm kiếm dịch vụ khám"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </span>
        </div>
      </div>
      <div className="add-service-btn-row-full">
        <button className="add-service-btn-small" onClick={handleAddService}>
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
            {filteredServices.length > 0 ? (
              filteredServices.map((service, index) => (
                <tr key={service.id}>
                  <td>{index + 1}</td>
                  <td>{service.name}</td>
                  <td>{service.department}</td>
                  <td>{service.doctor}</td>
                  <td>{service.price}</td>
                  <td>{service.duration}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn info-btn"
                        onClick={() => handleViewService(service.id)}
                        title="Xem chi tiết"
                      >
                        <FontAwesomeIcon icon={faInfoCircle} />
                      </button>
                      <button 
                        className="action-btn edit-btn"
                        onClick={() => handleEditService(service.id)}
                        title="Chỉnh sửa"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteService(service.id)}
                        title="Xóa"
                      >
                        <FontAwesomeIcon icon={faTrash} />
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
      {showAddForm && (
        <ServicesForm onClose={handleCloseForm} onSubmit={handleSubmitForm} />
      )}
      {showEditForm && (
        <ServicesForm onClose={handleCloseForm} onSubmit={handleSubmitForm} editingService={editingService} />
      )}
      <ConfirmModal open={showDeleteModal} title="Xác nhận xóa" message="Bạn có chắc chắn muốn xóa dịch vụ này?" onConfirm={() => {
        const service = services.find(s => s.id === deleteId);
        if (service && service.inUse) {
          setShowDeleteModal(false);
          setShowErrorModal(true);
        } else {
          setServices(prev => prev.filter(s => s.id !== deleteId));
          setShowDeleteModal(false);
        }
      }} onCancel={() => setShowDeleteModal(false)} />
      <ErrorModal open={showErrorModal} message="Có lỗi xảy ra!" onClose={() => setShowErrorModal(false)} />
    </div>
  );
};

export default ServicesList;
