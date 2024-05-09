import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const verifyToken = async (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token) {
    console.log("No token found in cookies.");
    return res.status(401).json({
      success: false,
      message: "Access token not found. You're not authorize",
    });
  }

  try {
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
        if (err) {
          console.log("Token is invalid");
          reject(err);
        } else {
          resolve(decodedToken);
          console.log("Token is valid");
          console.log("User logged in successfully");
        }
      });
    });
    // Fetch the user object from the database based on the decoded user ID
    const userObject = await User.findOne({ _id: decoded.id });

    // Attach the user object to the request for further processing
    req.user = userObject;

    next();
  } catch (err) {
    console.log("Token is invalid");
    return res.status(401).json({
      success: false,
      message: "Token is invalid",
    });
  }
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.id === req.params.id || req.user.role === "admin") {
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "You're not authenticated",
      });
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.role === "admin") {
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "You're not authorized",
      });
    }
  });
};
