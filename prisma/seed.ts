import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'bcryptjs';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const shopProducts = [
  { id: 1,  brand: 'adidas', title: 'rose t-shirt',         description: 'A soft rose-toned tee crafted for daily wear with breathable fabric and a clean silhouette.', price: 100, image: '/products-img/p3.webp',  rating: 4.5, fullRating: false, category: 't-shirts' },
  { id: 2,  brand: 'adidas', title: 'winter t-shirt',       description: 'Warm-toned winter tee featuring elevated finishing and relaxed fit for layering.', price: 100, image: '/products-img/p4.webp',  rating: 4.5, fullRating: false, category: 't-shirts' },
  { id: 3,  brand: 'adidas', title: 'snow t-shirt',         description: 'Crisp white tee with minimal branding. Pair with denim for an effortless city look.', price: 100, image: '/products-img/p1.webp',  rating: 4.5, fullRating: false, category: 't-shirts' },
  { id: 4,  brand: 'adidas', title: 'leaf t-shirt',         description: 'Nature-inspired leaf print on premium cotton. Perfect for weekend outings.', price: 100, image: '/products-img/p2.webp',  rating: 4.5, fullRating: false, category: 't-shirts' },
  { id: 5,  brand: 'adidas', title: 'butterfly t-shirt',    description: 'Delicate butterfly graphic on lightweight fabric. A statement piece for the bold.', price: 100, image: '/products-img/p5.webp',  rating: 4.5, fullRating: false, category: 't-shirts' },
  { id: 6,  brand: 'adidas', title: 'fine-linen t-shirt',   description: 'Linen-cotton blend for warm Nairobi days. Breathable, soft, and refined.', price: 100, image: '/products-img/p6.webp',  rating: 4.5, fullRating: false, category: 't-shirts' },
  { id: 7,  brand: 'adidas', title: 'ash flower shorts',    description: 'Floral ash-tone shorts with elastic waist. Comfortable and versatile for summer.', price: 100, image: '/products-img/p7.webp',  rating: 4.5, fullRating: false, category: 'shorts' },
  { id: 8,  brand: 'adidas', title: 'purple flower skirt',  description: 'Vibrant purple floral skirt with flowing silhouette. Dress up or down.', price: 100, image: '/products-img/p8.webp',  rating: 4.5, fullRating: false, category: 'skirts' },
  { id: 9,  brand: 'adidas', title: 'lightblue t-shirt',    description: 'Calming light-blue tee with premium stitching. A wardrobe essential.', price: 100, image: '/products-img/p9.webp',  rating: 5,   fullRating: true,  category: 't-shirts' },
  { id: 10, brand: 'adidas', title: 'dotted blue t-shirt',  description: 'Playful polka-dot pattern on sky blue. Fun yet refined for any occasion.', price: 100, image: '/products-img/p10.webp', rating: 5,   fullRating: true,  category: 't-shirts' },
  { id: 11, brand: 'adidas', title: 'white t-shirt',        description: 'Classic white tee made with 100% organic cotton. Timeless and sustainable.', price: 100, image: '/products-img/p11.webp', rating: 5,   fullRating: true,  category: 't-shirts' },
  { id: 12, brand: 'adidas', title: 'ash t-shirt',          description: 'Neutral ash tone tee with reinforced seams. Built to last through countless washes.', price: 100, image: '/products-img/p12.webp', rating: 5,   fullRating: true,  category: 't-shirts' },
  { id: 13, brand: 'adidas', title: 'blue t-shirt',         description: 'Rich blue tee with modern cut. Perfect base layer for streetwear stacks.', price: 100, image: '/products-img/p13.webp', rating: 5,   fullRating: true,  category: 't-shirts' },
  { id: 14, brand: 'adidas', title: 'linen ash short',      description: 'Linen ash shorts with drawstring waist. Breathable comfort meets clean style.', price: 100, image: '/products-img/p14.webp', rating: 5,   fullRating: true,  category: 'shorts' },
  { id: 15, brand: 'adidas', title: 'brown t-shirt',        description: 'Earthy brown tee with relaxed drop-shoulder fit. Easy to pair with anything.', price: 100, image: '/products-img/p15.webp', rating: 5,   fullRating: true,  category: 't-shirts' },
  { id: 16, brand: 'adidas', title: 'rose t-shirt',         description: 'Second-drop rose tee with updated collar and premium finishings.', price: 100, image: '/products-img/p16.webp', rating: 5,   fullRating: true,  category: 't-shirts' },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Create a demo user
  const passwordHash = await hash('demo1234', 12);
  await prisma.user.upsert({
    where: { email: 'demo@carastudio.co.ke' },
    update: {},
    create: {
      name: 'Demo Shopper',
      email: 'demo@carastudio.co.ke',
      phone: '254712345678',
      passwordHash,
      role: 'BUYER',
    },
  });
  console.log('  ✓ Demo user created (demo@carastudio.co.ke / demo1234)');

  // Seed products
  for (const product of shopProducts) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: product,
      create: product,
    });
  }
  console.log(`  ✓ ${shopProducts.length} products seeded`);

  console.log('✅ Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
