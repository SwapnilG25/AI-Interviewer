/** @type { import("drizzle-kit").Config } */
module.exports = {
  schema: "./utils/schema.js",
  out: "./drizzle/migrations",    // specify migration output folder
  dialect: "postgresql",           // <-- This is required!
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_9WnUIAseRQ7c@ep-soft-sunset-a8z9fmuw-pooler.eastus2.azure.neon.tech/Ai-Interviewer?sslmode=require"
  },
};
