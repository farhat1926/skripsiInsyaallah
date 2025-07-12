import jwt from "jsonwebtoken"

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
    httpOnly: true,
    sameSite: "none", // ⬅️ agar cross-site bisa kirim cookie
    secure: process.env.NODE_ENV !== "development", // ⬅️ harus true di prod
  });

  return token;
};

