import jwt from "jsonwebtoken";

const getUserIdFromJwt = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return decoded.id;
  } catch (error) {
    console.error("Error verifying JWT:", error);
    return null;
  }
};
export default getUserIdFromJwt;
