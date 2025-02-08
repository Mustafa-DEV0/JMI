import jwt from "jsonwebtoken";

const getUserIdFromJwt = (token) => {
  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // Debugging line

    return decoded.userId; // Ensure 'userId' exists in the payload
  } catch (error) {
    console.error("Error verifying JWT:", error);
    return null;
  }
};
export default getUserIdFromJwt;
