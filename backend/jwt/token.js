import  jwt from 'jsonwebtoken';
import User from '../model/user.model.js';

export const generateTokenAndSaveCookie = async(userId,res) => {
    try{
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '10d' });

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/',
        });

        await User.findByIdAndUpdate(userId, { token });
        return token;
    }catch(err){
        console.error('Token generation error:', err.stack || err);
        throw err;
    }

}
      
