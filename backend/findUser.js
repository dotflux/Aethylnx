import { userModel } from "./models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const findUser = async (req, res) => {
  const token = req.cookies.userToken;
  if (!token) {
    return res.status(404).json({ valid: false, error: "Token Not Found" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return res.status(400).json({ valid: false, error: "Invalid Token" });
    }
    const searchQuery = req.body.searchQuery;

    if (!searchQuery) {
      console.log(searchQuery);
      return res
        .status(402)
        .json({ valid: false, error: "Search query cant be empty" });
    }
    if (searchQuery.length > 10) {
      return res.status(402).json({
        valid: false,
        error: "Usernames are not longer than 10 characters",
      });
    }

    const user = await userModel.findOne({ username: searchQuery });
    if (!user) {
      return res
        .status(401)
        .json({ valid: false, error: "No such username exists" });
    }

    if (user.userId === decoded.id) {
      return res
        .status(403)
        .json({ valid: false, error: "Can't search yourself" });
    }

    const demander = await userModel.findOne({ userId: decoded.id });
    if (!demander) {
      return res
        .status(405)
        .json({ valid: false, error: "Invalid User Id (Refresh The Page)" });
    }

    const searchResults = {
      avatarUrl: user.avatarURL,
      username: user.username,
      displayName: user.displayName,
      id: user._id,
      isBlocked: demander.blockedUsers.includes(user._id),
    };

    return res.status(200).json({
      valid: true,
      message: "User Found",
      searchResults: searchResults,
    });
  } catch (error) {
    console.log("Error in searching user: ", error);
    return res
      .status(500)
      .json({ valid: false, error: "Internal Server Error" });
  }
};
