import Navbar from "../../components/Navbar";
import { useAuth } from "../../services/auth/useAuth";
import { useEffect, useState } from "react";
import {
  cancelBooking,
  getPatientBookings,
  getPatientPastBookings,
} from "../../services/api";
import PendingIcon from "@/assets/icons/pending.svg?react";
import ApprovedIcon from "@/assets/icons/approved.svg?react";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { notification, Spin } from "antd";

export default function AppointmentsPage() {
  const [api, contextHolder] = notification.useNotification();
  const { user } = useAuth();
  const [tab, setTab] = useState("upcoming");
  const [bookings, setBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [bookingsMap, setBookingsMap] = useState([]);
  const [loading, setLoading] = useState(true);

  const appointmentsList = bookingsMap.map((booking) => (
    <div key={booking.id} className={"appointment-card"}>
      <div className="date-badge">
        <span className="day">{booking.day}</span>
        <span className="month">{booking.month}</span>
      </div>
      <div className="details">
        <h3 className="doctor-name">
          Dr. {booking.doctor.firstName} {booking.doctor.lastName}
        </h3>
        <p className="doctor-degree">{booking.doctor.degree}</p>
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
      <button className="cancel-btn" onClick={() => handleCancel(booking.id)}>
        Cancel
      </button>
    </div>
  ));

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await getPatientBookings();
        setBookings(data);

        const pastData = await getPatientPastBookings();
        setPastBookings(pastData);

        tab === "upcoming" ? setBookingsMap(data) : setBookingsMap(pastData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [tab]);

  async function handleCancel(id) {
    try {
      await cancelBooking(id);

      api.success({
        message: "Appointment Cancelled",
        description: "Your appointment has been cancelled successfully.",
        placement: "bottomLeft",
        duration: 3,
      });

      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
      api.error({
        message: "Cancellation Failed",
        description: "An error occurred while cancelling your appointment.",
        placement: "bottomLeft",
        duration: 3,
      });
    }
  }

  return (
    <div className="appointments-page-container">
      <Navbar user={user} role="patient" />
      {loading ? (
        <Spin className="loading" size="large" />
      ) : (
        <div className="appointments-page-content container">
          <div className="header">
            <div>
              <h2 className="title">My Appointments</h2>
              <p className="subtitle">
                View and manage your scheduled and past appointments
              </p>
            </div>
            <div className="tabs">
              <button
                type={tab === "upcoming" ? "btn" : "text-btn"}
                className="tab-btn"
                onClick={() => setTab("upcoming")}
              >
                <CalendarOutlined /> Upcoming{" "}
                <span className="tab-value">{bookings.length}</span>
              </button>
              <button
                type={tab === "past" ? "btn" : "text-btn"}
                className="tab-btn"
                onClick={() => setTab("past")}
              >
                <ClockCircleOutlined /> Past{" "}
                <span className="tab-value">{pastBookings.length}</span>
              </button>
            </div>
          </div>

          <div className="appointments-list-container">{appointmentsList}</div>

          {contextHolder}
          {/* <div className="page-summary">
          <div className="summary-card">
            <PendingIcon />
            <div className="details">
              <h3 className="value">2</h3>
              <p className="label">Upcoming</p>
            </div>
          </div>
        </div> */}
        </div>
      )}
    </div>
  );
}
