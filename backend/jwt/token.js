import  jwt from 'jsonwebtoken';
import User from '../model/user.model.js';

export const generateTokenAndSaveCookie = async(userId,res) => {
    const token=await jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '10d'});

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',  
        path: "/"
    }
        
    )
    await User.findByIdAndUpdate(userId,{token});
    return token;

}
      
