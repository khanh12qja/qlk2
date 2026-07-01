export type EntityStatus = "active" | "inactive";

export type MaterialCategory = string;

export interface MaterialContract {
  id: string;
  code: string;
  baseCode?: string;
  name: string;
  category: MaterialCategory;
  colorCode?: string;
  colorName?: string;
  unit: string;
  manageLength: boolean;
  standardLength?: number;
  status: EntityStatus;
}

export interface DictionaryItemContract {
  code: string;
  label: string;
  sortOrder: number;
  status: EntityStatus;
}

export interface DictionaryContract {
  id: string;
  code: string;
  name: string;
  items: DictionaryItemContract[];
}

export type FormulaParameterType = "number" | "text" | "select" | "boolean";

export interface FormulaParameterContract {
  code: string;
  label: string;
  type: FormulaParameterType;
  required: boolean;
  optionsDictionaryCode?: string;
  options?: Array<{
    code: string;
    label: string;
  }>;
  defaultValue?: string | number | boolean;
}

export interface FormulaVariantContract {
  code: string;
  name: string;
  nameTemplate?: string;
  parameters: Record<string, string | number | boolean>;
  status: EntityStatus;
}

export interface FormulaItemContract {
  lineCode: string;
  materialId: string;
  description: string;
  lengthExpression?: string;
  quantityExpression: string;
  conditionExpression?: string;
  wasteRate?: number;
}

export interface FormulaContract {
  id: string;
  code: string;
  name: string;
  parameters: FormulaParameterContract[];
  variants: FormulaVariantContract[];
  items: FormulaItemContract[];
  status: EntityStatus;
}

export interface GenerateBomRequestContract {
  formulaId: string;
  variantCode?: string;
  parameters: Record<string, string | number | boolean>;
}

export interface BomLineContract {
  lineCode: string;
  materialId: string;
  description: string;
  length?: number;
  quantity: number;
  wasteRate: number;
}

export interface StockBarContract {
  id: string;
  materialId: string;
  warehouseId: string;
  originalLength: number;
  remainingLength: number;
  quantity: number;
  status: "available" | "reserved" | "issued" | "scrap";
}

export interface GenerateBomResponseContract {
  formulaId: string;
  variantCode?: string;
  runtimeParameters: Record<string, string | number | boolean>;
  lines: BomLineContract[];
}
