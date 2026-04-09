import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import checkUserAccountStatus from '../utils/checkUserAccountStatus';
import UserModel from '../model/User';

interface AuthenticatedRequest extends Request {
  user?: any;
}

const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    const { authorization } = req.headers

    if(!authorization) {
        return res.status(401).json( { error: "Authorization token required" } )
    }

    const token = authorization.split(' ')[1]
    
    if(!token) {
        return res.status(401).json( { error: "Invalid authorization token format" } )
    }
    
    try{
        const {_id} = jwt.verify( token, process.env.APP_SECRET_KEY!) as unknown as { _id: string }
       
        let user = await UserModel.findOne({_id}).lean()  

        if (!user) {
          return res.status(401).json({ error: "User not found" });
        }

        const { error: status_error } = checkUserAccountStatus(user.status);
        if (status_error) {
            return res.status(400).json({ error: status_error });
        }
        req.user=user
        next()

    }catch (error) {
        console.log(error)
        res.status(401).json({error: 'Request is not authorized', status:"unauthorized" })
    }

}

export default requireAuth