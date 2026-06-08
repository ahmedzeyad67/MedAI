import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Collapse, Form, Input, notification } from "antd";
import TextArea from "antd/es/input/TextArea";
import ChangePasswordCollapse from "./change-password-collapse";
import {
  changePassword,
  updateDoctorProfile,
  updateUserProfile,
} from "../services/api";

export default function EditProfileForm({
  profileData,
  setProfileData,
  role,
  imgFile,
  isAccountCompleted,
  refreshUser,
}) {
  const [form] = Form.useForm();
  const isLockedOpen = role === "doctor" ? !isAccountCompleted : false;
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsCollapseOpen(isLockedOpen);
  }, [isLockedOpen]);

  const handleSubmit = async (values) => {
    let profilePayload = {
      firstName: values.firstName,
      lastName: values.lastName,
    };
    if (role === "doctor") {
      profilePayload = {
        ...profilePayload,
        description: values.description,
        imgFile,
      };
    }

    const passwordPayload = {
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    };

    try {
      setIsSaving(true);
      setServerError(null);

      role === "doctor"
        ? await updateDoctorProfile(profilePayload)
        : await updateUserProfile(profilePayload);
      if (isCollapseOpen && values.newPassword && values.currentPassword) {
        await changePassword(passwordPayload);
      }

      if (!isAccountCompleted && role === "doctor") {
        await refreshUser();
        navigate("/dashboard", { replace: true });
      }

      api.success({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
        placement: "bottomLeft",
        duration: 3,
      });

      setProfileData({
        ...profilePayload,
        email: profileData.email,
        isAccountCompleted: true,
      });
      form.resetFields(["currentPassword", "newPassword"]);
    } catch (err) {
      console.log("Error updating profile:", err);

      const message =
        err.response?.data?.errors?.message ||
        "Unable to update your profile right now.";
      setServerError(message);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (profileData) {
      form.setFieldsValue({ ...profileData });
    }
  }, [profileData, form]);

  return (
    <>
      <Form
        initialValues={profileData}
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
          <Input />
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
          <Input />
        </Form.Item>

        <Form.Item className="full" name="email" label="E-mail">
          <Input disabled />
        </Form.Item>

        {role === "doctor" && (
          <>
            <Form.Item name="speciality" label="Speciality">
              <Input disabled />
            </Form.Item>

            <Form.Item name="degree" label="Degree">
              <Input disabled />
            </Form.Item>

            <Form.Item
              name="description"
              label="Professional Description"
              className="full"
              rules={[
                {
                  required: true,
                  message: "Please enter your description",
                },
              ]}
            >
              <TextArea
                autoSize={{ minRows: 4 }}
                placeholder={
                  !isAccountCompleted
                    ? "Write a short description about your experience, approach to care, and areas of expertise..."
                    : ""
                }
              />
            </Form.Item>
          </>
        )}

        <ChangePasswordCollapse
          isOpen={isCollapseOpen}
          setIsOpen={setIsCollapseOpen}
          isLockedOpen={isLockedOpen}
        />

        {serverError && <Alert title={serverError} type="error" showIcon />}

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
      {contextHolder}
    </>
  );
}
