import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";

const envPath = path.join(process.cwd(), "apps", "api", ".env");
const envContent = fs.readFileSync(envPath, "utf8");
const mongodbUri = readEnvValue(envContent, "MONGODB_URI");

if (!mongodbUri) {
  throw new Error("Khong tim thay MONGODB_URI");
}

await mongoose.connect(mongodbUri);

try {
  const db = mongoose.connection.db;
  const now = new Date();

  await db.collection("dictionaries").updateOne(
    { code: "MATERIAL_CATEGORY" },
    {
      $set: {
        code: "MATERIAL_CATEGORY",
        name: "Nhom vat tu",
        items: [
          { code: "BAN_LE", label: "Ban le", sortOrder: 1, status: "active" },
          { code: "THANH_DUNG", label: "Thanh dung", sortOrder: 2, status: "active" }
        ],
        updatedAt: now
      },
      $setOnInsert: { createdAt: now }
    },
    { upsert: true }
  );

  await db.collection("dictionaries").updateOne(
    { code: "MATERIAL_COLOR" },
    {
      $set: {
        code: "MATERIAL_COLOR",
        name: "Mau sac vat tu",
        items: [
          { code: "DEN", label: "Mau den", sortOrder: 1, status: "active" },
          { code: "VANG", label: "Mau vang", sortOrder: 2, status: "active" },
          { code: "TRANG", label: "Mau trang", sortOrder: 3, status: "active" }
        ],
        updatedAt: now
      },
      $setOnInsert: { createdAt: now }
    },
    { upsert: true }
  );

  await db.collection("dictionaries").updateOne(
    { code: "MATERIAL_UNIT" },
    {
      $set: {
        code: "MATERIAL_UNIT",
        name: "Don vi vat tu",
        items: [
          { code: "THANH", label: "thanh", sortOrder: 1, status: "active" },
          { code: "CAI", label: "cai", sortOrder: 2, status: "active" }
        ],
        updatedAt: now
      },
      $setOnInsert: { createdAt: now }
    },
    { upsert: true }
  );

  await db.collection("formulas").deleteMany({});
  await db.collection("materials").deleteMany({});
  await db.collection("stock_bars").deleteMany({});
  await db.collection("stock_movements").deleteMany({});

  const warehouse = await db.collection("warehouses").findOneAndUpdate(
    { code: "KHO_DEMO" },
    {
      $set: {
        code: "KHO_DEMO",
        name: "Kho demo phong tam kinh",
        address: "Kho test demo",
        status: "active",
        updatedAt: now
      },
      $setOnInsert: { createdAt: now }
    },
    { upsert: true, returnDocument: "after" }
  );

  const warehouseId = warehouse?._id;
  if (!warehouseId) {
    throw new Error("Khong tao duoc kho demo");
  }

  const colors = [
    { code: "DEN", label: "Mau den" },
    { code: "VANG", label: "Mau vang" },
    { code: "TRANG", label: "Mau trang" }
  ];
  const openings = [
    { code: "QUAY", label: "Mo quay" },
    { code: "TRUOT", label: "Mo truot" }
  ];

  const materialConfigs = [];
  materialConfigs.push({
    key: "DAMPER_COMMON",
    category: "BAN_LE",
    baseCode: "GC992",
    code: "BANLEGC992",
    name: "Giam chan dung chung 992",
    unit: "CAI",
    manageLength: false,
    status: "active"
  });
  for (const color of colors) {
    materialConfigs.push({
      key: `BAR_QUAY_${color.code}`,
      category: "THANH_DUNG",
      baseCode: "Q992",
      code: `THANHDUNGQ992${color.code}`,
      name: `Thanh dung 992 mo quay ${color.label.toLowerCase()}`,
      colorCode: color.code,
      colorName: color.label,
      unit: "THANH",
      manageLength: true,
      standardLength: 2200,
      status: "active"
    });
    materialConfigs.push({
      key: `BAR_TRUOT_${color.code}`,
      category: "THANH_DUNG",
      baseCode: "T992",
      code: `THANHDUNGT992${color.code}`,
      name: `Thanh dung 992 mo truot ${color.label.toLowerCase()}`,
      colorCode: color.code,
      colorName: color.label,
      unit: "THANH",
      manageLength: true,
      standardLength: 2100,
      status: "active"
    });
    materialConfigs.push({
      key: `HINGE_QUAY_${color.code}`,
      category: "BAN_LE",
      baseCode: "Q992",
      code: `BANLEQ992${color.code}`,
      name: `Ban le 992 mo quay ${color.label.toLowerCase()}`,
      colorCode: color.code,
      colorName: color.label,
      unit: "CAI",
      manageLength: false,
      status: "active"
    });
    materialConfigs.push({
      key: `HINGE_TRUOT_${color.code}`,
      category: "BAN_LE",
      baseCode: "T992",
      code: `BANLET992${color.code}`,
      name: `Ban le 992 mo truot ${color.label.toLowerCase()}`,
      colorCode: color.code,
      colorName: color.label,
      unit: "CAI",
      manageLength: false,
      status: "active"
    });
  }

  const materialDocs = materialConfigs.map((item) => ({
    ...item,
    _id: new mongoose.Types.ObjectId(),
    createdAt: now,
    updatedAt: now
  }));

  await db.collection("materials").insertMany(materialDocs);
  const materialMap = new Map(materialDocs.map((item) => [item.key, item]));

  const formula = {
    _id: new mongoose.Types.ObjectId(),
    code: "PTK992",
    name: "Phong tam kinh 992",
    parameters: [
      {
        code: "CHIEU_CAO",
        label: "Chieu cao can cat",
        type: "number",
        required: true
      },
      {
        code: "MAU",
        label: "Mau",
        type: "select",
        required: true,
        options: colors.map((item, index) => ({ code: item.code, label: item.label, sortOrder: index + 1 }))
      },
      {
        code: "KIEU_MO",
        label: "Kieu mo",
        type: "select",
        required: true,
        options: openings.map((item, index) => ({ code: item.code, label: item.label, sortOrder: index + 1 }))
      }
    ],
    variants: colors.flatMap((color) =>
      openings.map((opening) => ({
        code: `PTK992_MAU_${color.code}_KIEU_MO_${opening.code}`,
        name: `Phong tam kinh 992 - ${color.label} - ${opening.label}`,
        parameters: {
          MAU: color.code,
          KIEU_MO: opening.code
        },
        status: "active"
      }))
    ),
    items: [
      {
        lineCode: "GIAM_CHAN_CHUNG",
        materialId: materialMap.get("DAMPER_COMMON")._id,
        description: "Giam chan dung chung",
        quantityExpression: "1",
        conditionExpression: "",
        wasteRate: 0
      },
      ...colors.flatMap((color) => [
        {
          lineCode: `THANH_QUAY_${color.code}`,
          materialId: materialMap.get(`BAR_QUAY_${color.code}`)._id,
          description: `Thanh dung mo quay ${color.label.toLowerCase()}`,
          lengthExpression: "CHIEU_CAO",
          quantityExpression: "2",
        conditionExpression: `MAU==${color.code} && KIEU_MO==QUAY`,
        wasteRate: 0
      },
      {
        lineCode: `BAN_LE_QUAY_${color.code}`,
        materialId: materialMap.get(`HINGE_QUAY_${color.code}`)._id,
        description: `Ban le mo quay ${color.label.toLowerCase()}`,
        quantityExpression: "2",
        conditionExpression: `MAU==${color.code} && KIEU_MO==QUAY`,
        wasteRate: 0
      },
      {
        lineCode: `THANH_TRUOT_${color.code}`,
        materialId: materialMap.get(`BAR_TRUOT_${color.code}`)._id,
        description: `Thanh dung mo truot ${color.label.toLowerCase()}`,
        lengthExpression: "CHIEU_CAO",
        quantityExpression: "2",
        conditionExpression: `MAU==${color.code} && KIEU_MO==TRUOT`,
        wasteRate: 0
      },
        {
          lineCode: `BAN_LE_TRUOT_${color.code}`,
          materialId: materialMap.get(`HINGE_TRUOT_${color.code}`)._id,
          description: `Ban le mo truot ${color.label.toLowerCase()}`,
          quantityExpression: "2",
          conditionExpression: `MAU==${color.code} && KIEU_MO==TRUOT`,
          wasteRate: 0
        }
      ])
    ],
    status: "active",
    createdAt: now,
    updatedAt: now
  };

  await db.collection("formulas").insertOne(formula);

  const barStocks = [
    { key: "BAR_QUAY_DEN", qty: 3, length: 2200 },
    { key: "BAR_QUAY_DEN", qty: 2, length: 2350 },
    { key: "BAR_QUAY_DEN", qty: 1, length: 2500 },
    { key: "BAR_TRUOT_DEN", qty: 2, length: 2050 },
    { key: "BAR_TRUOT_DEN", qty: 3, length: 2150 },
    { key: "BAR_TRUOT_DEN", qty: 1, length: 2250 },
    { key: "BAR_QUAY_VANG", qty: 1, length: 2100 },
    { key: "BAR_QUAY_VANG", qty: 2, length: 2250 },
    { key: "BAR_QUAY_VANG", qty: 1, length: 2400 },
    { key: "BAR_TRUOT_VANG", qty: 2, length: 2000 },
    { key: "BAR_TRUOT_VANG", qty: 4, length: 2150 },
    { key: "BAR_TRUOT_VANG", qty: 2, length: 2300 },
    { key: "BAR_QUAY_TRANG", qty: 4, length: 2200 },
    { key: "BAR_QUAY_TRANG", qty: 2, length: 2450 },
    { key: "BAR_TRUOT_TRANG", qty: 1, length: 2050 },
    { key: "BAR_TRUOT_TRANG", qty: 2, length: 2200 }
  ].map((item) => ({
    _id: new mongoose.Types.ObjectId(),
    materialId: materialMap.get(item.key)._id,
    warehouseId,
    originalLength: item.length,
    remainingLength: item.length,
    quantity: item.qty,
    status: "available",
    createdAt: now,
    updatedAt: now
  }));

  await db.collection("stock_bars").insertMany(barStocks);

  const quantityStocks = [
    { key: "DAMPER_COMMON", qty: 5 },
    { key: "HINGE_QUAY_DEN", qty: 10 },
    { key: "HINGE_TRUOT_DEN", qty: 12 },
    { key: "HINGE_QUAY_VANG", qty: 8 },
    { key: "HINGE_TRUOT_VANG", qty: 6 },
    { key: "HINGE_QUAY_TRANG", qty: 4 },
    { key: "HINGE_TRUOT_TRANG", qty: 10 }
  ].map((item) => ({
    _id: new mongoose.Types.ObjectId(),
    materialId: materialMap.get(item.key)._id,
    warehouseId,
    type: "in",
    quantity: item.qty,
    referenceType: "seed",
    note: "Seed demo PTK992",
    createdAt: now,
    updatedAt: now
  }));

  await db.collection("stock_movements").insertMany(quantityStocks);

  console.log(
    JSON.stringify(
      {
        warehouse: { id: String(warehouseId), code: "KHO_DEMO" },
        materials: materialDocs.length,
        formulaCode: formula.code,
        variants: formula.variants.length,
        barStocks: barStocks.length,
        quantityStocks: quantityStocks.length
      },
      null,
      2
    )
  );
} finally {
  await mongoose.disconnect();
}

function readEnvValue(content, key) {
  const line = content
    .split(/\r?\n/)
    .find((entry) => entry.trim().startsWith(`${key}=`));

  return line ? line.slice(line.indexOf("=") + 1).trim() : "";
}
