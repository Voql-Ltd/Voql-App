import { consolelog } from '@/config';
import * as SecureStore from 'expo-secure-store';

type StorageType = 'secure' | 'local';

const useCookies = () => {

  const storeItemInSession = async ({
    key,
    val,
    storageType = 'secure',
    ttl 
  }: {
    key: string;
    val: any;
    storageType?: StorageType;
    ttl?: number; 
  }) => {

    const item = {
      value: val,
      expiry: ttl ? Date.now() + ttl : null
    };

    const stringify = JSON.stringify(item);

    if (storageType === 'local') {
      localStorage.setItem(key, stringify);
    } else {
      await SecureStore.setItemAsync(key, stringify);
    }

    return { key, val };
  };


  const getItemInSession = async ({
    key,
    storageType = 'secure'
  }: {
    key: string;
    storageType?: StorageType;
  }): Promise<any> => {

    let jsonData: string | null;

    if (storageType === 'local') {
      jsonData = localStorage.getItem(key);
    } else {
      jsonData = await SecureStore.getItemAsync(key);
    }

    if (!jsonData) return null;

    try {
      const parsed = JSON.parse(jsonData);
      if (!parsed?.expiry && parsed?.value === undefined) {
        return parsed;
      }

      if (parsed.expiry && Date.now() > parsed.expiry) {
        await deleteItemInSession({ key, storageType });
        return null;
      }

      return parsed.value;

    } catch (err) {
      consolelog({ err });
      return null;
    }
  };


  const deleteItemInSession = async ({
    key,
    storageType = 'secure'
  }: {
    key: string;
    storageType?: StorageType;
  }) => {

    if (storageType === 'local') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  };

  return {
    getItemInSession,
    storeItemInSession,
    deleteItemInSession
  };
};

export default useCookies;