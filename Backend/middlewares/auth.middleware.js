const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const blacklistTokenModel = require("../models/blacklistToken.model");
const captainModel = require("../models/captain.model");

module.exports.authUser = async (req, res, next) => {
  try {
    // Extract token from Authorization header or cookies
    const token =
      req.cookies.token ||
      (req.headers.authorization && req.headers.authorization?.split(" ")[1]);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    const isBlaclisted = await blacklistTokenModel.findOne({ token: token });

    if (isBlaclisted) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Token blacklisted" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await userModel.findById(decoded._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports.authCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  // console.log(token);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token missing" });
  }

  const isBlaclisted = await blacklistTokenModel.findOne({ token: token });

  // console.log(isBlaclisted);

  if (isBlaclisted) {
    return res.status(401).json({ message: "Unauthorized: Token blacklisted" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const captain = await captainModel.findById(decoded._id);
    req.captain = captain;
    return next();
  } catch (err) {
    // console.log(err);
    res.status(401).json({ message: "Unauthorized" });
  }
};
