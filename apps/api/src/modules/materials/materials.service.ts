import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateMaterialDto } from "./dto/create-material.dto";
import { UpdateMaterialDto } from "./dto/update-material.dto";
import { Material } from "./schemas/material.schema";

@Injectable()
export class MaterialsService {
  constructor(@InjectModel(Material.name) private readonly materialModel: Model<Material>) {}

  async create(dto: CreateMaterialDto) {
    const manageLength = this.isLengthManagedUnit(dto.unit);
    if (manageLength && !dto.standardLength) {
      throw new BadRequestException("Chieu dai chuan la bat buoc khi vat tu tinh theo thanh");
    }

    const categoryCode = this.normalizeCode(dto.category);
    const baseCode = this.normalizeCode(dto.baseCode);
    const colorCode = dto.colorCode ? this.normalizeCode(dto.colorCode) : undefined;
    const materialCode = this.buildMaterialCode(categoryCode, baseCode, colorCode);

    try {
      return await this.materialModel.create({
        ...dto,
        code: materialCode,
        baseCode,
        category: dto.category.trim().toUpperCase(),
        unit: dto.unit.trim().toUpperCase(),
        manageLength,
        standardLength: manageLength ? dto.standardLength : undefined,
        colorCode,
        colorName: dto.colorName?.trim() || undefined,
        status: dto.status ?? "active"
      });
    } catch (error) {
      this.handleMaterialWriteError(error, materialCode);
    }
  }

  async findAll() {
    return this.materialModel.find().sort({ code: 1 }).lean();
  }

  async findById(id: string) {
    const material = await this.materialModel.findById(id).lean();
    if (!material) {
      throw new NotFoundException("Khong tim thay vat tu");
    }
    return material;
  }

  async update(id: string, dto: UpdateMaterialDto) {
    const existing = await this.materialModel.findById(id).lean();
    if (!existing) {
      throw new NotFoundException("Khong tim thay vat tu");
    }

    const manageLength = dto.unit ? this.isLengthManagedUnit(dto.unit) : dto.manageLength ?? existing.manageLength;
    const standardLength = manageLength ? dto.standardLength ?? existing.standardLength : undefined;
    if (manageLength && !standardLength) {
      throw new BadRequestException("Chieu dai chuan la bat buoc khi vat tu tinh theo thanh");
    }

    const category = dto.category?.trim().toUpperCase() ?? existing.category;
    const baseCode = this.normalizeCode(dto.baseCode ?? existing.baseCode ?? this.extractBaseCode(existing.code, existing.category, existing.colorCode));
    const colorCode = dto.colorCode === undefined
      ? existing.colorCode
      : dto.colorCode.trim()
        ? this.normalizeCode(dto.colorCode)
        : undefined;
    const materialCode = this.buildMaterialCode(this.normalizeCode(category), baseCode, colorCode ? this.normalizeCode(colorCode) : undefined);

    const payload = {
      ...dto,
      code: materialCode,
      baseCode,
      category,
      unit: dto.unit?.trim().toUpperCase(),
      manageLength,
      colorCode: colorCode || undefined,
      colorName: dto.colorName?.trim() || undefined,
      standardLength
    };

    try {
      const material = await this.materialModel
        .findByIdAndUpdate(id, manageLength === false ? { $set: payload, $unset: { standardLength: "" } } : { $set: payload }, { new: true, runValidators: true })
        .lean();
      return material;
    } catch (error) {
      this.handleMaterialWriteError(error, materialCode);
    }
  }

  private isLengthManagedUnit(unit: string) {
    return unit.trim().toUpperCase().includes("THANH");
  }

  private buildMaterialCode(categoryCode: string, baseCode: string, colorCode?: string) {
    return `${categoryCode}${baseCode}${colorCode ?? ""}`;
  }

  private normalizeCode(value: string) {
    return value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Za-z0-9]/g, "")
      .toUpperCase();
  }

  private extractBaseCode(code: string, category: string, colorCode?: string) {
    const normalizedCode = this.normalizeCode(code);
    const categoryCode = this.normalizeCode(category);
    const normalizedColor = colorCode ? this.normalizeCode(colorCode) : "";

    let candidate = normalizedCode;
    if (candidate.startsWith(categoryCode)) {
      candidate = candidate.slice(categoryCode.length);
    }
    if (normalizedColor && candidate.endsWith(normalizedColor)) {
      candidate = candidate.slice(0, candidate.length - normalizedColor.length);
    }

    return candidate || normalizedCode;
  }

  private handleMaterialWriteError(error: unknown, materialCode: string): never {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: number }).code === 11000
    ) {
      throw new BadRequestException(`Ma vat tu ${materialCode} da duoc them vao phan mem.`);
    }

    throw error;
  }
}
