import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "G:/codekeyen/qlk2/outputs/excel-template";
const outputPath = `${outputDir}/mau_import_cong_thuc_vat_tu.xlsx`;

await fs.mkdir(outputDir, { recursive: true });

const workbook = Workbook.create();
console.log("created workbook");

const palette = {
  green: "#1F5B45",
  lightGreen: "#EAF2ED",
  line: "#D9E2DC",
  pale: "#F7FAF8",
  yellow: "#FFF7D6",
  gray: "#66736D",
  white: "#FFFFFF",
};

function setTitle(sheet, title, subtitle, lastCol = "H") {
  sheet.showGridLines = false;
  sheet.getRange(`A1:${lastCol}1`).merge();
  sheet.getRange("A1").values = [[title]];
  sheet.getRange("A1").format = {
    fill: palette.green,
    font: { bold: true, color: palette.white, size: 14 },
    wrapText: true,
  };
  sheet.getRange(`A2:${lastCol}2`).merge();
  sheet.getRange("A2").values = [[subtitle]];
  sheet.getRange("A2").format = {
    fill: palette.lightGreen,
    font: { color: "#21362D", size: 10 },
    wrapText: true,
  };
  sheet.getRange("A1:A2").format.rowHeightPx = 28;
}

function writeTable(sheet, startCell, headers, rows, tableName) {
  const startCol = startCell.match(/[A-Z]+/)[0];
  const startRow = Number(startCell.match(/\d+/)[0]);
  const colCount = headers.length;
  const rowCount = rows.length + 1;
  const range = sheet.getRangeByIndexes(startRow - 1, colToIndex(startCol), rowCount, colCount);
  range.values = [headers, ...rows];
  const headerRange = sheet.getRangeByIndexes(startRow - 1, colToIndex(startCol), 1, colCount);
  headerRange.format = {
    fill: palette.green,
    font: { bold: true, color: palette.white },
    wrapText: true,
  };
  range.format.borders = {
    insideHorizontal: { style: "thin", color: palette.line },
    bottom: { style: "thin", color: palette.line },
  };
  try {
    const table = sheet.tables.add(range.address, true, tableName);
    table.style = "TableStyleMedium4";
    table.showFilterButton = true;
  } catch {
    // Table creation can fail if an address is not available in some runtimes; formatting above is still usable.
  }
  return range;
}

function colToIndex(col) {
  let n = 0;
  for (const ch of col) n = n * 26 + ch.charCodeAt(0) - 64;
  return n - 1;
}

function widths(sheet, values) {
  for (const [col, width] of Object.entries(values)) {
    sheet.getRange(`${col}:${col}`).format.columnWidth = width;
  }
}

const guide = workbook.worksheets.add("Huong_dan");
console.log("guide");
setTitle(
  guide,
  "Mau Excel import cong thuc va vat tu",
  "Dien theo tung ma linh kien. Mau sac va kieu kinh la lua chon loc kho, khong can tao bien the neu cau tao bo khong doi.",
  "H",
);
writeTable(
  guide,
  "A4",
  ["Muc", "Cach dien", "Vi du"],
  [
    ["Cong_thuc", "Moi dong la 1 linh kien trong 1 bo san pham.", "PT995 + TDVC + so luong 2 + CHIEU_CAO"],
    ["Vat_tu", "Moi dong la 1 ma vat tu cu the co mau/kieu kinh neu can.", "TDVC99510MB"],
    ["Ton_kho_mau", "Nhap kho test: thanh thi dien chieu dai, phu kien so luong thi de trong chieu dai.", "KTEST + TDVC99510MB + THANH + 2400 + 10"],
    ["Bien the cau tao", "Chi dung khi cung san pham nhung cong thuc/linh kien khac nhau.", "Mo lua / Mo quay neu cau tao khac"],
    ["Mau va kinh", "Dung de loc ton kho. Kinh nho dung duoc phu kien kinh lon hon.", "Kinh 8 dung duoc 8, 10, 12"],
  ],
  "HuongDanTable",
);
guide.getRange("A10:H10").merge();
guide.getRange("A10").values = [["Quy uoc: CO/KHONG cho cot bat/tat, CHIEU_RONG/CHIEU_CAO cho thanh cat theo kich thuoc, CO_DINH khi can nhap gia tri mm co dinh."]];
guide.getRange("A10").format = { fill: palette.yellow, wrapText: true, font: { color: "#4A3B00" } };
widths(guide, { A: 22, B: 64, C: 34 });

