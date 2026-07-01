import { Body, Controller, Get, Param, Put } from "@nestjs/common";
import { DictionariesService } from "./dictionaries.service";
import { SaveDictionaryDto } from "./dto/save-dictionary.dto";

@Controller("dictionaries")
export class DictionariesController {
  constructor(private readonly dictionariesService: DictionariesService) {}

  @Get()
  findAll() {
    return this.dictionariesService.findAll();
  }

  @Get(":code")
  findByCode(@Param("code") code: string) {
    return this.dictionariesService.findByCode(code);
  }

  @Put(":code")
  save(@Param("code") code: string, @Body() dto: SaveDictionaryDto) {
    return this.dictionariesService.save({ ...dto, code });
  }
}
