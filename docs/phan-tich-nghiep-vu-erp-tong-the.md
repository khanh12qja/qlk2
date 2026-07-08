# Phân tích nghiệp vụ ERP tổng thể

## 1. Mục tiêu hệ thống

Hệ thống ERP lấy **đơn hàng làm trung tâm**.

Mọi nghiệp vụ liên quan đến khách hàng, bán hàng, kỹ thuật, BOM, kho, kế toán, công việc, chấm công và lương nếu phát sinh từ một đơn hàng thì phải gắn được về đơn hàng đó.

Mục tiêu chính:

- Quản lý khách hàng và lịch sử giao dịch.
- Quản lý đơn hàng, cọc, công nợ và phát sinh.
- Kỹ thuật chốt phương án thực tế trước khi kho xuất.
- Kho giữ hàng, xuất hàng và quản lý tồn khả dụng.
- Kế toán kiểm soát thu, chi, chứng từ, công nợ và lương.
- Nhân viên có Home cá nhân để xem việc cần xử lý, cần duyệt, cần phản hồi.
- Chấm công lấy từ máy chấm công, nhưng lương tính từ bảng công đã chốt.

## 2. Nguyên tắc lõi

- Không có khách hàng thì không tạo đơn hàng.
- Khách lẻ vẫn phải có hồ sơ khách hàng.
- Mọi khoản thu/chi/phát sinh phải có chứng từ.
- Cọc phải được kế toán xác nhận thì đơn hàng mới được đi tiếp.
- Phát sinh khách trả phải được khách chấp nhận trước khi đưa sang kế toán theo dõi.
- Công thức/BOM chỉ sinh phương án đề xuất, không phải lệnh xuất kho.
- Kỹ thuật chốt BOM thực tế trước khi kho giữ/xuất.
- Kho xuất theo BOM thực tế đã chốt.
- Tồn khả dụng = tồn vật lý - tồn đã giữ.
- Chấm công tháng phải lấy từ bảng công đã chốt, không lấy trực tiếp từ dữ liệu thô của máy chấm công.
- Hoa hồng nhân viên chỉ được tính khi đơn hàng đã thu hết tiền theo quy định.

## 3. Khách hàng

Khách hàng cần quản lý theo nhiều loại:

- Khách lẻ / cá nhân.
- Đại lý.
- Nhà thầu.
- Chủ đầu tư.
- Công ty / tổ chức.
- Khách hàng nội bộ nếu cần.

Thông tin khách hàng cá nhân:

- Mã khách hàng.
- Tên khách hàng.
- Số điện thoại.
- Địa chỉ.
- Ghi chú.
- Lịch sử đơn hàng.
- Công nợ nếu có.

Thông tin khách hàng tổ chức / chủ đầu tư / công ty:

- Tên pháp lý.
- Tên giao dịch.
- Mã số thuế nếu có.
- Địa chỉ trụ sở.
- Địa chỉ công trình/dự án.
- Người đại diện.
- Nhóm khách hàng.
- Nguồn khách.
- Hạn mức công nợ nếu có.
- Điều khoản thanh toán mặc định.
- Nhân viên phụ trách chính.
- Trạng thái hợp tác.

Khách hàng tổ chức có thể có nhiều người liên hệ:

- Phòng mua hàng.
- Phòng kế toán.
- Phòng kỹ thuật.
- Ban quản lý công trường.
- Lãnh đạo/người duyệt.

Mỗi người liên hệ cần có:

- Họ tên.
- Chức vụ.
- Phòng ban.
- Số điện thoại.
- Email/Zalo nếu có.
- Vai trò liên hệ.
- Liên hệ chính/phụ.
- Ghi chú.

## 4. Đơn hàng

Mỗi đơn hàng bắt buộc có:

- Mã đơn hàng.
- Khách hàng.
- Người liên hệ chính.
- Địa chỉ thực hiện/giao hàng.
- Người phụ trách bán hàng.
- Kỹ thuật phụ trách nếu có.
- Trạng thái đơn.
- Giá trị đơn hàng ban đầu.
- Giá trị phát sinh tăng/giảm.
- Tổng giá trị phải thu.
- Tổng đã thu.
- Còn phải thu.
- Điều kiện thanh toán.
- Dự kiến ngày thu cọc.
- Dự kiến ngày thu phần còn lại.

