# Logic ERP đơn hàng, khách hàng, kế toán và công việc

## Nguyên tắc chính

Mọi đơn hàng bắt buộc phải gắn với một khách hàng. Kể cả khách lẻ cũng phải có hồ sơ khách hàng trước khi tạo đơn, không cho tạo đơn hàng không có khách hàng.

Mọi phát sinh tiền, công việc, đi ra ngoài, chấm công liên quan đến đơn hàng nếu có thì phải gắn trực tiếp với đơn hàng đó.

Mọi khoản thu, chi, đặt cọc, tạm ứng, hoàn tiền và chi phí phát sinh bắt buộc phải có chứng từ.

Kế toán không nên phải đi tìm đơn hàng bằng tay. Mọi thông báo thu, chi, đặt cọc liên quan đến đơn hàng phải có link mở thẳng về chứng từ và đơn hàng để đối chiếu, xác nhận.

## Khách hàng và đơn hàng

Đơn hàng không được tạo nếu không có khách hàng.

Khách hàng cần quản lý theo nhiều loại, không chỉ là một tên và một số điện thoại.

Loại khách hàng có thể gồm:

- Khách lẻ / cá nhân.
- Đại lý.
- Nhà thầu.
- Chủ đầu tư.
- Công ty / tổ chức.
- Khách hàng nội bộ nếu cần.

Thông tin khách hàng tối thiểu với khách cá nhân:

- Mã khách hàng.
- Tên khách hàng.
- Số điện thoại.
- Địa chỉ.
- Ghi chú.
- Lịch sử đơn hàng.
- Công nợ nếu có.

Thông tin khách hàng tổ chức / chủ đầu tư / công ty nên có thêm:

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

Khách hàng có thể có nhiều người liên hệ.

Mỗi người liên hệ cần lưu:

- Họ tên.
- Chức vụ.
- Phòng ban.
- Số điện thoại.
- Email/Zalo nếu có.
- Vai trò liên hệ: mua hàng, kỹ thuật, kế toán, quản lý, công trường, pháp lý.
- Là liên hệ chính hay liên hệ phụ.
- Ghi chú.

Với khách hàng dạng chủ đầu tư/công ty, việc có nhiều phòng ban và nhiều số điện thoại là bắt buộc để vận hành thực tế.

Ví dụ:

- Phòng mua hàng: tiếp nhận báo giá và đơn hàng.
- Phòng kế toán: xác nhận thanh toán, công nợ, hóa đơn.
- Phòng kỹ thuật: xác nhận bản vẽ, thông số.
- Ban quản lý công trường: điều phối giao/lắp.
- Lãnh đạo/người duyệt: duyệt giá và điều kiện thanh toán.

Khi tạo đơn hàng, cần chọn:

- Khách hàng.
- Địa chỉ giao/lắp/công trình.
- Người liên hệ chính của đơn.
- Người liên hệ kế toán nếu có.
- Người liên hệ kỹ thuật/công trường nếu có.

Mỗi đơn hàng cần lưu:

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

## Chứng từ bắt buộc

Mọi khoản thu, chi, đặt cọc, tạm ứng, hoàn tiền và chi phí phát sinh đều phải có chứng từ.

Chứng từ cần có:

- Mã chứng từ.
- Loại chứng từ.
- Ngày phát sinh.
- Số tiền.
- Người tạo.
- Người xác nhận.
- Trạng thái.
- File đính kèm nếu có.
- Link đến đơn hàng nếu chứng từ liên quan đơn hàng.
- Link đến khách hàng/nhân viên/nhà cung cấp nếu có.

Chứng từ có thể là:

- Hóa đơn.
- Phiếu thu.
- Phiếu chi.
- Biên lai chuyển khoản.
- Ảnh chụp giao dịch ngân hàng.
- Hóa đơn/chứng từ mua hàng.
- Giấy đề nghị thanh toán.
- Giấy tạm ứng/hoàn ứng.
- Tệp đính kèm khác được kế toán chấp nhận.

## Tiền cọc đơn hàng

