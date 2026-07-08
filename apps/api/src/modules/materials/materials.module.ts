import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MaterialsController } from "./materials.controller";
import { MaterialsService } from "./materials.service";
import { Material, MaterialSchema } from "./schemas/material.schema";
import { Dictionary, DictionarySchema } from "../dictionaries/schemas/dictionary.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Material.name, schema: MaterialSchema },
      { name: Dictionary.name, schema: DictionarySchema }
    ])
  ],
  controllers: [MaterialsController],
  providers: [MaterialsService],
  exports: [MaterialsService, MongooseModule]
})
export class MaterialsModule {}
