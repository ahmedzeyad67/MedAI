import { Input, Pagination, Spin } from "antd";
import Navbar from "../components/navbar";
import { useAuth } from "../services/auth/useAuth";
import { useEffect, useState } from "react";
import { getDoctors } from "../services/api";
import PrivateDoctorCard from "../components/private-doctor-card";

export default function BrowseDoctorsPage() {
  const { user, role } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const doctorsList = doctors.map((doctor) => (
    <PrivateDoctorCard key={doctor.id} doctor={doctor} role={role} />
  ));

  useEffect(() => {
    loadDoctors(currentPage, searchInput);
  }, [currentPage, searchInput]);

  const loadDoctors = async (page, searchValue) => {
    try {
      setLoading(true);

      const res = await getDoctors(page, searchValue);
      setDoctors(res.doctors);
      setCurrentPage(res.currentPage);
      setTotal(res.total);
    } catch (err) {
      console.error("Failed to load doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="browse-doctors-page-container">
      <Navbar user={user} role={role} />
      <div className="browse-doctors-page-content container">
        <div className="header">
          <h2 className="title">Find Your Doctor</h2>
          <p className="subtitle">
            Browse expert doctors and book appointments
          </p>
          <Input
            id="search-bar"
            className="search-bar"
            size="large"
            placeholder="Search doctors by name or speciality"
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        {loading ? (
          <Spin className="loading" size="large" />
        ) : (
          <div className="doctors-list-container">
            {doctorsList.length > 0 ? (
              <>
                <div className="doctors-list">{doctorsList}</div>
                <Pagination
                  current={currentPage}
                  total={total}
                  onChange={setCurrentPage}
                  align="center"
                />
              </>
            ) : (
              <p className="no-data">No doctors found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
