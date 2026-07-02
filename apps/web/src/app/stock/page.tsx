"use client";

import { FormEvent, Fragment, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormulaContract, GenerateBomResponseContract, MaterialContract } from "@erp/shared";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";

type MaterialRecord = MaterialContract & { _id?: string };
type FormulaRecord = FormulaContract & { _id?: string };

type WarehouseRecord = {
  _id?: string;
  id?: string;
  code: string;
  name: string;
  address?: string;
  status: string;
};

type SuitableBar = {
  _id: string;
  originalLength: number;
  remainingLength: number;
  quantity: number;
  leftoverAfterCut: number;
  status: string;
};

type SuitableResponse = {
  requiredLength: number;
  requiredQuantity: number;
  suitableCount: number;
  enoughQuantity: boolean;
  bars: SuitableBar[];
};

type QuantityAvailability = {
  quantityBalance: number;
};

type InventoryResponse = {
  barStocks: Array<{
    id: string;
    materialId: string;
    materialCode: string;
    materialName: string;
    colorName?: string;
    colorCode?: string;
    warehouseId: string;
    warehouseCode: string;
    warehouseName: string;
    originalLength: number;
    remainingLength: number;
    quantity: number;
    status: string;
  }>;
  quantityStocks: Array<{
    materialId: string;
    materialCode: string;
    materialName: string;
    colorName?: string;
    colorCode?: string;
    warehouseId: string;
    warehouseCode: string;
    warehouseName: string;
    quantity: number;
  }>;
};

type FormulaRequestRow = {
  formulaCode: string;
  variantCode: string;
  orderQuantity: string;
  parameterValues: Record<string, string>;
};

type FormulaCheckResult = {
  formulaCode: string;
  formulaName: string;
  orderQuantity: number;
  variantCode?: string;
};

type CutPlanRow = {
  sourceLength: number;
  cutLength: number;
  leftoverLength: number;
};

type MaterialCheckResult = {
  materialId: string;
  materialCode: string;
  materialName: string;
  unit: string;
  requiredQuantity: number;
  requiredLength?: number;
  availableQuantity: number;
  enough: boolean;
  sources: string[];
  cutNotice?: string;
  cutPlan?: CutPlanRow[];
};

type FormulaStockCheckResponse = {
  formulaSummaries: FormulaCheckResult[];
  materialChecks: MaterialCheckResult[];
};

type ProductVariantCatalogItem = {
  formulaId: string;
  formulaCode: string;
  formulaName: string;
  variantCode: string;
  variantName: string;
  colorCode?: string;
  openingCode?: string;
  requestedHeight?: number;
  maxSets: number;
  materialLines: Array<{
    materialCode: string;
    materialName: string;
    unit: string;
    requiredQuantity: number;
    requiredLength?: number;
    availableQuantity: number;
    maxSets: number;
  }>;
};

type ProductCatalogResponse = {
  formulaCode: string;
  formulaName: string;
  totalVariants: number;
  filteredVariants: number;
  variants: ProductVariantCatalogItem[];
};

const emptyFormulaRequest: FormulaRequestRow = {
  formulaCode: "",
  variantCode: "",
  orderQuantity: "1",
  parameterValues: {}
};

