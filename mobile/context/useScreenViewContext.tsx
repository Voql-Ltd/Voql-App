import { createContext, ReactNode, useState } from 'react';

interface ScreenViewContextType {
  isScrollOffset: boolean;
  setIsScrollOffset: (offset: boolean) => void;
}

export const ScreenViewContext = createContext<ScreenViewContextType>({
  isScrollOffset: false,
  setIsScrollOffset: () => {}
})

interface ScreenViewContextComponentProps {
  children: ReactNode;
}

export default function ScreenViewContextComponent(
    {children}: ScreenViewContextComponentProps){ 
    const [isScrollOffset, setIsScrollOffset]=useState<boolean>(false)
    return(
        <ScreenViewContext.Provider value={{
           isScrollOffset, setIsScrollOffset
        }}>
            {children}
        </ScreenViewContext.Provider>
    )
}