Nếu có khoản đặt cọc cho đơn hàng, NVKD tạo chứng từ đặt cọc gắn trực tiếp với đơn hàng.

Chứng từ đặt cọc cần có:

- Mã đơn hàng.
- Khách hàng.
- Số tiền cọc.
- Ngày cọc.
- Hình thức thanh toán.
- Ảnh/tệp chứng từ nếu có.
- Ghi chú.
- Trạng thái: chờ kế toán xác nhận, đã xác nhận, từ chối.

Sau khi tạo, hệ thống gửi thông báo cho kế toán.

Kế toán bấm vào thông báo thì mở thẳng chứng từ cọc và đơn hàng liên quan, không phải tìm đơn hàng bằng tay.

Kế toán xác nhận xong, số tiền cọc được cộng vào tổng đã thu của đơn hàng.

Khách hàng bắt buộc phải đặt cọc thì đơn mới được chuyển sang kỹ thuật/kho xử lý.

Đơn hàng chỉ được đi tiếp sang các bước xử lý chính sau khi tiền cọc đã được kế toán xác nhận, trừ trường hợp ngoại lệ được quản lý/giám đốc phê duyệt.

Mức cọc tối thiểu do quản lý/admin cấu hình sau theo chính sách công ty. Có thể là số tiền cố định hoặc tỷ lệ phần trăm trên giá trị đơn hàng tùy cấu hình.

Nếu cọc chưa được xác nhận:

- Đơn ở trạng thái chờ xác nhận cọc.
- Không đẩy sang kỹ thuật/kho/sản xuất như một đơn chính thức.
- NVKD cần theo dõi và bổ sung chứng từ nếu kế toán từ chối.

## Công nợ đơn hàng và hoa hồng

Khi lập đơn hàng, cần ghi rõ điều kiện thanh toán và dự kiến thu tiền.

Thông tin công nợ đơn hàng cần có:

- Tổng giá trị phải thu.
- Tiền cọc dự kiến.
- Ngày dự kiến cọc.
- Số tiền còn lại.
- Ngày dự kiến thu phần còn lại.
- Điều kiện thanh toán: khi giao hàng, sau lắp đặt, theo tiến độ, theo hợp đồng, ghi chú riêng.
- Trạng thái công nợ: chưa thu, đã thu một phần, đã thu đủ, quá hạn.

Khách trả theo đơn là phần quản lý công nợ của đơn hàng.

Nếu khách trả nhiều lần, mỗi lần phải có chứng từ riêng và kế toán xác nhận.

Hoa hồng cho nhân viên chỉ được tính khi đơn hàng đã thu hết tiền theo quy định.

Quy tắc:

```text
Chỉ tính hoa hồng khi đơn hàng = đã thu đủ / đã chốt công nợ
```

Nếu đơn hàng còn nợ, hoa hồng của nhân viên liên quan chưa được tính hoặc chỉ được tính theo chính sách riêng nếu công ty cho phép.

Quyền giảm giá/giảm trừ đơn hàng do admin cấu hình theo từng chức vụ/phòng ban/người phụ trách. Không mặc định tất cả nhân viên bán hàng đều được giảm giá.

## Phát sinh doanh thu của đơn hàng

Mọi phát sinh nếu khách hàng trả thì cộng vào tiền của đơn hàng đó.

Ví dụ:

- Khách thêm phụ kiện.
- Khách đổi màu mất tiền chênh lệch.
- Khách yêu cầu lắp thêm hạng mục.
- Khách chịu phí vận chuyển/phát sinh.

Tất cả các khoản này phải làm tăng giá trị phải thu của đơn hàng.

Công thức:

```text
Tổng phải thu đơn hàng = Giá trị đơn ban đầu + Phát sinh khách trả - Giảm trừ
Còn phải thu = Tổng phải thu đơn hàng - Tổng đã thu
```

Phát sinh khách trả chỉ được đưa sang kế toán sau khi khách hàng đã chấp nhận.

Luồng đề xuất:

