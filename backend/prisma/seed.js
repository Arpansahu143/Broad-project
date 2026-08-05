/**
 * Development seed script.
 *
 * Creates one ADMIN account so you have a way to log in and use
 * ADMIN-only endpoints (create departments, create faculty, etc.)
 * without relying on public signup.
 *
 * Safe to re-run: checks for an existing admin by email first and
 * skips creation instead of erroring or duplicating.
 *
 * Run with: npx prisma db seed
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@university.edu";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "AdminPass123";
const SALT_ROUNDS = 12;

async function main() {
  const existingAdmin = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
  });

  if (existingAdmin) {
    console.log(
      `Seed skipped: an account with email "${ADMIN_EMAIL}" already exists (role: ${existingAdmin.role}).`
    );
    return;
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

  const admin = await prisma.user.create({
    data: {
      firstName: "System",
      lastName: "Admin",
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin account created:");
  console.log(`  Email:    ${admin.email}`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);
  console.log(
    "  IMPORTANT: change this password or set SEED_ADMIN_PASSWORD before running this against anything beyond local development."
  );
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
