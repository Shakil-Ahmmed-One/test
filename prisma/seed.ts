import { prisma } from "@/db.js";

async function main() {
  console.log("🌱 Seeding database...");

  // Create example products
  const products = await prisma.product.createMany({
    data: [
      {
        name: "Kalo Chal",
        purchasePrice: 85,
        sellPrice: 100,
        images: [
          "https://ik.imagekit.io/grahok/Grahok%20Landing/products/1742743925-kalo-chal.webp",
        ],
      },
      {
        name: "Amon Half Fiber",
        purchasePrice: 85,
        sellPrice: 100,
        images: [
          "https://ik.imagekit.io/grahok/Grahok%20Landing/products/1750438746-untitled-design-(4).webp",
        ],
      },
    ],
  });

  console.log(`✅ ${products.count} products created`);

  // Create example orders
  // const order = await prisma.order.create({
  //   data: {
  //     customer: {
  //       name: "Shakil Ahmmed",
  //       mobileNumber: "01712345678",
  //       address: {
  //         division: "Dhaka",
  //         district: "Dhaka",
  //         upazilla: "Dhaka",
  //         location: "Dhaka",
  //       },
  //     },
  //     products: {
  //       connect: [{ id: "69560d613d94f7adbf941693" }],
  //     },
  //     productsDetails: [
  //       {
  //         productId: "69560d613d94f7adbf941693",
  //         quantity: 2,
  //       },
  //     ],
  //     totalPrice: 200,
  //   },
  // });

  // console.log(`✅ Order ${order.id} created`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
