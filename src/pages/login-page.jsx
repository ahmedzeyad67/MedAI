import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserRole } from "../services/auth/getUserRole";
import { loginUser } from "../services/api";
import LogoIcon from "@/assets/icons/logo.svg?react";
import { Alert, Form, Input } from "antd";

export default function LoginPage() {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setServerError(null);
      setIsSubmitting(true);

      const res = await loginUser(values);
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
      if (err.response?.status === 401) {
        setServerError("Invalid email or password");
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="header">
        <div className="icon logo-icon">
          <LogoIcon />
        </div>
        <h1>MedAI</h1>
        <p>AI-Assisted Lung X-ray Analysis</p>
      </div>
      <div className="form-container">
        <div className="form-header">
          <h2 className="title">Welcome Back</h2>
          <p className="description">
            Enter your credentials to access your account
          </p>
        </div>
        <Form
          layout="vertical"
          form={form}
          name="register"
          onFinish={onFinish}
          size="large"
          scrollToFirstError
          validateTrigger="onSubmit"
        >
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
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please enter your password!",
              },
            ]}
          >
            <Input.Password
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </Form.Item>

          {serverError && <Alert title={serverError} type="error" showIcon />}

          <Form.Item>
            <button type="btn" disabled={isSubmitting}>
              Login
            </button>
          </Form.Item>
        </Form>
        <div className="form-footer">
          <p>
            Don't have an account? <a href="/signup">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