```text
NVKD/Kỹ thuật tạo đề xuất phát sinh -> Khách xác nhận/chấp nhận -> Chuyển kế toán theo dõi thu -> Kế toán xác nhận khi khách thanh toán
```

Sale phải thảo luận và thống nhất với khách trước. Sau khi khách chấp nhận phát sinh, sale mới báo kế toán để đưa vào theo dõi thu.

Kế toán là người duyệt/xác nhận phát sinh khách trả về mặt chứng từ và công nợ.

Nếu khách chưa chấp nhận:

- Khoản phát sinh chỉ ở trạng thái đề xuất.
- Chưa cộng vào tổng phải thu chính thức.
- Chưa gửi kế toán như một khoản phải thu chính thức.

## Phát sinh chi phí công ty

Nếu khoản phát sinh do công ty trả thì không cộng vào tiền đơn hàng khách phải trả. Khoản đó được ghi vào chi phí công ty.

Ví dụ:

- Chi phí sửa sai do nội bộ.
- Chi phí đi lại do công ty chịu.
- Chi phí vật tư hao hụt không thu của khách.
- Chi phí nhân sự, tăng ca, phụ cấp.
- Chi phí mua ngoài.

Khoản này cần gắn được với đơn hàng nếu có, để xem lại lãi/lỗ theo đơn.

Công thức lãi/lỗ đơn hàng:

```text
Lợi nhuận đơn hàng = Tổng khách phải trả - Giá vốn vật tư - Chi phí công ty gắn với đơn
```

Chi phí công ty do kế toán kiểm soát và xác nhận.

Doanh thu đơn hàng và doanh số tổng công ty là thông tin nhạy cảm. Chỉ giám đốc/quản lý được phân quyền mới được xem doanh số tổng và báo cáo doanh thu tổng hợp.

## Công việc và đi ra ngoài

Công việc nếu liên quan đơn hàng thì phải gắn với đơn hàng.

Ví dụ:

- Đi đo kích thước.
- Đi lắp đặt.
- Đi bảo hành.
- Đi giao hàng.
- Đi gặp khách.
- Xử lý phát sinh tại công trình.

Ra ngoài gặp khách được xem là công việc, không mặc định là chi phí hay ngày công đặc biệt nếu không có quy định riêng.

Công việc đi gặp khách không bắt buộc quản lý duyệt trước, nhưng nhân viên phải báo/tạo công việc để công ty nắm được lịch làm việc và lịch sử chăm sóc khách hàng.

Mỗi công việc cần lưu:

- Mã công việc.
- Loại công việc.
- Đơn hàng liên quan nếu có.
- Khách hàng liên quan nếu có.
- Nhân viên phụ trách.
- Thời gian bắt đầu/kết thúc.
- Địa điểm.
- Kết quả.
- Ảnh/tệp đính kèm nếu có.
- Chi phí phát sinh nếu có.

Nếu công việc có chi phí:

- Nếu khách trả: tạo phát sinh thu cho đơn hàng.
- Nếu công ty trả: tạo chi phí công ty, có thể gắn với đơn hàng để tính lãi/lỗ.

Chi phí đi ngoài do nhân viên khai bắt buộc phải có chứng từ/hình ảnh/biên lai hợp lệ thì kế toán mới xem xét xác nhận.

## Giao việc, hỏi ý kiến và xin duyệt nội bộ

Hệ thống cần có chức năng giao việc nội bộ. Giao việc không chỉ là việc đi ngoài, mà còn bao gồm việc hỏi ý kiến, xin xác nhận, xin duyệt hoặc yêu cầu một bộ phận khác phản hồi.

Mỗi giao việc có thể gắn với:

- Đơn hàng.
- Khách hàng.
- Chứng từ.
- Công việc đi ngoài.
- Khoản phát sinh.
- Nhân viên hoặc phòng ban được giao.

Các loại giao việc nên có:

- Việc cần làm.
- Hỏi ý kiến.
- Xin duyệt.
- Nhắc xử lý.
- Yêu cầu xác nhận thông tin.
- Yêu cầu phản hồi thời gian.

Ví dụ thực tế:

