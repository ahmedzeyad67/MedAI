import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BookAppointmentModal from "./book-appointment-modal";

export default function PrivateDoctorCard({ doctor, role }) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleBookClick() {
    if (!role) {
      navigate("/login");
      return;
    }

    setIsModalOpen(true);
  }

  return (
    <div className="doctor-card">
      <img
        src={`${doctor.imageUrl || "/src/assets/images/no-image.svg"}`}
        alt="Doctor"
        draggable="false"
      />
      <div className="info">
        <div>
          <h3 className="name">
            Dr. {doctor.firstName} {doctor.lastName}
          </h3>
          <p className="degree">
            {doctor.speciality} • {doctor.degree}
          </p>
        </div>
        <p className="description">{doctor.description}</p>
      </div>
      <button type="btn" className="book-btn" onClick={handleBookClick}>
        Book Appointment
      </button>
      <BookAppointmentModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        doctorId={doctor.id}
      />
    </div>
  );
}
