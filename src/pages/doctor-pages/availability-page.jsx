import { useEffect, useState } from "react";
import { useAuth } from "../../services/auth/useAuth";
import {
  deleteSchedule,
  getSchedule,
  updateScheduleCapacity,
} from "../../services/api";
import Navbar from "../../components/navbar";
import { Spin } from "antd";
import PendingIcon from "@/assets/icons/pending.svg?react";
import ApprovedIcon from "@/assets/icons/approved.svg?react";
import SlotsIcon from "@/assets/icons/slots.svg?react";
import { PlusOutlined } from "@ant-design/icons";
import AddTimeSlotModal from "../../components/doctor-dashboard-components/add-time-slot-modal";
import AvailableSlotCard from "../../components/doctor-dashboard-components/available-slot-card";

export default function AvailabilityPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [summary, setSummary] = useState({
    totalSlots: 0,
    availableTotal: 0,
    bookedTotal: 0,
  });
  const summaryCards = [
    {
      icon: SlotsIcon,
      iconColor: "rgb(59, 130, 246)",
      value: summary.totalSlots,
      label: "Total Slots",
    },
    {
      icon: PendingIcon,
      iconColor: "rgb(217, 119, 6)",
      value: summary.availableTotal,
      label: "Available",
    },
    {
      icon: ApprovedIcon,
      iconColor: "rgb(5, 150, 105)",
      value: summary.bookedTotal,
      label: "Booked",
    },
  ];

  const summaryCardsList = summaryCards.map((card, index) => (
    <div className="summary-card" key={index}>
      <card.icon className="icon" style={{ color: card.iconColor }} />
      <div className="details">
        <h3 className="value">{card.value}</h3>
        <p className="label">{card.label}</p>
      </div>
    </div>
  ));

  function calculateSummary(data) {
    return data.reduce(
      (acc, day) => {
        day.slots.forEach((slot) => {
          acc.totalSlots += slot.capacity;
          acc.bookedTotal += slot.bookedCount;
          acc.availableTotal += slot.availableSpots;
        });
        return acc;
      },
      { totalSlots: 0, bookedTotal: 0, availableTotal: 0 },
    );
  }

  const handleEditSave = async (id, newCapacity) => {
    try {
      await updateScheduleCapacity(id, newCapacity);

      setAvailableSlots((prev) => {
        const updated = prev.map((day) => ({
          ...day,
          slots: day.slots.map((slot) =>
            slot.id === id
              ? {
                  ...slot,
                  capacity: newCapacity,
                  availableSpots: newCapacity - slot.bookedCount,
                }
              : slot,
          ),
        }));

        setSummary(calculateSummary(updated));

        return updated;
      });
    } catch (err) {
      console.error("Failed to update schedule capacity", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSchedule(id);

      setAvailableSlots((prev) => {
        const updated = prev
          .map((day) => ({
            ...day,
            slots: day.slots.filter((slot) => slot.id !== id),
          }))
          .filter((day) => day.slots.length > 0);

        setSummary(calculateSummary(updated));

        return updated;
      });
    } catch (err) {
      console.error("Failed to delete schedule", err);
    }
  };

  const availableSlotsList = availableSlots.map(({ date, slots }) => (
    <div className="available-slots" key={date}>
      <h4 className="date">{date}</h4>
      <div className="slots">
        {slots.map((slot) => (
          <AvailableSlotCard
            key={slot.id}
            slot={slot}
            handlers={{ handleDelete, handleEditSave }}
          />
        ))}
      </div>
    </div>
  ));

  const loadSchedules = async () => {
    try {
      setLoading(true);

      const schedules = await getSchedule();
      setAvailableSlots(schedules.data);
      setSummary(schedules.summary);
    } catch (err) {
      console.error("Failed to fetch schedules", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  return (
    <div className="availability-page-container">
      <Navbar user={user} role="doctor" />
      <div className="availability-page-content container">
        <div className="header">
          <div>
            <h2 className="title">Manage Availability</h2>
            <p className="subtitle">
              Set your available time slots for patient bookings
            </p>
          </div>
          <button type="btn" onClick={() => setIsModalOpen(true)}>
            <PlusOutlined /> Add Time Slot
          </button>
          <AddTimeSlotModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            loadSchedules={loadSchedules}
          />
        </div>
        {loading ? (
          <Spin className="loading" size="large" />
        ) : (
          <>
            <div className="page-summary">{summaryCardsList}</div>
            <div className="available-slots-container">
              {availableSlots.length > 0 ? (
                availableSlotsList
              ) : (
                <p className="no-data">No time slots available.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
