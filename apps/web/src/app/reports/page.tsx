import { Card } from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Báo cáo</h1>
        <p className="mt-1 text-sm text-muted">Báo cáo tồn kho, phát sinh kho và vật tư theo công trình sẽ mở rộng trên cùng nghiệp vụ tồn kho.</p>
      </div>
      <Card className="p-5 text-sm text-muted">Phân hệ báo cáo đã sẵn sàng để gắn các truy vấn tổng hợp MongoDB theo nhu cầu vận hành.</Card>
    </div>
  );
}
