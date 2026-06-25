import "dotenv/config";
import { prisma } from "@/lib/prisma";
import { PreorderStatus } from "@prisma/client";

const preorderNames = [
  "Summer Collection Launch",
  "iPhone 18 Pro Max",
  "MacBook Air M8",
  "Gaming Console X",
  "Smart Watch Ultra",
  "Wireless Earbuds Pro",
  "Premium Backpack",
  "Mechanical Keyboard",
  "4K Monitor",
  "Portable SSD",
];

const preorderPeriods = ["out-of-stock", "regardless-of-stock"];

async function main() {
  console.log("🌱 Seeding database...");

  console.log(process.env.DATABASE_URL);

  await prisma.preorder.deleteMany({});

  const preorders = Array.from({ length: 25 }, (_, index) => {
    const now = new Date();

    const startsAt = new Date(now);
    startsAt.setDate(now.getDate() + index);

    const endsAt = new Date(startsAt);
    endsAt.setDate(startsAt.getDate() + 14);

    return {
      name: `${preorderNames[index % preorderNames.length]} #${index + 1}`,
      products: Math.floor(Math.random() * 100) + 1,
      preorderWhen: preorderPeriods[index % preorderPeriods.length],
      status: index % 3 === 0 ? PreorderStatus.INACTIVE : PreorderStatus.ACTIVE,
      startsAt,
      endsAt,
      createdAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000),
      isDeleted: false,
    };
  });

  await prisma.preorder.createMany({
    data: preorders,
  });

  console.log(`✅ Seeded ${preorders.length} preorders`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