- Sale hỏi quản lý: "Đơn hàng này được chiết khấu mức này không?"
- Sale hỏi kho: "Hàng này bao giờ về?"
- Sale hỏi kỹ thuật: "Phương án này có làm được không?"
- Kế toán hỏi sale: "Khoản cọc này của đơn nào?"
- Kho hỏi mua hàng: "Phụ kiện này dự kiến ngày nào nhập?"
- Quản lý giao kỹ thuật kiểm tra lại bản vẽ.
- Quản lý giao sale làm rõ phát sinh với khách.

Mỗi giao việc cần có:

- Mã giao việc.
- Tiêu đề.
- Nội dung yêu cầu/câu hỏi.
- Người tạo.
- Người nhận hoặc phòng ban nhận.
- Đơn hàng liên quan nếu có.
- Khách hàng liên quan nếu có.
- Hạn phản hồi nếu có.
- Mức ưu tiên.
- Trạng thái: mới tạo, đang xử lý, đã phản hồi, đã duyệt, từ chối, hoàn tất, hủy.
- Kết quả phản hồi.
- File/ảnh/chứng từ đính kèm nếu có.

### Giao việc dạng hỏi ý kiến chiết khấu

Nếu sale muốn hỏi đơn hàng này có được chiết khấu mức nào không, sale tạo giao việc dạng xin duyệt hoặc hỏi ý kiến gắn với đơn hàng.

Thông tin cần có:

- Đơn hàng.
- Mức chiết khấu đề xuất.
- Lý do xin chiết khấu.
- Người/phòng ban cần duyệt.
- Thời hạn cần phản hồi.

Chỉ khi người có quyền duyệt đồng ý thì mức chiết khấu mới được áp dụng vào đơn hàng.

Nếu không được duyệt:

- Chiết khấu không được áp dụng.
- Sale phải trao đổi lại với khách hoặc đề xuất mức khác.

Quyền duyệt chiết khấu do admin cấu hình theo chức vụ/phòng ban/mức chiết khấu.

### Giao việc dạng hỏi thời gian hàng về/giao hàng

Nếu sale muốn hỏi hàng bao giờ về hoặc giao hàng bao giờ được, sale tạo giao việc/hỏi thông tin gắn với đơn hàng hoặc vật tư liên quan.

Người nhận có thể là:

- Kho.
- Mua hàng.
- Kế hoạch.
- Sản xuất.
- Quản lý.

Thông tin phản hồi cần có:

- Dự kiến ngày hàng về.
- Dự kiến ngày giao/lắp.
- Lý do nếu chậm.
- Phương án thay thế nếu có.

Phản hồi này nên được lưu trong lịch sử đơn hàng để sau này xem lại ai đã xác nhận và xác nhận lúc nào.

### Nguyên tắc giao việc

- Giao việc liên quan đơn hàng phải link về đơn hàng.
- Giao việc liên quan khách hàng phải link về khách hàng.
- Giao việc xin duyệt phải có người có quyền duyệt.
- Giao việc hỏi thông tin phải có người/phòng ban chịu trách nhiệm phản hồi.
- Kết quả phản hồi phải được lưu lại, không chỉ gửi tin nhắn rời rạc.
- Nếu giao việc quá hạn, hệ thống nên cảnh báo cho người nhận và người tạo.

## Màn hình Home cá nhân của nhân viên

Mỗi nhân viên nên có một màn hình Home riêng. Đây là nơi tổng hợp những việc nhân viên đó cần xử lý, cần phản hồi, cần duyệt hoặc cần theo dõi.

Home không chỉ là màn hình thống kê, mà là bàn làm việc cá nhân.

Khi có người hỏi duyệt giá, hỏi chiết khấu, hỏi thời gian hàng về hoặc giao việc mới, hệ thống tạo thông báo trên Home của người được hỏi/người được giao.

Ví dụ:

- Sale hỏi quản lý duyệt chiết khấu cho đơn DH-000123.
- Trên Home của quản lý xuất hiện thông báo: "Cần duyệt chiết khấu đơn DH-000123".
- Quản lý bấm vào thông báo sẽ mở thẳng yêu cầu duyệt và đơn hàng liên quan.
- Quản lý duyệt/từ chối/phản hồi ngay tại đó.

