import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./modules/auth/auth.module";
import { AuditLogsModule } from "./modules/audit-logs/audit-logs.module";
import { CustomersModule } from "./modules/customers/customers.module";
import { DictionariesModule } from "./modules/dictionaries/dictionaries.module";
import { FormulasModule } from "./modules/formulas/formulas.module";
import { MaterialsModule } from "./modules/materials/materials.module";
import { QuotationsModule } from "./modules/quotations/quotations.module";
import { ReportsModule } from "./modules/reports/reports.module";
import { RolesModule } from "./modules/roles/roles.module";
import { SettingsModule } from "./modules/settings/settings.module";
import { StockModule } from "./modules/stock/stock.module";
import { UsersModule } from "./modules/users/users.module";
import { WarehousesModule } from "./modules/warehouses/warehouses.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>("MONGODB_URI")
      })
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    MaterialsModule,
    WarehousesModule,
    StockModule,
    FormulasModule,
    QuotationsModule,
    CustomersModule,
    ReportsModule,
    SettingsModule,
    DictionariesModule,
    AuditLogsModule
  ]
})
export class AppModule {}
