import { useEffect, useState } from "react";
import { Alert, Form, Input, Modal, notification } from "antd";
import { editDoctor } from "../../services/api";

export default function EditDoctorModal({
  isOpen,
  setIsOpen,
  doctor,
  setDoctors,
}) {
  const [form] = Form.useForm();
  const [serverError, setServerError] = useState(null);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (doctor) {
      form.setFieldsValue(doctor);
    }
  }, [doctor, form]);

  function handleCancel() {
    setIsOpen(false);
    form.resetFields();
  }

  const handleSubmit = async (values) => {
    const payload = { ...values };
    delete payload.firstName;
    delete payload.lastName;

    try {
      setServerError(null);

      await editDoctor(doctor.id, payload);
      setDoctors((prev) =>
        prev.map((d) => (d.id === doctor.id ? { ...d, ...payload } : d)),
      );

      setIsOpen(false);
      form.resetFields();
      api.success({
        title: "Doctor Edited",
        description: "The doctor has been edited successfully.",
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
        title="Edit Doctor"
        className="edit-doctor-modal"
        centered
        open={isOpen}
        onCancel={handleCancel}
        footer={
          <div className="action-buttons">
            <button type="text-btn" onClick={handleCancel}>
              Cancel
            </button>
            <button type="btn" onClick={form.submit}>
              Edit Doctor
            </button>
          </div>
        }
      >
        <p className="description">Update the doctor's information.</p>
        <Form
          initialValues={doctor}
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
            name="firstName"
            label="First Name"
            rules={[
              {
                required: true,
                message: "Please enter doctor's first name",
              },
              { min: 3, message: "Name must be at least 3 characters" },
              { max: 25, message: "Name cannot exceed 25 characters" },
            ]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[
              {
                required: true,
                message: "Please enter doctor's last name",
              },
              { min: 3, message: "Name must be at least 3 characters" },
              { max: 25, message: "Name cannot exceed 25 characters" },
            ]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            className="full"
            rules={[
              {
                required: true,
                message: "Please enter doctor's email",
              },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="speciality"
            label="Speciality"
            rules={[
              {
                required: true,
                message: "Please enter doctor's speciality",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="degree"
            label="Degree"
            rules={[
              {
                required: true,
                message: "Please enter doctor's degree",
              },
            ]}
          >
            <Input />
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
