const IdCard = require("../models/IdCard");

const getIdCardStats = async (req, res) => {
  try {
    const stats = await IdCard.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          approved: {
            $sum: { $cond: [{ $eq: ["$status", "Approved"] }, 1, 0] },
          },
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] },
          },
          actions: {
            $sum: { $cond: [{ $eq: ["$status", "Rejected"] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          total: 1,
          approved: 1,
          pending: 1,
          actions: 1,
        },
      },
    ]);

    const result = stats[0] || {
      total: 0,
      approved: 0,
      pending: 0,
      actions: 0,
    };

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("ID Card Stats Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch ID card stats",
    });
  }
};

module.exports = {
  getIdCardStats,
};
