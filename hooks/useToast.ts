import Toast from 'react-native-toast-message';


const useToast = () => {
    const NotifySuccess = (message?: string)=> {
        Toast.show({
            type: 'success',
            position: 'bottom',
            text1: message || 'Operation successful',
        });
        
    }

    const NotifyError = (message?: string) => {
        Toast.show({
            type: 'error',
            position: 'bottom',
            text1: message || 'Something went wrong',
        });
    }  

return {
    NotifyError, NotifySuccess
  };
};

export default useToast;
