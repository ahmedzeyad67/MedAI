import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Avatar, Form, Input, notification } from "antd";
import Navbar from "../components/Navbar";
import { useAuth } from "../services/auth/useAuth";
import { changePassword } from "../services/api";

export default function EditProfilePage() {
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const [serverError, setServerError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const payload = {
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    };

    try {
      setIsSaving(true);
      setServerError(null);

      await changePassword(payload);
      form.resetFields();
      api.success({
        message: "Password Updated",
        description: "Your password has been updated successfully.",
        placement: "bottomLeft",
        duration: 3,
      });
    } catch (err) {
      console.log("Error updating password:", err);

      const message =
        err.response?.data?.errors?.message ||
        "Unable to update your password right now.";
      setServerError(message);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (user) {
      form.setFieldsValue({ ...user });
    }
  }, [user, form]);

  return (
    <div className="edit-profile-page-container">
      <Navbar user={user} role={role} />

      <div className="edit-profile-page-content container">
        <div className="header">
          <p>Account settings</p>
          <h1>Edit Profile</h1>
          <p>Update your account information</p>
        </div>

        <div className="info-card">
          <Avatar size={72} className="avatar">
            {user?.firstName.charAt(0).toUpperCase()}
          </Avatar>

          <div className="details">
            <h2 className="name">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="email">{user?.email}</p>
          </div>
        </div>

        <div className="form-container">
          <Form
            initialValues={user}
            layout="vertical"
            form={form}
            name="edit-profile"
            onFinish={handleSubmit}
            onValuesChange={() => {
              if (serverError) setServerError(null);
            }}
            size="large"
            scrollToFirstError
            validateTrigger="onSubmit"
          >
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[
                {
                  required: true,
                  message: "Please enter your first name",
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
                  message: "Please enter your last name",
                },
                { min: 3, message: "Name must be at least 3 characters" },
                { max: 25, message: "Name cannot exceed 25 characters" },
              ]}
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              className="full"
              name="email"
              label="E-mail"
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                {
                  required: true,
                  message: "Please enter your E-mail!",
                },
              ]}
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              name="currentPassword"
              label="Current Password"
              rules={[
                {
                  required: true,
                  message: "Please enter your current password",
                },
              ]}
            >
              <Input.Password
                placeholder="Enter your current password"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="New Password"
              dependencies={["currentPassword"]}
              rules={[
                {
                  required: true,
                  message: "Please enter your new password",
                },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();

                    const strongPassword =
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()[\]{}\-_+=~`|:;"'<>,./?])[A-Za-z\d!@#$%^&*()[\]{}\-_+=~`|:;"'<>,./?]{8,}$/;
                    const currentPassword =
                      form.getFieldValue("currentPassword");

                    if (currentPassword && value === currentPassword) {
                      return Promise.reject(
                        new Error(
                          "New password must be different from the current password.",
                        ),
                      );
                    }
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
              <Input.Password
                placeholder="Enter your new password"
                autoComplete="new-password"
              />
            </Form.Item>

            {serverError && (
              <Alert message={serverError} type="error" showIcon />
            )}

            <div className={`form-actions ${serverError ? "" : "full"}`}>
              <button
                type="button"
                className="outlined-btn"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/dashboard", { replace: true });
                }}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button type="submit" className="btn" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </Form>
        </div>
      </div>
      {contextHolder}
    </div>
  );
}
