import { Card } from "@/components/ui/card";

const metrics = [
  { label: "Vật tư đang quản lý", value: "0", note: "Đồng bộ từ danh mục vật tư" },
  { label: "Công thức kích hoạt", value: "0", note: "Một công thức, nhiều biến thể" },
  { label: "Báo giá nháp", value: "0", note: "Sinh BOM tại thời điểm lập" },
  { label: "Cần kiểm tồn", value: "0", note: "Theo thanh và số lượng" }
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Tổng quan</h1>
        <p className="mt-1 text-sm text-muted">Tổng quan vận hành kho nhôm kính theo vật tư, thanh nhôm, công thức và báo giá.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="p-4">
            <div className="text-sm text-muted">{metric.label}</div>
            <div className="mt-3 text-3xl font-semibold text-ink">{metric.value}</div>
            <div className="mt-2 text-xs text-muted">{metric.note}</div>
          </Card>
        ))}
      </div>
      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="text-base font-semibold text-ink">Luồng báo giá</h2>
          <div className="mt-4 space-y-3 text-sm text-muted">
            <div>1. Chọn công thức gốc.</div>
            <div>2. Chọn biến thể, ví dụ mở trái hoặc mở phải.</div>
            <div>3. Nhập WIDTH, HEIGHT và các tham số khác.</div>
            <div>4. Hệ thống sinh BOM tại thời điểm lập và lưu snapshot vào báo giá.</div>
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="text-base font-semibold text-ink">Nguyên tắc tồn kho</h2>
          <div className="mt-4 space-y-3 text-sm text-muted">
            <div>Vật tư quản lý chiều dài được theo dõi từng thanh trong kho.</div>
            <div>Vật tư không quản lý chiều dài được tổng hợp theo phát sinh nhập xuất.</div>
            <div>Mỗi phát sinh kho có tham chiếu để truy vết về báo giá hoặc phiếu xuất.</div>
          </div>
        </Card>
      </section>
    </div>
  );
}
