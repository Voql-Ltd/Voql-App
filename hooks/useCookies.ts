import { consolelog } from '@/config';
import * as SecureStore from 'expo-secure-store';
// import { consolelog } from '../src/config';

type StorageType = 'secure' | 'local';

const useCookies = () => {

  const storeItemInSession = async({key, val, storageType = 'secure'}: {key: string; val: any; storageType?: StorageType}) => {
    consolelog({key, val, storageType})
    let stringify= typeof val==='string'?val:JSON.stringify(val)
    
    if (storageType === 'local') {
      localStorage.setItem(key, stringify);
    } else {
      await SecureStore.setItemAsync(key, stringify);
    }
    
    return {key,val}
  };
  
  const getItemInSession= async({key, storageType = 'secure'}: {key: string; storageType?: StorageType}): Promise<any>=>{
    let jsonData: string | null;
    
    if (storageType === 'local') {
      jsonData = localStorage.getItem(key);
    } else {
      jsonData = await SecureStore.getItemAsync(key);
    }
    
    consolelog({jsonData})
    if(jsonData===null) return null
    return typeof jsonData!=='string'?JSON.parse(jsonData):jsonData
  }
  
  const deleteItemInSession=async({key, storageType = 'secure'}: {key: string; storageType?: StorageType})=>{
    if (storageType === 'local') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }
  return {
    getItemInSession, storeItemInSession, deleteItemInSession
  };
};

export default useCookies;