Luồng tổng quát:

```text
Tạo khách hàng
-> Tạo đơn hàng / báo giá
-> Khách đặt cọc
-> Kế toán xác nhận cọc
-> Kỹ thuật chốt thông số và BOM thực tế
-> Quản lý duyệt
-> Giữ kho / sản xuất / xuất kho
-> Giao hàng / lắp đặt
-> Thu phần còn lại
-> Hoàn tất
```

## 5. Tiền cọc và công nợ

Khách hàng bắt buộc phải đặt cọc thì đơn mới được chuyển sang kỹ thuật/kho xử lý.

Mức cọc tối thiểu do quản lý/admin cấu hình sau theo chính sách công ty. Có thể là số tiền cố định hoặc tỷ lệ phần trăm trên giá trị đơn hàng.

NVKD tạo chứng từ cọc gắn với đơn hàng. Kế toán nhận thông báo và xác nhận.

Chứng từ cọc cần có:

- Mã đơn hàng.
- Khách hàng.
- Số tiền cọc.
- Ngày cọc.
- Hình thức thanh toán.
- Ảnh/tệp chứng từ nếu có.
- Ghi chú.
- Trạng thái: chờ kế toán xác nhận, đã xác nhận, từ chối.

Nếu cọc chưa được xác nhận:

- Đơn ở trạng thái chờ xác nhận cọc.
- Không đẩy sang kỹ thuật/kho/sản xuất như đơn chính thức.
- NVKD cần bổ sung thông tin nếu kế toán từ chối.

Công nợ đơn hàng:

- Tổng giá trị phải thu.
- Tiền cọc dự kiến.
- Ngày dự kiến cọc.
- Số tiền còn lại.
- Ngày dự kiến thu phần còn lại.
- Điều kiện thanh toán.
- Trạng thái công nợ: chưa thu, đã thu một phần, đã thu đủ, quá hạn.

Hoa hồng nhân viên chỉ được tính khi đơn hàng đã thu hết tiền theo quy định.

## 6. Phát sinh khách trả và chi phí công ty

Phát sinh khách trả là khoản làm tăng tiền khách phải trả cho đơn hàng.

Ví dụ:

- Khách thêm phụ kiện.
- Khách đổi màu mất tiền chênh lệch.
- Khách yêu cầu lắp thêm hạng mục.
- Khách chịu phí vận chuyển/phát sinh.

Quy tắc:

```text
Tổng phải thu đơn hàng = Giá trị đơn ban đầu + Phát sinh khách trả - Giảm trừ
Còn phải thu = Tổng phải thu đơn hàng - Tổng đã thu
```

Sale phải thảo luận và thống nhất với khách trước. Sau khi khách chấp nhận phát sinh, sale mới báo kế toán để đưa vào theo dõi thu.

Phát sinh công ty trả là khoản chi không cộng vào tiền khách phải trả.

Ví dụ:

- Chi phí sửa sai do nội bộ.
- Chi phí đi lại do công ty chịu.
- Chi phí vật tư hao hụt không thu của khách.
- Chi phí nhân sự, tăng ca, phụ cấp.
- Chi phí mua ngoài.

Chi phí công ty do kế toán kiểm soát và xác nhận.

Doanh thu tổng công ty là thông tin nhạy cảm. Chỉ giám đốc/quản lý được phân quyền mới được xem.

## 7. Chứng từ

Mọi khoản thu, chi, đặt cọc, tạm ứng, hoàn tiền và chi phí phát sinh đều phải có chứng từ.

Chứng từ có thể là:

- Hóa đơn.
- Phiếu thu.
- Phiếu chi.
- Biên lai chuyển khoản.
- Ảnh giao dịch ngân hàng.
- Hóa đơn/chứng từ mua hàng.
- Giấy đề nghị thanh toán.
- Giấy tạm ứng/hoàn ứng.
- Tệp đính kèm khác được kế toán chấp nhận.

