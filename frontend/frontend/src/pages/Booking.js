// frontend/src/pages/Booking.js
import React, { useState } from 'react'; // ሪአክት እና የሁኔታ ማዋቀሪያ ኢምፖርት
import { createNewAppointment } from '../api/appointmentsApi'; // ከAPI ፋይል የቀጠሮ መፍጠር ፋንክሽን ኢምፖርት

const Booking = () => { // የቀጠሮ ገፅ ኮምፖነንት
    const [formData, setFormData] = useState({  // የቅጽ ውሂብ ለማስቀመጥ ሁኔታ
        name: '', // የደንበኛ ስም (ወደ name ተቀይሯል)
        phone: '', // የደንበኛ ስልክ ቁጥር (ወደ phone ተቀይሯል)
        service: 'Haircut', // የሚፈልጉት አገልግሎት
        date: '',  // ቀጠሮ ቀን
        timeSlot: '10:00 AM' // ቀጠሮ ሰዓት
    });
    const [message, setMessage] = useState(''); // ለመልእክቶች ሁኔታ

    const handleChange = (e) => {  // የቅጽ መለወጥ አስተዳደር
        setFormData({ ...formData, [e.target.name]: e.target.value });  // የቅጽ ውሂብ እንደ ተለዋዋጭ ማድረግ
    };

    const handleSubmit = async (e) => { // የቅጽ ማስገባት አስተዳደር
        e.preventDefault(); // ነባሪ ተግባር መከላከል
        setMessage('በማስያዝ ላይ...'); // ማስያዣ ላይ መልእክት ማድረግ
        try {
            const res = await createNewAppointment(formData);   // አዲስ ቀጠሮ ማስያዣ ፋንክሽን ጥራት
            setMessage(res.data.message); // ከመልስ ውሂብ መልእክት ማድረግ
            // ቅጹን ባዶ ማድረግ
            setFormData({ name: '', phone: '', service: 'Haircut', date: '', timeSlot: '10:00 AM' }); // ቅጹን ባዶ ማድረግ
        } catch (error) {  // ስህተት ካጋጠማ
            setMessage('ስህተት ተፈጥሯል፡ ቀጠሮ ማስያዝ አልተቻለም።');  // ስህተት መልእክት ማድረግ
        }
    };

    return (  // የቀጠሮ ቅጽ ኤልኤምንት
        <div>  
            <h2>የኦንላይን ቀጠሮ ማስያዣ</h2>  {/* የቀጠሮ ቅጽ ርዕስ */}
            <form onSubmit={handleSubmit}>  {/* የቅጽ ማስገባት አስተዳደር */}
                <label>ስም፡</label>  {/* የደንበኛ ስም መለያየት */}
                <input type="text" name="name" value={formData.name} onChange={handleChange} required /> {/* የደንበኛ ስም ግቤት */}
                
                <label>ስልክ ቁጥር:</label> {/* የደንበኛ ስልክ ቁጥር መለያየት */}
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required /> {/* የደንበኛ ስልክ ቁጥር ግቤት */}
                
                <label>አገልግሎት፡</label> {/* የሚፈልጉት አገልግሎት መለያየት */}
                <select name="service" value={formData.service} onChange={handleChange}> {/* የአገልግሎት ምርጫ ግቤት */}
                    <option value="Haircut">ፀጉር መቆረጥ</option> {/* አገልግሎት አማራጭ */}
                    <option value="Manicure">ማኒኪዩር</option> {/* ሌላ አገልግሎት አማራጭ */}
                    {/* ሌሎች አገልግሎቶችን መጨመር ይቻላል */} 
                </select>

                <label>ቀን:</label> {/* ቀጠሮ ቀን መለያየት */}
                <input type="date" name="date" value={formData.date} onChange={handleChange} required /> {/* ቀጠሮ ቀን ግቤት */}

                <label>ሰዓት፡</label> {/* ቀጠሮ ሰዓት መለያየት */}
                <input type="text" name="timeSlot" value={formData.timeSlot} onChange={handleChange} required /> {/* ቀጠሮ ሰዓት ግቤት */}
                
                <button type="submit">አስያዝ</button> {/* የቅጽ ማስገባት አዝራር */}
            </form>
            {message && <p>{message}</p>} {/* መልእክት ከሆነ ማሳያ */}
        </div>
    );
};

export default Booking;  // የቀጠሮ ገፅ ኮምፖነንት ኤክስፖርት