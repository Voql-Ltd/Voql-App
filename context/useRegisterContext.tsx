
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
}

export const RegisterContext = createContext<RegisterContextType>(
    {
        formData: {},
        setFormData: () => {},
        step: 0,
        setStep: () => {},
        voiceFormData:{},
        setVoiceFormData:()=>{}
    }
)

interface RegisterContextComponentProps {
  children: ReactNode;
}

export default function RegisterContextComponent(
    {children}: RegisterContextComponentProps){ 
    const [formData, setFormData]= useState<FormData>({})
    const [step, setStep ]= useState<number>(2)
    const [voiceFormData, setVoiceFormData]= useState<FormData>({})
    
    return(
        <RegisterContext.Provider value={{
           formData, setFormData, step, setStep,
           voiceFormData, setVoiceFormData
        }}>
            {children}
        </RegisterContext.Provider>
    )
}

