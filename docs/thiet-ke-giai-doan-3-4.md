# Thiết kế Giai đoạn 3 và Giai đoạn 4

## 1. Mục tiêu

Tài liệu này chốt phạm vi triển khai tiếp theo cho hệ thống ERP kho nhôm kính, sau khi phần lõi hiện tại đã có:

- Vật tư
- Công thức và BOM runtime
- Kho
- Tồn kho theo thanh và theo số lượng
- Kiểm tra tồn theo công thức
- Báo giá cơ bản

Hai giai đoạn tiếp theo cần mở rộng từ lõi hiện có, không làm đứt logic kho và không làm sai luồng nghiệp vụ đã vận hành.

---

## 2. Hiện trạng code hiện tại

### Đã có trong hệ thống

- `users`, `roles`
- `materials`
- `warehouses`
- `stock_bars`, `stock_movements`
- `formulas`
- `customers`
- `quotations`
- `dictionaries`
- `settings`
- `audit_logs`

### Đã làm được về nghiệp vụ

- Quản lý vật tư theo thanh hoặc theo số lượng
- Tạo công thức và biến thể
- Sinh BOM runtime theo tham số
- Kiểm tra tồn kho theo công thức
- Nhập tồn, xem tồn, gợi ý cắt thanh
- Quản lý khách hàng cơ bản
- Tạo báo giá cơ bản từ công thức

### Chưa có hoặc mới ở mức nền

- Quản lý nhân viên chi tiết
- Chấm công
- Giao việc
- Báo cáo công việc
- Quy trình đơn hàng nhiều bước
- Duyệt kỹ thuật, duyệt quản lý, chờ sản xuất
- Theo dõi đặt cọc, điều kiện thanh toán, chứng từ thu tiền
- Đánh giá nhân viên, KPI, dữ liệu đầu vào tính lương

---

## 3. Phạm vi Giai đoạn 3

Giai đoạn 3 tập trung vào quản trị nội bộ và vận hành nhân sự.

### 3.1 Module cần có

1. Quản lý nhân viên
2. Chấm công
3. Giao việc
4. Báo cáo công việc

### 3.2 Mục tiêu của Giai đoạn 3

- Biết trong công ty có ai, thuộc bộ phận nào, chức vụ gì, đang làm việc hay nghỉ
- Ghi nhận giờ vào ra, lịch sử làm việc ngoài văn phòng, đi gặp khách, đi công trình
- Giao việc theo người phụ trách, theo hạn xử lý, theo mức ưu tiên
- Nhân viên tự báo cáo kết quả công việc theo ngày, tuần, tháng
- Sếp có dữ liệu thực để đánh giá hiệu quả nhân sự

---

## 4. Phạm vi Giai đoạn 4

Giai đoạn 4 tập trung vào luồng đơn hàng vận hành nhiều phòng ban, nối từ kinh doanh đến kỹ thuật, quản lý, kho và sản xuất.

### 4.1 Module cần có

1. Đơn hàng
2. Duyệt kỹ thuật
3. Duyệt quản lý
4. Chờ sản xuất
5. Chờ xuất kho
6. Thu tiền và chứng từ
7. Ưu tiên xử lý đơn cho kho

### 4.2 Mục tiêu của Giai đoạn 4

- Chốt được đơn hàng chỉ sau khi có cọc hoặc đủ điều kiện bán
- Gắn bản vẽ kỹ thuật với đúng mã đơn
- Phân biệt đơn xuất ngay và đơn chờ sản xuất
- Kho biết đơn nào ưu tiên, đơn nào bình thường
- Theo dõi đơn đã thu bao nhiêu, còn thiếu bao nhiêu, chứng từ ở đâu

---

## 5. Thiết kế nghiệp vụ Giai đoạn 3

## 5.1 Quản lý nhân viên

### Dữ liệu cốt lõi

- Mã nhân viên
- Họ tên
- Số điện thoại
- Email
- Phòng ban
- Chức danh
- Người quản lý trực tiếp
- Trạng thái làm việc
- Ngày vào làm
- Loại nhân sự
- Liên kết tài khoản đăng nhập

### Phòng ban đề xuất

- Kinh doanh
- Kỹ thuật
- Kho
- Sản xuất
- Kế toán
- Điều phối
- Quản lý
- Hành chính nhân sự

### Kết quả đạt được

