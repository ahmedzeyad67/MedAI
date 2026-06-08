import { Modal, notification } from "antd";
import { deleteDoctor } from "../../services/api";

export default function DeleteDoctorModal({
  isOpen,
  setIsOpen,
  doctorId,
  setDoctors,
}) {
  const [api, contextHolder] = notification.useNotification();

  const handleDelete = async (id) => {
    try {
      await deleteDoctor(id);
      setDoctors((prev) => prev.filter((doctor) => doctor.id !== id));

      setIsOpen(false);
      api.success({
        title: "Doctor Deleted",
        description: "The doctor has been deleted successfully.",
        placement: "bottomLeft",
        duration: 3,
      });
    } catch (error) {
      console.error("Failed to delete doctor:", error);
      api.error({
        title: "Deletion Failed",
        description: "Failed to delete the doctor. Please try again.",
        placement: "bottomLeft",
        duration: 3,
      });
    }
  };

  return (
    <>
      <Modal
        title="Delete this Doctor?"
        className="delete-doctor-modal"
        centered
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        key={doctorId}
        footer={
          <div className="action-buttons">
            <button type="text-btn" onClick={() => setIsOpen(false)}>
              Cancel
            </button>
            <button
              className="delete-btn"
              onClick={() => handleDelete(doctorId)}
            >
              Delete
            </button>
          </div>
        }
      >
        <p className="description">
          This action cannot be undone. The doctor's profile will be permanently
          removed.
        </p>
      </Modal>
      {contextHolder}
    </>
  );
}
