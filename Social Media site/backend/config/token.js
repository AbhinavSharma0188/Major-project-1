import jwt from "jsonwebtoken";

const genToken = (userId) => {
  try {
    const token = jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: "10y" }
    );
    return token;
  } catch (error) {
    console.error("Token generation error:", error.message);
    return null; // or throw error
  }
};

export default genToken;
