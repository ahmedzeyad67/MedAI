import { useState } from "react";
import { Alert, Form, Input, Modal, notification } from "antd";
import { addNewDoctor } from "../../services/api";

export default function AddNewDoctorModal({ isOpen, setIsOpen, setDoctors }) {
  const [form] = Form.useForm();
  const [serverError, setServerError] = useState(null);
  const [api, contextHolder] = notification.useNotification();

  function handleCancel() {
    setIsOpen(false);
    form.resetFields();
  }

  const handleSubmit = async (values) => {
    const payload = { ...values };
    delete payload.confirmPassword;

    try {
      setServerError(null);

      await addNewDoctor(payload);
      setDoctors((prev) => [...prev, payload]);

      setIsOpen(false);
      form.resetFields();
      api.success({
        title: "Doctor Added",
        description: "The new doctor has been added successfully.",
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
        title="Add New Doctor"
        className="add-new-doctor-modal"
        centered
        open={isOpen}
        onCancel={handleCancel}
        footer={
          <div className="action-buttons">
            <button type="text-btn" onClick={handleCancel}>
              Cancel
            </button>
            <button type="btn" onClick={form.submit}>
              Add Doctor
            </button>
          </div>
        }
      >
        <p className="description">
          Create a new doctor profile on the system.
        </p>
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
            <Input />
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
            <Input />
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

          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please enter a password",
              },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  const strongPassword =
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()[\]{}\-_+=~`|:;"'<>,./?])[A-Za-z\d!@#$%^&*()[\]{}\-_+=~`|:;"'<>,./?]{8,}$/;
                  if (!strongPassword.test(value)) {
                    return Promise.reject(
                      new Error(
                        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.",
                      ),
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Please confirm password",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="••••••••" />
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