const formula = workbook.worksheets.add("Cong_thuc");
console.log("formula");
setTitle(
  formula,
  "Cong thuc cau tao bo san pham",
  "Nhap danh sach linh kien tao nen 1 bo. Neu chi khac mau/kinh/kieu mo thi khong tao bien the o day.",
  "L",
);
const formulaHeaders = [
  "ma_san_pham",
  "ten_san_pham",
  "bien_the_cau_tao",
  "ma_he",
  "ma_linh_kien",
  "ten_linh_kien",
  "don_vi",
  "so_luong",
  "kieu_chieu_dai",
  "gia_tri_co_dinh_mm",
  "ap_dung_kinh",
  "ghi_chu",
];
const formulaRows = [
  ["PT995", "Bo phong tam he 995", "", "995", "TNRT", "Thanh ray tren", "THANH", 1, "CHIEU_RONG", "", "KHONG", ""],
  ["PT995", "Bo phong tam he 995", "", "995", "TNDH", "Thanh chan nuoc duoi", "THANH", 1, "CHIEU_RONG", "", "KHONG", ""],
  ["PT995", "Bo phong tam he 995", "", "995", "TNDU", "U fix duoi", "THANH", 1, "CHIEU_RONG", "", "CO", ""],
  ["PT995", "Bo phong tam he 995", "", "995", "TDFT", "Thanh dung Tuong - Kinh co dinh", "THANH", 1, "CHIEU_CAO", "", "CO", ""],
  ["PT995", "Bo phong tam he 995", "", "995", "TDFP", "Thanh dung Tuong - Kinh co dinh", "THANH", 1, "CHIEU_CAO", "", "CO", ""],
  ["PT995", "Bo phong tam he 995", "", "995", "TDCT", "Thanh dung Tuong-Canh", "THANH", 1, "CHIEU_CAO", "", "CO", ""],
  ["PT995", "Bo phong tam he 995", "", "995", "TDVF", "Thanh vien fix", "THANH", 1, "CHIEU_CAO", "", "CO", ""],
  ["PT995", "Bo phong tam he 995", "", "995", "TDVC", "Thanh vien canh", "THANH", 2, "CHIEU_CAO", "", "CO", ""],
  ["PT995", "Bo phong tam he 995", "", "995", "DH", "Dan huong", "CAI", 1, "CHIEU_RONG", "", "KHONG", ""],
  ["PT995", "Bo phong tam he 995", "", "995", "GC", "Giam chan", "CAI", 2, "KHONG_AP_DUNG", "", "KHONG", "Dung ma chung neu khong phu thuoc he"],
  ["PT995", "Bo phong tam he 995", "", "995", "BPK", "Hop phu kien", "BO", 1, "KHONG_AP_DUNG", "", "KHONG", ""],
  ["PT995", "Bo phong tam he 995", "", "995", "TN", "Tay nam", "CAI", 1, "KHONG_AP_DUNG", "", "KHONG", "Dung ma chung neu khong phu thuoc he"],
  ...Array.from({ length: 18 }, () => ["", "", "", "", "", "", "", "", "", "", "", ""]),
];
writeTable(formula, "A4", formulaHeaders, formulaRows, "CongThucTable");
formula.freezePanes.freezeRows(4);
widths(formula, { A: 14, B: 26, C: 18, D: 10, E: 14, F: 34, G: 12, H: 10, I: 18, J: 18, K: 14, L: 38 });
formula.getRange("G5:G200").dataValidation = { rule: { type: "list", values: ["THANH", "CAI", "BO", "SET", "M"] } };
formula.getRange("I5:I200").dataValidation = { rule: { type: "list", values: ["CHIEU_RONG", "CHIEU_CAO", "CO_DINH", "KHONG_AP_DUNG"] } };
formula.getRange("K5:K200").dataValidation = { rule: { type: "list", values: ["CO", "KHONG"] } };

