import { consolelog } from "@/config";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

type UseSingleFileProps = {
 
  CLOUD_NAME?: string;
  UPLOAD_PRESET?: string;
};

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

  const uploadToCloudinary = async (overrideFile?: any) => {
    const target = overrideFile || file;
    if (!target) return { error: "No file selected" };

    const formData = new FormData();

    formData.append("file", {
      uri: target.uri,
      type: target.mimeType || "image/jpeg",
      name: target.fileName || "upload.jpg",
    } as any);

    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      setLoading(true);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) return { error: "Upload failed" };

      return {
        imageUrl: data.secure_url,
        delete_token: data.delete_token,
      };
    } catch(e) {
      consolelog({e})
      return { error: "Something went wrong" };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    pickImage, file,
    uploadFile:uploadToCloudinary
  };
};

export default useSingleFile;