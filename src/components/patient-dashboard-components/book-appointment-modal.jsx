import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Calendar, Modal, notification } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import {
  getDoctorSchedule,
  createBooking,
  getPatientBookings,
} from "../../services/api";

export default function BookAppointmentModal({
  isModalOpen,
  setIsModalOpen,
  doctorId,
}) {
  const [api, contextHolder] = notification.useNotification();
  const [selectedDay, setSelectedDay] = useState(null);
  const [calendarValue, setCalendarValue] = useState(dayjs());
  const [availableDays, setAvailableDays] = useState(new Set());
  const [availableMap, setAvailableMap] = useState({});
  const [dayIntervals, setDayIntervals] = useState([]);
  const [selectedInterval, setSelectedInterval] = useState(null);

  const today = dayjs();
  const maxDate = today.add(4, "month").endOf("month");

  function resetState() {
    setSelectedDay(null);
    setCalendarValue(dayjs());
    setDayIntervals([]);
    setSelectedInterval(null);
  }

  function handleModalClose() {
    setIsModalOpen(false);
    resetState();
  }

  useEffect(() => {
    if (!isModalOpen || !doctorId) return;

    resetState();

    const fetchData = async () => {
      try {
        const [availableData, bookingsData] = await Promise.all([
          getDoctorSchedule(doctorId),
          getPatientBookings("upcoming"),
        ]);

        const bookedIds = new Set(bookingsData.items.map((b) => b.slot.id));

        const filtered = availableData.filter(
          (interval) => !bookedIds.has(interval.id),
        );

        const availableSet = new Set(filtered.map((d) => d.date));

        const map = {};

        filtered.forEach((d) => {
          if (!map[d.date]) map[d.date] = [];
          map[d.date].push(d);
        });

        setAvailableDays(availableSet);
        setAvailableMap(map);
      } catch (err) {
        console.error("Error fetching booking data:", err);
      }
    };

    fetchData();
  }, [isModalOpen, doctorId]);

  function goPrevMonth() {
    if (calendarValue.isAfter(today, "month")) {
      setCalendarValue((prev) => prev.subtract(1, "month"));
      setSelectedDay(null);
      setDayIntervals([]);
      setSelectedInterval(null);
    }
  }

  function goNextMonth() {
    const next = calendarValue.add(1, "month");
    if (next.startOf("month").isAfter(maxDate)) return;

    setCalendarValue(next);
    setSelectedDay(null);
    setDayIntervals([]);
    setSelectedInterval(null);
  }

  function disabledDate(current) {
    if (!current) return false;

    const dateStr = current.format("YYYY-MM-DD");

    if (current < today.startOf("day")) return true;
    if (current > maxDate) return true;
    if (!availableDays.has(dateStr)) return true;

    return false;
  }

  function handleSelect(date) {
    const key = date.format("YYYY-MM-DD");

    setSelectedDay(date);
    setCalendarValue(date);
    setDayIntervals(availableMap[key] || []);
    setSelectedInterval(null);
  }

  async function handleConfirm() {
    try {
      if (!selectedInterval) return;

      await createBooking(selectedInterval.id);

      api.success({
        title: "Appointment Confirmed",
        description: "Your appointment has been booked successfully.",
        placement: "bottomLeft",
        duration: 3,
      });

      handleModalClose();
    } catch (err) {
      console.error(err);
      api.error({
        title: "Failed to Confirm Appointment",
        description:
          "There was an error booking your appointment. Please try again.",
        placement: "bottomLeft",
        duration: 3,
      });
    }
  }

  return (
    <Modal
      className="book-apointment-modal"
      open={isModalOpen}
      centered
      onCancel={handleModalClose}
      footer={[
        <button
          key="confirm"
          type="btn"
          style={{ width: "100%" }}
          onClick={handleConfirm}
          disabled={!selectedInterval}
        >
          Confirm Appointment
        </button>,
      ]}
    >
      <Calendar
        className={`calendar ${selectedDay ? "has-selected" : ""}`}
        value={calendarValue}
        fullscreen={false}
        disabledDate={disabledDate}
        onPanelChange={(v) => setCalendarValue(v)}
        onSelect={handleSelect}
        headerRender={() => (
          <div className="calendar-header">
            <button
              type="outlined-btn"
              onClick={goPrevMonth}
              disabled={!calendarValue.isAfter(today, "month")}
            >
              <LeftOutlined />
            </button>

            <p className="calendar-title">{calendarValue.format("MMM YYYY")}</p>

            <button
              type="outlined-btn"
              onClick={goNextMonth}
              disabled={calendarValue.endOf("month").isSame(maxDate, "month")}
            >
              <RightOutlined />
            </button>
          </div>
        )}
      />

      {selectedDay && (
        <div className="intervals-container">
          {dayIntervals.map((interval) => {
            const isActive = selectedInterval?.id === interval.id;

            return (
              <button
                key={interval.id}
                type={isActive ? "btn" : "outlined-btn"}
                onClick={() => setSelectedInterval(interval)}
              >
                <span className="time">{interval.timeRange}</span>
                <span className="fee">Consultation fee: ${interval.fee}</span>
              </button>
            );
          })}
        </div>
      )}
      {contextHolder}
    </Modal>
  );
}