Chứng từ cần link được về:

- Đơn hàng nếu liên quan đơn hàng.
- Khách hàng nếu liên quan khách hàng.
- Nhân viên nếu liên quan nhân viên.
- Nhà cung cấp nếu liên quan nhà cung cấp.

## 8. Công việc, giao việc và Home cá nhân

Công việc nếu liên quan đơn hàng thì phải gắn với đơn hàng.

Ví dụ công việc:

- Đi đo kích thước.
- Đi lắp đặt.
- Đi bảo hành.
- Đi giao hàng.
- Đi gặp khách.
- Xử lý phát sinh tại công trình.

Ra ngoài gặp khách được xem là công việc, không bắt buộc quản lý duyệt trước, nhưng nhân viên phải báo/tạo công việc để công ty nắm được lịch sử chăm sóc khách hàng.

Giao việc nội bộ bao gồm:

- Việc cần làm.
- Hỏi ý kiến.
- Xin duyệt.
- Nhắc xử lý.
- Yêu cầu xác nhận thông tin.
- Yêu cầu phản hồi thời gian.

Ví dụ:

- Sale hỏi quản lý: "Đơn này được chiết khấu mức này không?"
- Sale hỏi kho: "Hàng này bao giờ về?"
- Sale hỏi kỹ thuật: "Phương án này có làm được không?"
- Kế toán hỏi sale: "Khoản cọc này của đơn nào?"

Mỗi nhân viên có màn hình Home cá nhân.

Home là bàn làm việc cá nhân, gồm:

- Cần xử lý.
- Cần duyệt.
- Cần phản hồi.
- Quá hạn.
- Theo dõi.
- Thông báo kế toán.
- Thông báo đơn hàng.

Mức ưu tiên:

- Khẩn cấp.
- Cao.
- Bình thường.
- Thấp.

Khi có người hỏi duyệt giá, hỏi chiết khấu, hỏi hàng về hoặc giao việc mới, hệ thống tạo thông báo trên Home của người được hỏi/người được giao.

## 9. Kỹ thuật, BOM và công thức

Công thức sản phẩm chỉ là phương án đề xuất ban đầu.

Khi vào đơn hàng thực tế, kỹ thuật có quyền điều chỉnh phương án để phù hợp với bản vẽ, kích thước, tồn kho và cách thi công.

Kho không xuất theo công thức gốc. Kho xuất theo BOM thực tế đã được kỹ thuật chốt.

Cần có 2 lớp BOM:

### BOM đề xuất

BOM đề xuất được hệ thống sinh từ công thức sản phẩm.

Dùng để:

- Gợi ý nhanh bộ cần những loại linh kiện nào.
- Tính số lượng và chiều dài cần cắt.
- Gợi ý mã vật tư phù hợp theo màu, loại kính và tồn kho.
- Kiểm tra tồn kho sơ bộ.

BOM đề xuất không khóa cứng việc xuất kho.

### BOM thực tế / BOM chốt xuất kho

BOM thực tế là danh sách cuối cùng do kỹ thuật xác nhận.

Là căn cứ để:

- Giữ kho.
- Xuất kho.
- Cắt thanh.
- Báo cáo tồn kho.
- Đối chiếu sau giao hàng.

Kỹ thuật có thể:

- Đổi mã phụ kiện khác.
- Đổi phương án sử dụng vật tư cho phù hợp thực tế.
- Thêm linh kiện.
- Bớt linh kiện.
- Sửa số lượng.
- Sửa chiều dài cắt.
- Chọn mã vật tư cụ thể để xuất.

Đơn hàng cần lưu snapshot BOM thực tế để sau này công thức thay đổi không làm thay đổi đơn cũ.

## 10. Kho, giữ kho và xuất kho

Giữ kho chi tiết là việc khóa tạm một phần tồn kho cho một đơn hàng cụ thể sau khi BOM thực tế đã được chốt.

Khi đơn A đã giữ kho, đơn B tra cứu tồn kho không được nhìn toàn bộ tồn vật lý. Đơn B chỉ được tính theo tồn khả dụng.

