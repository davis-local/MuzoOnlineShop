#!/usr/bin/env node

/**
 * Demo seed script for Muzo Online Shop.
 *
 * You can edit `apiUrl` directly before running, or override it from the terminal.
 * The API token must be provided from the terminal:
 *
 * MUZO_API_URL=http://localhost:5079 MUZO_API_TOKEN=your-token npm run seed:demo
 */

const CONFIG = {
  apiUrl: process.env.MUZO_API_URL ?? "http://localhost:5079",
  token: process.env.MUZO_API_TOKEN ?? "",
  categoryCount: 30,
  productCount: 200,
  productPageSize: 100,
  requestDelayMs: 0,
};

const CATEGORY_BLUEPRINTS = [
  {
    key: "electronics",
    name: "Electronics",
    description: "Devices and smart gadgets.",
    parentKey: null,
  },
  {
    key: "home-kitchen",
    name: "Home & Kitchen",
    description: "Essentials for living and cooking.",
    parentKey: null,
  },
  {
    key: "fashion",
    name: "Fashion",
    description: "Everyday style and wardrobe pieces.",
    parentKey: null,
  },
  {
    key: "sports-outdoors",
    name: "Sports & Outdoors",
    description: "Gear for fitness and adventure.",
    parentKey: null,
  },
  {
    key: "beauty-health",
    name: "Beauty & Health",
    description: "Care and wellness products.",
    parentKey: null,
  },
  {
    key: "office-tech",
    name: "Office & Tech",
    description: "Workspace and productivity tools.",
    parentKey: null,
  },

  {
    key: "phones-tablets",
    name: "Phones & Tablets",
    description: "Portable connected devices.",
    parentKey: "electronics",
  },
  {
    key: "audio-video",
    name: "Audio & Video",
    description: "Sound, screens, and streaming gear.",
    parentKey: "electronics",
  },
  {
    key: "computing",
    name: "Computing",
    description: "Laptops, desktops, and computing accessories.",
    parentKey: "electronics",
  },
  {
    key: "cookware",
    name: "Cookware",
    description: "Pots, pans, and kitchen prep tools.",
    parentKey: "home-kitchen",
  },
  {
    key: "storage-organization",
    name: "Storage & Organization",
    description: "Shelving, bins, and home order tools.",
    parentKey: "home-kitchen",
  },
  {
    key: "home-decor",
    name: "Home Decor",
    description: "Finishing touches for modern interiors.",
    parentKey: "home-kitchen",
  },
  {
    key: "mens-wear",
    name: "Men's Wear",
    description: "Clothing and accessories for men.",
    parentKey: "fashion",
  },
  {
    key: "womens-wear",
    name: "Women's Wear",
    description: "Clothing and accessories for women.",
    parentKey: "fashion",
  },
  {
    key: "footwear",
    name: "Footwear",
    description: "Shoes and comfort essentials.",
    parentKey: "fashion",
  },
  {
    key: "fitness",
    name: "Fitness",
    description: "Training and workout support.",
    parentKey: "sports-outdoors",
  },
  {
    key: "camping",
    name: "Camping",
    description: "Outdoor sleep, light, and travel gear.",
    parentKey: "sports-outdoors",
  },
  {
    key: "cycling",
    name: "Cycling",
    description: "Bikes, protection, and ride accessories.",
    parentKey: "sports-outdoors",
  },
  {
    key: "skincare",
    name: "Skincare",
    description: "Daily skin essentials and treatments.",
    parentKey: "beauty-health",
  },
  {
    key: "personal-care",
    name: "Personal Care",
    description: "Daily hygiene and grooming items.",
    parentKey: "beauty-health",
  },
  {
    key: "nutrition",
    name: "Nutrition",
    description: "Supplements and healthy living products.",
    parentKey: "beauty-health",
  },
  {
    key: "office-furniture",
    name: "Office Furniture",
    description: "Desks, chairs, and workspace support.",
    parentKey: "office-tech",
  },
  {
    key: "office-supplies",
    name: "Office Supplies",
    description: "Daily stationery and desk stock.",
    parentKey: "office-tech",
  },
  {
    key: "tech-accessories",
    name: "Tech Accessories",
    description: "Chargers, cables, and device helpers.",
    parentKey: "office-tech",
  },

  {
    key: "android-phones",
    name: "Android Phones",
    description: "Smartphones powered for daily use.",
    parentKey: "phones-tablets",
  },
  {
    key: "wireless-earbuds",
    name: "Wireless Earbuds",
    description: "Portable audio for work and travel.",
    parentKey: "audio-video",
  },
  {
    key: "gaming-laptops",
    name: "Gaming Laptops",
    description: "Performance laptops for play and power.",
    parentKey: "computing",
  },
  {
    key: "non-stick-pans",
    name: "Non-Stick Pans",
    description: "Easy-release pans for home cooking.",
    parentKey: "cookware",
  },
  {
    key: "running-shoes",
    name: "Running Shoes",
    description: "Footwear built for speed and comfort.",
    parentKey: "footwear",
  },
  {
    key: "protein-supplements",
    name: "Protein Supplements",
    description: "Workout recovery and nutrition support.",
    parentKey: "nutrition",
  },
];

