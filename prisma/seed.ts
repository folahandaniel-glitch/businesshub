/**
 * Seed script: categories, site settings and clearly-marked demo products.
 * Run: npm run db:seed
 * Every demo product carries isDemo = true so production stock is never confused with it.
 */
import { PrismaClient, ProductCondition, StockStatus } from '@prisma/client';
import { slugify } from '../src/lib/utils';

const prisma = new PrismaClient();

const CATEGORIES: { name: string; children?: string[]; popular?: boolean }[] = [
  { name: 'Laptops', popular: true },
  { name: 'Desktop Computers', popular: true },
  { name: 'Monitors', popular: true },
  { name: 'Printers', popular: true },
  {
    name: 'Computer Accessories',
    popular: true,
    children: ['Keyboards', 'Mouse', 'Cables', 'Gaming Accessories']
  },
  { name: 'Storage Devices', popular: true, children: ['Hard Drives', 'SSD', 'Flash Drives'] },
  { name: 'Components', children: ['RAM', 'Graphics Cards', 'Processors', 'Motherboards'] },
  { name: 'Networking Equipment', popular: true, children: ['Routers', 'Switches'] },
  { name: 'Power Solutions', children: ['UPS'] },
  { name: 'Software' },
  { name: 'CCTV and Security Equipment', popular: true },
  { name: 'Phones and Tablets' },
  { name: 'Office Equipment' },
  { name: 'Refurbished Computers', popular: true },
  { name: 'Computer Spare Parts' }
];

type DemoProduct = {
  name: string;
  category: string;
  brand: string;
  model: string;
  price: number;
  previousPrice?: number;
  stock: number;
  condition?: ProductCondition;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  description: string;
  specs: Record<string, string>;
};

