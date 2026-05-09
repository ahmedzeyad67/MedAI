import { ClockCircleOutlined } from "@ant-design/icons";

export default function DoctorAppointmentCard({ appointment }) {
  return (
    <div className="appointment-card doctor">
      <div className="time-badge">
        <ClockCircleOutlined /> {appointment.startTime.slice(0, 5)}
      </div>
      <div className="details">
        <h3 className="patient-name">
          {appointment.patientFirstName} {appointment.patientLastName}
        </h3>
        <p className="patient-email">{appointment.patientEmail}</p>
        <p className="timestamp">
          <span>
            <ClockCircleOutlined /> {appointment.startTime} -{" "}
            {appointment.endTime}
          </span>
        </p>
      </div>
      <div className={`status-badge ${appointment.status.toLowerCase()}`}>
        {appointment.status}
      </div>
    </div>
  );
}
