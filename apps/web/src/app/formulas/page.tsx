"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormulaContract, MaterialContract } from "@erp/shared";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";

type FormulaRecord = FormulaContract & { _id?: string };
type MaterialRecord = MaterialContract & { _id?: string };

type OptionRow = {
  code: string;
  label: string;
};

type ParameterRow = {
  code: string;
  label: string;
  type: "number" | "text" | "select" | "boolean";
  required: boolean;
  options: OptionRow[];
};

type VariantValueRow = {
  parameterCode: string;
  value: string;
};

type VariantRow = {
  values: VariantValueRow[];
};

type ItemRow = {
  lineCode: string;
  materialId: string;
  description: string;
  lengthExpression: string;
  quantityExpression: string;
  conditionExpression: string;
  wasteRate: string;
};

export default function FormulasPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [parameters, setParameters] = useState<ParameterRow[]>([]);
  const [variants, setVariants] = useState<VariantRow[]>([]);
  const [items, setItems] = useState<ItemRow[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const { data = [], isLoading } = useQuery({
    queryKey: ["formulas"],
    queryFn: () => api.get<FormulaRecord[]>("/formulas")
  });

  const { data: materials = [] } = useQuery({
    queryKey: ["materials"],
    queryFn: () => api.get<MaterialRecord[]>("/materials")
  });
  const totalParameters = data.reduce((sum, formula) => sum + formula.parameters.length, 0);
  const totalVariants = data.reduce((sum, formula) => sum + formula.variants.length, 0);
  const totalItems = data.reduce((sum, formula) => sum + formula.items.length, 0);

  const saveFormula = useMutation({
    mutationFn: () => {
      const payload = {
        code,
        name,
        parameters: parameters.map((parameter) => ({
          code: parameter.code,
          label: parameter.label,
          type: parameter.type,
          required: parameter.required,
          options: parameter.type === "select" ? parameter.options.filter((option) => option.code && option.label) : []
        })),
        variants: variants.map((variant) => ({
          code: buildVariantCode(variant, code),
          name: buildVariantName(variant, parameters, name),
          parameters: buildVariantParameters(variant),
          status: "active"
        })),
        items: items.map((item) => ({
          lineCode: item.lineCode,
          materialId: item.materialId,
          description: item.description,
          lengthExpression: item.lengthExpression || undefined,
          quantityExpression: item.quantityExpression,
          conditionExpression: item.conditionExpression || undefined,
          wasteRate: item.wasteRate ? Number(item.wasteRate) : 0
        })),
        status: "active"
      };

      return editingId ? api.patch<FormulaRecord>(`/formulas/${editingId}`, payload) : api.post<FormulaRecord>("/formulas", payload);
    },
    onSuccess: async () => {
      resetForm();
      setMessage(editingId ? "Da cap nhat cong thuc." : "Da tao cong thuc.");
      await queryClient.invalidateQueries({ queryKey: ["formulas"] });
    },
    onError: (error) => {
      setMessage(error instanceof Error ? error.message : "Khong luu duoc cong thuc.");
    }
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (parameters.some((parameter) => parameter.type === "select" && parameter.options.length === 0)) {
      setMessage("Tham so kieu danh sach phai co it nhat mot lua chon.");
      return;
    }

    if (items.some((item) => !item.materialId || !item.quantityExpression)) {
      setMessage("Moi dong vat tu phai co vat tu va cong thuc so luong.");
      return;
    }

    if (variants.some((variant) => variant.values.some((value) => !value.parameterCode || !value.value))) {
      setMessage("Moi gia tri bien the phai chon tham so va gia tri.");
      return;
    }

    saveFormula.mutate();
  }

  function startEdit(formula: FormulaRecord) {
    setEditingId(formula.id ?? formula._id ?? null);
    setCode(formula.code);
    setName(formula.name);
    setParameters(
      formula.parameters.map((parameter) => ({
        code: parameter.code,
        label: parameter.label,
        type: parameter.type,
        required: parameter.required,
        options: (parameter.options ?? []).map((option) => ({
          code: option.code,
          label: option.label
        }))
      }))
    );
    setVariants(
      formula.variants.map((variant) => ({
        values: Object.entries(variant.parameters ?? {}).map(([parameterCode, value]) => ({
          parameterCode,
          value: String(value)
        }))
      }))
    );
    setItems(
      formula.items.map((item) => ({
        lineCode: item.lineCode,
        materialId: item.materialId,
        description: item.description,
        lengthExpression: item.lengthExpression ?? "",
        quantityExpression: item.quantityExpression,
        conditionExpression: item.conditionExpression ?? "",
        wasteRate: item.wasteRate !== undefined ? String(item.wasteRate) : ""
      }))
    );
    setMessage("Dang sua cong thuc.");
  }

  function resetForm() {
    setEditingId(null);
    setCode("");
    setName("");
    setParameters([]);
    setVariants([]);
    setItems([]);
  }

  function cancelEdit() {
    resetForm();
    setMessage("Da huy sua cong thuc.");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-line bg-white p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="text-sm font-medium uppercase tracking-wide text-steel">Formula Workspace</div>
            <h1 className="mt-2 text-3xl font-semibold text-ink">Quan ly cong thuc va BOM</h1>
            <p className="mt-2 text-sm leading-6 text-muted">
              Trang nay giu nguyen toan bo luong nhap va nghiep vu hien co, nhung sap xep lai de viec tao cong thuc, quan ly bien the va gan dong vat tu de doc hon, de thao tac hon.
            </p>
          </div>
          <div className="grid flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Cong thuc" value={String(data.length)} note="Tong cong thuc dang co" />
            <MetricCard label="Tham so" value={String(totalParameters)} note="Khai bao tren tat ca cong thuc" />
            <MetricCard label="Bien the" value={String(totalVariants)} note="Gia tri co san de tao bo" />
            <MetricCard label="Dong BOM" value={String(totalItems)} note="Tong dong vat tu da cau hinh" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
        <Card className="border-line p-6">
          <SectionIntro
            eyebrow={editingId ? "Dang chinh sua" : "Tao moi"}
            title={editingId ? "Cap nhat cong thuc" : "Cau hinh cong thuc"}
            description="Toan bo form va logic giu nguyen. Phan hien thi duoc chia thanh cac lop ro rang hon: thong tin chung, tham so, bien the va BOM."
          />
        <form className="space-y-5" onSubmit={submit}>
          <div className="grid gap-3 md:grid-cols-4">
            <StepCard step="1" title="Thong tin chung" description="Ma va ten bo san pham." />
            <StepCard step="2" title="Tham so" description="Khai bao chieu cao, mau, kieu mo..." />
            <StepCard step="3" title="Bien the" description="Gom nhung gia tri co san de nhan vien chon nhanh." />
            <StepCard step="4" title="Dong vat tu" description="Gan BOM theo tung dieu kien va kich thuoc." />
          </div>

          <div className="grid gap-4 rounded-lg border border-line bg-[#fbfcfa] p-4 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm text-muted">Ma cong thuc</span>
              <input value={code} onChange={(event) => setCode(normalizeCode(event.target.value))} className="h-10 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-steel" required />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm text-muted">Ten cong thuc</span>
              <input value={name} onChange={(event) => setName(event.target.value)} className="h-10 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-steel" required />
            </label>
          </div>

          <SectionHeader
            title="Tham so"
            description="Day la nhung gia tri nhan vien se nhap hoac chon khi tinh bo. Vi du: CHIEU_CAO, MAU, KIEU_MO."
            action="Them tham so"
            count={parameters.length}
            onClick={() => setParameters((current) => [...current, { code: "", label: "", type: "number", required: true, options: [] }])}
          />
          <div className="space-y-3 rounded-md border border-line bg-[#fbfbf8] p-4">
            {parameters.length === 0 && <EmptyHint text="Chua co tham so. Ban nen tao tham so truoc khi khai bao bien the va dong vat tu." />}
            {parameters.map((parameter, index) => (
              <div key={index} className="space-y-3 rounded-md border border-line bg-white p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-ink">Tham so {index + 1}</div>
                  <div className="text-xs text-muted">{parameter.label || parameter.code || "Chua dat ten"}</div>
                </div>
                <div className="grid gap-3 md:grid-cols-5">
                  <input placeholder="Ma, vi du MAU" value={parameter.code} onChange={(event) => updateParameter(index, { code: normalizeCode(event.target.value) })} className="h-10 rounded-md border border-line px-3 text-sm" required />
                  <input placeholder="Ten, vi du Mau" value={parameter.label} onChange={(event) => updateParameter(index, { label: event.target.value })} className="h-10 rounded-md border border-line px-3 text-sm" required />
                  <select value={parameter.type} onChange={(event) => changeParameterType(index, event.target.value as ParameterRow["type"])} className="h-10 rounded-md border border-line px-3 text-sm">
                    <option value="number">So</option>
                    <option value="text">Chu</option>
                    <option value="select">Danh sach</option>
                    <option value="boolean">Co/khong</option>
                  </select>
                  <label className="flex items-center gap-2 text-sm text-ink">
                    <input type="checkbox" checked={parameter.required} onChange={(event) => updateParameter(index, { required: event.target.checked })} />
                    Bat buoc
                  </label>
                  <Button type="button" variant="secondary" onClick={() => removeParameter(index)}>Xoa</Button>
                </div>

                {parameter.type === "select" && (
                  <div className="space-y-2 rounded-md bg-[#f7f8f5] p-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="text-sm font-medium text-ink">Lua chon xo xuong</div>
                      <Button type="button" variant="secondary" onClick={() => addParameterOption(index)}>Them lua chon</Button>
                    </div>
                    {parameter.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                        <input placeholder="Ma, vi du DEN" value={option.code} onChange={(event) => updateParameterOption(index, optionIndex, { code: normalizeCode(event.target.value) })} className="h-10 rounded-md border border-line px-3 text-sm" required />
                        <input placeholder="Ten hien thi, vi du Den" value={option.label} onChange={(event) => updateParameterOption(index, optionIndex, { label: event.target.value })} className="h-10 rounded-md border border-line px-3 text-sm" required />
                        <Button type="button" variant="secondary" onClick={() => removeParameterOption(index, optionIndex)}>Xoa</Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <SectionHeader
            title="Bien the"
            description="Bien the la tap gia tri co san de tao nhanh tung bo cu the, khong can tao nhieu cong thuc."
            action="Them bien the"
            count={variants.length}
            onClick={() => setVariants((current) => [...current, { values: [{ parameterCode: "", value: "" }] }])}
          />
          <div className="space-y-3 rounded-md border border-line bg-[#fbfbf8] p-4">
            {variants.length === 0 && <EmptyHint text="Chua co bien the. Vi du mot cong thuc phong tam kinh co the co bien the Mau den - Mo quay, Mau vang - Mo truot..." />}
            {variants.map((variant, index) => (
              <div key={index} className="space-y-3 rounded-md border border-line bg-white p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-ink">Bien the {index + 1}</div>
                  <Button type="button" variant="secondary" onClick={() => setVariants((current) => current.filter((_, rowIndex) => rowIndex !== index))}>Xoa bien the</Button>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-md border border-line bg-[#f7f8f5] px-3 py-2">
                    <div className="text-xs text-muted">Ma bien the tu sinh</div>
                    <div className="mt-1 text-sm font-medium text-ink">{buildVariantCode(variant, code) || "Chua co"}</div>
                  </div>
                  <div className="rounded-md border border-line bg-[#f7f8f5] px-3 py-2">
                    <div className="text-xs text-muted">Ten bien the tu sinh</div>
                    <div className="mt-1 text-sm font-medium text-ink">{buildVariantName(variant, parameters, name) || "Chua co"}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-sm font-medium text-ink">Gia tri tham so cua bien the</div>
                    <Button type="button" variant="secondary" onClick={() => addVariantValue(index)}>Them gia tri</Button>
                  </div>
                  {variant.values.map((value, valueIndex) => {
                    const parameter = parameters.find((item) => item.code === value.parameterCode);
                    return (
                      <div key={valueIndex} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                        <select value={value.parameterCode} onChange={(event) => updateVariantValue(index, valueIndex, { parameterCode: event.target.value, value: "" })} className="h-10 rounded-md border border-line px-3 text-sm" required>
                          <option value="">Chon tham so</option>
                          {parameters.map((item) => (
                            <option key={item.code} value={item.code}>{item.label || item.code} ({item.code})</option>
                          ))}
                        </select>
                        <VariantValueInput parameter={parameter} value={value.value} onChange={(nextValue) => updateVariantValue(index, valueIndex, { value: nextValue })} />
                        <Button type="button" variant="secondary" onClick={() => removeVariantValue(index, valueIndex)}>Xoa</Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <SectionHeader
            title="Dong vat tu"
            description="Moi dong la 1 vat tu trong BOM. Co the gan theo tham so chieu dai va dieu kien mau, kieu mo..."
            action="Them dong vat tu"
            count={items.length}
            onClick={() => setItems((current) => [...current, { lineCode: "", materialId: "", description: "", lengthExpression: "", quantityExpression: "", conditionExpression: "", wasteRate: "" }])}
          />
          <div className="space-y-3 rounded-md border border-line bg-[#fbfbf8] p-4">
            <div className="grid gap-3 rounded-lg border border-dashed border-line bg-white p-4 md:grid-cols-3">
              <BomHintCard
                title="1. Nhan dien vat tu"
                description="Ma dong, vat tu va dien giai giup nhan vien biet dong nay dang dai dien cho chi tiet nao trong bo."
              />
              <BomHintCard
                title="2. Cach tinh kich thuoc"
                description="Neu dong BOM can cat thanh theo tham so thi cau hinh o nhom chieu dai. Neu khong, co the de trong."
              />
              <BomHintCard
                title="3. Dieu kien ap dung"
                description="So luong, dieu kien va hao hut quyet dinh khi nao dong nay duoc lay vao BOM thuc te."
              />
            </div>
            {items.length === 0 && <EmptyHint text="Chua co dong vat tu. Sau khi da co tham so va bien the, hay them tung dong BOM vao day." />}
            {items.map((item, index) => (
              <div key={index} className="space-y-4 rounded-lg border border-line bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-ink">Dong BOM {index + 1}</div>
                    <div className="flex flex-wrap gap-2 text-xs text-muted">
                      <span className="rounded-full bg-[#f3f5ef] px-2 py-1">Vat tu</span>
                      <span className="rounded-full bg-[#f3f5ef] px-2 py-1">Chieu dai</span>
                      <span className="rounded-full bg-[#f3f5ef] px-2 py-1">So luong va dieu kien</span>
                    </div>
                  </div>
                  <Button type="button" variant="secondary" onClick={() => setItems((current) => current.filter((_, rowIndex) => rowIndex !== index))}>Xoa</Button>
                </div>

                <div className="space-y-3 rounded-lg border border-line bg-[#fcfcfa] p-4">
                  <FieldGroupTitle
                    title="Nhan dien vat tu"
                    description="Day la nhom xac dinh dong BOM nay dang tro den vat tu nao va mo ta no la gi."
                  />
                  <div className="grid gap-3 md:grid-cols-3">
                    <input placeholder="Ma dong" value={item.lineCode} onChange={(event) => updateItem(index, { lineCode: normalizeCode(event.target.value) })} className="h-10 rounded-md border border-line px-3 text-sm" required />
                    <select value={item.materialId} onChange={(event) => updateItem(index, { materialId: event.target.value })} className="h-10 rounded-md border border-line px-3 text-sm" required>
                      <option value="">Chon vat tu</option>
                      {materials.map((material) => (
                        <option key={material.id ?? material._id} value={material.id ?? material._id}>{material.code} - {material.name}</option>
                      ))}
                    </select>
                    <input placeholder="Dien giai" value={item.description} onChange={(event) => updateItem(index, { description: event.target.value })} className="h-10 rounded-md border border-line px-3 text-sm" required />
                  </div>
                </div>

                <div className="space-y-3 rounded-lg border border-line bg-[#fcfcfa] p-4">
                  <FieldGroupTitle
                    title="Cach tinh chieu dai"
                    description="Neu dong nay la thanh can cat, cau hinh tham so va bieu thuc chieu dai o day."
                  />
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="space-y-2">
                      <span className="text-xs text-muted">Gan truc tiep vao tham so chieu dai</span>
                      <select value={parameters.some((parameter) => parameter.code === item.lengthExpression) ? item.lengthExpression : ""} onChange={(event) => updateItem(index, { lengthExpression: event.target.value })} className="h-10 w-full rounded-md border border-line px-3 text-sm">
                        <option value="">Khong gan truc tiep</option>
                        {parameters.map((parameter) => (
                          <option key={parameter.code} value={parameter.code}>{parameter.label || parameter.code} ({parameter.code})</option>
                        ))}
                      </select>
                    </label>
                    <label className="space-y-2">
                      <span className="text-xs text-muted">Bieu thuc chieu dai</span>
                      <input placeholder="Vi du CHIEU_CAO - 20" value={item.lengthExpression} onChange={(event) => updateItem(index, { lengthExpression: normalizeExpression(event.target.value) })} className="h-10 w-full rounded-md border border-line px-3 text-sm" />
                    </label>
                  </div>
                </div>

                <div className="space-y-3 rounded-lg border border-line bg-[#fcfcfa] p-4">
                  <FieldGroupTitle
                    title="So luong va dieu kien ap dung"
                    description="Cau hinh so luong lay ra, dieu kien de dong nay xuat hien trong BOM va muc hao hut neu co."
                  />
                  <div className="grid gap-3 md:grid-cols-3">
                    <input placeholder="So luong, vi du 2" value={item.quantityExpression} onChange={(event) => updateItem(index, { quantityExpression: normalizeExpression(event.target.value) })} className="h-10 rounded-md border border-line px-3 text-sm" required />
                    <input placeholder="Dieu kien, vi du MAU==DEN && KIEU_MO==QUAY" value={item.conditionExpression} onChange={(event) => updateItem(index, { conditionExpression: normalizeExpression(event.target.value) })} className="h-10 rounded-md border border-line px-3 text-sm" />
                    <input placeholder="Hao hut" value={item.wasteRate} onChange={(event) => updateItem(index, { wasteRate: event.target.value })} className="h-10 rounded-md border border-line px-3 text-sm" type="number" min={0} />
                  </div>
                </div>

                <div className="rounded-md bg-[#f7f8f5] px-3 py-2 text-xs text-muted">
                  Goi y: neu vat tu nay ap dung cho tat ca cac bo thi de trong dieu kien. Neu chi dung cho mot mau hoac mot kieu mo, nhap dieu kien o tren.
                </div>
              </div>
            ))}
          </div>

          <div className="sticky bottom-0 flex flex-wrap items-center gap-4 rounded-lg border border-line bg-white/95 p-4 backdrop-blur">
            <Button type="submit" disabled={saveFormula.isPending}>{saveFormula.isPending ? "Dang luu..." : editingId ? "Cap nhat cong thuc" : "Tao cong thuc"}</Button>
            {editingId && <Button type="button" variant="secondary" onClick={cancelEdit}>Huy sua</Button>}
            {message && <InlineMessage message={message} tone={message.toLowerCase().includes("khong") ? "error" : "success"} />}
          </div>
        </form>
        </Card>

        <div className="space-y-5">
          <Card className="border-line p-6">
            <SectionIntro
              eyebrow="Tom tat"
              title="Nguyen tac cau hinh"
              description="Khong doi nghiep vu. Chi nhac lai thu tu thao tac de nguoi nhap lieu di nhanh va it nham hon."
            />
            <div className="mt-5 space-y-3">
              <InfoRow title="1. Thong tin chung" description="Khai bao ma va ten cong thuc truoc de sinh ma bien the on dinh." />
              <InfoRow title="2. Tham so" description="Khai bao cac gia tri dau vao nhu MAU, KIEU_MO, CHIEU_CAO." />
              <InfoRow title="3. Bien the" description="Chon cac to hop gia tri co san, khong can tao nhieu cong thuc rieng." />
              <InfoRow title="4. Dong BOM" description="Gan vat tu, so luong, dieu kien va bieu thuc chieu dai cho tung dong." />
            </div>
          </Card>

          <Card className="border-line p-6">
            <SectionIntro
              eyebrow="Thu vien"
              title="Danh sach cong thuc"
              description="Tat ca cong thuc da co trong he thong. Co the xem nhanh tham so, bien the va so dong BOM truoc khi sua."
            />
            <div className="mt-5 grid gap-4">
              {isLoading && <Card className="border-line p-4 text-sm text-muted">Dang tai...</Card>}
              {!isLoading && data.length === 0 && <Card className="border-line p-4 text-sm text-muted">Chua co cong thuc.</Card>}
              {data.map((formula) => (
                <Card key={formula.id ?? formula._id} className="border-line p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium text-steel">{formula.code}</div>
                      <h2 className="mt-1 text-lg font-semibold text-ink">{formula.name}</h2>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="rounded-md border border-line bg-[#f8faf7] px-3 py-1 text-xs text-muted">{formula.status === "active" ? "Dang dung" : "Ngung dung"}</div>
                      <Button type="button" variant="secondary" onClick={() => startEdit(formula)}>Sua</Button>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <MiniStat label="Tham so" value={String(formula.parameters.length)} detail={formula.parameters.map((item) => item.label || item.code).join(", ") || "Khong co"} />
                    <MiniStat label="Bien the" value={String(formula.variants.length)} detail={formula.variants.map((item) => item.name).join(", ") || "Khong co"} />
                    <MiniStat label="Dong BOM" value={String(formula.items.length)} detail={`${formula.items.length} dong vat tu`} />
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  function updateParameter(index: number, patch: Partial<ParameterRow>) {
    setParameters((current) => current.map((item, rowIndex) => (rowIndex === index ? { ...item, ...patch } : item)));
  }

  function changeParameterType(index: number, type: ParameterRow["type"]) {
    setParameters((current) => current.map((item, rowIndex) => (rowIndex === index ? { ...item, type, options: type === "select" ? item.options : [] } : item)));
  }

  function removeParameter(index: number) {
    const removedCode = parameters[index]?.code;
    setParameters((current) => current.filter((_, rowIndex) => rowIndex !== index));
    setVariants((current) =>
      current.map((variant) => ({
        ...variant,
        values: variant.values.filter((value) => value.parameterCode !== removedCode)
      }))
    );
  }

  function addParameterOption(index: number) {
    setParameters((current) => current.map((item, rowIndex) => (rowIndex === index ? { ...item, options: [...item.options, { code: "", label: "" }] } : item)));
  }

  function updateParameterOption(index: number, optionIndex: number, patch: Partial<OptionRow>) {
    setParameters((current) =>
      current.map((item, rowIndex) =>
        rowIndex === index
          ? { ...item, options: item.options.map((option, currentOptionIndex) => (currentOptionIndex === optionIndex ? { ...option, ...patch } : option)) }
          : item
      )
    );
  }

  function removeParameterOption(index: number, optionIndex: number) {
    setParameters((current) =>
      current.map((item, rowIndex) => (rowIndex === index ? { ...item, options: item.options.filter((_, currentOptionIndex) => currentOptionIndex !== optionIndex) } : item))
    );
  }

  function addVariantValue(index: number) {
    setVariants((current) => current.map((item, rowIndex) => (rowIndex === index ? { ...item, values: [...item.values, { parameterCode: "", value: "" }] } : item)));
  }

  function updateVariantValue(index: number, valueIndex: number, patch: Partial<VariantValueRow>) {
    setVariants((current) =>
      current.map((item, rowIndex) =>
        rowIndex === index
          ? { ...item, values: item.values.map((value, currentValueIndex) => (currentValueIndex === valueIndex ? { ...value, ...patch } : value)) }
          : item
      )
    );
  }

  function removeVariantValue(index: number, valueIndex: number) {
    setVariants((current) =>
      current.map((item, rowIndex) => (rowIndex === index ? { ...item, values: item.values.filter((_, currentValueIndex) => currentValueIndex !== valueIndex) } : item))
    );
  }

  function updateItem(index: number, patch: Partial<ItemRow>) {
    setItems((current) => current.map((item, rowIndex) => (rowIndex === index ? { ...item, ...patch } : item)));
  }
}

function VariantValueInput({ parameter, value, onChange }: { parameter?: ParameterRow; value: string; onChange: (value: string) => void }) {
  if (parameter?.type === "select") {
    return (
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 rounded-md border border-line px-3 text-sm" required>
        <option value="">Chon gia tri</option>
        {parameter.options.map((option) => (
          <option key={option.code} value={option.code}>{option.label}</option>
        ))}
      </select>
    );
  }

  if (parameter?.type === "boolean") {
    return (
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 rounded-md border border-line px-3 text-sm" required>
        <option value="">Chon gia tri</option>
        <option value="true">Co</option>
        <option value="false">Khong</option>
      </select>
    );
  }

  return <input placeholder="Gia tri" value={value} onChange={(event) => onChange(parameter?.type === "number" ? event.target.value : normalizeCode(event.target.value))} className="h-10 rounded-md border border-line px-3 text-sm" required />;
}

function SectionHeader({
  title,
  description,
  action,
  count,
  onClick
}: {
  title: string;
  description?: string;
  action: string;
  count?: number;
  onClick: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-base font-semibold text-ink">{title}</h2>
          {typeof count === "number" && <span className="rounded-full bg-[#f1f3ed] px-2 py-0.5 text-xs text-muted">{count}</span>}
        </div>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      <Button type="button" variant="secondary" onClick={onClick}>{action}</Button>
    </div>
  );
}

function StepCard({ step, title, description }: { step: string; title: string; description: string }) {
  return (
    <div className="rounded-md border border-line bg-[#f7f8f5] p-3">
      <div className="text-xs font-medium text-steel">Buoc {step}</div>
      <div className="mt-1 text-sm font-semibold text-ink">{title}</div>
      <div className="mt-1 text-xs text-muted">{description}</div>
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return <div className="rounded-md border border-dashed border-line bg-white px-3 py-4 text-sm text-muted">{text}</div>;
}

function MetricCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-lg border border-line bg-[#fbfcfa] p-4">
      <div className="text-xs uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-ink">{value}</div>
      <div className="mt-1 text-sm text-muted">{note}</div>
    </div>
  );
}

function SectionIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-steel">{eyebrow}</div>
      <h2 className="mt-1 text-lg font-semibold text-ink">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}

function InfoRow({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-line bg-[#fbfcfa] p-4">
      <div className="text-sm font-medium text-ink">{title}</div>
      <div className="mt-1 text-sm text-muted">{description}</div>
    </div>
  );
}

function BomHintCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-line bg-[#fcfcfa] p-4">
      <div className="text-sm font-medium text-ink">{title}</div>
      <div className="mt-1 text-sm text-muted">{description}</div>
    </div>
  );
}

function FieldGroupTitle({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <div className="text-sm font-medium text-ink">{title}</div>
      <div className="mt-1 text-xs leading-5 text-muted">{description}</div>
    </div>
  );
}

function InlineMessage({ message, tone }: { message: string; tone: "success" | "error" }) {
  const toneClass = tone === "success" ? "border-[#b9d8c2] bg-[#eef7f0] text-[#24543a]" : "border-[#f0c7b8] bg-[#fff4ef] text-[#9a3412]";
  return <div className={`rounded-md border px-3 py-2 text-sm ${toneClass}`}>{message}</div>;
}

function MiniStat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-lg border border-line bg-[#fbfcfa] p-4">
      <div className="flex items-baseline justify-between gap-3">
        <div className="text-xs uppercase tracking-wide text-muted">{label}</div>
        <div className="text-lg font-semibold text-ink">{value}</div>
      </div>
      <div className="mt-2 text-sm text-muted">{detail}</div>
    </div>
  );
}

function buildVariantParameters(variant: VariantRow) {
  return Object.fromEntries(variant.values.filter((item) => item.parameterCode && item.value).map((item) => [item.parameterCode, item.value]));
}

function buildVariantCode(variant: VariantRow, formulaCode: string) {
  const parts = [
    normalizeCode(formulaCode) || "BT",
    ...variant.values.filter((item) => item.parameterCode && item.value).map((item) => `${item.parameterCode}_${normalizeCode(item.value)}`)
  ];
  return parts.join("_");
}

function buildVariantName(variant: VariantRow, parameters: ParameterRow[], formulaName: string) {
  const labels = variant.values
    .filter((item) => item.parameterCode && item.value)
    .map((item) => {
      const parameter = parameters.find((current) => current.code === item.parameterCode);
      const option = parameter?.options.find((current) => current.code === item.value);
      if (option?.label) {
        return option.label;
      }
      if (parameter?.type === "boolean") {
        return item.value === "true" ? "Co" : "Khong";
      }
      return item.value;
    });

  return [formulaName, ...labels].filter(Boolean).join(" - ");
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

function normalizeExpression(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toUpperCase();
}
