//====
// config/index.js
// All configuration settings one place-la!
// process.env = .env file-la irukka values
//====

export const config = {
  // MongoDB database name — .env-la MONGO_DATABASE set pannuvom
  database: process.env.MONGO_DATABASE || "TrimTracker",
};

export default config;