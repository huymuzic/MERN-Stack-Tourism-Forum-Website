import Purchase from "../models/Purchase.js";
import Tour from "../models/Tour.js";

export const createPurchase = async (req, res) => {
  const { userId, tourId, numPeople } = req.body;

  try {
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    const newPurchase = new Purchase({
      userId,
      tourId,
      tourTitle: tour.title,
      price: tour.price,
      numPeople,
    });

    await newPurchase.save();

    res.status(201).json({
      message: "Purchase created successfully",
      purchase: newPurchase,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
