# MongoDB database design

## Collections

- `users`: tai khoan dang nhap JWT.
- `roles`: vai tro va permission.
- `settings`: cau hinh he thong.
- `dictionaries`: danh muc dong.
- `materials`: vat tu.
- `warehouses`: kho.
- `stock_bars`: thanh nhom kinh duoc quan ly rieng tung thanh.
- `formulas`: cong thuc, parameter, variant, item.
- `quotations`: bao gia va snapshot BOM.
- `customers`: khach hang phuc vu bao gia.
- `stock_movements`: phat sinh nhap, xuat, dieu chinh, giu cho.
- `audit_logs`: nhat ky thay doi.

## Material

`manageLength=true`:

- Co `standardLength`.
- Ton kho chi tiet nam trong `stock_bars`.
- Moi thanh co `originalLength`, `remainingLength`, `status`.

`manageLength=false`:

- Khong bat buoc `standardLength`.
- Ton kho tong hop tu `stock_movements.quantity`.

## Formula

Formula la aggregate root.

- `parameters`: danh sach parameter duoc admin cau hinh.
- `variants`: chi luu parameter override, khong copy items.
- `items`: vat tu can sinh BOM, bieu thuc length, quantity, condition.

Condition ho tro:

- `==`
- `>`
- `<`
- `>=`
- `<=`
- `&&`
- `||`

## Indexing

- Code unique cho master data: materials, formulas, warehouses, customers, roles.
- Stock index theo material, warehouse, status, remainingLength.
- Quotation index theo formula, customer, status, thoi gian tao.
- Audit index theo module, action, entity, thoi gian tao.
