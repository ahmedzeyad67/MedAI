import { useAuth } from "../services/auth/useAuth";
import Navbar from "../components/Navbar";
import { Avatar, Spin, Upload } from "antd";
import EditProfileForm from "../components/edit-profile-form";
import { useEffect, useState } from "react";
import { CameraOutlined } from "@ant-design/icons";
import noImg from "@/assets/images/no-image.svg";

export default function EditProfilePage() {
  const { user, role, loading, refreshUser } = useAuth();
  const [profileData, setProfileData] = useState();
  const [imgFile, setImgFile] = useState();
  const [imgPreview, setImgPreview] = useState();
  const isAccountCompleted = profileData?.isAccountCompleted;

  useEffect(() => {
    if (user) {
      setProfileData(user);
      setImgFile(user.imageUrl || noImg);
      setImgPreview(user.imageUrl || noImg);
    }
  }, [user]);

  return (
    <div className="edit-profile-page-container">
      {loading ? (
        <Spin className="loading" size="large" />
      ) : (
        <>
          <Navbar user={user} role={role} />

          <div className="edit-profile-page-content container">
            <div className="header">
              <p>Account settings</p>
              <h1>
                {role === "doctor" && !isAccountCompleted
                  ? "Complete Profile"
                  : "Edit Profile"}
              </h1>
              <p>
                {role === "doctor" && !isAccountCompleted
                  ? "Complete your profile information"
                  : "Update your account information"}
              </p>
            </div>

            <div className="info-card">
              {role === "doctor" ? (
                <div className="avatar-wrapper">
                  <Avatar
                    className="avatar"
                    src={imgPreview}
                    size={90}
                    draggable="false"
                  />
                  <Upload
                    className="img-upload"
                    showUploadList={false}
                    beforeUpload={(file) => {
                      setImgFile(file);
                      setImgPreview(URL.createObjectURL(file));
                      return false;
                    }}
                  >
                    <button type="btn">
                      <CameraOutlined />
                    </button>
                  </Upload>
                </div>
              ) : (
                <Avatar size={72} className="avatar">
                  {profileData?.firstName.charAt(0).toUpperCase()}
                </Avatar>
              )}

              <div className="details">
                <h2 className="name">
                  {profileData?.firstName} {profileData?.lastName}
                </h2>
                <p className="email">{profileData?.email}</p>
              </div>
            </div>

            <div className="form-container">
              <EditProfileForm
                role={role}
                refreshUser={refreshUser}
                profileData={profileData}
                setProfileData={setProfileData}
                imgFile={imgFile}
                isAccountCompleted={isAccountCompleted}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
