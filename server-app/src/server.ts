import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./config/dbConfig";
import shortUrl from "./routes/shortUrl";
import authRoutes from "./routes/authRoutes";

dotenv.config();
connectDb();


const port = process.env.PORT || 5001

const app= express();

app.use(
    cors({
        // origin: "http://localhost:3000",
        origin: "http://localhost:3000",
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //this is inbuilt

// debug middleware
app.use((req, res, next) => {
    console.log("Incoming request:", req.method, req.url);
    next();
});


app.use("/api/auth", authRoutes);
app.use("/api/short", shortUrl);

app.listen(port, () =>{
    console.log(`Server started successfully on port : ${port}`);
});