# Architecture

## Principles

- Domain Driven Design theo module nghiep vu: Material, Formula, Warehouse, Stock, Customer, Quotation, Dictionary, Settings, Audit Log.
- Moi module so huu schema, DTO, service va controller cua rieng no.
- Shared contracts dat tai `packages/shared` de frontend va backend dung chung ngon ngu nghiep vu.
- Formula khong duoc copy theo huong mo. Variant chi bo sung parameter tai runtime.
- Formula expression chi di qua parser gioi han, khong dung `eval`.

## Backend boundaries

- `materials`: danh muc vat tu, quyet dinh cach quan ly ton theo thanh hay so luong.
- `formulas`: quan ly cong thuc, parameter dong, variant va sinh BOM runtime.
- `quotations`: tao bao gia va luu snapshot BOM da sinh.
- `stock`: stock_bars cho vat tu theo thanh, stock_movements cho phat sinh kho.
- `dictionaries`: danh muc dong cho parameter kieu select nhu OPENING, SYSTEM, COLOR.
- `settings`: cau hinh he thong.
- `audit-logs`: truy vet hanh dong va thay doi du lieu.

## Runtime BOM flow

1. User chon Formula.
2. User chon Variant neu co.
3. User nhap parameter nhu WIDTH, HEIGHT, OPENING.
4. Backend merge parameter theo thu tu: input nguoi dung, variant, default cua formula.
5. Backend danh gia condition cua tung Formula Item.
6. Backend tinh length va quantity expression.
7. Quotation luu snapshot BOM de bao gia khong bi thay doi khi Formula duoc cap nhat sau nay.

## Frontend boundaries

- App shell la man hinh van hanh truc tiep, khong phai landing page.
- API client nam tai `src/lib/api.ts`.
- TanStack Query quan ly truy van va mutation.
- UI components theo style Shadcn: nho gon, co focus state, de thay bang shadcn chuan khi cai CLI.
