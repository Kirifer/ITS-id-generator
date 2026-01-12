const IdCard = require("../models/IdCard");

const getFilteredIdCards = async (req, res) => {
  try {
    const { type, status, search, isGenerated } = req.query;


    const query = {};

    if (type) {
      query.type = type;
    }

    if (status) {
      query.status = status;
    }

    if (isGenerated !== undefined && isGenerated !== "") {
      query.isGenerated = isGenerated === "true";
    }

    if (search) {
      const searchTerm = search.trim();

      const searchWords = searchTerm
        .split(/\s+/)
        .filter((word) => word.length > 0);

      if (searchWords.length === 1) {
        query.$or = [
          { "fullName.firstName": { $regex: searchTerm, $options: "i" } },
          { "fullName.middleInitial": { $regex: searchTerm, $options: "i" } },
          { "fullName.lastName": { $regex: searchTerm, $options: "i" } },
          { employeeNumber: { $regex: searchTerm, $options: "i" } },
          { position: { $regex: searchTerm, $options: "i" } },
        ];
      } else {
        query.$or = [
          {
            $and: searchWords.map((word) => ({
              $or: [
                { "fullName.firstName": { $regex: word, $options: "i" } },
                { "fullName.middleInitial": { $regex: word, $options: "i" } },
                { "fullName.lastName": { $regex: word, $options: "i" } },
              ],
            })),
          },
          { employeeNumber: { $regex: searchTerm, $options: "i" } },
          { position: { $regex: searchTerm, $options: "i" } },
        ];
      }
    }

    const idCards = await IdCard.find(query)
      .sort({ createdAt: -1 })
      .populate("createdBy", "fullName email")
      .populate("approvedBy", "fullName email");

    res.status(200).json(idCards);
  } catch (error) {
    console.error("Error fetching ID cards:", error);
    res.status(500).json({ message: "Failed to fetch ID cards" });
  }
};

module.exports = {
  getFilteredIdCards,
};