import { StarFilled } from "@ant-design/icons";
import noImg from "@/assets/images/no-image.svg";

export default function PublicDoctorCard({ doctor }) {
  const ratings = [4, 5, 4];
  const numOfRatings = ratings?.length;
  const rating =
    (ratings?.reduce((total, num) => total + num, 0) / numOfRatings).toFixed(
      1,
    ) || 0;

  return (
    <div className="doctor-card">
      <div className="img-container">
        <img
          src={doctor.imageUrl || noImg}
          alt="doctor's img"
          draggable="false"
          onError={(e) => {
            e.currentTarget.src = noImg;
          }}
        />
      </div>
      <h3 className="name">
        Dr. {doctor.firstName} {doctor.lastName}
      </h3>
      <p className="speciality">{doctor.speciality}</p>
      <div className="review-summary">
        <div className="degree">{doctor.degree}</div>
        <div className="rating">
          <StarFilled style={{ color: "#0053b3" }} /> <span>{rating}</span> (
          {numOfRatings})
        </div>
      </div>
    </div>
  );
}