const PRODUCTS: DemoProduct[] = [
  {
    name: 'HP EliteBook 840 G8 Core i7 16GB 512GB SSD',
    category: 'Laptops',
    brand: 'HP',
    model: '840 G8',
    price: 985000,
    previousPrice: 1120000,
    stock: 12,
    featured: true,
    bestSeller: true,
    description:
      'A business-class ultrabook for managers and consultants who work across the office, client sites and home. Aluminium chassis, full-size backlit keyboard and all-day battery.',
    specs: {
      Processor: 'Intel Core i7-1165G7, 2.8GHz',
      Memory: '16GB DDR4',
      Storage: '512GB NVMe SSD',
      Display: '14 inch Full HD anti-glare',
      Graphics: 'Intel Iris Xe',
      Ports: '2x Thunderbolt 4, 2x USB-A, HDMI',
      Battery: 'Up to 10 hours',
      Weight: '1.32kg'
    }
  },
  {
    name: 'Dell Latitude 5420 Core i5 8GB 256GB SSD',
    category: 'Laptops',
    brand: 'Dell',
    model: 'Latitude 5420',
    price: 545000,
    previousPrice: 610000,
    stock: 18,
    bestSeller: true,
    description:
      'The dependable office workhorse. Strong build, easy servicing and enough performance for spreadsheets, browser-heavy work and video calls.',
    specs: {
      Processor: 'Intel Core i5-1135G7',
      Memory: '8GB DDR4, upgradeable to 32GB',
      Storage: '256GB NVMe SSD',
      Display: '14 inch Full HD',
      Ports: 'USB-C, 2x USB-A, HDMI, RJ-45',
      Warranty: '12 months'
    }
  },
  {
    name: 'Lenovo ThinkPad T14 Gen 3 Core i7 16GB 1TB SSD',
    category: 'Laptops',
    brand: 'Lenovo',
    model: 'T14 Gen 3',
    price: 1150000,
    stock: 6,
    featured: true,
    newArrival: true,
    description:
      'Engineering and design grade performance in a 14 inch frame, with the ThinkPad keyboard and military-standard durability testing.',
    specs: {
      Processor: 'Intel Core i7-1260P',
      Memory: '16GB DDR4',
      Storage: '1TB NVMe SSD',
      Display: '14 inch WUXGA IPS',
      Security: 'Fingerprint reader, dTPM 2.0'
    }
  },
  {
    name: 'HP ProDesk 400 G7 Desktop Core i5 8GB 1TB HDD',
    category: 'Desktop Computers',
    brand: 'HP',
    model: 'ProDesk 400 G7',
    price: 425000,
    previousPrice: 480000,
    stock: 9,
    description:
      'A compact tower for front-desk, accounts and cyber-cafe deployments. Quiet, serviceable and easy to expand later.',
    specs: {
      Processor: 'Intel Core i5-10500',
      Memory: '8GB DDR4',
      Storage: '1TB HDD',
      Expansion: '2 free DIMM slots, M.2 slot',
      Operating: 'Windows 11 Pro ready'
    }
  },
  {
    name: 'Dell P2422H 24 inch Full HD IPS Monitor',
    category: 'Monitors',
    brand: 'Dell',
    model: 'P2422H',
    price: 185000,
    previousPrice: 215000,
    stock: 22,
    bestSeller: true,
    description:
      'A 24 inch IPS panel with height, tilt and pivot adjustment. Comfortable for full working days on documents and dashboards.',
    specs: {
      Size: '23.8 inch',
      Resolution: '1920 x 1080',
      Panel: 'IPS, 99% sRGB',
      Refresh: '60Hz',
      Ports: 'HDMI, DisplayPort, VGA, 4x USB-A'
    }
  },
  {
    name: 'HP LaserJet Pro M404dn Monochrome Printer',
    category: 'Printers',
    brand: 'HP',
    model: 'M404dn',
    price: 395000,
    stock: 7,
    featured: true,
    description:
      'A duty-cycle printer for offices printing hundreds of pages weekly. Automatic duplex and network printing as standard.',
    specs: {
      Type: 'Monochrome laser',
      Speed: 'Up to 38 pages per minute',
      Duplex: 'Automatic two-sided printing',
      Connectivity: 'Ethernet, USB',
      'Monthly duty cycle': 'Up to 80,000 pages'
    }
  },
  {
    name: 'Samsung 870 EVO 1TB SATA SSD',
    category: 'SSD',
    brand: 'Samsung',
    model: '870 EVO',
    price: 128000,
    previousPrice: 149000,
    stock: 34,
    bestSeller: true,
    newArrival: true,
    description:
      'The straightforward upgrade for any slow laptop or desktop. Replaces a mechanical drive and cuts boot times sharply.',
    specs: {
      Capacity: '1TB',
      Interface: 'SATA III 6Gb/s',
      'Read speed': 'Up to 560 MB/s',
      'Write speed': 'Up to 530 MB/s',
      Warranty: '5 years limited'
    }
  },
  {
    name: 'Seagate BarraCuda 2TB Internal Hard Drive',
    category: 'Hard Drives',
    brand: 'Seagate',
    model: 'ST2000DM008',
    price: 92000,
    stock: 4,
    description:
      'High-capacity storage for archives, CCTV footage and media libraries where cost per gigabyte matters more than speed.',
    specs: { Capacity: '2TB', 'Form factor': '3.5 inch', Speed: '7200 RPM', Cache: '256MB' }
  },
  {
    name: 'Kingston FURY Beast 16GB DDR4 3200MHz RAM',
    category: 'RAM',
    brand: 'Kingston',
    model: 'KF432C16BB/16',
    price: 68000,
    stock: 26,
    newArrival: true,
    description: 'A single 16GB module for upgrading workstations, editing rigs and gaming builds.',
    specs: { Capacity: '16GB', Type: 'DDR4', Speed: '3200MHz', Latency: 'CL16' }
  },
  {
    name: 'Logitech MK270 Wireless Keyboard and Mouse Combo',
    category: 'Keyboards',
    brand: 'Logitech',
    model: 'MK270',
    price: 32500,
    previousPrice: 38000,
    stock: 45,
    bestSeller: true,
    description: 'A reliable wireless set for office desks, with a single USB receiver and long battery life.',
    specs: { Connection: '2.4GHz wireless', Range: 'Up to 10 metres', Battery: '24 months keyboard, 12 months mouse' }
  },
  {
    name: 'TP-Link Archer AX55 AX3000 Dual Band Wi-Fi 6 Router',
    category: 'Routers',
    brand: 'TP-Link',
    model: 'Archer AX55',
    price: 98000,
    stock: 15,
    featured: true,
    description:
      'Wi-Fi 6 coverage for offices and homes with many connected devices. Handles video calls and streaming without congestion.',
    specs: { Standard: 'Wi-Fi 6 (802.11ax)', Speed: 'Up to 3000 Mbps', Antennas: '4 external', Ports: '4x Gigabit LAN' }
  },
  {
    name: 'APC Back-UPS 1100VA Line Interactive UPS',
    category: 'UPS',
    brand: 'APC',
    model: 'BX1100C',
    price: 145000,
    stock: 3,
    description:
      'Protects desktops and network gear from the voltage swings common on Nigerian mains supply, with enough runtime for a clean shutdown.',
    specs: { Capacity: '1100VA / 600W', Type: 'Line interactive', Outlets: '6', 'Voltage regulation': 'Automatic' }
  },
  {
    name: 'Refurbished HP EliteDesk 800 G4 Core i5 8GB 256GB SSD',
    category: 'Refurbished Computers',
    brand: 'HP',
    model: 'EliteDesk 800 G4',
    price: 265000,
    previousPrice: 320000,
    stock: 11,
    condition: ProductCondition.REFURBISHED,
    description:
      'Professionally refurbished, tested and cleaned. A budget route to a capable office desktop, covered by a six month warranty.',
    specs: {
      Processor: 'Intel Core i5-8500',
      Memory: '8GB DDR4',
      Storage: '256GB SSD',
      Condition: 'Grade A refurbished',
      Warranty: '6 months'
    }
  },
  {
    name: 'Hikvision 4-Channel 1080p CCTV Kit with 4 Cameras',
    category: 'CCTV and Security Equipment',
    brand: 'Hikvision',
    model: 'DS-7104HGHI',
    price: 315000,
    stock: 0,
    featured: true,
    description:
      'A complete entry-level surveillance package for shops and small offices, including DVR, cameras, cabling and power supply.',
    specs: { Channels: '4', Resolution: '1080p', 'Night vision': 'Up to 20 metres', Storage: 'Supports up to 4TB' }
  }
];

