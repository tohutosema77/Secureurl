"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.deleteUser = exports.currentUser = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userModel_1 = __importDefault(require("../model/userModel"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("CREATE URL HIT", req.body, req.user);
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const userExists = yield userModel_1.default.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }
    //Hash password
    const salt = yield bcryptjs_1.default.genSalt(10);
    const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
    console.log("Hashed Password: ", hashedPassword);
    const user = yield userModel_1.default.create({
        name,
        email,
        password: hashedPassword
    });
    console.log(`User created ${user}`);
    res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: (0, generateToken_1.default)(user.id)
    });
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const user = yield userModel_1.default.findOne({ email });
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
    if (user && (yield bcryptjs_1.default.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: (0, generateToken_1.default)(user.id)
        });
    }
    else {
        res.status(401).json({ message: "email or password is not valid" });
    }
});
exports.loginUser = loginUser;
// interface AuthRequest extends Request {
//   user?: any;
// }
// export const currentUser = async (req: AuthRequest, res: Response) => {
//   res.json(req.user);
// };
const currentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(req.user);
});
exports.currentUser = currentUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findByIdAndDelete(req.user._id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfullly" });
});
exports.deleteUser = deleteUser;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //fetch all users, but exclude password
        const users = yield userModel_1.default.find().select("_id name email createdAt updatedAt");
        res.status(200).json(users);
    }
    catch (error) {
        console.error("Error fetching all users:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getAllUsers = getAllUsers;
