import { useEffect, useState } from "react";
import { Avatar, Input, Table, Tooltip } from "antd";
import { getAllDoctors } from "../../services/api";
import EditIcon from "@/assets/icons/edit.svg?react";
import {
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import AddNewDoctorModal from "./add-new-doctor-modal";
import EditDoctorModal from "./edit-doctor-modal";
import DeleteDoctorModal from "./delete-doctor-modal";

export default function DoctorsTable() {
  const [searchInput, setSearchInput] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const doctors = await getAllDoctors(searchInput);
        setDoctors(doctors);
      } catch (error) {
        console.error("Failed to load doctors:", error);
      }
    };

    loadDoctors();
  }, [searchInput]);

  const columns = [
    {
      title: "Doctor",
      key: "doctor",
      width: 300,
      fixed: "start",
      render: (_, record) => (
        <div className="doctor-cell">
          <Avatar className="avatar" size={44}>
            {record.firstName[0].toUpperCase()}
            {record.lastName[0].toUpperCase()}
          </Avatar>
          <div>
            <h3 className="name">
              Dr. {record.firstName} {record.lastName}
            </h3>
            <p className="email">{record.email}</p>
          </div>
        </div>
      ),
    },

    {
      title: "Speciality",
      dataIndex: "speciality",
      key: "speciality",
      width: 150,
    },

    {
      title: "degree",
      dataIndex: "degree",
      key: "degree",
      width: 120,
    },

    {
      title: "description",
      dataIndex: "description",
      key: "description",
      width: 120,
      ellipsis: { showTitle: false },
      render: (description) => (
        <Tooltip placement="topLeft" title={description}>
          {description || "-"}
        </Tooltip>
      ),
    },

    {
      title: "Appointments",
      dataIndex: "completedAppointments",
      key: "completedAppointments",
      align: "center",
      width: 120,
      render: (value) => value ?? 0,
    },

    {
      title: "Reviewed X-rays",
      dataIndex: "handledXrays",
      key: "handledXrays",
      align: "center",
      width: 120,
      render: (value) => value ?? 0,
    },

    {
      title: "actions",
      key: "actions",
      align: "center",
      fixed: "end",
      width: 120,
      render: (_, record) => (
        <div className="actions-cell">
          <button
            className="edit-btn"
            onClick={() => {
              setSelectedDoctor(record);
              setIsEditModalOpen(true);
            }}
          >
            <EditIcon />
          </button>
          <button
            className="delete-btn"
            onClick={() => {
              setSelectedDoctor(record);
              setIsDeleteModalOpen(true);
            }}
          >
            <DeleteOutlined />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="doctors-table-container">
      <div className="table-header">
        <div className="text">
          <h2>Doctors</h2>
          <p>
            Manage doctor accounts and view their activity.
            {searchInput}
          </p>
        </div>
        <div className="actions">
          <Input
            id="search-bar"
            className="search-bar"
            size="small"
            prefix={<SearchOutlined />}
            placeholder="Search doctors..."
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="btn" onClick={() => setIsAddDoctorModalOpen(true)}>
            <PlusOutlined /> Add Doctor
          </button>
        </div>

        <AddNewDoctorModal
          isOpen={isAddDoctorModalOpen}
          setIsOpen={setIsAddDoctorModalOpen}
          setDoctors={setDoctors}
        />
      </div>
      <Table
        className="doctors-table"
        rowKey="id"
        columns={columns}
        dataSource={doctors}
        pagination={false}
        scroll={{ x: "max-content", y: 600 }}
      />
      <EditDoctorModal
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        doctor={selectedDoctor}
        setDoctors={setDoctors}
      />
      <DeleteDoctorModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        doctorId={selectedDoctor?.id}
        setDoctors={setDoctors}
      />
    </div>
  );
}
