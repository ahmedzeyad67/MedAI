import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";

export default function PatientAppointmentCard({ booking, tab, handleCancel }) {
  return (
    <div className="appointment-card patient">
      <div className="date-badge">
        <span className="day">{booking.day}</span>
        <span className="month">{booking.month}</span>
      </div>
      <div className="details">
        <div>
          <div>
            <h3 className="doctor-name">
              Dr. {booking.doctor.firstName} {booking.doctor.lastName}
            </h3>
            <p className="doctor-degree">
              {booking.doctor.speciality} • {booking.doctor.degree}
            </p>
          </div>
          <p className="fee-badge">${booking.consultationFee}</p>
        </div>
        <p className="timestamp">
          <span>
            <ClockCircleOutlined /> {booking.startTime} - {booking.endTime}
          </span>
          <span>
            <CalendarOutlined /> {booking.date}
          </span>
          <span className="remaining-days">{booking.remainingDays}</span>
        </p>
      </div>
      {tab === "upcoming" && (
        <button className="cancel-btn" onClick={() => handleCancel(booking.id)}>
          Cancel
        </button>
      )}
    </div>
  );
}
