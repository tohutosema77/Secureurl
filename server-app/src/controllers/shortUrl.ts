import express  from "express";
import { urlModel } from "../model/shortUrl";
import { nanoid } from "nanoid";
import * as validator from "validator";

export const createUrl = async (req: express.Request,res: express.Response)=>{
    try {
        //attaching a logged-in user

        console.log("The fullurl is:", req.body.fullUrl);
        const { fullUrl } =req.body;
        // URL validation
        if(!validator.isURL(fullUrl, { require_protocol: true })){
            return res.status(400).json({ message: "Invalid URL format"});
        }
        // if (!fullUrl)
        // {
        //     return res.status(400).json({ message: "Full URL is required"});
        // }

        //req.user is set by protect middleware
        //every URL belongs to specific USER
        const userId= (req as any).user._id;

        //check if this user already created this url
        const urlFound= await urlModel.findOne({fullUrl, user: userId});
        // if (urlFound.length > 0)

        if(urlFound){
            // res.status(409);
            // res.send(urlFound);
            return res.status(409).json({
                message: "URL already exists for this user",
                url: urlFound
            });
        }
        
        //Create new short URL

        const shortUrl = nanoid(10);

        const url= await urlModel.create({
            fullUrl,
            shortUrl,
            user: (req as any).user._id
        })
        res.status(201).json(url);
    
        // const shortUrl= await urlModel.create({
        //     fullUrl,
        //     user: userId
        // });

        // res.status(201).json({
        //     fullUrl:shortUrl.fullUrl,
        //     shortUrl:shortUrl.shortUrl,
        //     user:shortUrl.user,
        //     clicks:shortUrl.clicks
        // });
        // } else {
        //     const shortUrl = await urlModel.create({ fullUrl });
        //     res.status(201).send(shortUrl);
        // }

    } catch (error){
        console.error("Error creating short URL:", error);
        res.status(500).send({"message": "Something went wrong"});
    }
};
export const getAllUrl = async (req: express.Request,res: express.Response)=>{
    try {
        const shortUrls = await urlModel.find().sort({ createdAt: -1});
        if (shortUrls.length == 0) {
            res.status(404).send({ message: "Short Urls not found!"});
        } else{
            res.status(200).send(shortUrls);
        }
    } catch (error) {
        res.status(500).send({"message": "Something went wrong"});
    }
};
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
export const getUrl = async (req: express.Request, res: express.Response) => {
    try {
        const url = await urlModel.findById(req.params.id);
        if (!url) return res.status(404).json({ message: "URL not found" });

        // Only owner can view this detail (optional)
        const userId = (req as any).user._id;
        if (!url.user) {
            return res.status(403).json({ message: "No owner assigned, cannot access" });
        }
        if (url.user.toString() !== userId.toString())
            return res.status(403).json({ message: "Not authorized" });

        res.status(200).json(url);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};


// export const deleteUrl = async (req: express.Request,res: express.Response)=>{ 
//     try { 
//         const shortUrl = await urlModel.findByIdAndDelete({_id: req.params.id}); 
//         if (shortUrl) { res.status(200).send({ message: "Requested Url Deleted!"}); } 
//     } catch (error) {
//          res.status(500).send({"message": "Something went wrong"}); 
//     } 
// };

// ------------------- Delete a URL -------------------
export const deleteUrl = async (req: express.Request, res: express.Response) => {
    try {
        const url = await urlModel.findById(req.params.id);
        if (!url) return res.status(404).json({ message: "URL not found" });

        const userId = (req as any).user._id;
        if (!url.user || url.user.toString() !== userId.toString()) {
            return res.status(403).json({ message:  "Not authorized" });
        }
        
        // if (url.user.toString() !== userId.toString())
        //     return res.status(403).json({ message: "Not authorized" });

        await url.deleteOne();
        res.status(200).json({ message: "URL deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

// Get all URLs for the logged-in user
export const getUserUrls = async (req: express.Request,res: express.Response)=>{
    try {
        //req.user is set by the protect middleware
        const userId = (req as any).user._id;

        //Find URLs created by this user
        const urls= await urlModel.find({ user: userId }).sort({ createdAt: -1});

        res.status(200).json(urls);
    } catch (error) {
        console.error("Error fetching user URLs:", error);
        res.status(500).send({"message": "Server error"});
    }
};

///alternative to the above link
// export const getUserUrls = async (req: express.Request, res: express.Response) => {
//     try {

//         const urls = await urlModel.find(); // temporarily get all urls

//         res.status(200).json(urls);

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             message: "Something went wrong"
//         });
//     }
// };
// ------------------- Redirect short URL -------------------
export const redirectShortUrl = async (req: express.Request, res: express.Response) => {
    try {
        const url = await urlModel.findOne({ shortUrl: req.params.shortUrl });
        if (!url) return res.status(404).json({ message: "Short URL not found" });

        url.clicks += 1;
        await url.save();

        res.redirect(url.fullUrl);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};