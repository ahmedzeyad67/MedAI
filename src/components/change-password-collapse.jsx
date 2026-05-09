import { Form, Input, Collapse } from "antd";
import LockIcon from "@/assets/icons/lock.svg?react";

export default function ChangePasswordCollapse({
  isOpen,
  setIsOpen,
  isLockedOpen,
}) {
  const [form] = Form.useForm();

  const collapseItems = [
    {
      key: "1",
      label: (
        <>
          <LockIcon className="lock-icon" /> Change Password
        </>
      ),
      children: (
        <>
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
                  const currentPassword = form.getFieldValue("currentPassword");

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
        </>
      ),
    },
  ];

  return (
    <Collapse
      ghost
      expandIconPlacement="end"
      className="change-password-collapse full"
      items={collapseItems}
      activeKey={isOpen ? ["1"] : []}
      onChange={(keys) => {
        if (isLockedOpen) return;
        setIsOpen(keys.length > 0);
      }}
      destroyOnHidden
    />
  );
}
