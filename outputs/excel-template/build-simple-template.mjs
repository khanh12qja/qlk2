import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "G:/codekeyen/qlk2/outputs/excel-template";
const outputPath = `${outputDir}/mau_cong_thuc_toi_gian_co_bien_the.xlsx`;

await fs.mkdir(outputDir, { recursive: true });

const workbook = Workbook.create();
const green = "#1F5B45";
const light = "#EAF2ED";
const line = "#D9E2DC";
const white = "#FFFFFF";

function colToIndex(col) {
  let n = 0;
  for (const ch of col) n = n * 26 + ch.charCodeAt(0) - 64;
  return n - 1;
}

function title(sheet, text, note, lastCol) {
  sheet.showGridLines = false;
  sheet.getRange(`A1:${lastCol}1`).merge();
  sheet.getRange("A1").values = [[text]];
  sheet.getRange("A1").format = { fill: green, font: { bold: true, color: white, size: 14 }, wrapText: true };
  sheet.getRange(`A2:${lastCol}2`).merge();
  sheet.getRange("A2").values = [[note]];
  sheet.getRange("A2").format = { fill: light, font: { color: "#21362D" }, wrapText: true };
}

function table(sheet, startCell, headers, rows, tableName) {
  const startCol = startCell.match(/[A-Z]+/)[0];
  const startRow = Number(startCell.match(/\d+/)[0]);
  const range = sheet.getRangeByIndexes(startRow - 1, colToIndex(startCol), rows.length + 1, headers.length);
  range.values = [headers, ...rows];
  sheet.getRangeByIndexes(startRow - 1, colToIndex(startCol), 1, headers.length).format = {
    fill: green,
    font: { bold: true, color: white },
    wrapText: true,
  };
  range.format.borders = {
    insideHorizontal: { style: "thin", color: line },
    bottom: { style: "thin", color: line },
  };
  try {
    const t = sheet.tables.add(range.address, true, tableName);
    t.style = "TableStyleMedium4";
    t.showFilterButton = true;
  } catch {}
}

function widths(sheet, values) {
  for (const [col, width] of Object.entries(values)) {
    sheet.getRange(`${col}:${col}`).format.columnWidth = width;
  }
}

const formula = workbook.worksheets.add("Cong_thuc_bo");
title(
  formula,
  "Nhap cong thuc tao bo san pham",
  "Moi dong la 1 loai linh kien trong cong thuc nen BASE. Mau sac, loai kinh, kieu mo la lua chon loc ton kho sau.",
  "J",
);
table(
  formula,
  "A4",
  [
    "ma_bo",
    "ten_bo",
    "ma_he",
    "ma_linh_kien",
    "ten_linh_kien",
    "so_luong",
    "cach_tinh",
    "ap_dung_kinh",
    "bat_buoc",
    "ghi_chu",
  ],
  [
    ["PT995", "Bo phong tam he 995", "995", "TNRT", "Thanh ray tren", 1, "CHIEU_RONG", "KHONG", "CO", ""],
    ["PT995", "Bo phong tam he 995", "995", "TNDH", "Thanh chan nuoc duoi", 1, "CHIEU_RONG", "KHONG", "CO", ""],
    ["PT995", "Bo phong tam he 995", "995", "TNDU", "U fix duoi", 1, "CHIEU_RONG", "CO", "CO", ""],
    ["PT995", "Bo phong tam he 995", "995", "TDFT", "Thanh dung Tuong - Kinh co dinh", 1, "CHIEU_CAO", "CO", "CO", ""],
    ["PT995", "Bo phong tam he 995", "995", "TDFP", "Thanh dung Tuong - Kinh co dinh", 1, "CHIEU_CAO", "CO", "CO", ""],
    ["PT995", "Bo phong tam he 995", "995", "TDCT", "Thanh dung Tuong-Canh", 1, "CHIEU_CAO", "CO", "CO", ""],
    ["PT995", "Bo phong tam he 995", "995", "TDVF", "Thanh vien fix", 1, "CHIEU_CAO", "CO", "CO", ""],
    ["PT995", "Bo phong tam he 995", "995", "TDVC", "Thanh vien canh", 2, "CHIEU_CAO", "CO", "CO", ""],
    ["PT995", "Bo phong tam he 995", "995", "DH", "Dan huong", 1, "CHIEU_RONG", "KHONG", "CO", ""],
    ["PT995", "Bo phong tam he 995", "995", "GC", "Giam chan", 2, "SO_LUONG", "KHONG", "KHONG", "Ma chung, khong theo he neu can"],
    ["PT995", "Bo phong tam he 995", "995", "BPK", "Hop phu kien", 1, "SO_LUONG", "KHONG", "CO", ""],
    ["PT995", "Bo phong tam he 995", "995", "TN", "Tay nam", 1, "SO_LUONG", "KHONG", "KHONG", "Ma chung, khong theo he neu can"],
    ...Array.from({ length: 38 }, () => ["", "", "", "", "", "", "", "", "", ""]),
  ],
  "CongThucBoTable",
);
formula.freezePanes.freezeRows(4);
widths(formula, { A: 14, B: 26, C: 20, D: 10, E: 14, F: 36, G: 10, H: 16, I: 14, J: 36 });
formula.getRange("G5:G300").dataValidation = { rule: { type: "list", values: ["CHIEU_RONG", "CHIEU_CAO", "SO_LUONG", "CO_DINH"] } };
formula.getRange("H5:I300").dataValidation = { rule: { type: "list", values: ["CO", "KHONG"] } };

