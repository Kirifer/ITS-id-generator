const dashboardEmployee = (req, res) => {
  res.json({ message: "Welcome to the Employee dashboard", user: req.user });
};

module.exports = {
  dashboardEmployee,
};