### Các nhóm việc trên Home

Home nên phân việc thành các mục gọn gàng, dễ nhìn:

| Nhóm | Ý nghĩa |
|---|---|
| Cần xử lý | Các việc được giao cần làm |
| Cần duyệt | Các yêu cầu duyệt giá, chiết khấu, phát sinh, hoàn tiền |
| Cần phản hồi | Các câu hỏi người khác gửi đến |
| Quá hạn | Việc đã quá hạn chưa xử lý |
| Theo dõi | Việc đã giao cho người khác nhưng mình cần theo dõi |
| Thông báo kế toán | Cọc, thu tiền, chi phí, chứng từ cần xác nhận |
| Thông báo đơn hàng | Đơn cần cập nhật, đơn chờ xử lý, đơn có thay đổi |

### Mức độ ưu tiên

Mỗi việc/thông báo nên có mức độ ưu tiên:

| Mức độ | Ý nghĩa |
|---|---|
| Khẩn cấp | Cần xử lý ngay, ảnh hưởng giao hàng/thu tiền/khách hàng |
| Cao | Cần xử lý sớm trong ngày |
| Bình thường | Xử lý theo thứ tự công việc |
| Thấp | Theo dõi, không gấp |

Mức độ ưu tiên có thể do người tạo chọn hoặc do hệ thống tự gợi ý theo loại việc, hạn xử lý và trạng thái đơn hàng.

### Thông tin hiển thị trên mỗi việc

Mỗi việc trên Home nên hiển thị ngắn gọn:

- Tiêu đề việc.
- Loại việc: cần duyệt, cần phản hồi, cần xử lý, thông báo.
- Đơn hàng liên quan nếu có.
- Khách hàng liên quan nếu có.
- Người tạo.
- Hạn xử lý.
- Mức độ ưu tiên.
- Trạng thái.
- Nút xử lý nhanh: duyệt, từ chối, phản hồi, mở đơn hàng, đánh dấu hoàn tất.

### Nguyên tắc thông báo

- Người được hỏi hoặc được giao phải thấy việc trên Home của mình.
- Việc liên quan đơn hàng phải mở được thẳng ra đơn hàng.
- Việc xin duyệt phải mở được thẳng ra nội dung cần duyệt.
- Sau khi xử lý, trạng thái việc phải được cập nhật.
- Người tạo việc cần thấy kết quả phản hồi.
- Không để các yêu cầu quan trọng chỉ nằm trong chat hoặc trao đổi miệng.

## Chấm công, nghỉ phép và đi muộn

Dữ liệu chấm công gốc lấy từ máy chấm công.

Máy chấm công là nguồn dữ liệu thô, ghi nhận:

- Nhân viên.
- Ngày.
- Giờ vào.
- Giờ ra.
- Thiết bị chấm công.
- Trạng thái đồng bộ.

Hệ thống không tính lương trực tiếp từ dữ liệu thô nếu chưa qua xử lý bảng công.

Lương tháng tính từ bảng công đã chốt.

Luồng xử lý:

```text
Máy chấm công -> Dữ liệu chấm công thô -> Bảng công tạm tính -> Kế toán/người được phân quyền duyệt điều chỉnh -> Bảng công chốt -> Bảng lương
```

### Nghỉ phép

Nhân viên có thể tạo đơn xin nghỉ phép.

Đơn nghỉ phép cần có:

- Nhân viên.
- Ngày nghỉ.
- Loại nghỉ: có phép, không lương, nghỉ ốm, nghỉ việc riêng.
- Lý do.
- File đính kèm nếu có.
- Trạng thái: chờ duyệt, đã duyệt, từ chối.
- Người duyệt.

Chỉ đơn nghỉ phép đã duyệt mới được tính vào bảng công và bảng lương.

Nếu chưa duyệt, ngày đó vẫn được xem là vắng/chưa hợp lệ khi tính bảng công tạm.

