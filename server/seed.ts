import { db } from "./db";
import { users } from "@shared/schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Seeding database...");

  const existingAdmin = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.role, "admin"),
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await db.insert(users).values({
      email: "admin@jobconnect.com",
      password: hashedPassword,
      name: "System Admin",
      role: "admin",
      isApproved: true,
    });
    console.log("Admin user created: admin@jobconnect.com / admin123");
  } else {
    console.log("Admin user already exists");
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
