import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { prisma } from "@/lib/prisma";

type GuestRow = {
  household: string;
  maxGuests: number;
  firstName: string;
  lastName: string;
  isChild: boolean;
};

function parseCsv(filePath: string): GuestRow[] {
  const raw = fs.readFileSync(filePath, "utf-8").trim();
  const [headerLine, ...lines] = raw.split("\n");
  const headers = headerLine.split(",").map((h) => h.trim());

  return lines
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      const cells = line.split(",").map((c) => c.trim());
      const row = Object.fromEntries(headers.map((h, i) => [h, cells[i]]));
      return {
        household: row.household,
        maxGuests: Number(row.maxGuests),
        firstName: row.firstName,
        lastName: row.lastName,
        isChild: row.isChild?.toLowerCase() === "true",
      };
    });
}

function slugForCode(householdName: string): string {
  return householdName
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 8) || "GUEST";
}

async function generateUniqueInviteCode(householdName: string): Promise<string> {
  const base = slugForCode(householdName);
  for (let attempt = 0; attempt < 20; attempt++) {
    const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
    const code = `${base}-${suffix}`;
    const existing = await prisma.household.findUnique({ where: { inviteCode: code } });
    if (!existing) return code;
  }
  throw new Error(`Could not generate a unique invite code for "${householdName}"`);
}

async function main() {
  const csvPath = process.argv[2] ?? path.join(process.cwd(), "data", "guests.csv");
  if (!fs.existsSync(csvPath)) {
    throw new Error(
      `Guest list CSV not found at ${csvPath}. Copy data/guests.example.csv to data/guests.csv and fill it in, or pass a path: npm run db:seed -- path/to/file.csv`,
    );
  }

  const rows = parseCsv(csvPath);
  const householdNames = [...new Set(rows.map((r) => r.household))];

  for (const householdName of householdNames) {
    const householdRows = rows.filter((r) => r.household === householdName);
    const maxGuests = householdRows[0].maxGuests;
    const inviteCode = await generateUniqueInviteCode(householdName);

    const household = await prisma.household.create({
      data: {
        name: householdName,
        inviteCode,
        maxGuests,
        guests: {
          create: householdRows.map((r) => ({
            firstName: r.firstName,
            lastName: r.lastName,
            isChild: r.isChild,
          })),
        },
      },
    });

    console.log(`Created "${household.name}" — invite code: ${household.inviteCode}`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
