// src/components/AppointmentList.js
import React from 'react';
import './AppointmentList.css'; // 1. የሲኤስኤስ ፋይሉን እናስገባለን

// ለእያንዳንዱ ቀጠሮ ዝርዝር መረጃዎችን የያዘ ሠንጠረዥ ለመፍጠር
function AppointmentList({ appointments, t }) {
  return (
    <div className="appointment-list-container">
      {appointments.length === 0 ? (
        <p className="no-appointments">{t.noAppointments}</p>
      ) : (
        <div className="table-wrapper">
            <table className="appointments-table">
                <thead>
                    <tr>
                        <th>{t.tableHeaderDate}</th>
                        <th>{t.tableHeaderTime}</th>
                        <th>{t.tableHeaderClient}</th>
                        <th>{t.tableHeaderPhone}</th>
                        <th>{t.tableHeaderService}</th>
                        <th>{t.tableHeaderPrice}</th>
                        <th>{t.tableHeaderSpecialist}</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map((app) => (
                        <tr key={app._id}>
                            <td>{new Date(app.date).toLocaleDateString()}</td>
                            <td>{app.startTime}</td>
                            <td>{app.client?.name || 'N/A'}</td>
                            <td>{app.client?.phone || 'N/A'}</td>
                            <td>{app.service?.name || 'N/A'}</td>
                            <td>{app.service?.price ? `${app.service.price} ${t.priceUnit}` : 'N/A'}</td>
                            <td>{app.specialist?.name || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      )}
    </div>
  );
}

export default AppointmentList;