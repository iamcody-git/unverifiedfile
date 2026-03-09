import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized, login again",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({
        success: false,
        message: "Admin access denied",
      });
    }

    next();

  } catch (error) {

    console.log(error);

    res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

export default adminAuth;