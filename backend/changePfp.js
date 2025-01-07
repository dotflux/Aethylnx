import { userModel } from "./models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cloudinary from "cloudinary";

dotenv.config();

export const changePfp = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ valid: false, error: "No file uploaded" });
  }
  const { userId } = req.body;
  const token = req.cookies.userToken;
  if (!token) {
    return res
      .status(500)
      .json({ valid: false, error: "Invalid Attempt (Refresh Page)" });
  }
  const decoded = jwt.verify(token, process.env.SECRET_KEY);

  if (!decoded) {
    return res.status(400).json({ valid: false, error: "Invalid Token" });
  }

  if (userId !== decoded.id) {
    return res.status(501).json({ valid: false, message: "Invalid User Id" });
  }

  const user = await userModel.findOne({ userId: userId });

  if (!user) {
    return res
      .status(400)
      .jdon({ valid: false, error: "Internal Server Error (Try Refreshing)" });
  }
  try {
    // Upload the image to Cloudinary
    const result = await cloudinary.v2.uploader.upload_stream(
      { resource_type: "image" },
      async (error, cloudinaryResult) => {
        if (error) {
          console.log("Cloudinary upload error:", error); // Log the error
          return res
            .status(500)
            .json({ valid: false, error: "Error uploading image" });
        }

        // Once uploaded, you get the URL of the image
        const imageUrl = cloudinaryResult.secure_url;

        // Find the user and update their profile picture
        user.avatarURL = imageUrl;
        await user.save();

        // Respond with the updated image URL
        res.status(200).json({
          valid: true,
          message: "Profile picture updated successfully",
          imageUrl,
        });
      }
    );

    result.end(req.file.buffer); // Pass the file buffer to Cloudinary for upload
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
