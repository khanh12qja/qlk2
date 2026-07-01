import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SaveDictionaryDto } from "./dto/save-dictionary.dto";
import { Dictionary } from "./schemas/dictionary.schema";

@Injectable()
export class DictionariesService {
  constructor(@InjectModel(Dictionary.name) private readonly dictionaryModel: Model<Dictionary>) {}

  async findAll() {
    return this.dictionaryModel.find().sort({ code: 1 }).lean();
  }

  async findByCode(code: string) {
    const normalizedCode = code.trim().toUpperCase();
    const dictionary = await this.dictionaryModel.findOne({ code: normalizedCode }).lean();
    return dictionary ?? { code: normalizedCode, name: normalizedCode, items: [] };
  }

  async save(dto: SaveDictionaryDto) {
    const code = dto.code.trim().toUpperCase();
    const items = dto.items
      .filter((item) => item.code && item.label)
      .map((item, index) => ({
        code: item.code.trim().toUpperCase(),
        label: item.label.trim(),
        sortOrder: item.sortOrder ?? index + 1,
        status: item.status ?? "active"
      }));

    return this.dictionaryModel
      .findOneAndUpdate(
        { code },
        {
          code,
          name: dto.name.trim(),
          items
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      )
      .lean();
  }
}
