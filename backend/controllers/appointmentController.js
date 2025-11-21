// backend/controllers/appointmentController.js
const Appointment = require('../models/appointment');
const { getOne, updateOne, deleteOne } = require('./apiHandler');

// የተወሰነ ንባብ (Populated Read) - ለቀጠሮ ሰራተኛውን እና አገልግሎቱን ማሳየት
const getAllAppointments = async (req, res) => {
    try {
        const docs = await Appointment.find()
            .populate('client', 'name phone') // የደንበኛን ስም እና ስልክ ቁጥር ያመጣል
            .populate('service', 'name price durationMinutes'); // የአገልግሎቱን ስም፣ ዋጋ እና የቆይታ ጊዜ ያመጣል
        res.status(200).json(docs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    አዲስ ቀጠሮ መፍጠር (ከግጭት ማረጋገጫ ጋር)
// @route   POST /api/appointments
// @access  Public
const createAppointment = async (req, res) => {
    const { date, startTime, endTime } = req.body;

    try {
        // 1. የግዜ ግጭት መኖሩን ማረጋገጥ
        // በተጠቀሰው ቀን እና ሰዓት ላይ ሌላ ቀጠሮ እንዳለ እንፈትሻለን
        const existingAppointment = await Appointment.findOne({
            date: date,
            $or: [
                // አዲሱ ቀጠሮ በነበረ ቀጠሮ ውስጥ እንዳይጀምር ወይም እንዳያልቅ ማረጋገጥ
                { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
            ]
        });

        if (existingAppointment) {
            // 409 Conflict status code እንመልሳለን
            return res.status(409).json({ message: 'ይህ ሰዓት በሌላ ቀጠሮ ተይዟል። እባክዎ ሌላ ሰዓት ይምረጡ።' });
        }

        // 2. ግጭት ከሌለ አዲሱን ቀጠሮ መፍጠር
        const newAppointment = await Appointment.create(req.body);
        res.status(201).json(newAppointment);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAppointment = getOne(Appointment);
const updateAppointment = updateOne(Appointment);
const deleteAppointment = deleteOne(Appointment);

module.exports = {
    getAllAppointments,
    createAppointment,
    getAppointment,
    updateAppointment,
    deleteAppointment,
    getAll: getAllAppointments // getAllAppointmentsን እንደ getAll export እናደርጋለን
};