const variants = workbook.worksheets.add("Bien_the_thay_doi");
title(
  variants,
  "Bien the thay doi linh kien",
  "Chi khai bao phan khac BASE. Dung REPLACE de thay loai linh kien, ADD de them, REMOVE de bo.",
  "K",
);
table(
  variants,
  "A4",
  [
    "ma_bo",
    "ma_bien_the",
    "ten_bien_the",
    "thao_tac",
    "ma_linh_kien_goc",
    "ma_linh_kien_moi",
    "ten_linh_kien_moi",
    "so_luong",
    "cach_tinh",
    "ap_dung_kinh",
    "ghi_chu",
  ],
  [
    ["PT995", "A", "Bien the mau cau tao A", "REPLACE", "GC", "GC-A", "Giam chan loai A", 2, "SO_LUONG", "KHONG", "Thay giam chan"],
    ["PT995", "A", "Bien the mau cau tao A", "REPLACE", "TN", "TN-A", "Tay nam loai A", 1, "SO_LUONG", "KHONG", "Thay tay nam"],
    ["PT995", "B", "Bien the mau cau tao B", "REMOVE", "GC", "", "", "", "", "", "Bo giam chan"],
    ["PT995", "B", "Bien the mau cau tao B", "ADD", "", "BPK-B", "Hop phu kien B", 1, "SO_LUONG", "KHONG", "Them hop phu kien rieng"],
    ...Array.from({ length: 36 }, () => ["", "", "", "", "", "", "", "", "", "", ""]),
  ],
  "BienTheTable",
);
variants.freezePanes.freezeRows(4);
widths(variants, { A: 14, B: 14, C: 26, D: 14, E: 18, F: 18, G: 34, H: 10, I: 16, J: 14, K: 38 });
variants.getRange("D5:D300").dataValidation = { rule: { type: "list", values: ["REPLACE", "ADD", "REMOVE"] } };
variants.getRange("I5:I300").dataValidation = { rule: { type: "list", values: ["CHIEU_RONG", "CHIEU_CAO", "SO_LUONG", "CO_DINH"] } };
variants.getRange("J5:J300").dataValidation = { rule: { type: "list", values: ["CO", "KHONG"] } };

