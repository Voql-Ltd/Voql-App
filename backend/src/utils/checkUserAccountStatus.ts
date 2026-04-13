interface StatusResponse {
  error?: {
    message: string;
  };
}

export default function checkUserAccountStatus(status: string): StatusResponse {
    if(status==='active') return {}
    
    if (status==="suspended"){
        return {error:{message:"Your account was suspended"}}
    }
    if (status==="pending"){
        return {error:{message:"Your account has not been verified"}}
    }
    if (status==="non-active"){
        return {error:{message:"Your account has not been activated"}}
    }

    if (status==="revoked"){
        return {error:{message:"Your account was revoked"}}
    }
    
    return {error: {message:"Account has been deleted"}}
}