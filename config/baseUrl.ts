const baseURL =
  process.env.NODE_ENV === "production"
  
    ? "http://10.59.55.198:5001/api/v1"
    //  10.59.55.198
      //k : "http://localhost:5002";
    // :"http://192.168.153.36:5002";
    
    : "http://10.59.55.198:5001/api/v1";
 
export default baseURL 