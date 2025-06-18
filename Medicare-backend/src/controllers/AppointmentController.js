const Appointment = require('../models/Appointment');
const { Op } = require('sequelize');

// Kiểm tra trùng lịch
exports.checkAppointmentConflict = async (req, res) => {
  try {
    const { appointmentDate, appointmentTime, doctorId, clinicId, appointmentId } = req.body;

    // Validate input
    if (!appointmentDate || !appointmentTime || !doctorId || !clinicId) {
      return res.status(400).json({
        message: 'Thiếu thông tin cần thiết để kiểm tra trùng lịch'
      });
    }

    // Tìm các lịch khám trùng thời gian
    const conflictingAppointments = await Appointment.findAll({
      where: {
        appointmentDate,
        appointmentTime,
        doctorId,
        clinicId,
        status: {
          [Op.notIn]: ['CANCELLED'] // Không kiểm tra các lịch đã hủy
        },
        // Nếu đang cập nhật, loại trừ lịch hiện tại
        ...(appointmentId ? { appointmentId: { [Op.ne]: appointmentId } } : {})
      }
    });

    // Kiểm tra xem có lịch khám nào trùng không
    const hasConflict = conflictingAppointments.length > 0;

    res.json({
      hasConflict,
      conflictingAppointments: hasConflict ? conflictingAppointments : []
    });
  } catch (error) {
    console.error('Error checking appointment conflict:', error);
    res.status(500).json({
      message: 'Có lỗi xảy ra khi kiểm tra trùng lịch',
      error: error.message
    });
  }
};

// Tạo lịch khám mới
exports.createAppointment = async (req, res) => {
  try {
    const appointmentData = req.body;

    // Kiểm tra trùng lịch trước khi tạo
    const hasConflict = await checkConflict(appointmentData);
    if (hasConflict) {
      return res.status(400).json({
        message: 'Lịch khám này đã bị trùng với một lịch khám khác'
      });
    }

    const appointment = await Appointment.create(appointmentData);
    res.status(201).json({
      message: 'Tạo lịch khám thành công',
      appointment
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({
      message: 'Có lỗi xảy ra khi tạo lịch khám',
      error: error.message
    });
  }
};

// Cập nhật lịch khám
exports.updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const updateData = req.body;

    // Kiểm tra trùng lịch trước khi cập nhật
    const hasConflict = await checkConflict({
      ...updateData,
      appointmentId
    });
    if (hasConflict) {
      return res.status(400).json({
        message: 'Lịch khám này đã bị trùng với một lịch khám khác'
      });
    }

    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        message: 'Không tìm thấy lịch khám'
      });
    }

    await appointment.update(updateData);
    res.json({
      message: 'Cập nhật lịch khám thành công',
      appointment
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({
      message: 'Có lỗi xảy ra khi cập nhật lịch khám',
      error: error.message
    });
  }
};

// Hàm helper kiểm tra trùng lịch
async function checkConflict(appointmentData) {
  const { appointmentDate, appointmentTime, doctorId, clinicId, appointmentId } = appointmentData;

  const conflictingAppointments = await Appointment.findAll({
    where: {
      appointmentDate,
      appointmentTime,
      doctorId,
      clinicId,
      status: {
        [Op.notIn]: ['CANCELLED']
      },
      ...(appointmentId ? { appointmentId: { [Op.ne]: appointmentId } } : {})
    }
  });

  return conflictingAppointments.length > 0;
} 