const parts = workbook.worksheets.add("Loai_linh_kien");
title(
  parts,
  "Danh muc loai linh kien",
  "Bang nay chi dung de chuan hoa ma linh kien. He thong se ghep ma he/mau/kieu kinh tu kho va bo loc sau.",
  "G",
);
table(
  parts,
  "A4",
  ["ma_linh_kien", "ten_linh_kien", "don_vi", "mac_dinh_cach_tinh", "mac_dinh_ap_dung_kinh", "co_the_dung_ma_chung", "ghi_chu"],
  [
    ["TNRT", "Thanh ray tren", "THANH", "CHIEU_RONG", "KHONG", "KHONG", ""],
    ["TNDH", "Thanh chan nuoc duoi", "THANH", "CHIEU_RONG", "KHONG", "KHONG", ""],
    ["TNDU", "U fix duoi", "THANH", "CHIEU_RONG", "CO", "KHONG", ""],
    ["TDFT", "Thanh dung Tuong - Kinh co dinh", "THANH", "CHIEU_CAO", "CO", "KHONG", ""],
    ["TDFP", "Thanh dung Tuong - Kinh co dinh", "THANH", "CHIEU_CAO", "CO", "KHONG", ""],
    ["TDCT", "Thanh dung Tuong-Canh", "THANH", "CHIEU_CAO", "CO", "KHONG", ""],
    ["TDVF", "Thanh vien fix", "THANH", "CHIEU_CAO", "CO", "KHONG", ""],
    ["TDVC", "Thanh vien canh", "THANH", "CHIEU_CAO", "CO", "KHONG", ""],
    ["DH", "Dan huong", "CAI", "CHIEU_RONG", "KHONG", "KHONG", ""],
    ["GC", "Giam chan", "CAI", "SO_LUONG", "KHONG", "CO", ""],
    ["BPK", "Hop phu kien", "BO", "SO_LUONG", "KHONG", "KHONG", ""],
    ["TN", "Tay nam", "CAI", "SO_LUONG", "KHONG", "CO", ""],
    ...Array.from({ length: 18 }, () => ["", "", "", "", "", "", ""]),
  ],
  "LoaiLinhKienTable",
);
parts.freezePanes.freezeRows(4);
widths(parts, { A: 16, B: 38, C: 12, D: 20, E: 22, F: 22, G: 34 });
parts.getRange("D5:D200").dataValidation = { rule: { type: "list", values: ["CHIEU_RONG", "CHIEU_CAO", "SO_LUONG", "CO_DINH"] } };
parts.getRange("E5:F200").dataValidation = { rule: { type: "list", values: ["CO", "KHONG"] } };

const guide = workbook.worksheets.add("Ghi_chu_logic");
title(
  guide,
  "Logic goi y",
  "Mau/kieu kinh/kieu mo nen nam o man hinh tra cuu va ton kho. Cong thuc chi mo ta bo gom nhung linh kien nao va so luong/cach cat.",
  "C",
);
table(
  guide,
  "A4",
  ["Noi dung", "Nen lam", "Ly do"],
  [
    ["Cong thuc BASE", "Khai bao day du linh kien mac dinh cua bo", "La nen chung cho tat ca bien the"],
    ["Bien the", "Chi khai bao phan khac BASE bang ADD/REMOVE/REPLACE", "Khong phai copy nguyen cong thuc"],
    ["Mau sac", "Chon khi tra cuu/nhap kho", "Cung 1 cong thuc co the co nhieu mau ton kho"],
    ["Loai kinh", "Chon khi tra cuu/nhap kho", "Kinh 8 dung duoc phu kien 8/10/12; kinh 10 dung 10/12; kinh 12 chi dung 12"],
    ["Kieu mo", "Chon khi tra cuu neu khong lam doi linh kien", "Neu kieu mo lam doi cau tao thi moi dua vao bien_the_cau_tao"],
  ],
  "GhiChuLogicTable",
);
widths(guide, { A: 20, B: 40, C: 58 });

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 50 },
  summary: "final formula error scan",
});
console.log(errors.ndjson);

const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(outputPath);
console.log(outputPath);
