import User from '../model/user.model.js';
import { z } from 'zod';

import bcrypt from "bcryptjs";
import { generateTokenAndSaveCookie } from '../jwt/token.js';

const userSchema=z.object({
    username: z.string().min(3, { message: "Username must be at least 3 characters long" }).max(20),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6,{ message: "Password must be at least 6 characters long" })
});
export const register= async(req,res)=>{
    try{
        const {username,email,password}= req.body;

        if(!username || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
       const validation=userSchema.safeParse({username,email,password}); 
       if(!validation.success){
        const errors= validation.error.errors.map((err)=> err.message);
        return res.status(400).json({message:errors.join(", ")});
       }

        const user= await User.findOne({email:email});
        if(user){
            return res.status(400).json({message:"User already registered"});
        }


        const hashed = await bcrypt.hash(password, 10);
        const newUser= new User({
            username,
            email,
            password: hashed
        });

        await newUser.save()
        if(newUser){
           const token= await generateTokenAndSaveCookie(newUser._id ,res);
            const userResponse = {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email
            };
            res.status(201).json({message:"User registered successfully",newUser:userResponse,token});
        }
        




    }catch(error){
        console.error('Register error stack:', error.stack || error);
        res.status(500).json({message:"Internal server error"});
    }
};

export const login=async(req,res)=>{
    const {email,password}= req.body;
    try{
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        const user=  await User.findOne({email:email}).select("+password");
        if(!user || !(await bcrypt.compare(password,user.password))){
             return res.status(400).json({message:"Invalid credentials"});
        }

        const token= await generateTokenAndSaveCookie(user._id ,res);
        const userResponse = {
            _id: user._id,
            username: user.username,
            email: user.email
        };
        res.status(200).json({message:"Login successful",user:userResponse,token});

        
    }catch(error){
        console.error('Login error stack:', error.stack || error);
        res.status(500).json({message:"Internal server error"});

    }
}

export const logout=(req,res)=>{
    try{
        res.clearCookie("jwt",{
            path: "/",
        })
        res.status(200).json({message:"Logout successful"});

    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}