Công thức:

```text
Tồn khả dụng = Tồn vật lý - Tồn đã giữ cho các đơn chưa xuất/chưa hủy
```

Cần phân biệt:

| Loại tồn | Ý nghĩa |
|---|---|
| Tồn vật lý | Hàng thật đang có trong kho |
| Tồn đã giữ | Hàng đã khóa tạm cho các đơn hàng khác |
| Tồn khả dụng | Số hàng còn có thể dùng cho đơn mới |

Ví dụ:

- Kho có 10 thanh TDVC99510MB.
- Đơn A đã giữ 3 thanh.
- Đơn B tra kho chỉ thấy khả dụng 7 thanh.

### Giữ kho với vật tư theo thanh

Với vật tư quản lý theo thanh, phải giữ chi tiết đến từng thanh nếu có thể.

Thông tin cần lưu:

- Mã đơn hàng.
- Mã vật tư.
- Mã kho.
- Mã thanh / stockBarId.
- Chiều dài cần cắt.
- Chiều dài còn lại của thanh tại thời điểm giữ.
- Phần dư dự kiến sau cắt.
- Trạng thái giữ: đang giữ, đã xuất, đã nhả giữ, đã hủy.

### Giữ kho với phụ kiện theo số lượng

Với phụ kiện quản lý theo số lượng, giữ theo mã vật tư và số lượng.

Thông tin cần lưu:

- Mã đơn hàng.
- Mã vật tư.
- Mã kho.
- Số lượng giữ.
- Trạng thái giữ: đang giữ, đã xuất, đã nhả giữ, đã hủy.

Số lượng khả dụng:

```text
Số lượng khả dụng = Số lượng tồn - Tổng số lượng đang giữ
```

### Trạng thái giữ kho

```text
Đang giữ -> Đã xuất
Đang giữ -> Đã nhả giữ
Đang giữ -> Đã hủy
```

- Đã xuất: kho đã xuất thật, tồn vật lý bị trừ chính thức.
- Đã nhả giữ: đơn đổi phương án hoặc không cần giữ nữa, hàng quay lại khả dụng.
- Đã hủy: đơn hủy, hàng quay lại khả dụng nếu chưa xuất.

## 11. Cắt thanh và phần thừa

Khi kho xuất một thanh để cắt theo BOM thực tế, nếu chiều dài thanh lớn hơn chiều dài cần cắt thì phần thừa phải được ghi nhận lại thành tồn kho mới hoặc cập nhật thành phần thừa còn lại.

Ví dụ:

- Thanh tồn kho ban đầu: 2400 mm.
- Đơn hàng cần cắt: 2100 mm.
- Phần thừa sau cắt: 300 mm.

Sau khi xuất/cắt:

```text
Thanh gốc 2400 mm -> đã cắt 2100 mm
Phần thừa 300 mm -> trở thành thanh tồn mới nếu còn đủ tiêu chuẩn sử dụng
```

Thông tin phần thừa cần lưu:

- Mã vật tư.
- Mã kho.
- Chiều dài ban đầu của phần thừa.
- Chiều dài còn lại của phần thừa.
- Nguồn phát sinh: cắt từ thanh nào / đơn hàng nào.
- Trạng thái: available, reserved, issued, scrap.

Cần có ngưỡng tối thiểu để quyết định phần thừa còn dùng được hay không.

```text
Nếu phần thừa >= chiều_dài_tối_thiểu_sử_dụng -> tạo thanh tồn mới
Nếu phần thừa < chiều_dài_tối_thiểu_sử_dụng -> chuyển thành phế liệu / scrap
```

## 12. Chấm công, nghỉ phép và lương

Dữ liệu chấm công gốc lấy từ máy chấm công.

Máy chấm công là nguồn dữ liệu thô, ghi nhận:

- Nhân viên.
- Ngày.
- Giờ vào.
- Giờ ra.
- Thiết bị chấm công.
- Trạng thái đồng bộ.

Lương tháng tính từ bảng công đã chốt, không tính trực tiếp từ dữ liệu thô.

