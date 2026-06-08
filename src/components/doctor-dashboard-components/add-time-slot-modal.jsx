import { useState } from "react";
import dayjs from "dayjs";
import {
  Form,
  DatePicker,
  InputNumber,
  Modal,
  TimePicker,
  Alert,
  notification,
} from "antd";
import { addSchedule } from "../../services/api";

export default function AddTimeSlotModal({
  isModalOpen,
  setIsModalOpen,
  loadSchedules,
}) {
  const [form] = Form.useForm();
  const [serverError, setServerError] = useState(null);
  const [api, contextHolder] = notification.useNotification();
  const disabledDate = (current) => {
    const today = dayjs().startOf("day");
    const minDate = today.add(1, "day");
    const maxDate = dayjs().add(5, "month").endOf("month");
    return current && (current < minDate || current > maxDate);
  };

  function handleCancel() {
    setIsModalOpen(false);
    form.resetFields();
  }

  const handleSubmit = async (values) => {
    try {
      setServerError(null);

      const payload = {
        date: values.date.format("YYYY-MM-DD"),
        startTime: values.timeRange[0].format("HH:mm:ss"),
        endTime: values.timeRange[1].format("HH:mm:ss"),
        consultationFee: values.fee,
        capacity: values.capacity,
      };
      await addSchedule(payload);

      setIsModalOpen(false);
      loadSchedules();
      form.resetFields();
      api.success({
        title: "Time Slot Added",
        description: "The time slot has been added successfully.",
        placement: "bottomLeft",
        duration: 3,
      });
    } catch (error) {
      const description = error?.response?.data?.description;
      if (description) {
        setServerError(description);
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <>
      <Modal
        className="add-time-slot-modal"
        title="Add Time Slot"
        centered
        open={isModalOpen}
        onCancel={handleCancel}
        footer={
          <div className="action-buttons">
            <button type="text-btn" onClick={handleCancel}>
              Cancel
            </button>
            <button type="btn" onClick={form.submit}>
              Add Time Slot
            </button>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          size="large"
          onFinish={handleSubmit}
          onValuesChange={() => {
            if (serverError) setServerError(null);
          }}
          validateTrigger="onSubmit"
          scrollToFirstError
        >
          <Form.Item
            label="Date"
            name="date"
            className="full"
            rules={[{ required: true, message: "Please select a date" }]}
          >
            <DatePicker disabledDate={disabledDate} />
          </Form.Item>

          <Form.Item
            label="Time Range"
            name="timeRange"
            className="full"
            rules={[{ required: true, message: "Please select time range" }]}
          >
            <TimePicker.RangePicker format="HH:mm" />
          </Form.Item>

          <Form.Item
            label="Consultation Fee ($)"
            name="fee"
            rules={[
              { required: true, message: "Enter consultation fee" },
              { type: "number", min: 0, message: "Please enter a valid fee" },
            ]}
          >
            <InputNumber placeholder="Enter fee" />
          </Form.Item>

          <Form.Item
            label="Capacity (patients)"
            name="capacity"
            rules={[
              { required: true, message: "Enter capacity" },
              {
                type: "number",
                min: 1,
                message: "Please enter a valid capacity",
              },
            ]}
          >
            <InputNumber placeholder="Enter capacity" />
          </Form.Item>

          {serverError && (
            <Alert title={serverError} type="error" showIcon className="full" />
          )}
        </Form>
      </Modal>
      {contextHolder}
    </>
  );
}
