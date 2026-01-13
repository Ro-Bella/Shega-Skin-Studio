// backend/controllers/appointmentController.js
const Appointment = require('../models/Appointment');  // ቀጠሮ ሞዴል እንዲጠቀም ለማድረግ

// አዲስ ቀጠሮ መፍጠር
exports.createAppointment = async (req, res) => { // አዲስ ቀጠሮ መፍጠር
    try { // የሚከናወን ኮድ
        // ከፍሮንትኤንድ የመጣውን ዳታ ማስተካከል
        const { name, phone, service, date, timeSlot } = req.body; // የቀጠሮ መረጃዎችን ከእባክዎ ያግኙ

        // የተመረጠው ቀን እና ሰዓት አስቀድሞ መያዙን ማረጋገጥ
        const existingAppointment = await Appointment.findOne({ date, timeSlot });
        if (existingAppointment) {
            return res.status(409).json({ // 409 Conflict status code
                success: false,
                message: 'ይህ የቀጠሮ ሰዓት በሌላ ደንበኛ ተይዟል። እባክዎ ሌላ ሰዓት ይምረጡ።'
            });
        }
        const appointmentData = { // የቀጠሮ መረጃዎችን ማዘጋጀት
            name, // የደንበኛ ስም
            phone,  // የደንበኛ ስልክ ቁጥር
            service, // የቀጠሮ አገልግሎት
            date, // የቀጠሮ ቀን
            timeSlot, // የቀጠሮ የሰዓት ሰአት
        };
        const appointment = new Appointment(appointmentData); // የቀጠሮ አዲስ ኦቤጅክት መፍጠር
        await appointment.save(); // ቀጠሮውን ወደ ዳታቤዝ ማስቀመጥ
        res.status(201).json({  // 201 ማለት ተፈጥሯል
            success: true, // ስኬታማ ሆኗል
            data: appointment, // የቀጠሮ መረጃ
            message: 'ቀጠሮዎ በተሳካ ሁኔታ ተይዟል!' // ማሳወቂያ መልእክት
        });
    } catch (error) { // ስህተት ከተፈጠረ
        // ከዳታቤዝ የሚመጣውን የ unique index ስህተት ማስተናገድ (E11000)
        if (error.code === 11000) {
            return res.status(409).json({ // 409 Conflict
                success: false,
                message: 'ይህ የቀጠሮ ሰዓት በሌላ ደንበኛ ተይዟል። እባክዎ ሌላ ሰዓት ይምረጡ።'
            });
        }

        res.status(500).json({ // 500 ማለት የውስጥ አስተዳደር ስህተት ነው
            success: false, // አልሆነም
            message: 'ቀጠሮ ማስያዝ አልተቻለም', // ማሳወቂያ መልእክት
            error: error.message // የስህተት መልእክት 
        });
    }
};


// ሁሉንም ቀጠሮዎች ማምጣት
exports.getAppointments = async (req, res) => { // ሁሉንም ቀጠሮዎች ማምጣት
    try {
        const appointments = await Appointment.find({}); // ሁሉንም ቀጠሮዎች ከዳታቤዝ ማግኘት
        res.status(200).json({ // 200 ማለት ጥሩ ነው
            success: true, // ስኬታማ ሆኗል
            count: appointments.length, // የቀጠሮዎች ብዛት
            data: appointments // የቀጠሮዎች መረጃ
        });

    } catch (error) { // ስህተት ከተፈጠረ
        res.status(500).json({ // 500 ማለት የውስጥ አስተዳደር ስህተት ነው
            success: false, // አልሆነም
            message: 'ቀጠሮዎችን ማምጣት አልተቻለም', // ማሳወቂያ መልእክት
            error: error.message // የስህተት መልእክት
        });
    }
};


