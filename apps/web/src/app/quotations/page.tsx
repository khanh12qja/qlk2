"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { GenerateBomResponseContract } from "@erp/shared";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

export default function QuotationsPage() {
  const [form, setForm] = useState({
    formulaId: "",
    variantCode: "",
    width: "",
    height: "",
    opening: ""
  });

  const generateBom = useMutation({
    mutationFn: () =>
      api.post<GenerateBomResponseContract>(`/formulas/${form.formulaId}/generate-bom`, {
        variantCode: form.variantCode || undefined,
        parameters: {
          WIDTH: Number(form.width),
          HEIGHT: Number(form.height),
          OPENING: form.opening
        }
      })
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Báo giá</h1>
        <p className="mt-1 text-sm text-muted">Nhập kích thước và biến thể để sinh BOM tại thời điểm lập trước khi lưu báo giá.</p>
      </div>
      <Card className="p-5">
        <div className="grid gap-4 md:grid-cols-4">
          <label className="space-y-2">
            <span className="text-sm text-muted">Mã công thức</span>
            <input
              value={form.formulaId}
              onChange={(event) => setForm((current) => ({ ...current, formulaId: event.target.value }))}
              className="h-10 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-steel"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-muted">Biến thể</span>
            <input
              value={form.variantCode}
              onChange={(event) => setForm((current) => ({ ...current, variantCode: event.target.value }))}
              className="h-10 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-steel"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-muted">Chiều rộng</span>
            <input
              value={form.width}
              onChange={(event) => setForm((current) => ({ ...current, width: event.target.value }))}
              className="h-10 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-steel"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-muted">Chiều cao</span>
            <input
              value={form.height}
              onChange={(event) => setForm((current) => ({ ...current, height: event.target.value }))}
              className="h-10 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-steel"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-muted">Hướng mở</span>
            <input
              value={form.opening}
              onChange={(event) => setForm((current) => ({ ...current, opening: event.target.value }))}
              className="h-10 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-steel"
            />
          </label>
        </div>
        <div className="mt-4">
          <Button
            type="button"
            disabled={!form.formulaId || !form.width || !form.height || generateBom.isPending}
            onClick={() => generateBom.mutate()}
          >
            Sinh BOM
          </Button>
        </div>
      </Card>
      {generateBom.data && (
        <Card className="overflow-hidden">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-[#eef2ed] text-left text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Dòng</th>
                <th className="px-4 py-3 font-medium">Diễn giải</th>
                <th className="px-4 py-3 font-medium">Chiều dài</th>
                <th className="px-4 py-3 font-medium">Số lượng</th>
                <th className="px-4 py-3 font-medium">Hao hụt</th>
              </tr>
            </thead>
            <tbody>
              {generateBom.data.lines.map((line) => (
                <tr key={line.lineCode} className="border-t border-line">
                  <td className="px-4 py-3 font-medium text-ink">{line.lineCode}</td>
                  <td className="px-4 py-3 text-ink">{line.description}</td>
                  <td className="px-4 py-3 text-muted">{line.length ?? "-"}</td>
                  <td className="px-4 py-3 text-muted">{line.quantity}</td>
                  <td className="px-4 py-3 text-muted">{line.wasteRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