const materials = workbook.worksheets.add("Vat_tu");
console.log("materials");
setTitle(
  materials,
  "Danh muc ma vat tu cu the",
  "Dien tung ma thuc te trong kho. Voi vat tu ap dung kinh, tao cac ma 8/10/12 neu nha cung cap co rieng ma.",
  "K",
);
const materialHeaders = [
  "ma_linh_kien",
  "ma_he",
  "ma_mau",
  "loai_kinh",
  "ma_vat_tu",
  "ten_vat_tu",
  "don_vi",
  "quan_ly_theo_thanh",
  "chieu_dai_chuan_mm",
  "trang_thai",
  "ghi_chu",
];
const materialRows = [
  ["TNRT", "995", "PSS", "", "TNRT995PSS", "Thanh ray tren 995 inox bong guong", "THANH", "CO", 2400, "ACTIVE", ""],
  ["TDVC", "995", "MB", 8, "TDVC9958MB", "Thanh vien canh 995 den mo kinh 8", "THANH", "CO", 2400, "ACTIVE", ""],
  ["TDVC", "995", "MB", 10, "TDVC99510MB", "Thanh vien canh 995 den mo kinh 10", "THANH", "CO", 2400, "ACTIVE", ""],
  ["TDVC", "995", "MB", 12, "TDVC99512MB", "Thanh vien canh 995 den mo kinh 12", "THANH", "CO", 2400, "ACTIVE", ""],
  ["GC", "", "MB", "", "GCCHUNGMB", "Giam chan den mo", "CAI", "KHONG", "", "ACTIVE", "Ma chung khong theo he"],
  ["TN", "", "MB", "", "TNCHUNGMB", "Tay nam den mo", "CAI", "KHONG", "", "ACTIVE", "Ma chung khong theo he"],
  ...Array.from({ length: 34 }, () => ["", "", "", "", "", "", "", "", "", "", ""]),
];
writeTable(materials, "A4", materialHeaders, materialRows, "VatTuTable");
materials.freezePanes.freezeRows(4);
widths(materials, { A: 14, B: 10, C: 12, D: 12, E: 20, F: 42, G: 12, H: 18, I: 18, J: 14, K: 36 });
materials.getRange("C5:C300").dataValidation = { rule: { type: "list", formula1: "Mau_sac!$A$5:$A$30" } };
materials.getRange("D5:D300").dataValidation = { rule: { type: "list", values: ["", "8", "10", "12"] } };
materials.getRange("G5:G300").dataValidation = { rule: { type: "list", values: ["THANH", "CAI", "BO", "SET", "M"] } };
materials.getRange("H5:H300").dataValidation = { rule: { type: "list", values: ["CO", "KHONG"] } };
materials.getRange("J5:J300").dataValidation = { rule: { type: "list", values: ["ACTIVE", "INACTIVE"] } };

const colors = workbook.worksheets.add("Mau_sac");
console.log("colors");
setTitle(colors, "Danh muc mau sac", "Bo sung them mau o day, sau do dung ma mau trong sheet Vat_tu va Ton_kho_mau.", "D");
writeTable(
  colors,
  "A4",
  ["ma_mau", "ten_mau", "nhom_mau", "ghi_chu"],
  [
    ["PSS", "Inox bong guong", "INOX", ""],
    ["BSS", "Inox xuoc", "INOX", ""],
    ["MB", "Den mo", "DEN", ""],
    ["PTG", "Titan vang bong", "TITAN", ""],
    ...Array.from({ length: 22 }, () => ["", "", "", ""]),
  ],
  "MauSacTable",
);
colors.freezePanes.freezeRows(4);
widths(colors, { A: 14, B: 28, C: 18, D: 34 });