Luồng xử lý:

```text
Máy chấm công
-> Dữ liệu chấm công thô
-> Bảng công tạm tính
-> Kế toán/người được phân quyền duyệt điều chỉnh
-> Bảng công chốt
-> Bảng lương
```

Nghỉ phép:

- Nhân viên tạo đơn xin nghỉ.
- Kế toán duyệt nghỉ phép.
- Chỉ đơn đã duyệt mới được tính vào bảng công và bảng lương.
- Kế toán quyết định ngày nghỉ là có lương hoặc không lương theo quy định.

Đến muộn/về sớm:

- Nhân viên tạo đơn xin đến muộn/về sớm.
- Nếu có kế hoạch, nên tạo từ ngày hôm trước.
- Nếu đột xuất/bất khả kháng, tạo đơn giải trình sớm nhất có thể.
- Kế toán duyệt thì mới được tính hợp lệ.
- Số phút đi muộn/về sớm bị tính phạt do admin cấu hình.

Bảng công:

- Nhân viên chỉ xem bảng công của mình.
- Kế toán xem bảng công của tất cả nhân viên.
- Giám đốc xem bảng công tổng thể.
- Nhân viên có thời hạn đến 8h sáng ngày đầu tiên của tháng sau để xem và đối soát bảng công của mình.
- Sau thời hạn đối soát, bảng công có thể được chốt để tính lương.

Tạm ứng nhân viên trong phạm vi hiện tại được hiểu là tạm ứng lương.

Phép năm và phép tồn nếu có sẽ xử lý trong phần quyết toán cuối năm.

## 13. Phân quyền

Hệ thống cần có chức năng phân quyền do admin thao tác và cấu hình.

Admin là người thiết lập ai được xem, tạo, sửa, duyệt, xác nhận hoặc xóa dữ liệu trong từng module.

| Vai trò | Quyền chính |
|---|---|
| NVKD | Tạo khách hàng, tạo đơn hàng, tạo chứng từ cọc, tạo yêu cầu phát sinh khách trả |
| Kỹ thuật | Chốt thông số, chốt BOM, tạo/chỉnh công việc kỹ thuật |
| Kho | Giữ kho, xuất kho, cập nhật tồn |
| Kế toán | Xác nhận tiền cọc, thu/chi, công nợ, chi phí, bảng lương, duyệt nghỉ phép/đi muộn |
| Quản lý | Duyệt đơn, duyệt phát sinh lớn, duyệt hoàn tiền, xem báo cáo theo phân quyền |
| Giám đốc | Xem doanh thu tổng công ty, xem bảng công tổng thể, xem báo cáo quản trị |
| Admin | Cấu hình hệ thống, phân quyền, cấu hình mức cọc tối thiểu, cấu hình mức phạt đi muộn, cấu hình quyền giảm giá |

### Các nhóm quyền cần có

| Nhóm quyền | Ý nghĩa |
|---|---|
| Quyền xem | Được xem dữ liệu trong module |
| Quyền tạo | Được tạo bản ghi mới |
| Quyền sửa | Được sửa thông tin |
| Quyền xóa/hủy | Được xóa hoặc hủy bản ghi |
| Quyền duyệt | Được duyệt đơn, duyệt giá, duyệt chiết khấu, duyệt phát sinh |
| Quyền xác nhận | Được xác nhận cọc, thu tiền, chi phí, bảng công |
| Quyền cấu hình | Được cài đặt tham số hệ thống |
| Quyền xem báo cáo | Được xem báo cáo theo phạm vi được cấp |

### Phân quyền theo chức vụ và phòng ban

Admin cần cấu hình quyền theo:

- Chức vụ.
- Phòng ban.
- Vai trò nghiệp vụ.
- Nhân viên cụ thể nếu cần ngoại lệ.

Ví dụ:

- Sale chỉ được xem đơn hàng của mình hoặc đơn được phân công.
- Trưởng nhóm sale được xem đơn của nhóm.
- Kế toán được xem công nợ, chứng từ, chi phí và bảng công.
- Kho chỉ xem các thông tin cần cho giữ kho/xuất kho, không cần xem doanh thu tổng.
- Giám đốc được xem doanh thu tổng, báo cáo tổng, bảng công tổng thể.
- Admin được cấu hình hệ thống nhưng không nhất thiết là người duyệt nghiệp vụ.

