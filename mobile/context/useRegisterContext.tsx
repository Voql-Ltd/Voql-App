
import { createContext, ReactNode, useState } from 'react';

interface FormData {
  [key: string]: any;
}
interface VoiceFormData {
  [key: string]: any;
}
interface RegisterContextType {
  formData: FormData;
  setFormData: (data: FormData) => void;
  step: number;
  setStep: (step: number) => void;
  voiceFormData: VoiceFormData;
  setVoiceFormData: (data: VoiceFormData) => void;
  otp: string;
  setOtp: (otp: string) => void;
  file: FormData;
  setFile: (file: FormData) => void;
}

export const RegisterContext = createContext<RegisterContextType>(
    {
        formData: {},
        setFormData: () => {},
        step: 0,
        setStep: () => {},
        voiceFormData:{},
        setVoiceFormData:()=>{},
        otp: '',
        setOtp: () => {},
        file:{},
        setFile: () => {},
    }
)

interface RegisterContextComponentProps {
  children: ReactNode;
}

export default function RegisterContextComponent(
    {children}: RegisterContextComponentProps){ 
    const [formData, setFormData]= useState<FormData>({})
    const [step, setStep ]= useState<number>(0)
    const [voiceFormData, setVoiceFormData]= useState<FormData>({})
    const [otp, setOtp] = useState<string>('');
    const [file, setFile] = useState<FormData>({});

    return(
        <RegisterContext.Provider value={{
           formData, setFormData, step, setStep,
           voiceFormData, setVoiceFormData,
           otp, setOtp,
           file, setFile
        }}>
            {children}
        </RegisterContext.Provider>
    )
}

