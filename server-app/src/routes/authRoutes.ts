import express from "express";
import { registerUser, loginUser,currentUser,deleteUser,getAllUsers} from "../controllers/authController";

import { protect } from "../middleware/authMiddleware";


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect,currentUser);
router.delete("/delete", protect, deleteUser);
router.get("/all",protect,getAllUsers);
export default router;