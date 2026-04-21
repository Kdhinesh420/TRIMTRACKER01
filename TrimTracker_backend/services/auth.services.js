//====
// services/auth.services.js
// All DB operations for Auth (Users collection)
//
// Unga pattern: client.db(MONGO_DATABASE).collection("users")
// No Mongoose — MongoDB Native Driver use pannrom
//====

import { client } from "../index.js";
import config from "../config/index.js";
import authHelpers from "../helpers/auth.js";

const MONGO_DATABASE = config.database; // "trimtracker"

// ---- Find user by email ----
// Login & Register time use aagum
const findUserByEmail = async (email) => {
  return await client
    .db(MONGO_DATABASE)
    .collection("users")
    .findOne({ email: email });
};

// ---- Register: Create new user ----
const createUser = async (userData) => {
  const { name, email, phone, password, role } = userData;

  // Password-a hash panni save pannuvom — never store plain password!
  const hashedPassword = await authHelpers.generateHashPassword(password);

  const newUser = {
    name,
    email,
    phone,
    password: hashedPassword, // Hashed version save aagum
    role, // "customer" or "owner"
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Insert to MongoDB
  const result = await client
    .db(MONGO_DATABASE)
    .collection("users")
    .insertOne(newUser);

  return result; // Returns { acknowledged: true, insertedId: ObjectId }
};

const authServices = {
  findUserByEmail,
  createUser,
};

export default authServices;