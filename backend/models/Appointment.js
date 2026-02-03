// backend/models/Appointment.js
const mongoose = require('mongoose'); // ሞንጎው አሰባሰብ ለመጠቀም

const appointmentSchema = new mongoose.Schema({ // የቀጠሮ ስኬታዊ አወቃቀር
    name: { // የደንበኛ ስም
        type: String, // ለምሳሌ 'John Doe'
        required: true, // አስፈላጊ ነው
        trim: true // ቅንጅት ለማድረግ
    },
    phone: { // የደንበኛ ስልክ ቁጥር
        type: String, // ለምሳሌ '+251912345678'
        required: true // አስፈላጊ ነው
    },
    service: { // የቀጠሮ አገልግሎት
        type: String, // ለምሳሌ 'Haircut', 'Manicure', 'Massage'
        required: true // አስፈላጊ ነው
    },
    date: { // የቀጠሮ ቀን
        type: Date, // ለምሳሌ '2024-06-15'
        required: true // አስፈላጊ ነው
    },
    timeSlot: { // የቀጠሮ የሰዓት ሰአት
        type: String, // ለምሳሌ '10:00 AM'
        required: true // አስፈላጊ ነው
    },
    status: { // የቀጠሮ ሁኔታ
        type: String, // ለምሳሌ 'Pending', 'Confirmed', 'Cancelled', 'Completed'
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'], // የሚቀበሉ እርምጃዎች
        default: 'Pending' // ነባሪ እርምጃ
    }
}, { timestamps: true }); // የማዘጋጃ ጊዜና የማሻሻያ ጊዜ መክተት

// አንድ አይነት ቀን እና ሰዓት እንዳይደገም ለማድረግ (Compound Index)
appointmentSchema.index({ date: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', appointmentSchema);  // ሞዴል ላይ ማስተናገድ