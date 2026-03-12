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
Object.defineProperty(exports, "__esModule", { value: true });
exports.redirectShortUrl = exports.getUserUrls = exports.deleteUrl = exports.getUrl = exports.getAllUrl = exports.createUrl = void 0;
const shortUrl_1 = require("../model/shortUrl");
const createUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //attaching a logged-in user
        console.log("The fullUrl is ", req.body.fullUrl);
        const { fullUrl } = req.body;
        if (!fullUrl) {
            return res.status(400).json({ message: "Full URL is required" });
        }
        //req.user is set by protect middleware
        const userId = req.user._id;
        //check if this user already created this url
        const urlFound = yield shortUrl_1.urlModel.find({ fullUrl, user: userId });
        if (urlFound.length > 0) {
            // res.status(409);
            // res.send(urlFound);
            return res.status(409).json({
                message: "URL already exists for this user",
                url: urlFound
            });
        }
        //Create new short URL
        const shortUrl = yield shortUrl_1.urlModel.create({
            fullUrl,
            user: userId
        });
        res.status(201).json({
            fullUrl: shortUrl.fullUrl,
            shortUrl: shortUrl.shortUrl,
            user: shortUrl.user,
            clicks: shortUrl.clicks
        });
        // } else {
        //     const shortUrl = await urlModel.create({ fullUrl });
        //     res.status(201).send(shortUrl);
        // }
    }
    catch (error) {
        console.error("Error creating short URL:", error);
        res.status(500).send({ "message": "Something went wrong" });
    }
});
exports.createUrl = createUrl;
const getAllUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shortUrls = yield shortUrl_1.urlModel.find().sort({ createdAt: -1 });
        if (shortUrls.length == 0) {
            res.status(404).send({ message: "Short Urls not found!" });
        }
        else {
            res.status(200).send(shortUrls);
        }
    }
    catch (error) {
        res.status(500).send({ "message": "Something went wrong" });
    }
});
exports.getAllUrl = getAllUrl;
// export const getUrl = async (req: express.Request,res: express.Response)=>{
//     try {
//         const shortUrl = await urlModel.findOne({shortUrl: req.params.id});
//         if (!shortUrl) {
//             res.status(404).send({ message: "Full Url not found!"});
//         } else {
//             shortUrl.clicks++;
//             await shortUrl.save();
//             res.redirect(`${shortUrl.fullUrl}`);
//         }
//     } catch (error) {
//         res.status(500).send({"message": "Something went wrong"});
//     }
// };
// ------------------- Get one URL by ID -------------------
const getUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = yield shortUrl_1.urlModel.findById(req.params.id);
        if (!url)
            return res.status(404).json({ message: "URL not found" });
        // Only owner can view this detail (optional)
        const userId = req.user._id;
        if (!url.user) {
            return res.status(403).json({ message: "No owner assigned, cannot access" });
        }
        if (url.user.toString() !== userId.toString())
            return res.status(403).json({ message: "Not authorized" });
        res.status(200).json(url);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.getUrl = getUrl;
// export const deleteUrl = async (req: express.Request,res: express.Response)=>{ 
//     try { 
//         const shortUrl = await urlModel.findByIdAndDelete({_id: req.params.id}); 
//         if (shortUrl) { res.status(200).send({ message: "Requested Url Deleted!"}); } 
//     } catch (error) {
//          res.status(500).send({"message": "Something went wrong"}); 
//     } 
// };
// ------------------- Delete a URL -------------------
const deleteUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = yield shortUrl_1.urlModel.findById(req.params.id);
        if (!url)
            return res.status(404).json({ message: "URL not found" });
        const userId = req.user._id;
        if (!url.user || url.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }
        // if (url.user.toString() !== userId.toString())
        //     return res.status(403).json({ message: "Not authorized" });
        yield url.deleteOne();
        res.status(200).json({ message: "URL deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.deleteUrl = deleteUrl;
// Get all URLs for the logged-in user
const getUserUrls = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //req.user is set by the protect middleware
        const userId = req.user._id;
        //Find URLs created by this user
        const urls = yield shortUrl_1.urlModel.find({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json(urls);
    }
    catch (error) {
        console.error("Error fetching user URLs:", error);
        res.status(500).send({ "message": "Server error" });
    }
});
exports.getUserUrls = getUserUrls;
// ------------------- Redirect short URL -------------------
const redirectShortUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = yield shortUrl_1.urlModel.findOne({ shortUrl: req.params.shortUrl });
        if (!url)
            return res.status(404).json({ message: "Short URL not found" });
        url.clicks += 1;
        yield url.save();
        res.redirect(url.fullUrl);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.redirectShortUrl = redirectShortUrl;
