import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../model/userModel";
import generateToken from "../utils/generateToken";

export const registerUser= async (req: Request, res: Response) =>{
    console.log("CREATE URL HIT", req.body, (req as any).user);
    const { name, email, password }= req.body;
    if(!name || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: "User already exists"});
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Hashed Password: ", hashedPassword);
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    console.log(`User created ${user}`);
    res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id)
    });
};

export const loginUser= async (req: Request, res: Response)=> {
    const {email, password } = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: "Email or password is not valid" });
    }

    //compare password with hashepassword
    // const isPasswordMatch = await bcrypt.compare(password, user.password);

    // if (!isPasswordMatch) {
    //     return res.status(401).json({ message: "Email or password is not valid" });
    // }

    // // Login success → send token
    // res.json({
    //     _id: user.id,
    //     name: user.name,
    //     email: user.email,
    //     token: generateToken(user.id)
    // });
    //compare password with hashepassword
    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id)
        });
    }else {
        res.status(401).json({ message: "email or password is not valid" });
    }
};

// interface AuthRequest extends Request {
//   user?: any;
// }
// export const currentUser = async (req: AuthRequest, res: Response) => {
//   res.json(req.user);
// };
export const currentUser = async (req: Request, res: Response) => {
  res.json((req as any).user);
};

export const deleteUser= async (req: Request, res:Response)=>{

    const user= await User.findByIdAndDelete((req as any).user._id);

    if(!user){
        return res.status(404).json({ message: "User not found"});
    }

    res.json({ message: "User deleted successfullly"});
};

export const getAllUsers= async(req: Request, res: Response) =>{
    try {
        //fetch all users, but exclude password
        const users= await User.find().select("_id name email createdAt updatedAt");
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching all users:", error);
        res.status(500).json({ message: "Server error"});
    }
};