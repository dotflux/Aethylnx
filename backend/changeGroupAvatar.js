import { userModel } from "./models/userModel.js";
import { conversationModel } from "./models/conversationModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
import { addSystemMessage } from "./systemMessage.js";

dotenv.config();

export const changeGroupAvatar = async (req, res, io) => {
  if (!req.file) {
    return res.status(400).json({ valid: false, error: "No file uploaded" });
  }
  const userId = req.body.userId;
  const groupId = req.body.groupId;
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
    return res.status(501).json({ valid: false, error: "Invalid User Id" });
  }

  const user = await userModel.findOne({ userId: userId });

  if (!user) {
    return res
      .status(400)
      .json({ valid: false, error: "Internal Server Error (Try Refreshing)" });
  }
  const conversation = await conversationModel.findOne({ _id: groupId });
  if (!conversation) {
    return res.status(400).json({ valid: false, error: "Invalid Parameters" });
  }
  if (!conversation.participants.includes(user._id)) {
    return res.status(400).json({ valid: false, error: "Not a participant" });
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
        if (conversation.groupAvatar) {
          const publicId = conversation.groupAvatar
            .split("/")
            .pop()
            .split(".")[0];
          await cloudinary.uploader.destroy(publicId, {
            resource_type: "image",
          });
        }
        // Find the conv and update their profile picture
        conversation.groupAvatar = imageUrl;
        await conversation.save();

        addSystemMessage(
          conversation._id,
          `${user.username} changed the group avatar`,
          io
        );
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
    console.error("Error in changing group pfp: ", err);
    res.status(500).json({ valid: false, error: "Server error" });
  }
};
