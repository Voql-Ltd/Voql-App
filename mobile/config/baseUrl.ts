const baseURL =
  process.env.NODE_ENV === "production"
    ? "http://172.22.75.198:5001/api/v1"
      // : "http://localhost:5002";
    // :"http://192.168.153.36:5002";
    : "http://172.22.75.198:5001/api/v1";
 
export default baseURL 