// import express  from "express";
// import { protect } from "../middleware/authMiddleware";
// import { createUrl, deleteUrl, getAllUrl, getUrl,getUserUrls } from "../controllers/shortUrl";

// const router = express.Router();

// // Create a short URL → attach logged-in user
// router.post("/shortUrl", protect, createUrl);
// // router.post("/shortUrl", createUrl);

// // Get all URLs for the logged-in user (dashboard)
// router.get("/shortUrl/myurls", protect, getUserUrls);

// router.get("/shortUrl", getAllUrl);
// router.get("/shortUrl/:id", getUrl);
// router.delete("/shortUrl/:id", deleteUrl);

// export default router;

import express  from "express";
import { protect } from "../middleware/authMiddleware";
import { createUrl, deleteUrl, getUserUrls, getUrl, getAllUrl, redirectShortUrl  } from "../controllers/shortUrl";

const router = express.Router();

// // Create a short URL → attach logged-in user
// router.post("/shortUrl", protect, createUrl);
console.log("Short URL router loaded");

router.post("/shortUrl", (req, res, next) => {
    console.log("POST /shortUrl HIT", req.body);
    next();
}, protect, createUrl);
// Dashboard → URLs of logged-in user
// router.get("/shortUrl/myurls", getUserUrls);
router.get("/shortUrl/myurls", protect, getUserUrls);
// Optional → all URLs
router.get("/shortUrl", protect, getAllUrl);

// Single URL details (by MongoDB _id)
router.get("/shortUrl/:id", protect, getUrl);

// Delete URL by ID
router.delete("/shortUrl/:id", protect, deleteUrl);

// Public redirect → catch-all last!
router.get("/:shortUrl", redirectShortUrl);

// Optional: get all URLs in the DB (admin use)
// router.get("/shortUrl", protect, getAllUrl);


export default router;