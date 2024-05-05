import jwt from "jsonwebtoken";
import User from '../models/user.js'

export const verifyToken = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token) {
    console.log("No token found in cookies.");
    return res.status(401).json({
      success: false,
      message: "Access token not found. You're not authorize",
    });
  }

  // if token is exist then verify the token
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
    if (err) {
      console.log("Token is invalid");
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    } else {
      console.log("Token is valid");
      console.log("Decoded token:", decoded);
      console.log("User logged in successfully");
      req.user = await User.findOne({ _id: decoded.id });
      next();
    }
  });
};

export const verifyUser = (req, res, next) => {
  console.log('check')
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