const PRODUCT_BASE_NAMES = [
  "Core",
  "Prime",
  "Ultra",
  "Flex",
  "Active",
  "Smart",
  "Urban",
  "Trail",
  "Elite",
  "Nova",
  "Pure",
  "Pro",
  "Essential",
  "Summit",
  "Vertex",
  "Pulse",
  "Glow",
  "Shield",
  "Edge",
  "Zen",
];

const PRODUCT_DESCRIPTORS = [
  "Series",
  "Collection",
  "Edition",
  "Kit",
  "Bundle",
  "Pack",
  "Set",
  "Model",
  "Line",
  "Range",
];

const PRODUCT_FEATURES = [
  "built for daily use",
  "designed for comfort and reliability",
  "optimized for performance",
  "crafted for modern homes",
  "suited for busy workspaces",
  "made for lightweight travel",
  "balanced for quality and value",
  "tuned for long-lasting use",
  "styled for a clean premium look",
  "ready for all-day productivity",
];

function sleep(ms) {
  if (!ms) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function ensureConfig() {
  if (!CONFIG.apiUrl) {
    throw new Error("Missing API URL. Set CONFIG.apiUrl or MUZO_API_URL.");
  }

  if (!CONFIG.token || CONFIG.token === "PASTE_YOUR_BEARER_TOKEN_HERE") {
    throw new Error(
      "Missing token. Set CONFIG.token or MUZO_API_TOKEN before running the script.",
    );
  }
}

function buildHeaders() {
  return {
    Accept: "application/json",
    Authorization: CONFIG.token.startsWith("Bearer ")
      ? CONFIG.token
      : `Bearer ${CONFIG.token}`,
    "Content-Type": "application/json",
  };
}

async function request(path, options = {}) {
  const response = await fetch(`${CONFIG.apiUrl.replace(/\/+$/, "")}${path}`, {
    ...options,
    headers: {
      ...buildHeaders(),
      ...(options.headers ?? {}),
    },
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "string"
        ? payload || response.statusText
        : payload?.message || response.statusText;

    throw new Error(`${response.status} ${response.statusText}: ${message}`);
  }

  return payload;
}

async function fetchAllProducts() {
  const products = [];
  let page = 1;

  for (;;) {
    const batch = await request(
      `/api/products?page=${page}&pageSize=${CONFIG.productPageSize}`,
      { method: "GET" },
    );

    if (!Array.isArray(batch) || batch.length === 0) {
      break;
    }

    products.push(...batch);

    if (batch.length < CONFIG.productPageSize) {
      break;
    }

    page += 1;
  }

  return products;
}

function getCategoryProductTargets(leafCategories, productCount) {
  const targets = new Map();

  leafCategories.forEach((category) => {
    targets.set(category.key, 0);
  });

  for (let index = 0; index < productCount; index += 1) {
    const category = leafCategories[index % leafCategories.length];
    targets.set(category.key, (targets.get(category.key) ?? 0) + 1);
  }

  return targets;
}

function buildProductCatalog(leafCategories) {
  const categoryTargets = getCategoryProductTargets(
    leafCategories,
    CONFIG.productCount,
  );
  const products = [];

  let serial = 1;

  for (const category of leafCategories) {
    const targetCount = categoryTargets.get(category.key) ?? 0;

    for (let index = 0; index < targetCount; index += 1) {
      const nameBase =
        PRODUCT_BASE_NAMES[(serial - 1) % PRODUCT_BASE_NAMES.length];
      const descriptor =
        PRODUCT_DESCRIPTORS[(serial - 1) % PRODUCT_DESCRIPTORS.length];
      const feature = PRODUCT_FEATURES[(serial - 1) % PRODUCT_FEATURES.length];
      const categoryToken = category.name
        .replace(/[^A-Za-z0-9]+/g, " ")
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .join(" ");
      const sku = `MUZO-DEMO-${String(serial).padStart(4, "0")}`;

      products.push({
        sku,
        body: {
          name: `${nameBase} ${categoryToken} ${descriptor}`,
          description: `${category.name} item ${serial} ${feature}.`,
          sku,
          price: Number(
            (19 + ((serial * 7) % 380) + (index % 3) * 0.99).toFixed(2),
          ),
          quantity: (serial * 3) % 45,
          categoryKey: category.key,
        },
      });

      serial += 1;
    }
  }

  return products;
}

async function createOrReuseCategories() {
  const existingCategories = await request("/api/categories", {
    method: "GET",
  });
  const categoriesByName = new Map(
    existingCategories.map((category) => [
      category.name.toLowerCase(),
      category,
    ]),
  );
  const createdByKey = new Map();

  for (const blueprint of CATEGORY_BLUEPRINTS) {
    const existing = categoriesByName.get(blueprint.name.toLowerCase());

    if (existing) {
      createdByKey.set(blueprint.key, existing);
      continue;
    }

    const parentId = blueprint.parentKey
      ? (createdByKey.get(blueprint.parentKey)?.id ?? null)
      : null;

    const created = await request("/api/categories", {
      method: "POST",
      body: JSON.stringify({
        name: blueprint.name,
        description: blueprint.description,
        parentCategoryId: parentId,
      }),
    });

    createdByKey.set(blueprint.key, created);
    categoriesByName.set(blueprint.name.toLowerCase(), created);
    await sleep(CONFIG.requestDelayMs);
  }

  return createdByKey;
}

async function createProducts(categoryMap) {
  const existingProducts = await fetchAllProducts();
  const existingSkus = new Set(existingProducts.map((product) => product.sku));
  const leafCategories = CATEGORY_BLUEPRINTS.filter(
    (blueprint) =>
      !CATEGORY_BLUEPRINTS.some((item) => item.parentKey === blueprint.key),
  );
  const catalog = buildProductCatalog(leafCategories);

  let createdCount = 0;
  let skippedCount = 0;

  for (const entry of catalog) {
    if (existingSkus.has(entry.sku)) {
      skippedCount += 1;
      continue;
    }

    const categoryId = categoryMap.get(entry.body.categoryKey)?.id;

    if (!categoryId) {
      throw new Error(
        `Missing category mapping for "${entry.body.categoryKey}".`,
      );
    }

    await request("/api/products", {
      method: "POST",
      body: JSON.stringify({
        name: entry.body.name,
        description: entry.body.description,
        sku: entry.body.sku,
        price: entry.body.price,
        quantity: entry.body.quantity,
        categoryId,
      }),
    });

    existingSkus.add(entry.sku);
    createdCount += 1;
    await sleep(CONFIG.requestDelayMs);
  }

  return { createdCount, skippedCount };
}

async function main() {
  ensureConfig();

  console.log("Seeding demo data...");
  console.log(`API URL: ${CONFIG.apiUrl}`);
  console.log(`Categories planned: ${CONFIG.categoryCount}`);
  console.log(`Products planned: ${CONFIG.productCount}`);

  const categoryMap = await createOrReuseCategories();
  const productResults = await createProducts(categoryMap);

  console.log("");
  console.log("Seed complete.");
  console.log(`Categories available: ${categoryMap.size}`);
  console.log(`Products created this run: ${productResults.createdCount}`);
  console.log(
    `Products skipped because SKU already exists: ${productResults.skippedCount}`,
  );
}

main().catch((error) => {
  console.error("");
  console.error("Seed failed.");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
