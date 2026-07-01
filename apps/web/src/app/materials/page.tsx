"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DictionaryContract, MaterialContract } from "@erp/shared";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";

type MaterialRecord = MaterialContract & {
  _id?: string;
};

type MaterialFormState = {
  baseCode: string;
  name: string;
  category: string;
  colorCode: string;
  unit: string;
  standardLength: string;
  status: "active" | "inactive";
};

type NoticeState = {
  tone: "success" | "error";
  text: string;
};

const emptyForm: MaterialFormState = {
  baseCode: "",
  name: "",
  category: "",
  colorCode: "",
  unit: "",
  standardLength: "",
  status: "active"
};

export default function MaterialsPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<MaterialFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<NoticeState | null>(null);

  const { data = [], isLoading } = useQuery({
    queryKey: ["materials"],
    queryFn: () => api.get<MaterialRecord[]>("/materials")
  });

  const { data: categoryDictionary } = useQuery({
    queryKey: ["dictionary", "MATERIAL_CATEGORY"],
    queryFn: () => api.get<DictionaryContract>("/dictionaries/MATERIAL_CATEGORY")
  });

  const { data: colorDictionary } = useQuery({
    queryKey: ["dictionary", "MATERIAL_COLOR"],
    queryFn: () => api.get<DictionaryContract>("/dictionaries/MATERIAL_COLOR")
  });

  const { data: unitDictionary } = useQuery({
    queryKey: ["dictionary", "MATERIAL_UNIT"],
    queryFn: () => api.get<DictionaryContract>("/dictionaries/MATERIAL_UNIT")
  });

  const categories = categoryDictionary?.items.filter((item) => item.status === "active") ?? [];
  const colors = colorDictionary?.items.filter((item) => item.status === "active") ?? [];
  const units = unitDictionary?.items.filter((item) => item.status === "active") ?? [];
  const selectedColor = colors.find((item) => item.code === form.colorCode);
  const lengthManaged = isLengthManagedUnit(form.unit);
  const generatedCode = buildMaterialCode(form.category, form.baseCode, form.colorCode);

  const saveMaterial = useMutation({
    mutationFn: () => {
      const payload = {
        baseCode: form.baseCode,
        name: form.name,
        category: form.category,
        colorCode: form.colorCode || undefined,
        colorName: selectedColor?.label,
        unit: form.unit,
        manageLength: lengthManaged,
        standardLength: lengthManaged ? Number(form.standardLength) : undefined,
        status: form.status
      };

      return editingId ? api.patch<MaterialRecord>(`/materials/${editingId}`, payload) : api.post<MaterialRecord>("/materials", payload);
    },
    onSuccess: async () => {
      setForm(emptyForm);
      setEditingId(null);
      setNotice({ tone: "success", text: editingId ? "Da cap nhat thanh cong." : "Da them thanh cong." });
      await queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
    onError: (error) => {
      setNotice({
        tone: "error",
        text: formatMaterialMessage(error instanceof Error ? error.message : "Khong luu duoc vat tu.")
      });
    }
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);
    saveMaterial.mutate();
  }

  function startEdit(material: MaterialRecord) {
    setEditingId(material.id ?? material._id ?? null);
    setNotice(null);
    setForm({
      baseCode: material.baseCode ?? extractBaseCode(material.code, material.category, material.colorCode),
      name: material.name,
      category: material.category,
      colorCode: material.colorCode ?? "",
      unit: material.unit,
      standardLength: material.standardLength ? String(material.standardLength) : "",
      status: material.status
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setNotice(null);
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Vat tu</h1>
        <p className="mt-1 text-sm text-muted">Don vi se tu quyet dinh cach quan ly ton: tinh theo thanh thi nhap met, tinh theo cai thi chi nhap so luong.</p>
        <a className="mt-3 inline-flex h-10 items-center rounded-md border border-line bg-white px-4 text-sm font-medium text-ink hover:bg-[#f7f8f5]" href="/settings">
          Quan ly nhom, mau sac, don vi
        </a>
      </div>

      <Card className="p-5">
        <form className="space-y-4" onSubmit={submit}>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm text-muted">Ma nhom + ma thanh + mau</span>
              <div className="flex h-10 items-center rounded-md border border-line bg-[#f7f8f5] px-3 text-sm font-medium text-ink">
                {generatedCode || "Tu dong sinh sau khi chon nhom, ma thanh va mau"}
              </div>
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm text-muted">Ten vat tu</span>
              <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="h-10 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-steel" required />
            </label>

            <label className="space-y-2">
              <span className="text-sm text-muted">Ma thanh / ma quy cach</span>
              <input value={form.baseCode} onChange={(event) => setForm((current) => ({ ...current, baseCode: compactCode(event.target.value) }))} className="h-10 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-steel" required />
            </label>

            <label className="space-y-2">
              <span className="text-sm text-muted">Nhom vat tu</span>
              <select value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} className="h-10 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-steel" required>
                <option value="">Chon nhom vat tu</option>
                {categories.map((item) => (
                  <option key={item.code} value={item.code}>{item.label}</option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm text-muted">Mau sac</span>
              <select value={form.colorCode} onChange={(event) => setForm((current) => ({ ...current, colorCode: event.target.value }))} className="h-10 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-steel">
                <option value="">Khong chon mau</option>
                {colors.map((item) => (
                  <option key={item.code} value={item.code}>{item.label}</option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm text-muted">Don vi</span>
              <select
                value={form.unit}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    unit: event.target.value,
                    standardLength: isLengthManagedUnit(event.target.value) ? current.standardLength : ""
                  }))
                }
                className="h-10 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-steel"
                required
              >
                <option value="">Chon don vi</option>
                {units.map((item) => (
                  <option key={item.code} value={item.code}>{item.label}</option>
                ))}
              </select>
            </label>

            <div className="space-y-2">
              <span className="text-sm text-muted">Cach quan ly ton</span>
              <div className="flex h-10 items-center rounded-md border border-line bg-[#f7f8f5] px-3 text-sm text-ink">
                {lengthManaged ? "Theo thanh va chieu dai" : "Theo so luong"}
              </div>
            </div>

            {lengthManaged && (
              <label className="space-y-2">
                <span className="text-sm text-muted">Chieu dai chuan (m hoac mm)</span>
                <input value={form.standardLength} onChange={(event) => setForm((current) => ({ ...current, standardLength: event.target.value }))} className="h-10 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-steel" required type="number" min={1} />
              </label>
            )}

            {editingId && (
              <label className="space-y-2">
                <span className="text-sm text-muted">Trang thai</span>
                <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as MaterialFormState["status"] }))} className="h-10 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-steel">
                  <option value="active">Dang dung</option>
                  <option value="inactive">Ngung dung</option>
                </select>
              </label>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button type="submit" disabled={saveMaterial.isPending}>
              {saveMaterial.isPending ? "Dang luu..." : editingId ? "Cap nhat vat tu" : "Them vat tu"}
            </Button>
            {editingId && <Button type="button" variant="secondary" onClick={cancelEdit}>Huy sua</Button>}
          </div>

          {notice && (
            <div
              className={`rounded-md border px-4 py-3 text-sm font-medium ${
                notice.tone === "success"
                  ? "border-[#cfe3d5] bg-[#eef7f0] text-[#24543a]"
                  : "border-[#ead3d3] bg-[#fff3f2] text-[#8a2f2b]"
              }`}
            >
              {notice.text}
            </div>
          )}
        </form>
      </Card>

      <Card className="overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-[#eef2ed] text-left text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Ma</th>
              <th className="px-4 py-3 font-medium">Ten vat tu</th>
              <th className="px-4 py-3 font-medium">Nhom</th>
              <th className="px-4 py-3 font-medium">Mau sac</th>
              <th className="px-4 py-3 font-medium">Don vi</th>
              <th className="px-4 py-3 font-medium">Cach quan ly ton</th>
              <th className="px-4 py-3 font-medium">Trang thai</th>
              <th className="px-4 py-3 font-medium">Thao tac</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td className="px-4 py-4 text-muted" colSpan={8}>Dang tai...</td>
              </tr>
            )}
            {!isLoading && data.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-muted" colSpan={8}>Chua co vat tu.</td>
              </tr>
            )}
            {data.map((material) => (
              <tr key={material.id ?? material._id} className="border-t border-line">
                <td className="px-4 py-3 font-medium text-ink">{material.code}</td>
                <td className="px-4 py-3 text-ink">{material.name}</td>
                <td className="px-4 py-3 text-muted">{material.category}</td>
                <td className="px-4 py-3 text-muted">{material.colorName ?? material.colorCode ?? "-"}</td>
                <td className="px-4 py-3 text-muted">{material.unit}</td>
                <td className="px-4 py-3 text-muted">{material.manageLength ? `Theo thanh ${material.standardLength ?? ""}` : "Theo so luong"}</td>
                <td className="px-4 py-3 text-muted">{material.status === "active" ? "Dang dung" : "Ngung dung"}</td>
                <td className="px-4 py-3">
                  <Button type="button" variant="secondary" onClick={() => startEdit(material)}>Sua</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function isLengthManagedUnit(unit: string) {
  return unit.trim().toUpperCase().includes("THANH");
}

function compactCode(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9]/g, "")
    .toUpperCase();
}

function buildMaterialCode(category: string, baseCode: string, colorCode: string) {
  return [category, baseCode, colorCode].map(compactCode).join("");
}

function extractBaseCode(code: string, category: string, colorCode?: string) {
  const normalizedCode = compactCode(code);
  const normalizedCategory = compactCode(category);
  const normalizedColor = compactCode(colorCode ?? "");

  let candidate = normalizedCode;
  if (candidate.startsWith(normalizedCategory)) {
    candidate = candidate.slice(normalizedCategory.length);
  }
  if (normalizedColor && candidate.endsWith(normalizedColor)) {
    candidate = candidate.slice(0, candidate.length - normalizedColor.length);
  }

  return candidate || normalizedCode;
}

function formatMaterialMessage(rawMessage: string) {
  try {
    const parsed = JSON.parse(rawMessage) as { message?: string | string[] };
    const message = Array.isArray(parsed.message) ? parsed.message.join(". ") : parsed.message;
    if (typeof message === "string" && message.trim()) {
      return normalizeMaterialMessage(message);
    }
  } catch {
    return normalizeMaterialMessage(rawMessage);
  }

  return normalizeMaterialMessage(rawMessage);
}

function normalizeMaterialMessage(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("da duoc them vao phan mem") || normalized.includes("da ton tai")) {
    return "Ma nay da duoc them, vui long kiem tra lai.";
  }

  return message;
}