- Có hồ sơ nhân sự thống nhất
- Là nền để phân quyền, giao việc, chấm công, báo cáo

## 5.2 Chấm công

### Dữ liệu cần quản lý

- Nhân viên
- Ngày công
- Giờ vào
- Giờ ra
- Nguồn chấm công
- Trạng thái
- Ghi chú
- Ảnh hoặc chứng cứ nếu có
- Vị trí nếu là đi gặp khách hoặc ra công trình

### Nguồn dữ liệu

1. Đồng bộ từ máy chấm công hoặc phần mềm chấm công
2. Nhập tay có duyệt
3. Đơn xin bổ sung công

### Nghiệp vụ chính

- Đi làm đúng giờ
- Đi muộn, về sớm
- Công tác gặp khách
- Đi khảo sát công trình
- Làm thêm giờ
- Quên chấm công và xin bổ sung

### Kết quả đạt được

- Có dữ liệu thật để đánh giá kỷ luật làm việc
- Là đầu vào cho lương, thưởng, KPI sau này

## 5.3 Giao việc

### Đối tượng giao việc

- Công việc nội bộ
- Việc xử lý đơn hàng
- Việc kỹ thuật
- Việc kho
- Việc chăm sóc khách hàng

### Dữ liệu cần có

- Mã công việc
- Tiêu đề
- Loại công việc
- Người giao
- Người nhận
- Người phối hợp
- Phòng ban liên quan
- Mức ưu tiên
- Hạn xử lý
- Mô tả
- Tệp đính kèm
- Đối tượng liên kết

### Đối tượng liên kết đề xuất

- Khách hàng
- Báo giá
- Đơn hàng
- Công thức
- Kho
- Phiếu xuất

### Trạng thái công việc

- Mới tạo
- Đã nhận
- Đang làm
- Chờ phản hồi
- Chờ duyệt
- Hoàn thành
- Hủy

### Kết quả đạt được

- Không còn giao việc qua tin nhắn rời rạc
- Theo dõi được ai đang giữ việc và việc đang tắc ở đâu

## 5.4 Báo cáo công việc

### Báo cáo theo chu kỳ

- Báo cáo ngày
- Báo cáo tuần
- Báo cáo tháng

### Dữ liệu cần có

- Người báo cáo
- Kỳ báo cáo
- Công việc đã làm
- Kết quả đạt được
- Vướng mắc
- Kế hoạch tiếp theo
- Tệp đính kèm
- Người duyệt
- Trạng thái duyệt

### Kết quả đạt được

- Sếp có bức tranh vận hành theo người và theo phòng ban
- Có dữ liệu để đánh giá hiệu quả nhân viên theo tháng, quý

---

## 6. Thiết kế nghiệp vụ Giai đoạn 4

## 6.1 Luồng đơn hàng tổng thể

1. Nhân viên kinh doanh tạo đơn
2. Ghi nhận đặt cọc hoặc điều kiện thanh toán
3. Đơn chuyển kỹ thuật
4. Kỹ thuật kiểm tra, duyệt và đính kèm bản vẽ
5. Đơn chuyển quản lý
6. Quản lý quyết định:
   - Xuất ngay nếu kho đủ
   - Chờ sản xuất nếu kho chưa đủ
7. Nếu chờ sản xuất, quản lý hoặc điều phối nhập số ngày dự kiến
8. Khi đủ điều kiện xuất, đơn chuyển kho
9. Kinh doanh có thể đánh dấu mức độ ưu tiên gửi kho
10. Kho xử lý xuất hàng
11. Sau giao hàng, xác nhận đã thu tiền hoặc còn công nợ theo điều kiện thanh toán
12. Đính kèm chứng từ thu tiền

## 6.2 Đơn hàng

### Dữ liệu cần có

- Mã đơn hàng
- Khách hàng
- Loại khách hàng
- Nhân viên kinh doanh phụ trách
- Nguồn đơn
- Danh sách sản phẩm đặt
- Kích thước yêu cầu
- Màu
- Hướng mở
- Số lượng
- Tổng giá trị
- Số tiền cọc
- Tỷ lệ cọc
- Điều kiện thanh toán
- Ghi chú đơn
- Trạng thái đơn

### Loại khách hàng

- Cá nhân
- Công ty
- Đối tác

## 6.3 Duyệt kỹ thuật

### Mục tiêu

