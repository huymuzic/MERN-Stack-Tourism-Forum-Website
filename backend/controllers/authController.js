import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
// user registration
export const register = async (req, res) => {
  if (!req.body.username || !req.body.email || !req.body.pwd) {
    return res.status(400).send("Missing fields");
  }
  const token = req.body.token;
  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SITE_SECRET}&response=${token}`,
    {
      method: "POST",
    }
  );

  const data = await response.json();

  if (!data.success) {
    return res.status(400).send("reCAPTCHA verification failed");
  }

  const existingUser = await User.findOne({ username: req.body.username });
  if (existingUser) {
    return res.status(400).send("User already exists");
  }

  const existingEmail = await User.findOne({ email: req.body.email });
  if (existingEmail) {
    return res.status(400).send("Email already exists");
  }
  try {
    // hashing password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.pwd, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(200).json({
      success: true,
      message: "User registration successful",
      user: newUser,
    });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({
      success: false,
      message: "Failed to register user. Try again",
    });
  }
};

// user login
export const login = async (req, res) => {
  const { email, pwd, rem } = req.body;
  try {
    const user = await User.findOne({ email: email });
    // if no user is found
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    if (user.status == "locked") {
      return res.status(400).json({
        success: false,
        message: "Your account has been locked, please contact to admin!",
      });
    }
    // if user is found, check password and compare with hashed password

    const checkCorrectPassword = await bcrypt.compare(pwd, user.password);

    // if password is incorrect
    if (!checkCorrectPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect email or password" });
    }

    const { password, role, ...rest } = user._doc;

    // set token in the browser cookies and send the response to the client
    if (rem) {
      const token = jwt.sign(
        { signInTime: Date.now(), id: user._id, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "365d" }
      );
      res
        .cookie("accessToken", token, {
          expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        })
        .status(200)
        .json({
          token,
          data: { ...rest },
          role,
          message: "User logged in successfully",
        });
    }
    if (!rem) {
      const token = jwt.sign(
        { signInTime: Date.now(), id: user._id, role: user.role },
        process.env.JWT_SECRET_KEY
      );
      res
        .cookie("accessToken", token, {
          httpOnly: true,
          expires: 0,
        })
        .status(200)
        .json({
          token,
          data: { ...rest },
          role,
          message: "User logged in successfully",
        });
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to login. Try again",
    });
  }
};

// user logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("accessToken", { httpOnly: true });

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to log out. Try again",
    });
  }
};
