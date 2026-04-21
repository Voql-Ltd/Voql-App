import { consolelog } from "@/config";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { useState } from "react";

type UseSingleFileProps = {
 
  CLOUD_NAME?: string;
  UPLOAD_PRESET?: string;
};
interface AudioChunk {
  data: any;
  text: string;
  timestamp: number;
  duration: number;
  uploaded?: boolean;
  transcription?: string;
}



export const useSingleFile = ({
  CLOUD_NAME="greyhairedgallery",
  UPLOAD_PRESET='voql-test-8b2d-5bfff0e05162',
}: UseSingleFileProps) => {
  const [loading, setLoading] = useState(false);

  const [file, setFile]= useState<any>({});
  
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setFile(result.assets[0]);
      return result.assets[0];
    }

    return null;
  };

const uploadToVoiceCloudinary = async (
  chunk: AudioChunk,
  chunkIndex: number
): Promise<{ voiceUrl?: string; error?: string; delete_token?: string }> => {
  const target = chunk.data; // base64 data URL string
  if (!target) return { error: "No file selected" };
  // consolelog({target})
  return {voiceUrl: target}
  const formData = new FormData();
  formData.append("file", target); // data:audio/wav;base64,...
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("resource_type", "video");
  // Remove resource_type from formData — it belongs in the URL only
  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    // Log the ACTUAL response body, not the Response object
    consolelog({ upload_data: data });

    if (!res.ok) {
      // This will now show you the real Cloudinary error message
      return { error: data?.error?.message || "Upload failed" };
    }

    return {
      voiceUrl: data.secure_url,
      delete_token: data.delete_token,
    };
  } catch (error) {
    consolelog({ error });
    return { error: "Something went wrong" };
  }
};

  // const uploadToCloudinary = async (overrideFile?: any) => {
  //   const target = overrideFile || file;
  //   if (!target) return { error: "No file selected" };

  //   const formData = new FormData();

  //   formData.append("file", {
  //     uri: target.uri,
  //     type: target.mimeType || "image/jpeg",
  //     name: target.fileName || "upload.jpg",
  //   } as any);

  //   formData.append("upload_preset", UPLOAD_PRESET);

  //   try {
  //     setLoading(true);

  //     const res = await fetch(
  //       `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
  //       {
  //         method: "POST",
  //         body: formData,
  //       }
  //     );

  //     const data = await res.json();

  //     if (!res.ok) return { error: "Upload failed" };

  //     return {
  //       imageUrl: data.secure_url,
  //       delete_token: data.delete_token,
  //     };
  //   } catch(e) {
  //     consolelog({e})
  //     return { error: "Something went wrong" };
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return {
    loading,
    pickImage, file,
    // uploadFile:uploadToCloudinary,
    uploadVoice:uploadToVoiceCloudinary
  };
};

export default useSingleFile;