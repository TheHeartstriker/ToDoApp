import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function authenticate(req, res, next) {
  try {
    const token = req.cookies?.jwtToken;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authentication required", success: false });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ message: "Invalid or expired token", success: false });
  }
}

export { authenticate };
