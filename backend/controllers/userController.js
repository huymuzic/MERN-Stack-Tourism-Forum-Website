import User from "../models/user.js";
import bcrypt from "bcrypt";
import { sendOTPEmail, generateAndStoreOTP, checkOTPAndUpdatePassword } from '../utils/otp.js';
import { gfs } from '../utils/gridfsconfig.js'
const saltRounds = 10;
// create new user
export const createUser = async (req, res) => {
  const newUser = new User(req.body);

  try {
    const savedUser = await newUser.save();

    res.status(200).json({
      success: true,
      message: "Sucessfully created a new user",
      data: savedUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create a new user. Try again",
    });
  }
};

// update user
export const updateUser = async (req, res) => {
  const id = req.params.id;
  try {
    if (req.body.password) {
      console.log('??')
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      req.body.password = hashedPassword;
   }
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Successfully updated user",
      data: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update user. Try again",
    });
  }
};

// delete user
export const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Successfully deleted user",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user. Try again",
    });
  }
};

// get Single user
export const getSingleUser = async (req, res) => {
  const id = req.params.id;

  try {
    let user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Ensure `name` is set to `username` if it's missing
    if (!user.name) {
      user.name = user.username;
    }

    // Generate an avatar if it's missing
    if (!user.avatar) {
      user.avatar = generateUIAvatar(user.name);
      // Save the updated user document
      await user.save();
    }
    res.status(200).json({
      success: true,
      message: "Successfully fetched user",
      data: user,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
};
async function updateMissingAvatars() {
try {
  // Find users missing either the `avatar` or `name` field
  const users = await User.find({
    $or: [{ avatar: { $exists: false } }, { name: { $exists: false } }, { name: null }],
  });

  for (const user of users) {
    // Set the name to the username if `name` is missing
    if (!user.name) {
      user.name = user.username;
    }

    // Generate an avatar if it's missing
    if (!user.avatar) {
      user.avatar = generateUIAvatar(user.username);
    }

    await user.save(); // Save the updated user document
  }

  console.log("Successfully updated missing avatars and names.");
} catch (err) {
  console.warn("Error updating missing avatars:", err);
}
}

function generateUIAvatar(name) {
const baseUrl = "https://ui-avatars.com/api/";
const size = 128;
const background = "random";
const rounded = true;
const url = `${baseUrl}?name=${encodeURIComponent(name)}&size=${size}&background=${background}&rounded=${rounded}`;
return url;
}

updateMissingAvatars();

// get All User

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find({}).limit(8);

    res.status(200).json({
      success: true,
      count: users.length,
      message: "Successfully fetched all users",
      data: users,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "Not Found. Try again",
    });
  }
};


export const checkPassword = async (req, res) => {
  const { password } = req.body;  // Ensure this data is received securely
  const userId = req.user.id;  // User ID from the verified token

  try {
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
        res.json({ message: 'Password verification successful' });
    } else {
        res.status(401).json({ message: 'Password is incorrect' });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const CheckReset = async (req, res) => {
  const { identifier } = req.body;
  try {
      const user = await User.findOne({
          $or: [{ email: identifier }, { username: identifier }]
      });
      if (user) {
          await sendOTPEmail(user.email);
          res.json({ success: true, message: "OTP sent if user exists" });
      } else {
          res.status(404).json({ success: false, message: "User not found" });
      }
  } catch (error) {
    console.log(error)
      res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Endpoint to initiate the reset password process and send OTP
export const checkPass = async (req, res) => {
  const { identifier } = req.body;
  
  try {
      const user = await User.findOne({
          $or: [{ email: identifier }, { username: identifier }]
      });
      if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
      }
      const otp = await generateAndStoreOTP(user.email);
      await sendOTPEmail(user.email, otp);
      res.json({ success: true, message: "OTP sent to your email." ,data:user});
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, message: "Failed to send OTP", error: error.message });
  }
};

// Endpoint to verify OTP
export const otpChecking = async (req, res) => {
  const { email, otp } = req.body;
  try {
      const user = await User.findOne({ email });
      console.log(user.otp)
      if (!user || user.otp !== otp || new Date() > user.otpExpires) {
          return res.status(401).json({ success: false, message: "Invalid or expired OTP" });
      }
      res.json({ success: true, message: "OTP verified successfully." });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Endpoint to reset password
export const resetpassword = async (req, res) => {
  const { email, newPassword } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  try {
      await User.findOneAndUpdate({ email }, { $set: { password: hashedPassword } });
      res.json({ success: true, message: "Password reset successfully." });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
//Image uplpoad? may be change in future 
export const uploadAvatar = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { filename } = req.file;

    // Update user's avatar field to reference the uploaded file
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: `/api/v1/users/avatar/${filename}` },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
//get Ava
export const getAvatar = async (req, res) => {
  const { filename } = req.params;
  /*try {
   
    console.log("test")
    gfs.find({ filename: filename }).toArray((err, files) => {
      if (err) {
        console.error('Error querying GridFS:', err);
        return res.status(500).json({ message: 'Server Error', error: err.message });
      }

      if (!files || files.length === 0) {
        console.log(`No files found with filename: ${filename}`);
        return res.status(404).json({ message: 'No files found' });
      }
      console.log(`Streaming file: ${filename}`); */
       gfs.openDownloadStreamByName(filename).pipe(res) /*.on('error', (error) => {
        console.error('Error streaming file:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
      });
    });
  } catch (error) {
    console.error('Unexpected server error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  } */
};
// get List User
export const getListUser = async (req, res) => {
  try {
    let { page, limit, status, search, searchType, role } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const filter = {};
    if (status) {
      filter.status = status;
    }
    if (role) {
      filter.role = role;
    }
    if (search) {
      if (searchType === "email") {
        filter.email = { $regex: search, $options: "i" };
      } else if (searchType === "username") {
        filter.username = { $regex: search, $options: "i" };
      } else {
        filter.$or = [
          { username: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ];
      }
    }

    const totalCount = await User.countDocuments();
    const totalPages = await User.countDocuments(filter) / limit
    const users = await User.find(filter)
      .limit(limit)
      .skip((page - 1) * limit);

    res.status(200).json({
      success: true,
      totalPages: Math.ceil(totalPages),
      totalCount: totalCount,
      message: "Successfully fetched users",
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again.",
    });
  }
};

// Lock user
export const lockUser = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: { status: "inactive" },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Successfully locked user",
      data: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to lock user. Try again",
    });
  }
};

// Unlock user
export const unlockUser = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: { status: "active" },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Successfully unlocked user",
      data: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to unlock user. Try again",
    });
  }
};