const mapping = workbook.worksheets.add("Mapping_linh_kien");
console.log("mapping");
setTitle(mapping, "Mapping linh kien mac dinh", "Bang tham chieu de thong nhat ten goi, don vi, kich thuoc cat va viec ap dung kinh.", "H");
writeTable(
  mapping,
  "A4",
  ["ma_linh_kien", "ten_linh_kien", "don_vi_mac_dinh", "so_luong_mac_dinh", "kieu_chieu_dai_mac_dinh", "ap_dung_kinh_mac_dinh", "co_the_dung_ma_chung", "ghi_chu"],
  [
    ["TNRT", "Thanh ray tren", "THANH", 1, "CHIEU_RONG", "KHONG", "KHONG", ""],
    ["TNDH", "Thanh chan nuoc duoi", "THANH", 1, "CHIEU_RONG", "KHONG", "KHONG", ""],
    ["TNDU", "U fix duoi", "THANH", 1, "CHIEU_RONG", "CO", "KHONG", ""],
    ["TDFT", "Thanh dung Tuong - Kinh co dinh", "THANH", 1, "CHIEU_CAO", "CO", "KHONG", ""],
    ["TDFP", "Thanh dung Tuong - Kinh co dinh", "THANH", 1, "CHIEU_CAO", "CO", "KHONG", ""],
    ["TDCT", "Thanh dung Tuong-Canh", "THANH", 1, "CHIEU_CAO", "CO", "KHONG", ""],
    ["TDVF", "Thanh vien fix", "THANH", 1, "CHIEU_CAO", "CO", "KHONG", ""],
    ["TDVC", "Thanh vien canh", "THANH", 2, "CHIEU_CAO", "CO", "KHONG", ""],
    ["DH", "Dan huong", "CAI", 1, "CHIEU_RONG", "KHONG", "KHONG", ""],
    ["GC", "Giam chan", "CAI", 2, "KHONG_AP_DUNG", "KHONG", "CO", ""],
    ["BPK", "Hop phu kien", "BO", 1, "KHONG_AP_DUNG", "KHONG", "KHONG", ""],
    ["TN", "Tay nam", "CAI", 1, "KHONG_AP_DUNG", "KHONG", "CO", ""],
  ],
  "MappingTable",
);
mapping.freezePanes.freezeRows(4);
widths(mapping, { A: 14, B: 38, C: 16, D: 18, E: 24, F: 24, G: 22, H: 32 });

const stock = workbook.worksheets.add("Ton_kho_mau");
console.log("stock");
setTitle(stock, "Mau nhap ton kho", "Dien ma kho, ma vat tu va so luong. Thanh cat theo chieu dai thi dien chieu dai ban dau/con lai bang mm.", "K");
writeTable(
  stock,
  "A4",
  ["ma_kho", "ma_vat_tu", "ma_mau", "loai_kinh", "loai_ton", "chieu_dai_ban_dau_mm", "chieu_dai_con_lai_mm", "so_luong", "gia_nhap", "ngay_nhap", "ghi_chu"],
  [
    ["KTEST", "TDVC9958MB", "MB", 8, "THANH", 2400, 2400, 10, "", "", "Test kinh 8"],
    ["KTEST", "TDVC99510MB", "MB", 10, "THANH", 2400, 2400, 7, "", "", "Test kinh 10"],
    ["KTEST", "TDVC99512MB", "MB", 12, "THANH", 2400, 2400, 5, "", "", "Test kinh 12"],
    ["KTEST", "GCCHUNGMB", "MB", "", "SO_LUONG", "", "", 20, "", "", ""],
    ["KTEST", "TNCHUNGMB", "MB", "", "SO_LUONG", "", "", 10, "", "", ""],
    ...Array.from({ length: 35 }, () => ["", "", "", "", "", "", "", "", "", "", ""]),
  ],
  "TonKhoMauTable",
);
stock.freezePanes.freezeRows(4);
widths(stock, { A: 14, B: 20, C: 12, D: 12, E: 14, F: 22, G: 22, H: 12, I: 14, J: 14, K: 32 });
stock.getRange("C5:C300").dataValidation = { rule: { type: "list", formula1: "Mau_sac!$A$5:$A$30" } };
stock.getRange("D5:D300").dataValidation = { rule: { type: "list", values: ["", "8", "10", "12"] } };
stock.getRange("E5:E300").dataValidation = { rule: { type: "list", values: ["THANH", "SO_LUONG"] } };
stock.getRange("J5:J300").format.numberFormat = "yyyy-mm-dd";

console.log("inspect");
const inspect = await workbook.inspect({
  kind: "sheet,table",
  maxChars: 4000,
  tableMaxRows: 3,
  tableMaxCols: 6,
});
console.log(inspect.ndjson);

console.log("errors");
const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 50 },
  summary: "formula error scan",
});
console.log(errors.ndjson);

console.log("export");
const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(outputPath);
console.log(outputPath);