- Xác nhận đơn có thể triển khai đúng kỹ thuật
- Gắn bản vẽ, thông số, ghi chú kỹ thuật

### Dữ liệu cần có

- Người duyệt kỹ thuật
- Ngày duyệt
- Kết quả duyệt
- Ghi chú chỉnh sửa
- File bản vẽ
- Phiên bản bản vẽ

## 6.4 Duyệt quản lý

### Mục tiêu

- Chốt hướng xử lý của đơn
- Phân loại xuất ngay hay chờ sản xuất

### Quyết định duyệt

- Duyệt xuất kho ngay
- Duyệt chờ sản xuất
- Trả lại kỹ thuật
- Tạm dừng
- Hủy đơn

## 6.5 Chờ sản xuất

### Mục tiêu

- Gom các đơn chưa đủ hàng
- Theo dõi thời gian chờ
- Hỗ trợ điều độ kế hoạch

### Dữ liệu cần có

- Mã đơn
- Lý do chờ
- Vật tư thiếu
- Ngày dự kiến xong
- Người phụ trách điều độ
- Mức độ ưu tiên

## 6.6 Chờ xuất kho

### Mục tiêu

- Kho nhận đơn đã đủ điều kiện
- Sắp theo ưu tiên để xử lý

### Mức độ ưu tiên đề xuất

- Khẩn cấp
- Ưu tiên cao
- Bình thường

### Ai được đặt ưu tiên

- Kinh doanh được đề xuất ưu tiên
- Quản lý hoặc kho có quyền xác nhận lại mức ưu tiên

## 6.7 Thu tiền và chứng từ

### Dữ liệu cần có

- Số tiền cần thu
- Đã cọc
- Còn phải thu
- Hình thức thanh toán
- Điều kiện thanh toán
- Người xác nhận thu
- Ngày thu
- Ảnh chuyển khoản hoặc chứng từ

### Điều kiện thanh toán ví dụ

- Cọc trước, thanh toán khi nhận hàng
- Cọc trước, thanh toán sau X ngày
- Không cọc, thanh toán ngay
- Cọc X phần trăm, còn lại khi lắp đặt xong

---

## 7. Liên kết Giai đoạn 3 và 4 với phần kho hiện tại

## 7.1 Liên kết với công thức

- Đơn hàng phải tham chiếu công thức và biến thể
- Kích thước thực tế của đơn là đầu vào để sinh BOM runtime
- Kỹ thuật có thể kiểm tra lại trước khi duyệt

## 7.2 Liên kết với tồn kho

- Khi đơn sang bước duyệt quản lý, hệ thống gọi logic kiểm tra tồn hiện có
- Nếu đủ hàng, cho phép tạo yêu cầu xuất
- Nếu chưa đủ, tự động đưa vào danh sách chờ sản xuất

## 7.3 Liên kết với kho

- Kho chỉ nhận đơn đã qua duyệt
- Kho nhìn thấy ưu tiên, hạn giao và tình trạng thanh toán
- Kho xuất xong phải phản hồi trạng thái về đơn hàng

## 7.4 Liên kết với nhân viên

- Mọi đơn đều gắn:
  - Nhân viên kinh doanh phụ trách
  - Kỹ thuật duyệt
  - Quản lý duyệt
  - Nhân viên kho xử lý

---

## 8. Thiết kế phân quyền đề xuất

## 8.1 Admin

- Toàn quyền cấu hình
- Quản lý người dùng, vai trò, quyền
- Xem toàn bộ dữ liệu

## 8.2 Nhân viên kinh doanh

- Tạo và sửa khách hàng của mình
- Tạo báo giá
- Tạo đơn hàng
- Ghi nhận cọc
- Gửi ưu tiên cho kho
- Xem đơn do mình phụ trách
- Không sửa tồn kho

## 8.3 Nhân viên kỹ thuật

- Nhận đơn chờ duyệt kỹ thuật
- Đính bản vẽ
- Ghi chú kỹ thuật
- Trả lại hoặc duyệt kỹ thuật

## 8.4 Quản lý

- Duyệt đơn
- Chuyển đơn sang xuất kho hoặc chờ sản xuất
- Xem báo cáo toàn bộ
- Xác nhận mức độ ưu tiên

## 8.5 Nhân viên kho

- Xem đơn chờ xuất
- Xem mức độ ưu tiên
- Kiểm tra tồn
- Xử lý xuất kho
- Xác nhận hoàn tất xuất

