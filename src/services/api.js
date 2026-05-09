import axios from "axios";

function formatTime(time) {
  const [hours, minutes] = time.split(":");

  const date = new Date();
  date.setHours(hours, minutes);

  return date
    .toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .toUpperCase();
}

function formatDate(dateStr, type) {
  const date = new Date(dateStr);

  if (type === "short") {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  if (type === "long") {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
}

function getDayAndMonth(dateStr) {
  const date = new Date(dateStr);

  return {
    day: date.getDate(),
    month: date.toLocaleString("en-US", { month: "short" }),
  };
}

function getRemainingDaysDiff(date) {
  const now = new Date();
  const [year, month, day] = date.split("-").map(Number);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(year, month - 1, day);
  const daysDiff = Math.round((targetDay - today) / (1000 * 60 * 60 * 24));
  return daysDiff;
}

function getRemainingDaysLabel(daysDiff) {
  if (daysDiff === 0) return "today";
  if (daysDiff === 1) return "tomorrow";
  if (daysDiff > 1) return `in ${daysDiff} days`;
  if (daysDiff === -1) return "yesterday";
  return `${Math.abs(daysDiff)} days ago`;
}

function getImageUrl(path) {
  if (!path) return null;
  return `${import.meta.env.VITE_API_URL}/${path}`;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Automatically attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err),
);

// Handle refresh logic
// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error, token = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) prom.reject(error);
//     else prom.resolve(token);
//   });
//   failedQueue = [];
// };

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (!error.config) return Promise.reject(error);

//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       const token = localStorage.getItem("token");
//       const refreshToken = localStorage.getItem("refreshToken");

//       if (!token || !refreshToken) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("refreshToken");
//         window.location.href = "/";
//         return Promise.reject(error);
//       }

//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({
//             resolve: (newToken) => {
//               originalRequest.headers.Authorization = `Bearer ${newToken}`;
//               resolve(api(originalRequest));
//             },
//             reject,
//           });
//         });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         const res = await axios.post(
//           `${import.meta.env.VITE_API_URL}/Auth/refresh`,
//           {
//             token,
//             refreshToken,
//           },
//         );

//         const newToken = res.data.token;
//         const newRefreshToken = res.data.refreshToken;

//         localStorage.setItem("token", newToken);
//         localStorage.setItem("refreshToken", newRefreshToken);

//         processQueue(null, newToken);

//         originalRequest.headers.Authorization = `Bearer ${newToken}`;
//         return api(originalRequest);
//       } catch (err) {
//         processQueue(err, null);

//         localStorage.removeItem("token");
//         localStorage.removeItem("refreshToken");

//         window.location.href = "/login";
//         return Promise.reject(err);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   },
// );

// Auth API calls
export const registerUser = (data) => api.post("/Auth/register", data);
export const loginUser = (data) => api.post("/Auth/login", data);

// User API calls
export const getUser = async () => {
  try {
    const res = await api.get("/me");
    return res.data;
  } catch (err) {
    console.error("Error fetching user data:", err);
    throw err;
  }
};

export const changePassword = (data) => api.put("/me/change-password", data);

export const updateUserProfile = (data) => api.put("/me/info", data);

// Patient API calls
export const getDoctors = async (pageNumber = 1, searchValue = "") => {
  const res = await api.get("/api/doctors/", {
    params: { pageNumber, pageSize: 10, searchValue },
  });

  const data = res.data;

  const doctors = data.items.map((doctor) => ({
    ...doctor,
    imageUrl: getImageUrl(doctor.imageUrl),
  }));

  return {
    doctors,
    currentPage: data.pageNumber,
    total: data.totalCount,
  };
};

export const getPatientBookings = async (type) => {
  const res = await api.get("/api/Bookings/my-bookings", {
    params: { type },
  });

  const data = res.data;

  const processedBookings = data.items.map((booking) => {
    const { slot } = booking;
    const { day, month } = getDayAndMonth(slot.date);
    const daysDiff = getRemainingDaysDiff(slot.date);

    return {
      ...booking,
      date: formatDate(slot.date, "short"),
      startTime: formatTime(slot.startTime),
      endTime: formatTime(slot.endTime),
      remainingDays: getRemainingDaysLabel(daysDiff),
      day: day,
      month: month,
      consultationFee: slot.consultationFee,
    };
  });

  return { items: processedBookings, total: data.totalCount };
};

export const cancelBooking = async (id) => {
  const res = await api.delete(`/api/Bookings/${id}`);
  return res.data;
};

export const getDoctorSchedule = async (doctorId) => {
  const res = await api.get(`/api/Doctors/${doctorId}/schedule`);

  return res.data
    .filter((item) => item.availableSlots > 0)
    .map((item) => {
      return {
        id: item.id,
        date: item.date,
        timeRange: `${formatTime(item.startTime)} - ${formatTime(item.endTime)}`,
        fee: item.consultationFee,
        availableSlots: item.availableSlots,
      };
    });
};

export const createBooking = async (slotId) => {
  const res = await api.post(`/api/Bookings/${slotId}`);
  return res.data;
};

// Doctor API calls
export const getDoctorProfile = async () => {
  try {
    const res = await api.get("/api/Doctors/me");
    return { ...res.data, imageUrl: getImageUrl(res.data.imageUrl) };
  } catch (err) {
    console.error("Error fetching doctor profile:", err);
    throw err;
  }
};

export const updateDoctorProfile = async (data) => {
  const formData = new FormData();

  formData.append("FirstName", data.firstName);
  formData.append("LastName", data.lastName);
  formData.append("Description", data.description);
  formData.append("Image", data.imgFile);

  const res = await api.put("/api/Doctors/complete-profile", formData);
  return res.data;
};

export const addSchedule = async (payload) => {
  const res = await api.post("/api/Schedules", payload);
  return res.data;
};

export const getSchedule = async () => {
  const res = await api.get("/api/Schedules");

  const data = res.data.map((item) => ({
    ...item,
    date: formatDate(item.date, "long"),
  }));

  const summary = data.reduce(
    (acc, day) => {
      day.slots.forEach((slot) => {
        acc.totalSlots += slot.capacity;
        acc.bookedTotal += slot.bookedCount;
        acc.availableTotal += slot.availableSpots;
      });
      return acc;
    },
    { totalSlots: 0, bookedTotal: 0, availableTotal: 0 },
  );

  return { data, summary };
};

export const updateScheduleCapacity = async (id, newCapacity) => {
  const res = await api.put(`/api/Schedules/${id}/capacity`, { newCapacity });
  return res.data;
};

export const deleteSchedule = async (id) => {
  const res = await api.delete(`/api/Schedules/${id}`);
  return res.data;
};

export const getDoctorAppointments = async (pageNumber = 1, type) => {
  const res = await api.get("/api/Doctors/my-appointments", {
    params: {
      pageNumber,
      pageSize: 10,
      type,
    },
  });

  const data = res.data;

  const processedAppointments = data.items.map((item) => ({
    ...item,
    date: formatDate(item.date, "long"),

    appointments: item.appointments.map((appointment) => ({
      ...appointment,
      startTime: formatTime(appointment.startTime),
      endTime: formatTime(appointment.endTime),
      status: "Upcoming",
    })),
  }));

  return {
    items: processedAppointments,
    currentPage: data.pageNumber,
    total: data.totalCount,
  };
};

export default api;
