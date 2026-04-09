import axios from "axios";
// import { baseURL, consolelog } from "../src/config";
import useCookies from "./useCookies";
import { baseURL, consolelog } from "@/config";

interface HttpServiceParams {
  path: string;
  body?: any;
  userType?: string;
}

interface ProtectedHttpServiceParams extends HttpServiceParams {
  userType?: string;
}

const useHttpServices = () => {
  const {getItemInSession}= useCookies()
  
  const postData = async ({path, body}: HttpServiceParams) => {
    consolelog({body,baseURL})
    try {
      const { data } = await axios.post(`${baseURL}/${path}`, body);
      return data;
    } catch (e: any) {
      consolelog(e?.response?.data?.error?.message);
      const error=e?.response?.data;
      throw error;
    } finally {
      
    }
  };
  const postDataWithoutBaseUrl = async ({path,body}: {path: string; body: any}) => {
    try {

      const { data } = await axios.post(`${path}`, body);
      consolelog({data})
      return data;
    } catch (e: any) {
      consolelog(e?.response?.data?.error?.message);
      const error=e?.response?.data;
      throw error;
    } finally {
      
    }
  };
    const getDataWithoutBaseUrl = async ({path}: {path: string}) => {
    try {

      const { data } = await axios.get(`${path}`);
      consolelog({data})
      return data;
    } catch (e: any) {
      consolelog(e?.response?.data?.error?.message);
      const error=e?.response?.data;
      throw error;
    } finally {
      
    }
  };
  const postProtectedData = async ({path, body = {}, userType}: ProtectedHttpServiceParams) => {
    consolelog({path})
    let token = await getItemInSession({key: 'access_token'})
    consolelog({token})
    const headers={
      authorization: `Bearer ${userType==="vendor"?token:token}`,
    }
    try {
      
      const { data } = await axios.post(`${baseURL}/${path}`, body, {headers});
      consolelog(data.status);
      return data
    } catch (e: any) {
        consolelog(e?.response?.data?.error?.message);
        const error=e?.response?.data;
        consolelog(e.response)
        throw error;
    } finally {
      
      
    }
  };
  
  const putProtectedData = async ({path, body = {}, userType}: ProtectedHttpServiceParams) => {
    let token = await getItemInSession({key: 'access_token'})
    consolelog({path, token})

    const headers={
      authorization: `Bearer ${userType==="vendor"?token:token}`,
    }
    consolelog({headers})

    try {
;
      // const response=await axios.put(`${baseUrl}/bootcamps/edit/${btcId}`, formData,{headers})
      const { data } = await axios.put(`${baseURL}/${path}`, body, {headers});
      consolelog(data.status);
      return data
    } catch (e: any) {
        consolelog(e?.response?.data?.error?.message);
        const error=e?.response?.data;
        throw error;
    } finally {
      
      
    }
  };
  const patchProtectedData = async ({path, body = {}, userType}: ProtectedHttpServiceParams) => {
    consolelog({path})
    let token = await getItemInSession({key: 'access_token'})


    const headers={
      authorization: `Bearer ${userType==="vendor"?token:token}`,
    }
    try {

      // const response=await axios.put(`${baseUrl}/bootcamps/edit/${btcId}`, formData,{headers})
      const { data } = await axios.patch(`${baseURL}/${path}`, body, {headers});
      consolelog(data.status);
      return data
    } catch (e: any) {
        consolelog(e?.response?.data?.error?.message);
        const error=e?.response?.data;
        throw error;
    } finally {
      
      
    }
  };
  const deleteProtectedData = async ({path, body = {}, userType}: ProtectedHttpServiceParams) => {
    consolelog({path})
    let token = await getItemInSession({key: 'access_token'})


    const headers={
      authorization: `Bearer ${userType==="vendor"?token:token}`,
    }
    try {

      const { data } = await axios.delete(`${baseURL}/${path}`, {headers, data:body});
      consolelog(data.status);
      return data
    }  catch (e: any) {
      consolelog(e?.response?.data?.error?.message);
      const error=e?.response?.data;
      throw error;
    } finally {
      
      
    }
  };
  const getProtectedData = async ({path, userType}: {path: string; userType?: string}) => {
    consolelog({path})
    let token = await getItemInSession({key: 'access_token'})

    // consolelog({token})
    try {
      // consolelog({token})
      // const { data } 
      const {data}= await axios.get(`${baseURL}/${path}`, {
        headers: {
          authorization: `Bearer ${userType==="vendor"?token:token}`,
        },
      });
      return data;
    } catch (error: any) {
      const e=error?.response?.data;
      throw e
    } finally {
    
    }
  };
  const getData = async ({path}: {path: string}) => {
    try {
      const { data } = await axios.get(`${baseURL}/${path}`);
      
      return data;
    } catch (e: any) {
      // consolelog(error?.response?.status);
      // consolelog(error?.response?.data?.error?.message);
      const error=e?.response?.data;
      throw error;
    } finally {
    }
  };

  
  return {
    postData,
    postProtectedData,
    putProtectedData,
    patchProtectedData,
    getProtectedData,
    deleteProtectedData,
    postDataWithoutBaseUrl,
    getData,
    getDataWithoutBaseUrl
  };
};

export default useHttpServices;
