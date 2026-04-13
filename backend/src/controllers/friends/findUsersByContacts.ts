import { NextFunction, Request, Response } from 'express';

import { AuthenticatedRequest } from '../../middleware/requireAuth';
import UserModel from '../../model/User';
import { normalizePhone } from '../../utils/phoneUtils';

export const findUsersByContacts = async (req: AuthenticatedRequest, res: Response, next:NextFunction ) => {
  try {
    const { phoneNumbers } = req.body;
    const currentUserPhone = req.user.formattedText;
    // console.log(currentUserPhone)
    // const normalizedNumbers = phoneNumbers.map(num => normalizePhoneNumber(num));
    const excludedPhones=[currentUserPhone]
    const normalizedContacts = phoneNumbers
      .map((phone:string) =>
        normalizePhone(phone, {
          defaultCountry: req.user.countryCode 
        })
      )
      .filter(Boolean);

    const matchedUsers = await UserModel.find({
      formattedText: { $in: normalizedContacts.filter((phone:string) => !excludedPhones.includes(phone)) }
    }).lean()

    res.status(200).json({ 
      data:{
        users: matchedUsers, 
      },
      status:'success',
      message:'Users found successfully'
    });

  } catch (error) {
    console.error('Error finding users by contacts:', error);
    next(error);
  }
};
