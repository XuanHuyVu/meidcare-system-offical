import React, { useState, useEffect } from "react";
import "../../../style/Patients.css";
import ConfirmModal from "../../../components/ConfirmModal";

const PatientsForm = ({ onClose, onSubmit, editingPatient = null }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dateOfBirth: "",
    phoneNumber: "",
    address: "",
    email: "",
    avatar: null,
    emergencyContactName: "",
    emergencyContactPhone: "",
  });

  const [errors, setErrors] = useState({});
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    if (editingPatient) {
      setFormData({
        fullName: editingPatient.fullName || "",
        gender: editingPatient.gender || "",
        dateOfBirth: editingPatient.dateOfBirth?.split("T")[0] || "",
        phoneNumber: editingPatient.phoneNumber || "",
        address: editingPatient.address || "",
        email: editingPatient.email || "",
        avatar: editingPatient.avatar || null,
        emergencyContactName: editingPatient.emergencyContactName || "",
        emergencyContactPhone: editingPatient.emergencyContactPhone || "",
      });
    }
  }, [editingPatient]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = [
        "image/png",
        "image/jpg",
        "image/jpeg",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          avatar: "Chỉ chấp nhận file PNG, JPG, JPEG hoặc GIF",
        }));
        return;
      }
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          avatar: "Kích thước file không được vượt quá 5MB",
        }));
        return;
      }

      // Resize image before converting to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 300;
          const MAX_HEIGHT = 300;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to base64 with lower quality
          const resizedBase64 = canvas.toDataURL('image/jpeg', 0.5);
          setFormData((prev) => ({
            ...prev,
            avatar: resizedBase64,
          }));
          if (errors.avatar) setErrors((prev) => ({ ...prev, avatar: "" }));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, avatar: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.avatar) newErrors.avatar = "Vui lòng chọn ảnh đại diện";
    if (!formData.fullName.trim()) newErrors.fullName = "Vui lòng nhập họ tên";
    if (!formData.gender) newErrors.gender = "Vui lòng chọn giới tính";
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Vui lòng chọn ngày sinh";
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Vui lòng nhập số điện thoại";
    else if (!/^\d{10,11}$/.test(formData.phoneNumber))
      newErrors.phoneNumber = "Số điện thoại không hợp lệ";
    if (!formData.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ";
    if (!formData.emergencyContactName.trim())
      newErrors.emergencyContactName = "Vui lòng nhập tên người liên hệ";
    if (!formData.emergencyContactPhone.trim())
      newErrors.emergencyContactPhone = "Vui lòng nhập số liên hệ khẩn cấp";
    else if (!/^\d{10,11}$/.test(formData.emergencyContactPhone))
      newErrors.emergencyContactPhone = "Số điện thoại khẩn cấp không hợp lệ";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("=== DỮ LIỆU FORM BỆNH NHÂN ===");
      console.log("Họ tên:", formData.fullName);
      console.log("Giới tính:", formData.gender);
      console.log("Ngày sinh:", formData.dateOfBirth);
      console.log("Số điện thoại:", formData.phoneNumber);
      console.log("Địa chỉ:", formData.address);
      console.log("Email:", formData.email);
      console.log("Tên người liên hệ:", formData.emergencyContactName);
      console.log("Số liên hệ khẩn cấp:", formData.emergencyContactPhone);
      console.log("Avatar:", formData.avatar ? "Đã tải lên" : "Chưa có");
      console.log("===========================");
      onSubmit(formData);
    }
  };

  return (
    <>
      <div
        className="modal-overlay"
        onClick={(e) =>
          e.target === e.currentTarget && setShowCancelModal(true)
        }
      >
        <div className="modal-container">
          <div className="modal-header">
            <h2>
              {editingPatient
                ? "SỬA THÔNG TIN BỆNH NHÂN"
                : "THÊM THÔNG TIN BỆNH NHÂN"}
            </h2>
            <button className="close-btn" onClick={onClose}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <form className="patients-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-col-left">
                {/* Avatar */}
                <div className="form-group">
                  <label>
                    Ảnh đại diện: <span className="required">*</span>
                  </label>
                  <div className="avatar-upload-box">
                    {formData.avatar ? (
                      <div className="avatar-preview">
                        <img src={formData.avatar} alt="avatar" />
                        <button
                          type="button"
                          className="remove-avatar-btn"
                          onClick={handleRemoveImage}
                        >
                          Xóa
                        </button>
                      </div>
                    ) : (
                      <div className="avatar-placeholder">
                        <span>Chưa có ảnh</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    {errors.avatar && (
                      <span className="error-message">{errors.avatar}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="emergencyContactName">
                    Tên người liên hệ: <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="emergencyContactName"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleInputChange}
                    className={errors.emergencyContactName ? "error" : ""}
                  />
                  {errors.emergencyContactName && (
                    <span className="error-message">
                      {errors.emergencyContactName}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="emergencyContactPhone">
                    Liên hệ khẩn cấp: <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="emergencyContactPhone"
                    name="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={handleInputChange}
                    className={errors.emergencyContactPhone ? "error" : ""}
                  />
                  {errors.emergencyContactPhone && (
                    <span className="error-message">
                      {errors.emergencyContactPhone}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? "error" : ""}
                  />
                  {errors.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>
              </div>

              <div className="form-col-right">
                <div className="form-group">
                  <label htmlFor="fullName">
                    Họ tên: <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={errors.fullName ? "error" : ""}
                  />
                  {errors.fullName && (
                    <span className="error-message">{errors.fullName}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="address">
                    Địa chỉ: <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={errors.address ? "error" : ""}
                  />
                  {errors.address && (
                    <span className="error-message">{errors.address}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="dateOfBirth">
                    Ngày sinh: <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className={errors.dateOfBirth ? "error" : ""}
                  />
                  {errors.dateOfBirth && (
                    <span className="error-message">{errors.dateOfBirth}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="phoneNumber">
                    Số điện thoại: <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className={errors.phoneNumber ? "error" : ""}
                  />
                  {errors.phoneNumber && (
                    <span className="error-message">{errors.phoneNumber}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>
                    Giới tính: <span className="required">*</span>
                  </label>
                  <div className="gender-radio-group">
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="Nam"
                        checked={formData.gender === "Nam"}
                        onChange={handleInputChange}
                      />
                      Nam
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="Nữ"
                        checked={formData.gender === "Nữ"}
                        onChange={handleInputChange}
                      />
                      Nữ
                    </label>
                  </div>
                  {errors.gender && (
                    <span className="error-message">{errors.gender}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="form-actions" style={{ textAlign: "right" }}>
              <button type="submit" className="submit-btn">
                Xác nhận
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowCancelModal(true)}
              >
                Hủy bỏ
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={onClose}
        title="XÁC NHẬN THOÁT"
        message="Bạn có chắc chắn muốn hủy bỏ không?"
        confirmText="Hủy bỏ"
        cancelText="Quay lại"
      />
    </>
  );
};

export default PatientsForm;
