import { useEffect, useState } from "react";
import { useAuth } from "../services/auth/useAuth";
import Navbar from "../components/Navbar";
import { notification, Pagination, Spin } from "antd";
import PendingIcon from "@/assets/icons/pending.svg?react";
import CalendarIcon from "@/assets/icons/calendar.svg?react";
import PatientAppointmentCard from "../components/patient-dashboard-components/patient-appointment-card";
import DoctorAppointmentCard from "../components/doctor-dashboard-components/doctor-appointment-card";
import {
  cancelBooking,
  getDoctorAppointments,
  getPatientBookings,
} from "../services/api";

export default function AppointmentsPage() {
  const [api, contextHolder] = notification.useNotification();
  const { user, role } = useAuth();
  const [tab, setTab] = useState("upcoming");
  const [bookingsMap, setBookingsMap] = useState([]);
  const [upcomingTotal, setUpcomingTotal] = useState(0);
  const [pastTotal, setPastTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  function handleTabChange(newTab) {
    setTab(newTab);
    setCurrentPage(1);
  }

  useEffect(() => {
    const loadBookings = async (page, role) => {
      try {
        setLoading(true);

        let data, pastData;

        if (role === "patient") {
          data = await getPatientBookings("upcoming");
          pastData = await getPatientBookings("past");
        }

        if (role === "doctor") {
          data = await getDoctorAppointments(page, "upcoming");
          pastData = await getDoctorAppointments(page, "past");
        }

        tab === "upcoming" ? setBookingsMap(data) : setBookingsMap(pastData);

        setUpcomingTotal(data.total);
        setPastTotal(pastData.total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBookings(currentPage, role);
  }, [tab, currentPage, role]);

  const handleCancel = async (id) => {
    try {
      await cancelBooking(id);

      api.success({
        title: "Appointment Cancelled",
        description: "Your appointment has been cancelled successfully.",
        placement: "bottomLeft",
        duration: 3,
      });

      setBookingsMap((prev) => ({
        ...prev,
        items: prev.items.filter((b) => b.id !== id),
      }));
      tab === "upcoming"
        ? setUpcomingTotal((prev) => prev - 1)
        : setPastTotal((prev) => prev - 1);
    } catch (err) {
      console.error(err);

      api.error({
        title: "Cancellation Failed",
        description: "An error occurred while cancelling your appointment.",
        placement: "bottomLeft",
        duration: 3,
      });
    }
  };

  const patientAppointmentsList = bookingsMap.items?.map((booking) => (
    <PatientAppointmentCard
      key={booking.id}
      booking={booking}
      tab={tab}
      handleCancel={handleCancel}
    />
  ));

  const doctorAppointmentsList = bookingsMap.items?.map((item) => (
    <div key={item.date} className="appointments-day-group">
      <p className="appointments-day-header">{item.date}</p>

      <div className="appointments-cards-list">
        {item.appointments?.map((appointment) => (
          <DoctorAppointmentCard
            key={appointment.id}
            appointment={appointment}
          />
        ))}
      </div>
    </div>
  ));

  return (
    <div className="appointments-page-container">
      <Navbar user={user} role={role} />

      <div className="appointments-page-content container">
        <div className="header">
          <div>
            <h2 className="title">My Appointments</h2>
            <p className="subtitle">
              View and manage your scheduled and past appointments
            </p>
          </div>
          <div className={`tabs ${role}`}>
            <button
              type={tab === "upcoming" ? "btn" : "text-btn"}
              className="tab-btn"
              onClick={() => handleTabChange("upcoming")}
            >
              <CalendarIcon /> Upcoming{" "}
              <span className="tab-value">{upcomingTotal}</span>
            </button>
            <button
              type={tab === "past" ? "btn" : "text-btn"}
              className="tab-btn"
              onClick={() => handleTabChange("past")}
            >
              <PendingIcon /> Past{" "}
              <span className="tab-value">{pastTotal}</span>
            </button>
          </div>
        </div>

        {loading ? (
          <Spin className="loading" size="large" />
        ) : (
          <>
            {bookingsMap.items?.length > 0 ? (
              <>
                {role === "patient" ? (
                  <div className="appointments-list-container">
                    {patientAppointmentsList}
                  </div>
                ) : (
                  <>
                    <div className="appointments-list-container">
                      {doctorAppointmentsList}
                    </div>
                    <Pagination
                      current={currentPage}
                      total={tab === "upcoming" ? upcomingTotal : pastTotal}
                      onChange={setCurrentPage}
                      align="center"
                    />
                  </>
                )}
              </>
            ) : (
              <p className="no-data">{`No ${tab} appointments available.`}</p>
            )}
          </>
        )}
        {contextHolder}
      </div>
    </div>
  );
}
