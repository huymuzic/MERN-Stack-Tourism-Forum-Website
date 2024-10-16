import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const verifyToken = async (req, res, next) => {
  const token =
    req.cookies.accessToken ||
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token not found. You're not authorize",
    });
  }
  try {
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
        if (err) {
          reject(err);
        } else {
          resolve(decodedToken);
        }
      });
    });
    const rememberMe = decoded.exp ? true : false;
    // Fetch the user object from the database based on the decoded user ID
    const userObject = await User.findOne({ _id: decoded.id });
    // Attach the user object to the request for further processing
    req.user = userObject;
    req.rememberMe = rememberMe;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};

export const verifyStatusChange = async (req, res, next) => {
  await verifyToken(req, res, async () => {
    if (req.user || req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "You're not authenticated to change the status",
      });
    }
  });
};
export const verifyUser = async (req, res, next) => {
  await verifyToken(req, res, async () => {
    if ((req.user && req.user.status === "active" ) || (req.user.role === "admin" && req.user.status === "active") ) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive, please active it.",
      });
    }
  });
};
  export const verifyAdmin = async (req, res, next) => {
    await verifyToken(req, res, async () => {
      if (req.user && req.user.role === "admin" && req.user.status === "active") {
        next();
      } else {
        return res.status(403).json({
          success: false,
          message: "You're not authorized to this page, just admin can!",
        });
      }
    });
  };
