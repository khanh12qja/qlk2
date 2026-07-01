import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";

const rootDir = process.cwd();
const envPath = path.join(rootDir, "apps", "api", ".env");
const envContent = fs.readFileSync(envPath, "utf8");
const mongodbUri = readEnvValue(envContent, "MONGODB_URI");

if (!mongodbUri) {
  throw new Error("Khong tim thay MONGODB_URI trong apps/api/.env");
}

const materialSchema = new mongoose.Schema(
  {
    code: String,
    baseCode: String,
    name: String,
    category: String,
    colorCode: String,
    colorName: String,
    unit: String,
    manageLength: Boolean,
    standardLength: Number,
    status: String
  },
  {
    collection: "materials",
    strict: false
  }
);

const Material = mongoose.model("MaterialNormalize", materialSchema);

const overrides = {
  "6a400d19128f45e680bb668b": {
    category: "ALUMINIUM_PROFILE",
    baseCode: "ALU004913"
  },
  "6a400d90128f45e680bb6696": {
    category: "21",
    baseCode: "2"
  },
  "6a437c9b62c0120c09542c01": {
    category: "BAN_LE",
    baseCode: "992",
    colorCode: "DEN"
  },
  "6a437cd362c0120c09542c04": {
    category: "THANH_DUNG",
    baseCode: "992",
    colorCode: "DEN"
  },
  "6a439b5b51e1b8361b98abe0": {
    category: "BAN_LE",
    baseCode: "CU6A439B5B",
    colorCode: "DEN",
    status: "inactive"
  },
  "6a43acaa1aa864f84edeaf1d": {
    category: "THANH_DUNG",
    baseCode: "CU6A43ACAA",
    colorCode: "DEN",
    status: "inactive"
  }
};

await mongoose.connect(mongodbUri);

try {
  const materials = await Material.find().lean();
  const normalizedTargets = new Map();

  for (const material of materials) {
    const target = buildTarget(material);
    normalizedTargets.set(String(material._id), target);
  }

  const duplicatesByTargetCode = new Map();
  for (const [id, target] of normalizedTargets) {
    if (!target.code) {
      continue;
    }
    const ids = duplicatesByTargetCode.get(target.code) ?? [];
    ids.push(id);
    duplicatesByTargetCode.set(target.code, ids);
  }

  const updates = [];
  const skipped = [];

  for (const material of materials) {
    const id = String(material._id);
    const target = normalizedTargets.get(id);
    if (!target) {
      continue;
    }

    if (!target.code || !target.baseCode || !target.categoryRaw) {
      skipped.push({
        id,
        currentCode: material.code,
        reason: "Khong du du lieu de suy ra ma chuan"
      });
      continue;
    }

    if ((duplicatesByTargetCode.get(target.code) ?? []).length > 1) {
      skipped.push({
        id,
        currentCode: material.code,
        targetCode: target.code,
        reason: "Trung ma muc tieu voi vat tu khac"
      });
      continue;
    }

    const currentCode = compactCode(material.code ?? "");
    const currentBaseCode = compactCode(material.baseCode ?? "");
    if (currentCode === target.code && currentBaseCode === target.baseCode) {
      continue;
    }

    updates.push({
      updateOne: {
        filter: { _id: material._id },
        update: {
          $set: {
            code: target.code,
            baseCode: target.baseCode,
            category: target.categoryRaw,
            colorCode: target.colorCode,
            status: target.status,
            updatedAt: new Date()
          }
        }
      }
    });
  }

  if (updates.length > 0) {
    await Material.bulkWrite(updates);
  }

  console.log(
    JSON.stringify(
      {
        updatedCount: updates.length,
        updatedCodes: updates.map((item) => ({
          id: String(item.updateOne.filter._id),
          code: item.updateOne.update.$set.code,
          baseCode: item.updateOne.update.$set.baseCode
        })),
        skipped
      },
      null,
      2
    )
  );
} finally {
  await mongoose.disconnect();
}

function buildTarget(material) {
  const override = overrides[String(material._id)];
  const categoryRaw = override?.category ?? String(material.category ?? "").trim().toUpperCase();
  const category = compactCode(categoryRaw);
  const colorCode = compactCode(override?.colorCode ?? material.colorCode ?? "");
  const baseCode =
    compactCode(override?.baseCode ?? "") ||
    compactCode(material.baseCode ?? "") ||
    extractBaseCode(compactCode(material.code ?? ""), category, colorCode);

  return {
    categoryRaw,
    category,
    colorCode: colorCode || undefined,
    baseCode,
    code: category && baseCode ? `${category}${baseCode}${colorCode}` : "",
    status: override?.status ?? material.status
  };
}

function extractBaseCode(code, category, colorCode) {
  let candidate = code;
  if (category && candidate.startsWith(category)) {
    candidate = candidate.slice(category.length);
  }
  if (colorCode && candidate.endsWith(colorCode)) {
    candidate = candidate.slice(0, candidate.length - colorCode.length);
  }
  return candidate;
}

function compactCode(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9]/g, "")
    .toUpperCase();
}

function readEnvValue(content, key) {
  const line = content
    .split(/\r?\n/)
    .find((entry) => entry.trim().startsWith(`${key}=`));

  return line ? line.slice(line.indexOf("=") + 1).trim() : "";
}