// ቀጠሮ ማስተካከል
exports.updateAppointment = async (req, res) => { // ቀጠሮ ማስተካከል
    try {
        const { date, timeSlot } = req.body;

        // If date or time is being updated, check for conflicts
        if (date && timeSlot) {
            const existingAppointment = await Appointment.findOne({
                date,
                timeSlot,
                _id: { $ne: req.params.id } // Exclude the current appointment from the check
            });
            if (existingAppointment) {
                return res.status(409).json({
                    success: false,
                    message: 'ይህ የቀጠሮ ሰዓት በሌላ ደንበኛ ተይዟል። እባክዎ ሌላ ሰዓት ይምረጡ።',
                    messageKey: 'timeSlotTaken' // ለፍሮንትኤንድ ትርጉም
                });
            }
        }

        const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // የተስተካከለውን ዳታ ለመመለስ
            runValidators: true // በሞዴሉ ላይ የተቀመጡትን ህጎች ለማረጋገጥ
        });

        if (!appointment) {
            return res.status(404).json({ // 404 ማለት አልተገኘም
                success: false,
                message: 'ይህ ቀጠሮ አልተገኘም'
            });
        }

        res.status(200).json({ // 200 ማለት ጥሩ ነው
            success: true, // ስኬታማ ሆኗል
            data: appointment,
            message: 'ቀጠሮዎ በተሳካ ሁኔታ ተስተካክሏል!' // ማሳወቂያ መልእክት
        });

    } catch (error) { // ስህተት ከተፈጠረ
        // ከዳታቤዝ የሚመጣውን የ unique index ስህተት ማስተናገድ (E11000)
        if (error.code === 11000) {
            return res.status(409).json({ // 409 Conflict
                success: false,
                message: 'ሊያስተካክሉ የሞከሩት የቀጠሮ ሰዓት በሌላ ደንበኛ ተይዟል።',
                messageKey: 'timeSlotTaken'
            });
        }
        res.status(500).json({ // 500 ማለት የውስጥ አስተዳደር ስህተት ነው
            success: false, // አልሆነም
            message: 'ቀጠሮ ማስተካከል አልተቻለም', // ማሳወቂያ መልእክት
            error: error.message // የስህተት መልእክት
        });
    }
};


// ቀጠሮ ማጥፋት
exports.deleteAppointment = async (req, res) => { // ቀጠሮ ማጥፋት
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id); // የቀጠሮ መረጃ ማጥፋት

        if (!appointment) {
            return res.status(404).json({ // 404 ማለት አልተገኘም
                success: false,
                message: 'ይህ ቀጠሮ አልተገኘም'
            });
        }

        res.status(200).json({ // 200 ማለት ጥሩ ነው
            success: true, // ስኬታማ ሆኗል
            message: 'ቀጠሮው በተሳካ ሁኔታ ተሰርዟል' // ማሳወቂያ መልእክት
        });

    } catch (error) {  // ስህተት ከተፈጠረ
        res.status(500).json({ // 500 ማለት የውስጥ አስተዳደር ስህተት ነው
            success: false, // አልሆነም
            message: 'ቀጠሮ ማጥፋት አልተቻለም', // ማሳወቂያ መልእክት   
            error: error.message // የስህተት መልእክት
        });
    }
};

// Helper function to update status to avoid repetition
const updateStatus = async (id, status, res) => {
    try {
        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'ይህ ቀጠሮ አልተገኘም'
            });
        }

        appointment.status = status;
        await appointment.save();

        res.status(200).json({
            success: true,
            data: appointment,
            message: `ቀጠሮው ወደ '${status}' በተሳካ ሁኔታ ተቀይሯል!`
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'የቀጠሮውን ሁኔታ ማስተካከል አልተቻለም',
            error: error.message
        });
    }
};

// ቀጠሮን ማረጋገጥ (Confirm)
exports.confirmAppointment = async (req, res) => {
    await updateStatus(req.params.id, 'Confirmed', res);
};

// ቀጠሮን መሰረዝ (Cancel)
exports.cancelAppointment = async (req, res) => {
    await updateStatus(req.params.id, 'Cancelled', res);
};

// @desc    ለተወሰነ ቀን የተያዙትን ሰዓቶች ለማምጣት
// @route   GET /api/appointments/booked-slots
// @access  Public (can be protected if needed)
exports.getBookedSlots = async (req, res) => {
    const { date } = req.query;
    if (!date) {
        return res.status(400).json({ message: 'Date query parameter is required.' });
    }

    try {
        const appointments = await Appointment.find({ date, status: { $ne: 'Cancelled' } });
        const bookedTimeSlots = appointments.map(apt => apt.timeSlot);
        res.status(200).json(bookedTimeSlots);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch booked slots.', error: error.message });
    }
};
