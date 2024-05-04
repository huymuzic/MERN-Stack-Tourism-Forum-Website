import User from "../models/user.js";
import bcrypt from "bcrypt";
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
 console.log('it work')
  try {
    console.log('duunno man')
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
    const user = await User.findById(id);

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