import jwt from "jsonwebtoken";
import messages from "@/utils/messages";

export default function verifyToken(handler) {
  return async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ code: 401, message: messages.errors.ACCESS_DENIED, status: "Unauthorized" });
    }

    try {
      // const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const decoded = jwt.verify(token, "SECRET");
      req.user = decoded;
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ code: 401, message: messages.INVALID_TOKEN, status: "Unauthorized" });
    }
  };
}
