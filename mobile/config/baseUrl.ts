const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://monielog-backend-stagging.onrender.com/api/v1"
      // : "http://localhost:5002";
    // :"http://192.168.153.36:5002";
    : "https://monielog-backend-stagging.onrender.com/api/v1";
 
export default baseURL 