const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/AppointmentController');

// Route kiểm tra trùng lịch
router.post('/check-conflict', appointmentController.checkAppointmentConflict);

// Route tạo lịch khám mới
router.post('/', appointmentController.createAppointment);

// Route cập nhật lịch khám
router.put('/:appointmentId', appointmentController.updateAppointment);

module.exports = router; 