//====
// helpers/auth.js
// Password hash பண்ற + JWT token create பண்ற helper functions
// Unga existing pattern: named functions, export panning
//====

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ---- Password hash panrom ----
// bcrypt = Password-a directly save pannaamal, secure hash-a save pannuvom
async function generateHashPassword(password) {
  const NO_OF_ROUNDS = 10; // Hash strength — 10 is standard
  const salt = await bcrypt.genSalt(NO_OF_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

// ---- Password verify pannuvom (Login time) ----
// plainPassword = User typed password
// hashedPassword = DB-la irukka hash
async function verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

// ---- JWT Token create pannuvom ----
// payload = { userId, role } — token-la store aagum
// Token = user-oda "identity card" maadiri
function generateToken(payload) {
  const SECRET = process.env.JWT_SECRET;
  const OPTIONS = { expiresIn: "7d" }; // Token 7 days valid
  return jwt.sign(payload, SECRET, OPTIONS);
}

// ---- JWT Token verify pannuvom (Protected routes) ----
function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

const authHelpers = {
  generateHashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
};

export default authHelpers;