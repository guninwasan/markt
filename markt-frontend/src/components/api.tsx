const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://project-1-web-application-design-group15.onrender.com";

export { API_BASE_URL };