### Phân quyền dữ liệu nhạy cảm

Dữ liệu nhạy cảm cần kiểm soát riêng:

- Doanh thu tổng công ty.
- Lợi nhuận đơn hàng.
- Chi phí công ty.
- Lương nhân viên.
- Bảng công tổng thể.
- Công nợ khách hàng.
- Quyền giảm giá/chiết khấu.

Nguyên tắc:

- Nhân viên chỉ xem dữ liệu cần cho công việc của mình.
- Doanh thu tổng công ty chỉ giám đốc/quản lý được phân quyền mới được xem.
- Nhân viên chỉ xem bảng công của mình.
- Kế toán và giám đốc xem được bảng công tổng thể.
- Lương là thông tin nhạy cảm, chỉ kế toán/giám đốc/người được phân quyền mới được xem.

### Phân quyền duyệt

Các nghiệp vụ cần phân quyền duyệt:

- Duyệt đơn hàng.
- Duyệt chiết khấu/giảm giá.
- Duyệt phát sinh khách trả.
- Duyệt hoàn tiền.
- Duyệt chi phí công ty.
- Duyệt nghỉ phép/đi muộn/về sớm.
- Duyệt bảng công.
- Duyệt bảng lương.
- Duyệt mở lại hoặc điều chỉnh dữ liệu đã chốt.

Quyền duyệt chiết khấu nên do admin cấu hình theo chức vụ và hạn mức.

Ví dụ:

- Sale không được tự duyệt chiết khấu.
- Trưởng nhóm được duyệt chiết khấu trong hạn mức nhỏ.
- Quản lý/giám đốc duyệt chiết khấu lớn.

### Audit log phân quyền

Mọi thao tác quan trọng cần lưu lịch sử:

- Ai tạo.
- Ai sửa.
- Ai duyệt.
- Ai từ chối.
- Ai xác nhận.
- Thời gian thao tác.
- Nội dung trước và sau thay đổi nếu là dữ liệu quan trọng.

Đặc biệt bắt buộc ghi log với:

- Tiền.
- Công nợ.
- Chiết khấu.
- Cọc.
- Chi phí.
- Bảng công.
- Bảng lương.
- BOM thực tế.
- Giữ kho/xuất kho.
- Phân quyền.

## 14. Chiến lược workflow và cấu hình

Workflow không nên để tự do hoàn toàn, cũng không nên code cứng toàn bộ.

Hệ thống nên làm theo hướng:

```text
Xương sống nghiệp vụ cố định
+ Điều kiện duyệt/cảnh báo/phân quyền cho admin cấu hình
+ Giao việc/hỏi ý kiến linh hoạt theo người dùng
```

### Phần nên code cố định

Các luồng liên quan tiền, kho, BOM, công nợ, lương cần có khung cố định để không vỡ nghiệp vụ.

| Phần | Cách làm | Lý do |
|---|---|---|
| Đơn hàng | Code cố định các trạng thái chính | Tránh sale/kho/kế toán hiểu khác nhau |
| Cọc | Code cố định yêu cầu kế toán xác nhận | Liên quan tiền và điều kiện đơn đi tiếp |
| Kỹ thuật chốt BOM | Code cố định bước chốt BOM thực tế | Kho chỉ xuất theo BOM đã chốt |
| Giữ kho/xuất kho | Code cố định luồng giữ, nhả, xuất | Tránh sai tồn và bán trùng hàng |
| Bảng công/bảng lương | Code cố định luồng bảng công tạm -> chốt -> lương | Tránh sai lương |
| Chứng từ thu/chi | Code cố định yêu cầu chứng từ và kế toán xác nhận | Đảm bảo kiểm soát kế toán |

Ví dụ khung đơn hàng cố định:

```text
Nháp
-> Chờ xác nhận cọc
-> Đã cọc
-> Chờ kỹ thuật
-> Kỹ thuật đã chốt BOM
-> Chờ duyệt
-> Chờ kho / chờ sản xuất
-> Đang giao / lắp
-> Hoàn tất
```

Các trạng thái chính này không nên để admin tự xóa/sửa tùy ý.

### Phần nên có giao diện cho admin cấu hình

Admin/quản lý nên có màn hình cấu hình các điều kiện và hạn mức.

| Nội dung cấu hình | Ví dụ |
|---|---|
| Mức cọc tối thiểu | 30% đơn hàng hoặc số tiền cố định |
| Quyền duyệt chiết khấu | Trưởng nhóm duyệt đến 3%, giám đốc duyệt trên 3% |
| Quyền giảm giá/giảm trừ | Theo chức vụ hoặc phòng ban |
| Hạn mức phát sinh cần duyệt | Phát sinh trên 1.000.000 cần quản lý duyệt |
| Số phút đi muộn bị phạt | Quá 10 phút tính đi muộn |
| Số lần đi muộn hợp lệ trong tháng | Tối đa 2 lần/tháng nếu được duyệt |
| Quy tắc nghỉ phép | Xin trước tối thiểu từ hôm trước, trừ bất khả kháng |
| Thời hạn xử lý giao việc | Quá hạn thì cảnh báo người nhận/người tạo |
| Quyền xem báo cáo | Ai được xem doanh thu, lương, bảng công, lợi nhuận |
| Ngưỡng phần thừa sau cắt | Từ bao nhiêu mm thì giữ lại làm tồn |

Phần này nên có giao diện cài đặt sau, vì mỗi công ty có thể thay đổi chính sách.

### Phần nên cho người dùng tạo linh hoạt

Các việc trao đổi nội bộ nên linh hoạt hơn, vì phát sinh thực tế rất đa dạng.

| Phần | Cách làm |
|---|---|
| Giao việc | Người dùng tạo được |
| Hỏi ý kiến | Người dùng tạo được và gắn đơn hàng nếu có |
| Xin duyệt giá/chiết khấu | Người dùng tạo yêu cầu, hệ thống chuyển đúng người có quyền |
| Hỏi hàng bao giờ về | Người dùng hỏi kho/mua hàng/kế hoạch |
| Nhắc xử lý | Người dùng tạo được |
| Theo dõi việc | Người tạo theo dõi được trạng thái |

Tuy linh hoạt, các việc này vẫn cần trạng thái cơ bản:

```text
Mới tạo -> Đang xử lý -> Đã phản hồi / Hoàn tất -> Hủy
```

### Kết luận cấu hình workflow

| Nhóm nghiệp vụ | Cách cài |
|---|---|
| Đơn hàng, tiền, kho, BOM, lương | Code cố định khung workflow |
| Điều kiện duyệt, hạn mức, phân quyền, cảnh báo | Có giao diện admin cấu hình |
| Giao việc, hỏi ý kiến, nhắc xử lý | Người dùng tạo linh hoạt |
| Trạng thái chính | Cố định |
| Người xử lý, hạn xử lý, mức ưu tiên | Người dùng chọn hoặc admin cấu hình mặc định |

Nguyên tắc cuối cùng:

```text
Không để người dùng tự do phá workflow lõi.
Không code cứng mọi chính sách khiến sau này muốn đổi phải sửa phần mềm.
```

## 15. Điểm còn cần chốt thêm

- Khi hủy đơn, tiền cọc sẽ hoàn toàn bộ, khấu trừ chi phí, hay xử lý theo từng trường hợp?
- Bảng công đã chốt có cho mở lại không, hay chỉ tạo phiếu điều chỉnh?
- Bảng lương đã duyệt nếu sai do nghiệp vụ thì điều chỉnh trong tháng cũ hay tạo khoản bù/trừ ở tháng sau?
- Quy tắc chiết khấu theo chức vụ sẽ chia theo % tối đa, số tiền tối đa, hay từng loại đơn hàng?
- Giữ kho một phần khi thiếu hàng có được phép không, hay thiếu một món thì toàn đơn chuyển chờ sản xuất?
