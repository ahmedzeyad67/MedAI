import { useState } from "react";
import { ClockCircleOutlined } from "@ant-design/icons";
import { InputNumber, Progress } from "antd";

export default function AvailableSlotCard({ slot, handlers }) {
  const { handleDelete, handleEditSave } = handlers;
  const [isEdditing, setIsEdditing] = useState(false);
  const [inputValue, setInputValue] = useState(slot.bookedCount);
  const availableSlotsText = () => {
    if (slot.availableSpots === 0) {
      return "No slots available";
    } else if (slot.availableSpots === 1) {
      return "1 slot available";
    } else {
      return `${slot.availableSpots} slots available`;
    }
  };
  const timeInterval = `${slot.startTime.slice(0, 5)} - ${slot.endTime.slice(0, 5)}`;
  const isDeletable = slot.bookedCount === 0;

  return (
    <div className="available-slot-card">
      <div className="info">
        <div className="time-interval">
          <ClockCircleOutlined /> {timeInterval}
        </div>
        <div className="details">
          <div className="details-item">
            <span className="label">Fee</span>
            <span className="value">${slot.consultationFee}</span>
          </div>
          <div className="details-item">
            <span className="label">Capacity</span>
            <span className="value">
              {isEdditing ? (
                <InputNumber
                  mode="spinner"
                  defaultValue={slot.capacity}
                  min={slot.bookedCount}
                  onChange={(value) => setInputValue(value)}
                  size="small"
                />
              ) : (
                slot.capacity + " patients"
              )}
            </span>
          </div>
          <div className="details-item">
            <span className="label">Booked</span>
            <span className="value">
              {slot.bookedCount} / {slot.capacity}
            </span>
          </div>
        </div>
      </div>
      <div className="progress">
        <Progress
          percent={(slot.bookedCount / slot.capacity) * 100 || 0}
          showInfo={false}
          railColor="#0000001f"
          strokeColor="#059669"
        />
        <p>{availableSlotsText()}</p>
      </div>
      {isEdditing ? (
        <div className="action-buttons">
          <button
            className="save-btn"
            onClick={() => {
              handleEditSave(slot.id, inputValue).then(() => {
                setIsEdditing(false);
              });
            }}
          >
            Save
          </button>
          <button className="cancel-btn" onClick={() => setIsEdditing(false)}>
            Cancel
          </button>
        </div>
      ) : (
        <div className="action-buttons">
          <button type="text-btn" onClick={() => setIsEdditing(true)}>
            Edit Capacity
          </button>
          <button
            className="delete-btn"
            type="text-btn"
            disabled={!isDeletable}
            onClick={() => {
              if (isDeletable) handleDelete(slot.id);
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
