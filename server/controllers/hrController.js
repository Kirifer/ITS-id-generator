

const dashboardHr = (req, res) => {
  res.json({ message: 'Welcome to the HR dashboard', user: req.user });
}

module.exports = {
    dashboardHr
}