export default function StockPage() {
  const queryClient = useQueryClient();
  const [warehouseForm, setWarehouseForm] = useState({ code: "", name: "", address: "" });
  const [stockForm, setStockForm] = useState({ materialId: "", warehouseId: "", originalLength: "", remainingLength: "", quantity: "1" });
  const [checkForm, setCheckForm] = useState({ materialId: "", warehouseId: "", requiredLength: "", requiredQuantity: "1" });
  const [formulaWarehouseId, setFormulaWarehouseId] = useState("");
  const [productCatalogForm, setProductCatalogForm] = useState({ formulaCode: "", colorCode: "", openingCode: "", requestedHeight: "2100" });
  const [formulaRequests, setFormulaRequests] = useState<FormulaRequestRow[]>([{ ...emptyFormulaRequest }]);
  const [message, setMessage] = useState<string | null>(null);
  const [showAddedDone, setShowAddedDone] = useState(false);

  const { data: materials = [] } = useQuery({
    queryKey: ["materials"],
    queryFn: () => api.get<MaterialRecord[]>("/materials")
  });

  const { data: formulas = [] } = useQuery({
    queryKey: ["formulas"],
    queryFn: () => api.get<FormulaRecord[]>("/formulas")
  });

  const { data: warehouses = [] } = useQuery({
    queryKey: ["warehouses"],
    queryFn: () => api.get<WarehouseRecord[]>("/warehouses")
  });

  const { data: inventory } = useQuery({
    queryKey: ["stock-inventory"],
    queryFn: () => api.get<InventoryResponse>("/stock/inventory")
  });

  const selectedStockMaterial = materials.find((item) => (item.id ?? item._id) === stockForm.materialId);
  const selectedCheckMaterial = materials.find((item) => (item.id ?? item._id) === checkForm.materialId);
  const selectedCatalogFormula = formulas.find((item) => item.code === normalizeCode(productCatalogForm.formulaCode) || item.code.includes(normalizeCode(productCatalogForm.formulaCode)));
  const catalogColorOptions = selectedCatalogFormula
    ? Array.from(
        new Map(
          selectedCatalogFormula.variants
            .map((variant) => {
              const code = readVariantParameter(variant.parameters, "MAU");
              const label = resolveVariantOptionLabel(selectedCatalogFormula, "MAU", code);
              return code ? [code, label ?? code] : null;
            })
            .filter((item): item is [string, string] => item !== null)
        ).entries()
      ).map(([code, label]) => ({ code, label }))
    : [];
  const catalogOpeningOptions = selectedCatalogFormula
    ? Array.from(
        new Map(
          selectedCatalogFormula.variants
            .map((variant) => {
              const code = readVariantParameter(variant.parameters, "KIEU_MO");
              const label = resolveVariantOptionLabel(selectedCatalogFormula, "KIEU_MO", code);
              return code ? [code, label ?? code] : null;
            })
            .filter((item): item is [string, string] => item !== null)
        ).entries()
      ).map(([code, label]) => ({ code, label }))
    : [];

  const createWarehouse = useMutation({
    mutationFn: () => api.post<WarehouseRecord>("/warehouses", warehouseForm),
    onSuccess: async () => {
      setWarehouseForm({ code: "", name: "", address: "" });
      setMessage("Đã thêm kho.");
      setShowAddedDone(false);
      await queryClient.invalidateQueries({ queryKey: ["warehouses"] });
    },
    onError: (error) => setMessage(error instanceof Error ? error.message : "Không thêm được kho.")
  });

  const createStock = useMutation({
    mutationFn: () => {
      if (selectedStockMaterial?.manageLength) {
        return api.post("/stock/bars", {
          materialId: stockForm.materialId,
          warehouseId: stockForm.warehouseId,
          originalLength: Number(stockForm.originalLength),
          remainingLength: stockForm.remainingLength ? Number(stockForm.remainingLength) : undefined,
          quantity: Number(stockForm.quantity)
        });
      }

      return api.post("/stock/quantity", {
        materialId: stockForm.materialId,
        warehouseId: stockForm.warehouseId,
        quantity: Number(stockForm.quantity)
      });
    },
    onSuccess: async () => {
      setStockForm((current) => ({
        ...current,
        originalLength: "",
        remainingLength: "",
        quantity: "1"
      }));
      setMessage("Đã nhập tồn kho.");
      setShowAddedDone(true);
      await queryClient.invalidateQueries({ queryKey: ["stock-inventory"] });
    },
    onError: (error) => setMessage(error instanceof Error ? error.message : "Không nhập được tồn kho.")
  });

  const checkStock = useMutation({
    mutationFn: async () => {
      if (selectedCheckMaterial?.manageLength) {
        return {
          mode: "length" as const,
          data: await api.get<SuitableResponse>(
            `/stock/suitable-bars?materialId=${checkForm.materialId}&warehouseId=${checkForm.warehouseId}&requiredLength=${checkForm.requiredLength}&requiredQuantity=${checkForm.requiredQuantity}`
          )
        };
      }

      return {
        mode: "quantity" as const,
        data: await api.get<QuantityAvailability>(`/stock/availability?materialId=${checkForm.materialId}&warehouseId=${checkForm.warehouseId}`)
      };
    },
    onError: (error) => setMessage(error instanceof Error ? error.message : "Không kiểm tra được tồn kho.")
  });

  const checkFormulaStock = useMutation({
    mutationFn: async (): Promise<FormulaStockCheckResponse> => {
      const latestMaterials = await queryClient.fetchQuery({
        queryKey: ["materials"],
        queryFn: () => api.get<MaterialRecord[]>("/materials")
      });
      const latestFormulas = await queryClient.fetchQuery({
        queryKey: ["formulas"],
        queryFn: () => api.get<FormulaRecord[]>("/formulas")
      });
      const activeRows = formulaRequests.filter((row) => row.formulaCode.trim());
      if (!formulaWarehouseId) {
        throw new Error("Chọn kho cần kiểm tra.");
      }
      if (activeRows.length === 0) {
        throw new Error("Nhập ít nhất một mã công thức.");
      }

      const materialMap = new Map(latestMaterials.map((item) => [item.id ?? item._id ?? "", item]));
      const aggregated = new Map<
        string,
        {
          materialId: string;
          materialCode: string;
          materialName: string;
          unit: string;
          requiredQuantity: number;
          requiredLength?: number;
          sources: string[];
        }
      >();
      const formulaSummaries: FormulaCheckResult[] = [];

      for (const row of activeRows) {
        const formula = latestFormulas.find((item) => item.code === normalizeCode(row.formulaCode));
        if (!formula) {
          throw new Error(`Không tìm thấy công thức ${row.formulaCode}.`);
        }

        const parameters = buildFormulaParameters(formula, row.parameterValues);
        const orderQuantity = Number(row.orderQuantity || 1);
        const targetVariants = row.variantCode
          ? formula.variants.filter((variant) => variant.code === row.variantCode)
          : formula.variants.length > 0
            ? formula.variants.filter((variant) => matchesVariantWithParameters(variant.parameters, parameters))
            : [undefined];

        const variantsToRun = targetVariants.length > 0 ? targetVariants : [undefined];

        for (const variant of variantsToRun) {
          const bom = await api.post<GenerateBomResponseContract>(`/formulas/${formula.id ?? formula._id}/generate-bom`, {
            variantCode: variant?.code,
            parameters
          });

          formulaSummaries.push({
            formulaCode: formula.code,
            formulaName: formula.name,
            orderQuantity,
            variantCode: variant?.code
          });

          for (const line of bom.lines) {
            const material = materialMap.get(line.materialId);
            if (!material) {
              continue;
            }

            const requiredQuantity = line.quantity * orderQuantity;
            const requiredLength = material.manageLength ? line.length ?? material.standardLength : undefined;
            const key = material.manageLength ? `${line.materialId}:${requiredLength ?? 0}` : line.materialId;
            const sourceLabel = `${formula.code}${variant?.code ? ` (${variant.code})` : ""} x ${orderQuantity}`;
            const current = aggregated.get(key);

            if (current) {
              current.requiredQuantity += requiredQuantity;
              if (!current.sources.includes(sourceLabel)) {
                current.sources.push(sourceLabel);
              }
            } else {
              aggregated.set(key, {
                materialId: line.materialId,
                materialCode: material.code,
                materialName: material.name,
                unit: material.unit,
                requiredQuantity,
                requiredLength,
                sources: [sourceLabel]
              });
            }
          }
        }
      }

      const materialChecks = await Promise.all(
        Array.from(aggregated.values()).map(async (item) => {
          if (item.requiredLength && item.requiredLength > 0) {
            const suitable = await api.get<SuitableResponse>(
              `/stock/suitable-bars?materialId=${item.materialId}&warehouseId=${formulaWarehouseId}&requiredLength=${item.requiredLength}&requiredQuantity=${item.requiredQuantity}`
            );

            return {
              materialId: item.materialId,
              materialCode: item.materialCode,
              materialName: item.materialName,
              unit: item.unit,
              requiredQuantity: item.requiredQuantity,
              requiredLength: item.requiredLength,
              availableQuantity: suitable.suitableCount,
              enough: suitable.enoughQuantity,
              sources: item.sources,
              cutNotice: buildCutNotice(suitable),
              cutPlan: buildCutPlanRows(suitable)
            };
          }

          const availability = await api.get<QuantityAvailability & { quantityBalance: number }>(
            `/stock/availability?materialId=${item.materialId}&warehouseId=${formulaWarehouseId}`
          );

          return {
            materialId: item.materialId,
            materialCode: item.materialCode,
            materialName: item.materialName,
            unit: item.unit,
            requiredQuantity: item.requiredQuantity,
            availableQuantity: availability.quantityBalance,
            enough: availability.quantityBalance >= item.requiredQuantity,
            sources: item.sources
          };
        })
      );

      return { formulaSummaries, materialChecks };
    },
    onError: (error) => setMessage(error instanceof Error ? error.message : "Không kiểm tra được tồn theo công thức.")
  });

  const browseProductCatalog = useMutation({
    mutationFn: async (): Promise<ProductCatalogResponse> => {
      const latestMaterials = await queryClient.fetchQuery({
        queryKey: ["materials"],
        queryFn: () => api.get<MaterialRecord[]>("/materials")
      });
      const latestFormulas = await queryClient.fetchQuery({
        queryKey: ["formulas"],
        queryFn: () => api.get<FormulaRecord[]>("/formulas")
      });

      if (!formulaWarehouseId) {
        throw new Error("Chọn kho để tra cứu bộ sản phẩm.");
      }

      const keyword = normalizeCode(productCatalogForm.formulaCode);
      if (!keyword) {
        throw new Error("Nhập mã sản phẩm hoặc mã công thức.");
      }
      const requestedHeight = Number(productCatalogForm.requestedHeight);
      if (!Number.isFinite(requestedHeight) || requestedHeight <= 0) {
        throw new Error("Nhập chiều cao cần cắt hợp lệ.");
      }

      const formula = latestFormulas.find((item) => item.code === keyword || item.code.includes(keyword));
      if (!formula) {
        throw new Error(`Không tìm thấy mã ${productCatalogForm.formulaCode}.`);
      }

      const materialMap = new Map(latestMaterials.map((item) => [item.id ?? item._id ?? "", item]));
      const filteredVariants = formula.variants.filter((variant) => {
        const colorCode = readVariantParameter(variant.parameters, "MAU");
        const openingCode = readVariantParameter(variant.parameters, "KIEU_MO");

        if (productCatalogForm.colorCode && colorCode !== productCatalogForm.colorCode) {
          return false;
        }
        if (productCatalogForm.openingCode && openingCode !== productCatalogForm.openingCode) {
          return false;
        }
        return true;
      });

      const variants = await Promise.all(
        filteredVariants.map(async (variant) => {
          const bom = await api.post<GenerateBomResponseContract>(`/formulas/${formula.id ?? formula._id}/generate-bom`, {
            variantCode: variant.code,
            parameters: {
              CHIEU_CAO: requestedHeight
            }
          });

          const lines = await Promise.all(
            bom.lines.map(async (line) => {
              const material = materialMap.get(line.materialId);
              if (!material) {
                throw new Error(`Không tìm thấy vật tư ${line.materialId}.`);
              }

              const requiredLength = material.manageLength ? line.length ?? material.standardLength : undefined;
              if (material.manageLength && requiredLength) {
                const suitable = await api.get<SuitableResponse>(
                  `/stock/suitable-bars?materialId=${line.materialId}&warehouseId=${formulaWarehouseId}&requiredLength=${requiredLength}&requiredQuantity=1`
                );

                return {
                  materialCode: material.code,
                  materialName: material.name,
                  unit: material.unit,
                  requiredQuantity: line.quantity,
                  requiredLength,
                  availableQuantity: suitable.suitableCount,
                  maxSets: Math.floor(suitable.suitableCount / line.quantity)
                };
              }

              const availability = await api.get<QuantityAvailability>(
                `/stock/availability?materialId=${line.materialId}&warehouseId=${formulaWarehouseId}`
              );

              return {
                materialCode: material.code,
                materialName: material.name,
                unit: material.unit,
                requiredQuantity: line.quantity,
                availableQuantity: availability.quantityBalance,
                maxSets: Math.floor(availability.quantityBalance / line.quantity)
              };
            })
          );

          return {
            formulaId: formula.id ?? formula._id ?? "",
            formulaCode: formula.code,
            formulaName: formula.name,
            variantCode: variant.code,
            variantName: variant.name,
            colorCode: readVariantParameter(variant.parameters, "MAU"),
            openingCode: readVariantParameter(variant.parameters, "KIEU_MO"),
            requestedHeight,
            maxSets: lines.length > 0 ? Math.min(...lines.map((item) => item.maxSets)) : 0,
            materialLines: lines
          };
        })
      );

      return {
        formulaCode: formula.code,
        formulaName: formula.name,
        totalVariants: formula.variants.length,
        filteredVariants: variants.length,
        variants
      };
    },
    onError: (error) => setMessage(error instanceof Error ? error.message : "Không tra cứu được bộ sản phẩm.")
  });
  const productCatalogSummaries = browseProductCatalog.data ? buildProductCatalogSummaries(browseProductCatalog.data, selectedCatalogFormula) : [];
  const activeFormulaRequests = formulaRequests.filter((row) => row.formulaCode.trim());
  const totalInventoryRows = (inventory?.barStocks.length ?? 0) + (inventory?.quantityStocks.length ?? 0);
  const totalWarehouseCount = warehouses.length;
  const totalMaterialCount = materials.length;
  const totalFormulaCount = formulas.length;
  const cutNoticeRows = checkFormulaStock.data?.materialChecks.filter((item) => item.cutNotice) ?? [];

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-line bg-white p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="text-sm font-medium uppercase tracking-wide text-steel">Trung tâm tồn kho</div>
            <h1 className="mt-2 text-3xl font-semibold text-ink">Quản lý tồn kho và khả năng xuất</h1>
            <p className="mt-2 text-sm leading-6 text-muted">
              Trang này giữ nguyên toàn bộ nghiệp vụ hiện có, nhưng sắp xếp lại theo từng khu vực để tra cứu nhanh, nhập tồn gọn và kiểm tra xuất kho dễ quan sát hơn.
            </p>
          </div>
          <div className="grid flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard label="Kho" value={String(totalWarehouseCount)} note="Kho đang quản lý" />
            <SummaryCard label="Vật tư" value={String(totalMaterialCount)} note="Danh mục sử dụng" />
            <SummaryCard label="Công thức" value={String(totalFormulaCount)} note="Công thức đang có" />
            <SummaryCard label="Dòng tồn" value={String(totalInventoryRows)} note="Theo thanh và số lượng" />
          </div>
        </div>
      </div>

      <Card className="border-line p-6">
        <SectionHeading
          eyebrow="Tra cứu nhanh"
          title="Tra cứu bộ sản phẩm theo mã"
          description="Kiểm tra nhanh tổng số bộ có thể tạo theo kho, màu sắc, kiểu mở và chiều cao cần cắt."
        />
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            setMessage(null);
            browseProductCatalog.mutate();
          }}
        >
          <div className="grid gap-4 md:grid-cols-3">
            <SelectWarehouse value={formulaWarehouseId} warehouses={warehouses} onChange={setFormulaWarehouseId} />
            <TextInput
              label="Mã sản phẩm"
              value={productCatalogForm.formulaCode}
              onChange={(value) => setProductCatalogForm((current) => ({ ...current, formulaCode: normalizeCode(value), colorCode: "", openingCode: "" }))}
              required
            />
            <NumberInput
              label="Chiều cao cần cắt"
              value={productCatalogForm.requestedHeight}
              onChange={(value) => setProductCatalogForm((current) => ({ ...current, requestedHeight: value }))}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm text-muted">Màu sắc</span>
              <select
                value={productCatalogForm.colorCode}
                onChange={(event) => setProductCatalogForm((current) => ({ ...current, colorCode: event.target.value }))}
                className="h-10 w-full rounded-md border border-line px-3 text-sm"
              >
                <option value="">Tất cả màu</option>
                {catalogColorOptions.map((item) => (
                  <option key={item.code} value={item.code}>{item.label}</option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm text-muted">Kiểu mở</span>
              <select
                value={productCatalogForm.openingCode}
                onChange={(event) => setProductCatalogForm((current) => ({ ...current, openingCode: event.target.value }))}
                className="h-10 w-full rounded-md border border-line px-3 text-sm"
              >
                <option value="">Tất cả kiểu mở</option>
                {catalogOpeningOptions.map((item) => (
                  <option key={item.code} value={item.code}>{item.label}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={browseProductCatalog.isPending}>
              {browseProductCatalog.isPending ? "Đang tra cứu..." : "Tra cứu bộ sản phẩm"}
            </Button>
            <div className="text-sm text-muted">Không thay đổi nghiệp vụ, chỉ giúp nhìn nhanh tổng khả năng xuất theo biến thể.</div>
          </div>
        </form>

        {browseProductCatalog.data && (
          <div className="mt-6 space-y-5 border-t border-line pt-5">
            <div className="rounded-lg border border-line bg-[#f8faf7] p-5">
              <div className="text-sm font-medium text-ink">
                {browseProductCatalog.data.formulaCode} - {browseProductCatalog.data.formulaName}
              </div>
              <div className="mt-1 text-sm text-muted">
                Tổng {browseProductCatalog.data.totalVariants} biến thể, đang hiển thị {browseProductCatalog.data.filteredVariants} biến thể theo bộ lọc. Chiều cao đang test: {productCatalogForm.requestedHeight}.
              </div>
            </div>

            {productCatalogSummaries.length > 0 && !productCatalogForm.openingCode && (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {productCatalogSummaries.map((summary) => (
                  <div key={summary.key} className="rounded-lg border border-line bg-white p-5 shadow-sm">
                    <div className="text-xs uppercase tracking-wide text-muted">Tổng hợp theo màu</div>
                    <div className="mt-2 text-base font-semibold text-ink">{summary.label}</div>
                    <div className="mt-3 text-3xl font-semibold text-ink">{summary.totalSets}</div>
                    <div className="text-sm text-muted">bộ có thể tạo tối đa</div>
                    <div className="mt-3 text-sm text-muted">
                      {summary.openings.map((item) => `${item.label}: ${item.maxSets} b?`).join(" | ")}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {browseProductCatalog.data.variants.map((variant) => (
                <div key={variant.variantCode} className="rounded-lg border border-line bg-white p-5 shadow-sm">
                  <div className="text-xs uppercase tracking-wide text-muted">{variant.variantCode}</div>
                  <div className="mt-1 text-base font-semibold text-ink">{variant.variantName}</div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted">
                    {variant.colorCode && <span className="rounded-md border border-line bg-[#f8faf7] px-2 py-1">{variant.colorCode}</span>}
                    {variant.openingCode && <span className="rounded-md border border-line bg-[#f8faf7] px-2 py-1">{variant.openingCode}</span>}
                  </div>
                  <div className="mt-4 rounded-lg bg-[#eef7f0] px-4 py-3 text-sm font-medium text-[#24543a]">
                    Tối đa tạo được {variant.maxSets} bộ
                  </div>
                  <div className="mt-4 space-y-2">
                    {variant.materialLines.map((line) => (
                      <div key={`${variant.variantCode}-${line.materialCode}`} className="rounded-md border border-line bg-[#fbfcfa] px-3 py-3 text-sm">
                        <div className="font-medium text-ink">{line.materialCode} - {line.materialName}</div>
                        <div className="mt-1 text-muted">
                          Cần {line.requiredQuantity} {line.unit.toLowerCase()}
                          {line.requiredLength ? `, dài ${line.requiredLength}` : ""}
                          . Hiện có {line.availableQuantity}. Tối đa {line.maxSets} bộ.
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-xs text-muted">
                    Biến thể này được tính trên chiều cao cần cắt {variant.requestedHeight ?? "-"}.
                  </div>
                </div>
              ))}
            </div>

            {browseProductCatalog.data.variants.length === 0 && (
              <div className="rounded-lg border border-dashed border-line px-4 py-6 text-sm text-muted">
                Không có biến thể nào khớp với bộ lọc đã chọn.
              </div>
            )}
          </div>
        )}
      </Card>

      <div className="grid gap-5 xl:grid-cols-12">
        <Card className="border-line p-6 xl:col-span-4">
          <SectionHeading
          eyebrow="Danh mục"
          title="Tạo kho"
          description="Khai báo kho mới trong hệ thống. Không thay đổi bất kỳ nghiệp vụ nào, chỉ sắp lại để nhìn rõ hơn."
          />
          <form className="mt-5 grid gap-4" onSubmit={submitWarehouse}>
            <TextInput label="Mã kho" value={warehouseForm.code} onChange={(value) => setWarehouseForm((current) => ({ ...current, code: value }))} required />
            <TextInput label="Tên kho" value={warehouseForm.name} onChange={(value) => setWarehouseForm((current) => ({ ...current, name: value }))} required />
            <TextInput label="Địa chỉ" value={warehouseForm.address} onChange={(value) => setWarehouseForm((current) => ({ ...current, address: value }))} />
            <div className="flex items-end">
              <Button type="submit" disabled={createWarehouse.isPending}>{createWarehouse.isPending ? "Đang thêm..." : "Thêm kho"}</Button>
            </div>
          </form>
        </Card>

        <Card className="border-line p-6 xl:col-span-4">
          <SectionHeading
          eyebrow="Nghiệp vụ kho"
          title="Nhập tồn kho"
          description="Nhập tồn theo thanh hoặc theo số lượng, giữ nguyên đúng quy trình và điều kiện hiện có."
          />
          <form className="mt-5 space-y-4" onSubmit={submitStock}>
            <div className="grid gap-4 md:grid-cols-2">
              <SelectMaterial value={stockForm.materialId} materials={materials} onChange={(value) => setStockForm((current) => ({ ...current, materialId: value, originalLength: "", remainingLength: "", quantity: "1" }))} />
              <SelectWarehouse value={stockForm.warehouseId} warehouses={warehouses} onChange={(value) => setStockForm((current) => ({ ...current, warehouseId: value }))} />
              <ReadonlyField label="Màu sắc" value={selectedStockMaterial?.colorName ?? selectedStockMaterial?.colorCode ?? "-"} />
              <NumberInput label={selectedStockMaterial?.manageLength ? "Số lượng thanh" : "Số lượng"} value={stockForm.quantity} onChange={(value) => setStockForm((current) => ({ ...current, quantity: value }))} required />
              {selectedStockMaterial?.manageLength && <NumberInput label="Chiều dài ban đầu" value={stockForm.originalLength} onChange={(value) => setStockForm((current) => ({ ...current, originalLength: value }))} required />}
              {selectedStockMaterial?.manageLength && <NumberInput label="Chiều dài còn lại" value={stockForm.remainingLength} onChange={(value) => setStockForm((current) => ({ ...current, remainingLength: value }))} placeholder="Để trống nếu còn nguyên" />}
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={createStock.isPending}>{createStock.isPending ? "Đang nhập..." : "Nhập tồn"}</Button>
            </div>
          </form>
        </Card>

        <Card className="border-line p-6 xl:col-span-4">
          <SectionHeading
          eyebrow="Kiểm tra nhanh"
          title="Kiểm tra tồn đơn lẻ"
          description="Kiểm tra khả năng xuất theo từng vật tư mà không cần vào công thức."
          />
          <form className="mt-5 space-y-4" onSubmit={submitCheck}>
            <div className="grid gap-4 md:grid-cols-2">
              <SelectMaterial value={checkForm.materialId} materials={materials} onChange={(value) => setCheckForm((current) => ({ ...current, materialId: value, requiredLength: "", requiredQuantity: "1" }))} />
              <SelectWarehouse value={checkForm.warehouseId} warehouses={warehouses} onChange={(value) => setCheckForm((current) => ({ ...current, warehouseId: value }))} />
              <ReadonlyField label="Màu sắc" value={selectedCheckMaterial?.colorName ?? selectedCheckMaterial?.colorCode ?? "-"} />
              <NumberInput label="Số lượng cần xuất" value={checkForm.requiredQuantity} onChange={(value) => setCheckForm((current) => ({ ...current, requiredQuantity: value }))} required />
              {selectedCheckMaterial?.manageLength && <NumberInput label="Chiều dài cần xuất" value={checkForm.requiredLength} onChange={(value) => setCheckForm((current) => ({ ...current, requiredLength: value }))} required />}
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={checkStock.isPending}>{checkStock.isPending ? "Đang kiểm tra..." : "Kiểm tra"}</Button>
            </div>
          </form>

          {checkStock.data?.mode === "length" && (
            <div className="mt-5 rounded-lg border border-line bg-[#f8faf7] p-4 text-sm text-ink">
              {checkStock.data.data.enoughQuantity ? "Đủ" : "Chưa đủ"} {checkStock.data.data.requiredQuantity} thanh cho chiều dài {checkStock.data.data.requiredLength}. Hiện có {checkStock.data.data.suitableCount} thanh phù hợp.
            </div>
          )}

          {checkStock.data?.mode === "quantity" && (
            <div className="mt-5 rounded-lg border border-line bg-[#f8faf7] p-4 text-sm text-ink">
              {checkStock.data.data.quantityBalance >= Number(checkForm.requiredQuantity)
              ? `Đủ số lượng. Hiện có ${checkStock.data.data.quantityBalance}, cần xuất ${checkForm.requiredQuantity}.`
              : `Chưa đủ số lượng. Hiện có ${checkStock.data.data.quantityBalance}, cần xuất ${checkForm.requiredQuantity}.`}
            </div>
          )}
        </Card>
      </div>

      <Card className="border-line p-6">
        <form className="space-y-4" onSubmit={submitFormulaCheck}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionHeading
              eyebrow="Xuất theo bộ"
              title="Kiểm tra tồn theo công thức"
              description="Tổng hợp nhiều sản phẩm trong cùng một lần kiểm tra để nhìn tổng nhu cầu vật tư trước khi xuất."
            />
            <Button type="button" variant="secondary" onClick={() => setFormulaRequests((current) => [...current, { ...emptyFormulaRequest }])}>Thêm sản phẩm</Button>
          </div>

          <div className="rounded-lg border border-line bg-[#f8faf7] p-4 text-sm text-ink">
            <div className="font-medium">Kiểm tra nhiều bộ trong một lần</div>
            <div className="mt-1 text-muted">
              Mỗi dòng là một yêu cầu xuất. Ví dụ: dòng 1 = PTK992, Màu đen - Mở quay, số lượng 2. Dòng 2 = PTK992, Màu đen - Mở trượt, số lượng 1.
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <SelectWarehouse value={formulaWarehouseId} warehouses={warehouses} onChange={setFormulaWarehouseId} />
          </div>

          <div className="space-y-3">
            {formulaRequests.map((row, index) => {
              const formula = formulas.find((item) => item.code === normalizeCode(row.formulaCode));
              const formulaSuggestions = row.formulaCode.trim()
                ? formulas.filter((item) => {
                    const keyword = normalizeCode(row.formulaCode);
                    return item.code.includes(keyword) || normalizeText(item.name).includes(normalizeText(row.formulaCode));
                  }).slice(0, 5)
                : [];
              return (
                <div key={index} className="space-y-4 rounded-lg border border-line bg-white p-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium text-ink">Sản phẩm {index + 1}</div>
                      <div className="text-xs text-muted">Một dòng = một biến thể và số lượng bộ cần xuất.</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="secondary" onClick={() => removeFormulaRow(index)}>Xóa dòng</Button>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-4">
                    <TextInput label="Mã công thức" value={row.formulaCode} onChange={(value) => updateFormulaRow(index, { formulaCode: normalizeCode(value), variantCode: "", parameterValues: {} })} required />
                    <label className="space-y-2">
                      <span className="text-sm text-muted">Biến thể</span>
                      <select
                        value={row.variantCode}
                        onChange={(event) => updateFormulaVariant(index, formula, event.target.value)}
                        className="h-10 w-full rounded-md border border-line px-3 text-sm"
                      >
                        <option value="">Không chọn biến thể</option>
                        {getSelectableVariants(formula, row.parameterValues).map((variant) => (
                          <option key={variant.code} value={variant.code}>{variant.name}</option>
                        ))}
                      </select>
                    </label>
                    <NumberInput label="Số lượng bộ" value={row.orderQuantity} onChange={(value) => updateFormulaRow(index, { orderQuantity: value })} required />
                    <ReadonlyField
                      label="Tóm tắt"
                      value={row.formulaCode ? `${row.formulaCode}${row.variantCode ? ` - ${resolveVariantName(formula, row.variantCode) ?? row.variantCode}` : ""} x ${row.orderQuantity || 1}` : "Chưa chọn"}
                    />
                  </div>

                  {formulaSuggestions.length > 0 && !formula && (
                    <div className="rounded-lg border border-line bg-[#f8faf7] p-3">
                      <div className="text-sm font-medium text-ink">Gợi ý công thức và biến thể</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {formulaSuggestions.map((item) => (
                          <Button
                            key={item.id ?? item._id}
                            type="button"
                            variant="secondary"
                            onClick={() =>
                              updateFormulaRow(index, {
                                formulaCode: item.code,
                                variantCode: "",
                                parameterValues: {}
                              })
                            }
                          >
                            {item.code} - {item.name}
                          </Button>
                        ))}
                      </div>
                      {formulaSuggestions.some((item) => item.variants.length > 0) && (
                        <div className="mt-3 space-y-2">
                          {formulaSuggestions
                            .filter((item) => item.variants.length > 0)
                            .map((item) => (
                              <div key={`${item.id ?? item._id}-variants`} className="flex flex-wrap items-center gap-2 text-sm text-muted">
                                <span>{item.code}:</span>
                                {item.variants.map((variant) => (
                                  <Button
                                    key={variant.code}
                                    type="button"
                                    variant="secondary"
                                    onClick={() =>
                                      updateFormulaSuggestionVariant(index, item, variant.code)
                                    }
                                  >
                                    {variant.name}
                                  </Button>
                                ))}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )}

                  {formula && formula.variants.length > 0 && !row.variantCode && (
                    <div className="rounded-lg border border-line bg-[#f8faf7] p-3">
                      <div className="text-sm font-medium text-ink">Thêm nhanh biến thể vào danh sách</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {formula.variants.map((variant) => (
                          <Button
                            key={`${formula.id ?? formula._id ?? formula.code}-${variant.code}-quick-add`}
                            type="button"
                            variant="secondary"
                            onClick={() =>
                              insertFormulaRowAfter(index, {
                                formulaCode: formula.code,
                                variantCode: variant.code,
                                orderQuantity: "1",
                                parameterValues: buildParameterValuesFromVariant(variant)
                              })
                            }
                          >
                            {variant.name}
                          </Button>
                        ))}
                      </div>
                      <div className="mt-2 text-xs text-muted">Bấm vào biến thể cần thêm, sau đó đổi số lượng bộ ở dòng mới.</div>
                    </div>
                  )}

                  {formula && formula.parameters.length > 0 && (
                    <div className="grid gap-3 md:grid-cols-3">
                      {formula.parameters.map((parameter) => (
                        <FormulaParameterInput
                          key={parameter.code}
                          parameter={parameter}
                          required={parameter.required && !isVariantBackedParameter(formula, parameter.code)}
                          value={row.parameterValues[parameter.code] ?? ""}
                          onChange={(value) =>
                            updateFormulaParameter(index, formula, parameter.code, value)
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {activeFormulaRequests.length > 0 && (
            <div className="overflow-hidden rounded-lg border border-line">
              <div className="border-b border-line bg-[#f8faf7] px-4 py-3 text-sm font-medium text-ink">Danh sách yêu cầu sắp kiểm tra</div>
              <table className="w-full border-collapse text-sm">
                <thead className="bg-[#eef2ed] text-left text-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">STT</th>
                    <th className="px-4 py-3 font-medium">Mã công thức</th>
                    <th className="px-4 py-3 font-medium">Biến thể</th>
                    <th className="px-4 py-3 font-medium">Số lượng bộ</th>
                  </tr>
                </thead>
                <tbody>
                  {activeFormulaRequests.map((item, index) => {
                    const formula = formulas.find((row) => row.code === normalizeCode(item.formulaCode));
                    return (
                      <tr key={`${item.formulaCode}-${item.variantCode}-${index}`} className="border-t border-line">
                        <td className="px-4 py-3 text-muted">{index + 1}</td>
                        <td className="px-4 py-3 text-ink">{item.formulaCode}</td>
                        <td className="px-4 py-3 text-muted">{item.variantCode ? resolveVariantName(formula, item.variantCode) ?? item.variantCode : "Tất cả biến thể khớp"}</td>
                        <td className="px-4 py-3 text-muted">{item.orderQuantity || 1}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={checkFormulaStock.isPending}>{checkFormulaStock.isPending ? "Đang kiểm tra..." : "Kiểm tra tồn theo công thức"}</Button>
          </div>
        </form>

        {checkFormulaStock.data && (
          <div className="mt-5 space-y-5">
            <div className="overflow-hidden rounded-lg border border-line">
              <div className="border-b border-line bg-[#f8faf7] px-4 py-3 text-sm font-medium text-ink">Danh sách công thức đang kiểm tra</div>
              <table className="w-full border-collapse text-sm">
                <thead className="bg-[#eef2ed] text-left text-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">Mã công thức</th>
                    <th className="px-4 py-3 font-medium">Tên công thức</th>
                    <th className="px-4 py-3 font-medium">Biến thể</th>
                    <th className="px-4 py-3 font-medium">Số lượng bộ</th>
                  </tr>
                </thead>
                <tbody>
                  {checkFormulaStock.data.formulaSummaries.map((item, index) => (
                    <tr key={`${item.formulaCode}-${item.variantCode ?? "none"}-${index}`} className="border-t border-line">
                      <td className="px-4 py-3 text-ink">{item.formulaCode}</td>
                      <td className="px-4 py-3 text-muted">{item.formulaName}</td>
                      <td className="px-4 py-3 text-muted">{item.variantCode ?? "Tất cả biến thể khớp"}</td>
                      <td className="px-4 py-3 text-muted">{item.orderQuantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="overflow-hidden rounded-lg border border-line">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-[#eef2ed] text-left text-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">Vật tư</th>
                    <th className="px-4 py-3 font-medium">Đơn vị</th>
                    <th className="px-4 py-3 font-medium">Chiều dài cần</th>
                    <th className="px-4 py-3 font-medium">Cần xuất</th>
                    <th className="px-4 py-3 font-medium">Tồn hiện có</th>
                    <th className="px-4 py-3 font-medium">Còn thiếu</th>
                    <th className="px-4 py-3 font-medium">Gợi ý cắt</th>
                    <th className="px-4 py-3 font-medium">Kết quả</th>
                    <th className="px-4 py-3 font-medium">Nguồn công thức</th>
                  </tr>
                </thead>
                <tbody>
                  {checkFormulaStock.data.materialChecks.map((item) => (
                    <tr key={`${item.materialId}-${item.requiredLength ?? "qty"}`} className="border-t border-line">
                      <td className="px-4 py-3 text-ink">{item.materialCode} - {item.materialName}</td>
                      <td className="px-4 py-3 text-muted">{item.unit}</td>
                      <td className="px-4 py-3 text-muted">{item.requiredLength ?? "-"}</td>
                      <td className="px-4 py-3 text-muted">{item.requiredQuantity}</td>
                      <td className="px-4 py-3 text-muted">{item.availableQuantity}</td>
                      <td className="px-4 py-3 text-muted">{Math.max(item.requiredQuantity - item.availableQuantity, 0)}</td>
                      <td className="px-4 py-3 text-muted">{item.cutNotice ?? "-"}</td>
                      <td className={`px-4 py-3 font-medium ${item.enough ? "text-[#24543a]" : "text-[#9a3412]"}`}>{item.enough ? "Đủ" : "Thiếu"}</td>
                      <td className="px-4 py-3 text-muted">{item.sources.join(", ")}</td>
                    </tr>
                  ))}
                  {checkFormulaStock.data.materialChecks.length === 0 && (
                    <tr>
                      <td className="px-4 py-4 text-muted" colSpan={9}>Không có vật tư nào được sinh ra từ công thức.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {cutNoticeRows.length > 0 && (
              <div className="overflow-hidden rounded-lg border border-line">
                <div className="border-b border-line bg-[#f8faf7] px-4 py-3 text-sm font-medium text-ink">Bang goi y cat thanh</div>
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-[#eef2ed] text-left text-muted">
                    <tr>
                      <th className="px-4 py-3 font-medium">Vật tư</th>
                      <th className="px-4 py-3 font-medium">Thanh tồn</th>
                      <th className="px-4 py-3 font-medium">Cần cắt</th>
                      <th className="px-4 py-3 font-medium">Còn dư</th>
                      <th className="px-4 py-3 font-medium">Ghi chu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cutNoticeRows.map((item) => (
                      <Fragment key={`${item.materialId}-${item.requiredLength ?? "qty"}-cut`}>
                        <tr className="border-t border-line bg-[#fbfcfa]">
                          <td className="px-4 py-3 font-medium text-ink">{item.materialCode} - {item.materialName}</td>
                          <td className="px-4 py-3 text-muted" colSpan={3}>
                            Cần {item.requiredQuantity} thanh, hiện cắt được {item.cutPlan?.length ?? 0} thanh.
                          </td>
                        </tr>
                        {(item.cutPlan ?? []).map((plan, index) => (
                          <tr key={`${item.materialId}-${item.requiredLength ?? "qty"}-${index}`} className="border-t border-line">
                            <td className="px-4 py-3 text-muted">Thanh {index + 1}</td>
                            <td className="px-4 py-3 text-muted">{plan.sourceLength}</td>
                            <td className="px-4 py-3 text-muted">{plan.cutLength}</td>
                            <td className="px-4 py-3 text-muted">{plan.leftoverLength}</td>
                            <td className="px-4 py-3 text-muted">
                              {plan.leftoverLength > 0 ? `Cat ${plan.cutLength}, du ${formatLengthAsCentimeters(plan.leftoverLength)}` : "Cat vua du"}
                            </td>
                          </tr>
                        ))}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </Card>

      <Card className="border-line p-5">
        <div className="flex flex-wrap items-center gap-3">
          {message && <InlineNotice message={message} tone={message.toLowerCase().includes("khong") || message.toLowerCase().includes("chua") ? "error" : "success"} />}
          {showAddedDone && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowAddedDone(false);
                setMessage("Đã thêm xong.");
              }}
            >
              Da them xong
            </Button>
          )}
        </div>
      </Card>

      <Card className="border-line p-6">
        <SectionHeading
          eyebrow="Tồn thực tế"
          title="Danh sách tồn kho"
          description="Tổng hợp tất cả dòng tồn theo thanh và theo số lượng để đội kho có thể quan sát nhanh."
        />
        <div className="mt-5 overflow-hidden rounded-lg border border-line">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-[#eef2ed] text-left text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Loại</th>
                <th className="px-4 py-3 font-medium">Vật tư</th>
                <th className="px-4 py-3 font-medium">Màu sắc</th>
                <th className="px-4 py-3 font-medium">Kho</th>
                <th className="px-4 py-3 font-medium">Dài ban đầu</th>
                <th className="px-4 py-3 font-medium">Còn lại</th>
                <th className="px-4 py-3 font-medium">Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {(inventory?.barStocks ?? []).map((item) => (
                <tr key={item.id} className="border-t border-line">
                  <td className="px-4 py-3 text-muted">Theo thanh</td>
                  <td className="px-4 py-3 text-ink">{item.materialCode} - {item.materialName}</td>
                  <td className="px-4 py-3 text-muted">{item.colorName ?? item.colorCode ?? "-"}</td>
                  <td className="px-4 py-3 text-muted">{item.warehouseCode} - {item.warehouseName}</td>
                  <td className="px-4 py-3 text-muted">{item.originalLength}</td>
                  <td className="px-4 py-3 text-muted">{item.remainingLength}</td>
                  <td className="px-4 py-3 text-muted">{item.quantity}</td>
                </tr>
              ))}
              {(inventory?.quantityStocks ?? []).map((item) => (
                <tr key={`${item.materialId}-${item.warehouseId}`} className="border-t border-line">
                  <td className="px-4 py-3 text-muted">Theo số lượng</td>
                  <td className="px-4 py-3 text-ink">{item.materialCode} - {item.materialName}</td>
                  <td className="px-4 py-3 text-muted">{item.colorName ?? item.colorCode ?? "-"}</td>
                  <td className="px-4 py-3 text-muted">{item.warehouseCode} - {item.warehouseName}</td>
                  <td className="px-4 py-3 text-muted">-</td>
                  <td className="px-4 py-3 text-muted">-</td>
                  <td className="px-4 py-3 text-muted">{item.quantity}</td>
                </tr>
              ))}
              {(inventory?.barStocks.length ?? 0) === 0 && (inventory?.quantityStocks.length ?? 0) === 0 && (
                <tr>
                  <td className="px-4 py-4 text-muted" colSpan={7}>Chưa có dữ liệu tồn kho.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  function submitWarehouse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setShowAddedDone(false);
    createWarehouse.mutate();
  }

  function submitStock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setShowAddedDone(false);
    createStock.mutate();
  }

  function submitCheck(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setShowAddedDone(false);
    checkStock.mutate();
  }

  function submitFormulaCheck(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setShowAddedDone(false);
    checkFormulaStock.mutate();
  }

  function updateFormulaRow(index: number, patch: Partial<FormulaRequestRow>) {
    setFormulaRequests((current) => current.map((item, rowIndex) => (rowIndex === index ? { ...item, ...patch } : item)));
  }

  function updateFormulaVariant(index: number, formula: FormulaRecord | undefined, variantCode: string) {
    if (!formula) {
      updateFormulaRow(index, { variantCode });
      return;
    }

    if (!variantCode) {
      updateFormulaRow(index, { variantCode: "" });
      return;
    }

    const variant = formula.variants.find((item) => item.code === variantCode);
    if (!variant) {
      updateFormulaRow(index, { variantCode });
      return;
    }

    updateFormulaRow(index, {
      variantCode,
      parameterValues: {
        ...formulaRequests[index].parameterValues,
        ...buildParameterValuesFromVariant(variant)
      }
    });
  }

  function updateFormulaParameter(index: number, formula: FormulaRecord, parameterCode: string, value: string) {
    const nextParameterValues = {
      ...formulaRequests[index].parameterValues,
      [parameterCode]: value
    };
    const syncedVariantCode = resolveSyncedVariantCode(formula, nextParameterValues, formulaRequests[index].variantCode);

    updateFormulaRow(index, {
      parameterValues: nextParameterValues,
      variantCode: syncedVariantCode
    });
  }

  function updateFormulaSuggestionVariant(index: number, formula: FormulaRecord, variantCode: string) {
    const variant = formula.variants.find((item) => item.code === variantCode);
    updateFormulaRow(index, {
      formulaCode: formula.code,
      variantCode,
      parameterValues: variant ? buildParameterValuesFromVariant(variant) : {}
    });
  }

  function removeFormulaRow(index: number) {
    setFormulaRequests((current) => (current.length === 1 ? [{ ...emptyFormulaRequest }] : current.filter((_, rowIndex) => rowIndex !== index)));
  }

  function insertFormulaRowAfter(index: number, row: FormulaRequestRow) {
    setFormulaRequests((current) => {
      const next = [...current];
      next.splice(index + 1, 0, row);
      return next;
    });
  }
}

function TextInput({ label, value, onChange, required }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return (
    <label className="space-y-2">
      <span className="text-sm text-muted">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full rounded-md border border-line px-3 text-sm" required={required} />
    </label>
  );
}

function ReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <label className="space-y-2">
      <span className="text-sm text-muted">{label}</span>
      <div className="flex h-10 items-center rounded-md border border-line bg-[#f7f8f5] px-3 text-sm text-ink">{value}</div>
    </label>
  );
}

function NumberInput({ label, value, onChange, placeholder, required }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; required?: boolean }) {
  return (
    <label className="space-y-2">
      <span className="text-sm text-muted">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full rounded-md border border-line px-3 text-sm" type="number" min={1} placeholder={placeholder} required={required} />
    </label>
  );
}

function SummaryCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-lg border border-line bg-[#fbfcfa] p-4">
      <div className="text-xs uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-ink">{value}</div>
      <div className="mt-1 text-sm text-muted">{note}</div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-steel">{eyebrow}</div>
      <h2 className="mt-1 text-lg font-semibold text-ink">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}

function InlineNotice({ message, tone }: { message: string; tone: "success" | "error" }) {
  const toneClass = tone === "success" ? "border-[#b9d8c2] bg-[#eef7f0] text-[#24543a]" : "border-[#f0c7b8] bg-[#fff4ef] text-[#9a3412]";
  return <div className={`rounded-md border px-3 py-2 text-sm ${toneClass}`}>{message}</div>;
}

function SelectMaterial({ value, materials, onChange }: { value: string; materials: MaterialRecord[]; onChange: (value: string) => void }) {
  return (
    <label className="space-y-2">
      <span className="text-sm text-muted">Vật tư</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full rounded-md border border-line px-3 text-sm" required>
        <option value="">Chọn vật tư</option>
        {materials.map((material) => (
          <option key={material.id ?? material._id} value={material.id ?? material._id}>
            {material.code} - {material.name}
          </option>
        ))}
      </select>
    </label>
  );
}

function SelectWarehouse({ value, warehouses, onChange }: { value: string; warehouses: WarehouseRecord[]; onChange: (value: string) => void }) {
  return (
    <label className="space-y-2">
      <span className="text-sm text-muted">Kho</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full rounded-md border border-line px-3 text-sm" required>
        <option value="">Chọn kho</option>
        {warehouses.map((warehouse) => (
          <option key={warehouse.id ?? warehouse._id} value={warehouse.id ?? warehouse._id}>
            {warehouse.code} - {warehouse.name}
          </option>
        ))}
      </select>
    </label>
  );
}

function FormulaParameterInput({
  parameter,
  required,
  value,
  onChange
}: {
  parameter: FormulaContract["parameters"][number];
  required: boolean;
  value: string;
  onChange: (value: string) => void;
}) {
  if (parameter.type === "select") {
    return (
      <label className="space-y-2">
        <span className="text-sm text-muted">{parameter.label}</span>
        <select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full rounded-md border border-line px-3 text-sm" required={required}>
          <option value="">Chọn giá trị</option>
          {(parameter.options ?? []).map((option) => (
            <option key={option.code} value={option.code}>{option.label}</option>
          ))}
        </select>
      </label>
    );
  }

  if (parameter.type === "boolean") {
    return (
      <label className="space-y-2">
        <span className="text-sm text-muted">{parameter.label}</span>
        <select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full rounded-md border border-line px-3 text-sm" required={required}>
          <option value="">Chọn giá trị</option>
          <option value="true">Có</option>
          <option value="false">Không</option>
        </select>
      </label>
    );
  }

  return (
    <label className="space-y-2">
      <span className="text-sm text-muted">{parameter.label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full rounded-md border border-line px-3 text-sm" type={parameter.type === "number" ? "number" : "text"} required={required} />
    </label>
  );
}

function buildFormulaParameters(formula: FormulaRecord, values: Record<string, string>) {
  return Object.fromEntries(
    formula.parameters
      .filter((parameter) => values[parameter.code] !== undefined && values[parameter.code] !== "")
      .map((parameter) => [parameter.code, parseParameterValue(parameter.type, values[parameter.code])])
  );
}

function parseParameterValue(type: FormulaContract["parameters"][number]["type"], value: string) {
  if (type === "number") {
    return Number(value);
  }
  if (type === "boolean") {
    return value === "true";
  }
  return value;
}

function readVariantParameter(parameters: Record<string, string | number | boolean>, key: string) {
  const value = parameters[key];
  return typeof value === "string" ? value : value !== undefined ? String(value) : undefined;
}

function resolveVariantOptionLabel(formula: Pick<FormulaRecord, "parameters"> | undefined, parameterCode: string, value?: string) {
  if (!value) {
    return undefined;
  }

  const parameter = formula?.parameters.find((item) => item.code === parameterCode);
  const option = parameter?.options?.find((item) => item.code === value);
  return option?.label;
}

function resolveVariantName(formula: Pick<FormulaRecord, "variants"> | undefined, variantCode?: string) {
  if (!variantCode) {
    return undefined;
  }

  return formula?.variants.find((item) => item.code === variantCode)?.name;
}

function buildParameterValuesFromVariant(variant: FormulaRecord["variants"][number]) {
  return Object.fromEntries(
    Object.entries(variant.parameters ?? {}).map(([key, value]) => [key, String(value)])
  );
}

function getSelectableVariants(formula: FormulaRecord | undefined, parameterValues: Record<string, string>) {
  if (!formula) {
    return [];
  }

  const filtered = formula.variants.filter((variant) => matchesVariantWithInputValues(variant.parameters, parameterValues));
  return filtered.length > 0 ? filtered : formula.variants;
}

function resolveSyncedVariantCode(formula: FormulaRecord, parameterValues: Record<string, string>, currentVariantCode: string) {
  const matchedVariants = formula.variants.filter((variant) => matchesVariantWithInputValues(variant.parameters, parameterValues));

  if (currentVariantCode) {
    const currentVariantStillMatches = matchedVariants.some((variant) => variant.code === currentVariantCode);
    if (currentVariantStillMatches) {
      return currentVariantCode;
    }
  }

  if (matchedVariants.length === 1) {
    return matchedVariants[0].code;
  }

  return "";
}

function isVariantBackedParameter(formula: FormulaRecord, parameterCode: string) {
  return formula.variants.some((variant) => variant.parameters[parameterCode] !== undefined);
}

function matchesVariantWithParameters(
  variantParameters: Record<string, string | number | boolean>,
  runtimeParameters: Record<string, string | number | boolean>
) {
  return Object.entries(runtimeParameters).every(([key, value]) => {
    if (variantParameters[key] === undefined) {
      return true;
    }

    return String(variantParameters[key]) === String(value);
  });
}

function matchesVariantWithInputValues(
  variantParameters: Record<string, string | number | boolean>,
  inputValues: Record<string, string>
) {
  return Object.entries(inputValues).every(([key, value]) => {
    if (!value) {
      return true;
    }
    if (variantParameters[key] === undefined) {
      return true;
    }

    return String(variantParameters[key]) === String(value);
  });
}

function buildProductCatalogSummaries(data: ProductCatalogResponse, formula?: Pick<FormulaRecord, "parameters">) {
  const grouped = new Map<
    string,
    {
      key: string;
      label: string;
      totalSets: number;
      openings: Array<{ code: string; label: string; maxSets: number }>;
    }
  >();

  for (const variant of data.variants) {
    const colorCode = variant.colorCode ?? "ALL";
    const openingCode = variant.openingCode ?? "ALL";
    const colorLabel = resolveVariantOptionLabel(formula, "MAU", variant.colorCode) ?? colorCode;
    const openingLabel = resolveVariantOptionLabel(formula, "KIEU_MO", variant.openingCode) ?? openingCode;

    const current = grouped.get(colorCode) ?? {
      key: colorCode,
      label: colorLabel,
      totalSets: 0,
      openings: []
    };

    current.totalSets += variant.maxSets;

    const openingItem = current.openings.find((item) => item.code === openingCode);
    if (openingItem) {
      openingItem.maxSets += variant.maxSets;
    } else {
      current.openings.push({
        code: openingCode,
        label: openingLabel,
        maxSets: variant.maxSets
      });
    }

    grouped.set(colorCode, current);
  }

  return Array.from(grouped.values());
}

function buildCutNotice(suitable: SuitableResponse) {
  if (suitable.requiredLength <= 0 || suitable.requiredQuantity <= 0) {
    return undefined;
  }

  const targetQuantity = suitable.enoughQuantity
    ? suitable.requiredQuantity
    : Math.min(suitable.requiredQuantity, suitable.suitableCount);
  const selectedBars = selectBarsForCut(suitable.bars, targetQuantity);
  if (selectedBars.length === 0) {
    return undefined;
  }

  const totalLeftover = selectedBars.reduce((sum, length) => sum + Math.max(length - suitable.requiredLength, 0), 0);
  const sample = selectedBars
    .slice(0, 3)
    .map((length) => `${length} -> du ${formatLengthAsCentimeters(length - suitable.requiredLength)}`)
    .join('; ');
  const moreCount = selectedBars.length - Math.min(selectedBars.length, 3);

  if (!suitable.enoughQuantity) {
    return `Chưa đủ số thanh. Hiện có ${selectedBars.length}/${suitable.requiredQuantity} thanh có thể cắt, dự kiến cắt bỏ ${formatLengthAsCentimeters(totalLeftover)}. ${sample}${moreCount > 0 ? `; và ${moreCount} thanh khác` : ""}`;
  }

  if (totalLeftover <= 0) {
    return "Cat vua du, khong du.";
  }

  return `Đủ nhờ cắt thanh dài hơn. Cần cắt bỏ tổng ${formatLengthAsCentimeters(totalLeftover)} trên ${selectedBars.length} thanh. ${sample}${moreCount > 0 ? `; và ${moreCount} thanh khác` : ""}`;
}

function buildCutPlanRows(suitable: SuitableResponse) {
  if (suitable.requiredLength <= 0 || suitable.requiredQuantity <= 0) {
    return [];
  }

  const targetQuantity = suitable.enoughQuantity
    ? suitable.requiredQuantity
    : Math.min(suitable.requiredQuantity, suitable.suitableCount);

  return selectBarsForCut(suitable.bars, targetQuantity).map((sourceLength) => ({
    sourceLength,
    cutLength: suitable.requiredLength,
    leftoverLength: Math.max(sourceLength - suitable.requiredLength, 0)
  }));
}

function selectBarsForCut(bars: SuitableBar[], requiredQuantity: number) {
  const selected: number[] = [];

  for (const bar of bars) {
    const count = Math.max(bar.quantity ?? 0, 0);
    for (let index = 0; index < count && selected.length < requiredQuantity; index += 1) {
      selected.push(bar.remainingLength);
    }
    if (selected.length >= requiredQuantity) {
      break;
    }
  }

  return selected;
}

function formatLengthAsCentimeters(length: number) {
  const centimeters = length / 10;
  const rounded = Number.isInteger(centimeters) ? centimeters.toFixed(0) : centimeters.toFixed(1);
  return `${rounded} cm`;
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

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toUpperCase();
}
