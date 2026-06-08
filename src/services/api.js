import axios from "axios";
import { logout } from "./auth/useLogout";

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

const authPaths = ["/Auth/login", "/Auth/register", "/Auth/refresh"];
let refreshPromise = null;

const isAuthRequest = (url) => authPaths.some((path) => url?.includes(path));

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

// Auth API calls
export const registerUser = (data) => api.post("/Auth/register", data);
export const loginUser = (data) => api.post("/Auth/login", data);
export const refreshToken = (data) => api.post("/Auth/refresh", data);

export const refreshTokens = () => {
  const token = localStorage.getItem("token");
  const refreshTokenValue = localStorage.getItem("refreshToken");

  if (!token || !refreshTokenValue) {
    return Promise.reject(new Error("Missing refresh tokens"));
  }

  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${import.meta.env.VITE_API_URL}/Auth/refresh`, {
        token,
        refreshToken: refreshTokenValue,
      })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        api.defaults.headers.common.Authorization = `Bearer ${res.data.token}`;
        return res.data.token;
      })
      .catch((refreshError) => {
        const status = refreshError?.response?.status;
        if (status === 400 || status === 401) {
          logout();
        }
        throw refreshError;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

// handle refresh token
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (isAuthRequest(originalRequest.url)) {
      return Promise.reject(error);
    }

    // prevent infinite retry loop
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const token = localStorage.getItem("token");
        const refreshToken = localStorage.getItem("refreshToken");

        if (!token || !refreshToken) {
          logout();
          return Promise.reject(error);
        }

        const newToken = await refreshTokens();

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

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
export const getPatientStats = async () => {
  const res = await api.get("/me/dashboard");
  const data = res.data;

  if (data.nextAppointment?.slot) {
    data.nextAppointment.slot = {
      ...data.nextAppointment.slot,
      date: formatDate(data.nextAppointment.slot.date, "short"),
      startTime: formatTime(data.nextAppointment.slot.startTime),
      endTime: formatTime(data.nextAppointment.slot.endTime),
    };
  }

  data.recentAnalysis = data.recentAnalysis.map((item) => ({
    ...item,
    imageUrl: getImageUrl(item.imageUrl),
    creationDateInfo: {
      date: formatDate(item.createdAt, "long"),
      ...getDayAndMonth(item.createdAt),
    },
    confirmationDateInfo: {
      date: formatDate(item.confirmedAt, "long"),
      ...getDayAndMonth(item.confirmedAt),
    },
  }));

  return data;
};

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

export const uploadXray = async (file) => {
  const formData = new FormData();
  formData.append("Image", file);

  const res = await api.post("/api/Xrays/upload", formData);
  return res.data;
};

export const getPatientXrays = async () => {
  const res = await api.get("/api/Xrays/my-history", {
    params: {
      pageNumber: 1,
      pageSize: 100000,
    },
  });

  return {
    ...res.data,
    items: res.data.items.map((item) => ({
      ...item,
      imageUrl: getImageUrl(item.imageUrl),
      creationDateInfo: {
        date: formatDate(item.createdAt, "long"),
        ...getDayAndMonth(item.createdAt),
      },
      confirmationDateInfo: {
        date: formatDate(item.confirmedAt, "long"),
        ...getDayAndMonth(item.confirmedAt),
      },
    })),
  };
};

export const getReviewedXrayDetails = async (xrayId) => {
  const res = await api.get(`/api/Xrays/${xrayId}`);
  const data = res.data;

  return {
    ...data,
    imageUrl: getImageUrl(data.imageUrl),
    creationDateInfo: {
      date: formatDate(data.createdAt, "long"),
      ...getDayAndMonth(data.createdAt),
    },
    confirmationDateInfo: {
      date: formatDate(data.confirmedAt, "long"),
      ...getDayAndMonth(data.confirmedAt),
    },
  };
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

export const getDoctorStats = async () => {
  const res = await api.get("/api/Doctors/dashboard");

  return {
    ...res.data,
    unrevisedList: res.data.unrevisedList.map((item) => ({
      ...item,
      imageUrl: getImageUrl(item.imageUrl),
      date: formatDate(item.createdAt, "long"),
      ...getDayAndMonth(item.createdAt),
      aI_Confidence: Math.round(item.aI_Confidence),
    })),
    todayAppointmentsList: res.data.todayAppointmentsList.map(
      (appointment) => ({
        ...appointment,
        startTime: formatTime(appointment.startTime),
        endTime: formatTime(appointment.endTime),
      }),
    ),
  };
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
    })),
  }));

  return {
    items: processedAppointments,
    currentPage: data.pageNumber,
    total: data.totalCount,
  };
};

export const getUnrevisedXrays = async (pageNumber = 1) => {
  const res = await api.get("/api/Xrays/unrevised", {
    params: {
      pageNumber,
      pageSize: 9,
    },
  });

  return {
    ...res.data,
    items: res.data.items.map((item) => ({
      ...item,
      imageUrl: getImageUrl(item.imageUrl),
      date: formatDate(item.createdAt, "long"),
      ...getDayAndMonth(item.createdAt),
      aI_Confidence: Math.round(item.aI_Confidence),
    })),
  };
};

export const getUnrevisedXrayDetails = async (xrayId) => {
  const res = await api.get(`/api/Xrays/unrevised/${xrayId}`);
  const data = res.data;
  return {
    ...data,
    imageUrl: getImageUrl(data.imageUrl),
    date: formatDate(data.createdAt, "long"),
    ...getDayAndMonth(data.createdAt),
    aI_Confidence: Math.round(data.aI_Confidence),
  };
};

export const getDoctorReviwedXraysHistory = async (pageNumber = 1) => {
  const res = await api.get("/api/Xrays/my-work", {
    params: {
      pageNumber,
      pageSize: 9,
    },
  });

  return {
    ...res.data,
    items: res.data.items.map((item) => ({
      ...item,
      imageUrl: getImageUrl(item.imageUrl),
      date: formatDate(item.confirmedAt, "long"),
      ...getDayAndMonth(item.confirmedAt),
      aI_Confidence: Math.round(item.aI_Confidence),
    })),
  };
};

export const getDoctorReviwedXrayDetails = async (xrayId) => {
  const res = await api.get(`/api/Xrays/my-work/${xrayId}`);
  const data = res.data;

  return {
    ...data,
    imageUrl: getImageUrl(data.imageUrl),
    date: formatDate(data.confirmedAt, "long"),
    ...getDayAndMonth(data.confirmedAt),
    aI_Confidence: Math.round(data.aI_Confidence),
  };
};

export const confirmXrayAnalysis = async (
  xrayId,
  finalDiagnosis,
  doctorNotes,
) => {
  const res = await api.post(`/api/Xrays/${xrayId}/confirm`, {
    finalDiagnosis,
    doctorNotes,
  });

  return res.data;
};

// Admin API calls

export const getAdminStats = async () => {
  const res = await api.get("/api/Admin/dashboard");
  return res.data;
};

export const getAllDoctors = async (searchValue = "") => {
  const res = await api.get("/api/doctors/", {
    params: {
      pageNumber: 1,
      pageSize: 100000,
      searchValue,
    },
  });

  const data = res.data;

  return data.items.map((doctor) => ({
    ...doctor,
    imageUrl: getImageUrl(doctor.imageUrl),
  }));
};

export const addNewDoctor = async (data) => api.post("/api/Doctors", data);

export const editDoctor = async (id, data) =>
  api.put(`/api/Doctors/${id}`, data);

export const deleteDoctor = async (id) => api.delete(`/api/Doctors/${id}`);

export default api;
