const IdCard = require("../models/IdCard");

const getFilteredIdCards = async (req, res) => {
  try {
    const { type, status, search } = req.query;

    const query = {};

    if (type) {
      query.type = type;
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { "fullName.firstName": { $regex: search, $options: "i" } },
        { "fullName.middleInitial": { $regex: search, $options: "i" } },
        { "fullName.lastName": { $regex: search, $options: "i" } },
      ];
    }

    const idCards = await IdCard.find(query)
      .sort({ createdAt: -1 })
      .populate("createdBy", "fullName email")
      .populate("approvedBy", "fullName email");

    res.status(200).json(idCards);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch ID cards" });
  }
};

module.exports = {
  getFilteredIdCards,
};
