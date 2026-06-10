import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserRole } from "../services/auth/getUserRole";
import { registerUser } from "../services/api";
import LogoIcon from "@/assets/icons/logo.svg?react";
import { Alert, Form, Input } from "antd";

export default function SignupPage() {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const payload = { ...values };
    delete payload.confirmPassword;

    try {
      setServerError(null);
      setIsSubmitting(true);

      const res = await registerUser(payload);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("refreshToken", res.data.refreshToken);

      const role = getUserRole();
      if (!role) {
        localStorage.removeItem("token");
        setServerError("Something went wrong. Please try again.");
        return;
      }
      navigate("/dashboard", { replace: true });

      form.resetFields();
    } catch (err) {
      console.error("Registration failed:", err);

      if (err.response?.status === 409) {
        const message =
          err.response.data?.errors?.message || "User already exists";
        setServerError(message);
      } else {
        setServerError("Signup failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-page-container">
      <div className="header">
        <div className="icon logo-icon">
          <LogoIcon />
        </div>
        <h1>MedAI</h1>
        <p>Create your account</p>
      </div>
      <div className="form-container">
        <div className="form-header">
          <h2 className="title">Get Started</h2>
          <p className="description">
            Create an account to upload and analyze X-rays
          </p>
        </div>
        <Form
          layout="vertical"
          form={form}
          name="register"
          onFinish={onFinish}
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
            <Input placeholder="e.g., John" />
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
            <Input placeholder="e.g., Doe" />
          </Form.Item>

          <Form.Item
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
            <Input placeholder="you@example.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please enter your password!",
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
                message: "Please confirm your password!",
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

          {serverError && <Alert title={serverError} type="error" showIcon />}

          <Form.Item>
            <button type="btn" disabled={isSubmitting}>
              Create Account
            </button>
          </Form.Item>
        </Form>
        <div className="form-footer">
          <p>
            Already have an account? <a href="/login">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
