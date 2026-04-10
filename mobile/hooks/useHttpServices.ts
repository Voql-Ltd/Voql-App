import { baseURL, consolelog } from "@/config";
import axios from "axios";
import { useState } from "react";
import useCookies from "./useCookies";

interface HttpServiceParams {
  path: string;
  body?: any;
  userType?: string;
}

interface ProtectedHttpServiceParams extends HttpServiceParams {
  userType?: string;
}

type UseHttpServicesProps = {
  baseURL?: string;
};

export const useHttpServices = ({
  baseURL: customBaseURL = baseURL,
}: UseHttpServicesProps = {}) => {
  const {getItemInSession}= useCookies()
  const [loading, setLoading] = useState(false);
  
  const postData = async ({path, body}: HttpServiceParams) => {
    consolelog({body, url: `${customBaseURL}/${path}`})
    try {
      setLoading(true);
      const { data } = await axios.post(`${customBaseURL}/${path}`, body);
      return data;
    } catch (e: any) {
      // consolelog(e?.response || e?.response?.data)
      consolelog(e?.response?.data);
      const error=e?.response?.data;
      throw error;
    } finally {
      setLoading(false);
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
      setLoading(true);
      const { data } = await axios.post(`${customBaseURL}/${path}`, body, {headers});
      consolelog(data.status);
      return data
    } catch (e: any) {
        consolelog(e?.response?.data?.error?.message);
        const error=e?.response?.data;
        consolelog(e.response)
        throw error;
    } finally {
      setLoading(false);
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
      setLoading(true);
      const { data } = await axios.put(`${customBaseURL}/${path}`, body, {headers});
      consolelog(data.status);
      return data
    } catch (e: any) {
        consolelog(e?.response?.data?.error?.message);
        const error=e?.response?.data;
        throw error;
    } finally {
      setLoading(false);
    }
  };
  const patchProtectedData = async ({path, body = {}, userType}: ProtectedHttpServiceParams) => {
    consolelog({path})
    let token = await getItemInSession({key: 'access_token'})

    const headers={
      authorization: `Bearer ${userType==="vendor"?token:token}`,
    }
    try {
      setLoading(true);
      const { data } = await axios.patch(`${customBaseURL}/${path}`, body, {headers});
      consolelog(data.status);
      return data
    } catch (e: any) {
        consolelog(e?.response?.data?.error?.message);
        const error=e?.response?.data;
        throw error;
    } finally {
      setLoading(false);
    }
  };
  const deleteProtectedData = async ({path, body = {}, userType}: ProtectedHttpServiceParams) => {
    consolelog({path})
    let token = await getItemInSession({key: 'access_token'})

    const headers={
      authorization: `Bearer ${userType==="vendor"?token:token}`,
    }
    try {
      setLoading(true);
      const { data } = await axios.delete(`${customBaseURL}/${path}`, {headers, data:body});
      consolelog(data.status);
      return data
    }  catch (e: any) {
      consolelog(e?.response?.data?.error?.message);
      const error=e?.response?.data;
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const getProtectedData = async ({path, userType}: {path: string; userType?: string}) => {
    consolelog({path})
    let token = await getItemInSession({key: 'access_token'})

    try {
      setLoading(true);
      const {data}= await axios.get(`${customBaseURL}/${path}`, {
        headers: {
          authorization: `Bearer ${userType==="vendor"?token:token}`,
        },
      });
      return data;
    } catch (error: any) {
      const e=error?.response?.data;
      throw e
    } finally {
      setLoading(false);
    }
  };
  const getData = async ({path}: {path: string}) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${customBaseURL}/${path}`);
      return data;
    } catch (e: any) {
      const error=e?.response?.data;
      throw error;
    } finally {
      setLoading(false);
    }
  };

  
  return {
    loading,
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