async function main() {
  console.log('Seeding categories...');
  for (const [index, cat] of CATEGORIES.entries()) {
    const parent = await prisma.category.upsert({
      where: { slug: slugify(cat.name) },
      update: {},
      create: {
        name: cat.name,
        slug: slugify(cat.name),
        isPopular: cat.popular ?? false,
        sortOrder: index,
        metaTitle: `${cat.name} in Nigeria`,
        metaDescription: `Buy ${cat.name.toLowerCase()} from BUSINESS-HUB COMPUTERS with warranty and nationwide delivery.`
      }
    });

    for (const [childIndex, child] of (cat.children ?? []).entries()) {
      await prisma.category.upsert({
        where: { slug: slugify(child) },
        update: {},
        create: { name: child, slug: slugify(child), parentId: parent.id, sortOrder: childIndex }
      });
    }
  }

  console.log('Seeding business and contact settings...');
  await prisma.businessInformation.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      companyName: 'BUSINESS-HUB COMPUTERS',
      registrationNumber: 'RC: 3001886',
      logoUrl: '/logo.jpeg',
      description:
        'BUSINESS-HUB COMPUTERS supplies laptops, desktops, components, printers, networking and security equipment to businesses, schools and individuals across Nigeria, with warranty support and nationwide delivery.',
      website: 'https://www.businesshubcomputers.com',
      businessHours: 'Monday to Saturday, 8:00am to 6:00pm'
    }
  });

  await prisma.contactInformation.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      primaryPhone: '0803 000 0000',
      secondaryPhone: '0805 000 0000',
      whatsappNumber: '0803 000 0000',
      email: 'sales@businesshubcomputers.com',
      supportEmail: 'support@businesshubcomputers.com',
      address: 'Head office address, Nigeria',
      openingHours: 'Monday to Saturday, 8:00am to 6:00pm',
      mapsLink: ''
    }
  });

  const socials = ['Facebook', 'WhatsApp', 'Instagram', 'TikTok', 'Telegram', 'LinkedIn', 'X'];
  for (const [i, platform] of socials.entries()) {
    await prisma.socialLink.upsert({
      where: { platform },
      update: {},
      create: { platform, url: '', isActive: false, sortOrder: i }
    });
  }

  console.log('Seeding demo products...');
  for (const [index, p] of PRODUCTS.entries()) {
    const category = await prisma.category.findUnique({ where: { slug: slugify(p.category) } });
    if (!category) continue;

    const sku = `BHC-${p.brand.slice(0, 3).toUpperCase()}-${String(index + 1).padStart(4, '0')}`;
    const stockStatus =
      p.stock <= 0 ? StockStatus.OUT_OF_STOCK : p.stock <= 5 ? StockStatus.LOW_STOCK : StockStatus.IN_STOCK;

    await prisma.product.upsert({
      where: { slug: slugify(p.name) },
      update: {},
      create: {
        name: p.name,
        slug: slugify(p.name),
        sku,
        brand: p.brand,
        modelNumber: p.model,
        shortDescription: p.description.split('.')[0] + '.',
        description: p.description,
        specifications: p.specs,
        warrantyInfo: p.specs.Warranty ?? '12 months warranty on parts and labour',
        price: p.price,
        previousPrice: p.previousPrice,
        condition: p.condition ?? ProductCondition.NEW,
        isFeatured: p.featured ?? false,
        isBestSeller: p.bestSeller ?? false,
        isNewArrival: p.newArrival ?? false,
        isOnSale: Boolean(p.previousPrice),
        isDemo: true,
        tags: [p.brand.toLowerCase(), p.category.toLowerCase()],
        categoryId: category.id,
        metaTitle: p.name,
        metaDescription: p.description.slice(0, 155),
        inventory: {
          create: {
            stockQuantity: p.stock,
            minStockLevel: 5,
            totalReceived: p.stock,
            stockStatus
          }
        }
      }
    });
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