Đơn nghỉ phép cần phân biệt:

- Nghỉ có lương.
- Nghỉ không lương.
- Nghỉ phép năm.
- Nghỉ đột xuất/bất khả kháng.

Kế toán duyệt nghỉ phép và quyết định hình thức tính lương của ngày nghỉ: có lương hoặc không lương theo quy định công ty.

Nghỉ phép do kế toán duyệt trực tiếp là đủ điều kiện ghi nhận vào bảng công/bảng lương, không bắt buộc quản lý trực tiếp duyệt trước nếu công ty không yêu cầu.

Cần có quy tắc số lần/ngày nghỉ hợp lệ trong tháng.

Ví dụ:

- Mỗi tháng được chấp nhận tối đa bao nhiêu lần đi muộn/về sớm có lý do.
- Mỗi tháng được bao nhiêu ngày nghỉ có lương nếu còn phép.
- Trường hợp bất khả kháng thì kế toán xem xét và duyệt riêng.

Với ngày nghỉ có kế hoạch, nhân viên phải tạo đơn xin trước tối thiểu từ ngày hôm trước, trừ khi là trường hợp đột xuất/bất khả kháng.

Trường hợp đột xuất/bất khả kháng:

- Nhân viên tạo đơn bổ sung sớm nhất có thể.
- Kế toán xem xét lý do và chứng từ nếu có.
- Chỉ khi được duyệt mới được tính lương cho ngày đó theo loại nghỉ được phê duyệt.

Phép năm và phép tồn nếu có sẽ được xử lý trong phần quyết toán cuối năm.

### Xin đến muộn / về sớm

Nhân viên có thể tạo đơn xin đến muộn hoặc về sớm.

Đơn đến muộn/về sớm cần có:

- Nhân viên.
- Ngày áp dụng.
- Giờ dự kiến đến muộn hoặc về sớm.
- Lý do.
- Trạng thái: chờ duyệt, đã duyệt, từ chối.
- Người duyệt.

Chỉ đơn đã duyệt mới được chấp nhận khi tính công và tính lương.

Nếu không được duyệt, hệ thống tính theo dữ liệu máy chấm công và quy tắc phạt/đi muộn mặc định.

Đơn xin đến muộn/về sớm nên được tạo trước tối thiểu từ ngày hôm trước đối với trường hợp có kế hoạch.

Trường hợp đột xuất/bất khả kháng:

- Nhân viên tạo đơn giải trình.
- Kế toán xem xét và duyệt nếu hợp lệ.
- Nếu được duyệt thì ngày công/giờ công được tính theo quy tắc công ty.
- Nếu không được duyệt thì tính là đi muộn/về sớm theo máy chấm công.

Số phút đi muộn/về sớm bị tính phạt do admin cấu hình sau theo quy định công ty.

### Kiểm soát chấm công

- Dữ liệu máy chấm công không nên sửa trực tiếp.
- Nếu cần sửa, tạo dòng điều chỉnh bảng công có lý do và người duyệt.
- Bảng công đã chốt thì không được sửa trực tiếp.
- Nếu cần sửa bảng công đã chốt, phải mở lại kỳ công hoặc tạo phiếu điều chỉnh.
- Bảng lương phải lưu snapshot bảng công tại thời điểm tính.
- Sau khi bảng lương đã duyệt, sửa chấm công không được tự động làm đổi lương cũ.

Kế toán được xem bảng công của tất cả nhân viên.

Giám đốc được xem bảng công tổng thể của tất cả nhân viên.

Nhân viên chỉ được xem bảng công của chính mình.

Bảng công tháng được hệ thống tự tổng hợp vào đầu tháng sau. Nhân viên có thời hạn đến 8h sáng ngày đầu tiên của tháng sau để xem và đối soát bảng công của mình.

Nếu nhân viên thấy sai trong thời gian đối soát:

- Nhân viên phải liên hệ kế toán.
- Kế toán kiểm tra dữ liệu máy chấm công, đơn nghỉ phép, đơn đến muộn/về sớm và các điều chỉnh liên quan.
- Nếu hợp lệ, kế toán điều chỉnh/duyệt trước khi chốt bảng công.

