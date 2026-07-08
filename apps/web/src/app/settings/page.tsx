"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DictionaryContract, DictionaryItemContract } from "@erp/shared";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";

type DictionaryItemRow = Pick<DictionaryItemContract, "code" | "label" | "unit" | "status">;

const managedDictionaries = [
  { code: "MATERIAL_CATEGORY", name: "Nhóm vật tư" },
  { code: "MATERIAL_COLOR", name: "Màu sắc vật tư" }
];

export default function SettingsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Thiết lập</h1>
        <p className="mt-1 text-sm text-muted">Quản lý danh mục dùng chung cho vật tư, công thức và tồn kho.</p>
      </div>

      <div className="grid gap-4">
        {managedDictionaries.map((dictionary) => (
          <DictionaryEditor key={dictionary.code} code={dictionary.code} name={dictionary.name} />
        ))}
      </div>
    </div>
  );
}

function DictionaryEditor({ code, name }: { code: string; name: string }) {
  const queryClient = useQueryClient();
  const [items, setItems] = useState<DictionaryItemRow[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const isMaterialCategory = code === "MATERIAL_CATEGORY";

  const { data, isLoading } = useQuery({
    queryKey: ["dictionary", code],
    queryFn: () => api.get<DictionaryContract>(`/dictionaries/${code}`)
  });

  useEffect(() => {
    if (data) {
      setItems(data.items.map((item) => ({ code: item.code, label: item.label, unit: item.unit ?? "", status: item.status })));
    }
  }, [data]);

  const saveDictionary = useMutation({
    mutationFn: () =>
      api.put<DictionaryContract>(`/dictionaries/${code}`, {
        code,
        name,
        items: items.map((item, index) => ({
          ...item,
          code: normalizeCode(item.code),
          unit: isMaterialCategory ? normalizeCode(item.unit ?? "") : undefined,
          sortOrder: index + 1
        }))
      }),
    onSuccess: async () => {
      setMessage("Đã lưu danh mục.");
      await queryClient.invalidateQueries({ queryKey: ["dictionary", code] });
    },
    onError: (error) => {
      setMessage(error instanceof Error ? error.message : "Không lưu được danh mục.");
    }
  });

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-ink">{name}</h2>
          <p className="mt-1 text-sm text-muted">{code}</p>
        </div>
        <Button type="button" variant="secondary" onClick={() => setItems((current) => [...current, { code: "", label: "", unit: "", status: "active" }])}>Thêm dòng</Button>
      </div>

      <div className="mt-4 space-y-3">
        {isLoading && <div className="text-sm text-muted">Đang tải...</div>}
        {!isLoading && items.length === 0 && <div className="text-sm text-muted">Chưa có dữ liệu.</div>}
        {items.map((item, index) => (
          <div key={index} className={`grid gap-3 ${isMaterialCategory ? "md:grid-cols-[1fr_1fr_140px_160px_auto]" : "md:grid-cols-[1fr_1fr_160px_auto]"}`}>
            <input
              placeholder="Mã, ví dụ DEN"
              value={item.code}
              onChange={(event) => updateItem(index, { code: normalizeCode(event.target.value) })}
              className="h-10 rounded-md border border-line px-3 text-sm"
            />
            <input
              placeholder="Tên hiển thị, ví dụ Đen"
              value={item.label}
              onChange={(event) => updateItem(index, { label: event.target.value })}
              className="h-10 rounded-md border border-line px-3 text-sm"
            />
            {isMaterialCategory && (
              <input
                placeholder="Đơn vị, ví dụ THANH"
                value={item.unit ?? ""}
                onChange={(event) => updateItem(index, { unit: normalizeCode(event.target.value) })}
                className="h-10 rounded-md border border-line px-3 text-sm"
                required
              />
            )}
            <select value={item.status} onChange={(event) => updateItem(index, { status: event.target.value as DictionaryItemRow["status"] })} className="h-10 rounded-md border border-line px-3 text-sm">
              <option value="active">Đang dùng</option>
              <option value="inactive">Ngừng dùng</option>
            </select>
            <Button type="button" variant="secondary" onClick={() => setItems((current) => current.filter((_, rowIndex) => rowIndex !== index))}>Xóa</Button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button type="button" onClick={() => saveDictionary.mutate()} disabled={saveDictionary.isPending}>
          {saveDictionary.isPending ? "Đang lưu..." : "Lưu danh mục"}
        </Button>
        {message && <span className="text-sm text-muted">{message}</span>}
      </div>
    </Card>
  );

  function updateItem(index: number, patch: Partial<DictionaryItemRow>) {
    setItems((current) => current.map((item, rowIndex) => (rowIndex === index ? { ...item, ...patch } : item)));
  }
}

function normalizeCode(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^A-Za-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .toUpperCase();
}
