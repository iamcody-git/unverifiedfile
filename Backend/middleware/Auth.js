import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.json({
        success: false,
        message: "Not Authorized. Please login again."
      });
    }

    const token = authHeader.split(" ")[1];

    console.log("Received Token:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;

    next();

  } catch (error) {

    console.log("Auth Error:", error.message);

    return res.json({
      success: false,
      message: "Invalid Token. Please login again."
    });
  }
};

export default authUser;