Sau thời hạn đối soát, bảng công có thể được chốt để tính lương.

Nếu bảng lương đã duyệt nhưng phát hiện sai do lỗi hệ thống, nhân viên/kế toán tạo yêu cầu gửi admin để kiểm tra và sửa hệ thống theo quy trình được phê duyệt.

Tạm ứng nhân viên trong phạm vi hiện tại được hiểu là tạm ứng lương.

## Phân quyền đề xuất

| Vai trò | Quyền chính |
|---|---|
| NVKD | Tạo khách hàng, tạo đơn hàng, tạo chứng từ cọc cho đơn, tạo yêu cầu phát sinh khách trả |
| Kỹ thuật | Chốt thông số, chốt BOM, tạo/chỉnh công việc kỹ thuật |
| Kho | Giữ kho, xuất kho, cập nhật tồn |
| Kế toán | Xác nhận tiền cọc, thu/chi, công nợ, chi phí, bảng lương, duyệt nghỉ phép/đi muộn để tính lương |
| Quản lý | Duyệt đơn, duyệt phát sinh lớn, duyệt hoàn tiền, xem báo cáo theo phân quyền |
| Giám đốc | Xem doanh thu tổng công ty, xem bảng công tổng thể, xem báo cáo quản trị |
| Admin | Cấu hình hệ thống, phân quyền, cấu hình mức cọc tối thiểu, cấu hình mức phạt đi muộn, cấu hình quyền giảm giá |

## Kiểm soát quan trọng

- Không có khách hàng thì không tạo đơn.
- Khách lẻ vẫn phải có hồ sơ khách hàng.
- Khách hàng tổ chức/chủ đầu tư nên có ít nhất một người liên hệ chính.
- Đơn hàng nên chọn rõ người liên hệ và địa chỉ thực hiện.
- Không có chứng từ thì không ghi nhận thu/chi.
- Chứng từ liên quan đơn hàng phải link về đơn hàng.
- Kế toán xác nhận thu/chi mới cập nhật số tiền chính thức.
- NVKD có thể tạo thông tin cọc, nhưng kế toán là người xác nhận.
- Cọc phải được kế toán xác nhận thì đơn hàng mới được đi tiếp sang xử lý chính.
- Mức cọc tối thiểu do quản lý/admin cấu hình.
- Phát sinh khách trả phải được khách chấp nhận trước khi đưa sang kế toán theo dõi thu.
- Kế toán duyệt/xác nhận phát sinh khách trả sau khi sale đã thống nhất với khách.
- Phát sinh công ty trả làm tăng chi phí công ty hoặc chi phí đơn hàng.
- Chi phí công ty do kế toán kiểm soát.
- Doanh thu tổng công ty chỉ giám đốc/quản lý được phân quyền mới được xem.
- Quyền giảm giá/giảm trừ do admin cấu hình theo chức vụ.
- Chấm công tháng phải lấy từ bảng công đã chốt, không lấy trực tiếp từ dữ liệu thô của máy chấm công.
- Nghỉ phép, đến muộn, về sớm chỉ được tính lương khi đã được duyệt.
- Nhân viên chỉ xem bảng công của mình; kế toán xem được tất cả bảng công.
- Giám đốc xem được bảng công tổng thể.
- Hoa hồng nhân viên chỉ được tính khi đơn hàng đã thu hết tiền theo quy định.
- Tạm ứng nhân viên là tạm ứng lương.
- Mọi thay đổi tiền phải có audit log.

## Các điểm còn cần chốt thêm

- Khi hủy đơn, tiền cọc sẽ hoàn toàn bộ, khấu trừ chi phí, hay xử lý theo từng trường hợp?
- Bảng công đã chốt có cho mở lại không, hay chỉ tạo phiếu điều chỉnh?
- Bảng lương đã duyệt nếu sai do nghiệp vụ thì điều chỉnh trong tháng cũ hay tạo khoản bù/trừ ở tháng sau?
