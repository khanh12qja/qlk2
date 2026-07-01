import Link from "next/link";
import { Boxes, ClipboardList, FileText, Gauge, Layers, Settings, Warehouse } from "lucide-react";
import { ReactNode } from "react";

const navigation = [
  { href: "/", label: "Tổng quan", icon: Gauge },
  { href: "/materials", label: "Vật tư", icon: Boxes },
  { href: "/formulas", label: "Công thức", icon: Layers },
  { href: "/quotations", label: "Báo giá", icon: FileText },
  { href: "/stock", label: "Tồn kho", icon: Warehouse },
  { href: "/reports", label: "Báo cáo", icon: ClipboardList },
  { href: "/settings", label: "Thiết lập", icon: Settings }
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-line bg-panel px-4 py-5 md:block">
        <div className="mb-8">
          <div className="text-lg font-semibold text-ink">Kho nhôm kính</div>
          <div className="text-xs uppercase tracking-wide text-muted">Quản lý kho ERP</div>
        </div>
        <nav className="space-y-1">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="flex h-10 items-center gap-3 rounded-md px-3 text-sm text-ink hover:bg-[#eef2ed]">
              <item.icon className="h-4 w-4 text-steel" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="md:pl-64">
        <div className="border-b border-line bg-panel px-5 py-4 md:px-8">
          <div className="text-sm text-muted">Quản lý vật tư, công thức, tồn kho và báo giá</div>
        </div>
        <div className="px-5 py-6 md:px-8">{children}</div>
      </main>
    </div>
  );
}