## 8.6 Điều phối hoặc sản xuất

- Xem đơn chờ sản xuất
- Gán thời gian dự kiến
- Theo dõi tiến độ chuẩn bị hàng

## 8.7 Kế toán

- Xem thông tin thanh toán
- Xác nhận chứng từ
- Dùng dữ liệu chấm công và đánh giá làm đầu vào lương

---

## 9. Thiết kế dữ liệu đề xuất

Các collection sau nên bổ sung theo đúng hướng DDD, không nhồi thêm quá nhiều vào collection cũ.

## 9.1 Giai đoạn 3

- `employees`
- `attendance_profiles`
- `attendance_logs`
- `attendance_adjustment_requests`
- `tasks`
- `task_comments`
- `task_attachments`
- `work_reports`
- `work_report_lines`

## 9.2 Giai đoạn 4

- `sales_orders`
- `sales_order_lines`
- `sales_order_approvals`
- `technical_drawings`
- `production_queue`
- `warehouse_dispatch_requests`
- `delivery_confirmations`
- `payment_receipts`
- `customer_activities`

## 9.3 Có thể để giai đoạn sau

- `payroll_cycles`
- `employee_kpis`
- `bonus_rules`
- `commission_rules`

---

## 10. Gợi ý API module nên tạo

## 10.1 Backend module

- `employees`
- `attendance`
- `tasks`
- `work-reports`
- `sales-orders`
- `approvals`
- `production`
- `dispatch`
- `payments`

## 10.2 Frontend page

- `/employees`
- `/attendance`
- `/tasks`
- `/work-reports`
- `/orders`
- `/orders/[id]`
- `/approvals`
- `/production`
- `/dispatch`
- `/payments`

---

## 11. Thứ tự triển khai hợp lý

Không nên làm tất cả một lần. Thứ tự an toàn nhất:

### Bước 1

- Mở rộng `users`, `roles`
- Tạo `employees`
- Tạo màn hình quản lý nhân viên

### Bước 2

- Tạo `tasks`, `work_reports`
- Làm giao việc và báo cáo công việc

### Bước 3

- Tạo `attendance_logs`
- Kết nối chấm công hoặc nhập công bổ sung

### Bước 4

- Tạo `sales_orders`
- Dựng luồng đơn hàng nhiều bước

### Bước 5

- Nối `sales_orders` với công thức, BOM runtime, tồn kho

### Bước 6

- Tạo duyệt kỹ thuật, duyệt quản lý, chờ sản xuất, chờ xuất kho

### Bước 7

- Tạo thu tiền, chứng từ, đối soát đơn hàng

---

## 12. Đánh giá độ khó

## Giai đoạn 3

Mức độ: Trung bình đến cao

Lý do:

- Dữ liệu không quá phức tạp
- Nhưng liên quan phân quyền, báo cáo, lịch sử thao tác

## Giai đoạn 4

Mức độ: Cao

Lý do:

- Liên quan nhiều phòng ban
- Có nhiều trạng thái đơn
- Phải gắn chặt với kho, công thức, BOM, thanh toán

---

## 13. Khuyến nghị triển khai thực tế

Nếu làm đúng chuẩn enterprise, nên chia như sau:

### Đợt A

- Nhân viên
- Giao việc
- Báo cáo công việc

### Đợt B

- Chấm công
- Bổ sung phân quyền chi tiết

### Đợt C

- Đơn hàng
- Duyệt kỹ thuật
- Duyệt quản lý

### Đợt D

- Chờ sản xuất
- Chờ xuất kho
- Ưu tiên xử lý
- Thu tiền và chứng từ

---

## 14. Kết luận

Giai đoạn 3 và Giai đoạn 4 hoàn toàn phù hợp để phát triển tiếp trên nền hiện tại, nhưng không nên ghép thẳng vào các module cũ.

Hướng đúng là:

- Giữ nguyên lõi kho, vật tư, công thức, BOM
- Bổ sung lớp nhân sự và điều hành vận hành
- Sau đó mới dựng lớp đơn hàng nhiều bước

Như vậy hệ thống sẽ đi từ:

- Quản lý kho

thành:

- ERP vận hành cho kinh doanh, kỹ thuật, quản lý, kho và sản xuất

theo đúng lộ trình mở rộng enterprise.
