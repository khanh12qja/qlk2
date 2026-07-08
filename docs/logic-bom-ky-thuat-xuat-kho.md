# Logic BOM ky thuat va xuat kho thuc te

## Nguyen tac chinh

Cong thuc san pham chi nen la phuong an de xuat ban dau. Khi vao don hang thuc te, ky thuat co quyen dieu chinh phuong an de phu hop voi ban ve, kich thuoc, ton kho va cach thi cong.

Kho khong xuat theo cong thuc goc. Kho xuat theo BOM thuc te da duoc ky thuat chot.

## Hai lop BOM can co

### 1. BOM de xuat

BOM de xuat duoc he thong sinh tu cong thuc san pham.

No dung de:

- Goi y nhanh bo can nhung loai linh kien nao.
- Tinh so luong va chieu dai can cat theo kich thuoc.
- Goi y ma vat tu phu hop theo mau, loai kinh va ton kho.
- Kiem tra ton kho so bo.

BOM de xuat khong nen khoa cung viec xuat kho.

### 2. BOM thuc te / BOM chot xuat kho

BOM thuc te la danh sach cuoi cung do ky thuat xac nhan.

Day moi la can cu de:

- Giu kho.
- Xuat kho.
- Cat thanh.
- Bao cao ton kho.
- Doi chieu sau giao hang.

## Luong xu ly de xuat

1. NVKD tao don.

   NVKD nhap cac thong tin dau vao nhu he san pham, kich thuoc, mau, loai kinh, kieu mo va ghi chu khach hang.

2. He thong sinh BOM de xuat.

   He thong dua vao cong thuc de tao danh sach linh kien du kien:

   - Loai linh kien can dung.
   - So luong.
   - Chieu dai can cat neu la thanh.
   - Goi y ma vat tu cu the theo mau, kinh va ton kho.

3. Ky thuat duyet va chinh phuong an.

   Ky thuat co the:

   - Doi ma phu kien khac.
   - Doi phuong an su dung vat tu cho phu hop thuc te.
   - Them linh kien.
   - Bot linh kien.
   - Sua so luong.
   - Sua chieu dai cat.
   - Chon ma vat tu cu the de xuat.

4. Ky thuat chot BOM thuc te.

   Sau khi ky thuat xac nhan, BOM de xuat duoc chot thanh BOM thuc te.

5. Kho xuat theo BOM thuc te.

   Kho xuat theo:

   - Ma vat tu / ma phu kien cu the.
   - So luong cu the.
   - Chieu dai thanh cu the neu vat tu quan ly theo thanh.

## Y nghia thiet ke

Cong thuc khong nen phu thuoc truc tiep vao mau va loai kinh nhu bien the cau tao. Mau va loai kinh la dieu kien loc vat tu khi tra kho.

Bien the cong thuc chi dung khi cau tao bo thay doi, vi du:

- Thay tay nam.
- Thay hop phu kien.
- Them thanh phu.
- Bo giam chan.
- Doi nhom linh kien.

Trong don hang, ky thuat van co quyen thay doi phuong an cuoi cung, ke ca khi cong thuc da goi y san.

## Quy tac quan trong

- Cong thuc sinh de xuat, khong phai lenh xuat kho.
- Ky thuat chot BOM thuc te truoc khi kho xuat.
- Kho chi xuat theo ma vat tu va so luong cu the.
- Neu la thanh, kho can quan ly theo cay/thanh va chieu dai con lai.
- Neu la phu kien, kho quan ly theo ma phu kien va so luong.
- Don hang can luu snapshot BOM thuc te de sau nay cong thuc thay doi khong lam thay doi don cu.
- Hang da giu cho don nay phai duoc tru tam khi don khac tra cuu ton kho.

## Logic giu kho chi tiet

Giu kho chi tiet la viec khoa tam mot phan ton kho cho mot don hang cu the sau khi BOM thuc te da duoc chot.

Khi don A da giu kho, don B tra cuu ton kho khong duoc nhin toan bo ton vat ly. Don B chi duoc tinh theo ton kha dung.

Cong thuc ton kha dung:

```text
Ton kha dung = Ton vat ly - Ton da giu cho cac don chua xuat/chua huy
```

Can phan biet 3 so:

| Loai ton | Y nghia |
|---|---|
| Ton vat ly | Hang that dang co trong kho |
| Ton da giu | Hang da khoa tam cho cac don hang khac |
| Ton kha dung | So hang con co the dung cho don moi |

Vi du:

- Kho co 10 thanh TDVC99510MB.
- Don A da giu 3 thanh.
- Don B tra kho thi chi thay kha dung 7 thanh.

### Giu kho voi vat tu theo thanh

Voi vat tu quan ly theo thanh, phai giu chi tiet den tung thanh neu co the.

Thong tin nen luu:

- Ma don hang.
- Ma vat tu.
- Ma kho.
- Ma thanh / stockBarId.
- Chieu dai can cat.
- Chieu dai con lai cua thanh tai thoi diem giu.
- Phan du du kien sau cat.
- Trang thai giu: dang giu, da xuat, da nha giu, da huy.

Khi don khac tra ton, thanh da giu phai bi tru khoi danh sach thanh kha dung hoac bi tru phan chieu dai da giu tuy cach quan ly cat thuc te.

### Cat thanh va tao ton phan thua

Khi kho xuat mot thanh de cat theo BOM thuc te, neu chieu dai thanh lon hon chieu dai can cat thi phan thua phai duoc ghi nhan lai thanh ton kho moi hoac cap nhat thanh goc thanh phan thua con lai.

Vi du:

- Thanh ton kho ban dau: 2400 mm.
- Don hang can cat: 2100 mm.
- Phan thua sau cat: 300 mm.

Sau khi xuat/cat, he thong can ghi nhan:

```text
Thanh goc 2400 mm -> da cat 2100 mm
Phan thua 300 mm -> tro thanh thanh ton moi neu con du tieu chuan su dung
```

Thong tin phan thua nen luu:

- Ma vat tu.
- Ma kho.
- Chieu dai ban dau cua phan thua.
- Chieu dai con lai cua phan thua.
- Nguon phat sinh: cat tu thanh nao / don hang nao.
- Trang thai: available, reserved, issued, scrap.

Can co nguong toi thieu de quyet dinh phan thua con dung duoc hay khong.

Vi du:

```text
Neu phan thua >= chieu_dai_toi_thieu_su_dung -> tao thanh ton moi
Neu phan thua < chieu_dai_toi_thieu_su_dung -> chuyen thanh phe lieu / scrap
```

Quy tac nay giup ton kho thanh khong bi mat phan du sau moi lan cat, va lan sau khi tra kho he thong van co the dung lai cac doan thua phu hop.

### Giu kho voi phu kien theo so luong

Voi phu kien quan ly theo so luong, giu theo ma vat tu va so luong.

Thong tin nen luu:

- Ma don hang.
- Ma vat tu.
- Ma kho.
- So luong giu.
- Trang thai giu: dang giu, da xuat, da nha giu, da huy.

Khi don khac tra ton, so luong kha dung phai bang:

```text
So luong kha dung = So luong ton - Tong so luong dang giu
```

### Chuyen trang thai giu kho

Luong trang thai cua mot dong giu kho nen la:

```text
Dang giu -> Da xuat
Dang giu -> Da nha giu
Dang giu -> Da huy
```

Trong do:

- Da xuat: kho da xuat that, ton vat ly bi tru chinh thuc.
- Da nha giu: don doi phuong an hoac khong can giu nua, hang quay lai kha dung.
- Da huy: don huy, hang quay lai kha dung neu chua xuat.

## Luong trang thai lien quan

Nen di theo luong:

```text
Nhap -> Da coc -> Ky thuat xac nhan va chot BOM -> Sep duyet -> Cho xuat kho / Cho san xuat -> Hoan tat
```

Trong do:

- Sau khi da coc: co the giu mem don hang.
- Sau khi ky thuat chot BOM va sep duyet: giu kho chinh thuc.
- Khi kho xuat: tru ton theo BOM thuc te.

## Nhan xet QA Architect

Danh gia tong quan: logic dung huong de van hanh thuc te. Diem manh la tach BOM de xuat va BOM thuc te, cho phep ky thuat chot phuong an cuoi cung, va kho xuat theo ma vat tu cu the. Tuy nhien, de dam bao dung cho ERP/WMS thuc te, can bo sung ro cac quy tac ve transaction, khoa dong thoi, phan quyen, snapshot, audit trail va xu ly phan thua sau cat.

| Muc do | Logic hien tai | Van de | Rui ro | Vi du xay ra | Cach sua | Co phuong an tot hon khong? |
|---|---|---|---|---|---|---|
| Critical | Ton kha dung = ton vat ly - ton da giu | Chua noi ro bat buoc tinh ton kha dung trong tat ca API tra ton | Don sau co the thay ca hang da giu va bi ban trung | Don A giu 3 thanh, don B van thay 10 thanh va tiep tuc giu | Moi API tra ton, check cong thuc, goi y vat tu phai dung available stock | Nen tao service ton kho trung tam, cam module khac tu tinh ton rieng |
| Critical | Giu kho chi tiet sau khi chot BOM | Chua co yeu cau transaction khi giu nhieu dong BOM | Giu duoc dong nay, loi dong khac, don bi giu nua voi | BOM co 12 dong, giu thanh thanh cong nhung giu phu kien loi | Giu kho phai nam trong transaction, loi thi rollback toan bo | Dung reservation aggregate voi trang thai pending -> committed |
| Critical | Kho xuat theo BOM thuc te | Chua noi ro xuat kho cung phai transaction | Da tru phu kien nhung chua tru thanh, du lieu lech | Xuat 1 bo, tru GC roi loi khi cat TDVC | Xuat kho phai atomic: cap nhat stock, reservation, movement, leftover trong 1 transaction | Dung stock issue document, chi post khi tat ca dong hop le |
| High | Ky thuat co the sua BOM | Chua co quy tac khoa BOM sau khi sep duyet/kho dang xu ly | BOM bi sua trong luc kho xuat | Ky thuat sua so luong GC khi kho da in phieu xuat | Them trang thai BOM: draft, technical_approved, manager_approved, issued_locked | Chi cho sua bang revision moi, khong sua truc tiep BOM da duyet |
| High | BOM thuc te la can cu xuat kho | Chua noi ro snapshot day du cac truong nao | Cong thuc/vat tu thay doi lam don cu kho doi chieu | Doi ten vat tu, don cu hien ten moi | Snapshot ma vat tu, ten vat tu, don vi, mau, kinh, chieu dai, so luong, nguon goi y, nguoi chot | Luu version BOM va version cong thuc tai thoi diem sinh |
| High | Cat thanh tao phan thua | Chua ro chon cach cap nhat thanh goc hay tao thanh moi | Double count hoac mat ton phan du | Thanh 2400 cat 2100, vua de thanh goc 300 vua tao thanh moi 300 | Chon 1 quy uoc: thanh goc chuyen issued, tao leftover bar moi 300 | Tot hon: moi lan cat tao movement lineage de truy vet thanh cha/con |
| High | Phan thua >= nguong thi tao thanh moi | Chua co nguong theo nhom vat tu/he vat tu | Tao nhieu doan qua ngan gay rac kho | Du 50mm van tao ton moi | Them minReusableLength theo nhom vat tu hoac setting | Co the them ly do scrap va bao cao hao hut |
| High | Giu thanh theo stockBarId | Chua xu ly truong hop 1 thanh co the cat nhieu doan cho nhieu don | Hoac khoa ca thanh lam giam kha dung, hoac chia sai phan du | Thanh 2400 co the cat 1000 va 800, nhung he thong khoa ca thanh | Giai doan dau nen khoa ca thanh khi reserve; khi xuat cat moi tao leftover | Sau nay co the ho tro nesting/multi-cut reservation phuc tap hon |
| High | Don khac tra kho tru hang da giu | Chua co expiry/timeout cho giu kho | Hang bi giu vo thoi han lam sai ton kha dung | Don treo 3 thang van giu 5 bo | Them reservationExpiresAt va quy trinh gia han/nhac nhan/nha giu | Dashboard hang dang giu qua han |
| High | Da coc co the giu mem | Chua dinh nghia giu mem khac giu cung | Nhan vien hieu nham la hang da khoa that | Don da coc nhung chua chot BOM van bao kho da giu | Giu mem chi la uu tien/flag, khong tru ton kha dung | Ten trang thai nen la priority_hold, khong goi la reservation |
| Medium | Sep duyet roi chon cho xuat/cho san xuat | Chua co case thieu mot phan | Kho khong biet xuat phan duoc hay phai cho | Thieu BPK nhung du tat ca thanh | Them ket qua: du xuat, thieu mot phan, khong du xuat | Co the cho phep tach dot giao neu nghiep vu can |
| Medium | Ky thuat doi ma phu kien | Chua bat buoc ly do khi doi khac goi y | Kho truy vet kho, tranh cai sau nay | He thong goi y GC-A, ky thuat doi GC-B | Bat buoc note khi replace/add/remove so voi BOM de xuat | Luu diff giua BOM de xuat va BOM thuc te |
| Medium | Bien the chi khi cau tao thay doi | Chua noi ro mau/kinh/kieu mo khong tao bien the cong thuc | Co nguy co nhan ban cong thuc theo mau/kinh | PT995-MB-8, PT995-PSS-10 bi tao tran lan | Quy uoc ro: mau/kinh la filter, khong phai variant cau tao | UI nen tach "bo loc ton kho" va "bien the cau tao" |
| Medium | Kho xuat theo ma vat tu cu the | Chua noi ro thay the vat tu tai kho co can ky thuat duyet lai khong | Kho tu doi ma lam sai ky thuat | Kho thay TDVC10 bang TDVC12 vi con hang | Neu kho thay ma vat tu phai tao request doi phuong an hoac can quyen override | Tot hon: kho chi de xuat thay the, ky thuat/quan ly duyet |
| Medium | Phu kien giu theo so luong | Chua noi ro so luong am va movement type | Ton co the am neu xuat vuot | Ton 5, hai nguoi cung xuat 4 | Ap dung atomic decrement voi dieu kien quantityAvailable >= required | Dung ledger + materialized balance co version |
| Medium | Phan quyen chua duoc mo ta | Chua tach quyen NVKD, ky thuat, sep, kho | Ai cung sua/xuat/duyet duoc | NVKD sua BOM thuc te sau khi ky thuat chot | RBAC: sales create, technician approve BOM, manager approve, warehouse issue | Them audit log bat buoc cho moi hanh dong quan trong |
| Medium | Workflow co hoan tat | Chua co huy don, doi phuong an, tra hang | Don bi ket neu khach huy hoac doi kich thuoc | Don da giu kho nhung khach doi mau | Them trang thai: tam dung, huy, cho ky thuat sua lai, da tra hang | Workflow nen co transition matrix |
| Medium | Cho san xuat | Chua ro co giu ton mot phan hay khong | Ton kha dung sai voi don san xuat thieu hang | Don thieu BPK nhung da giu thanh | Neu thieu mot phan, cho phep giu cac dong du hoac nha toan bo theo cau hinh | Nen co policy: reserve_partial true/false |
| Low | Bao cao ton kho | Chua noi ro bao cao ton vat ly, da giu, kha dung | Bao cao kho gay nham lan | Ke toan thay ton 10 nhung kho bao chi dung 7 | Moi bao cao ton nen co 3 cot: physical, reserved, available | Them drill-down danh sach don dang giu |
| Low | Nguon phat sinh phan thua | Chua noi ro barcode/ma thanh con | Kho kho nhan dien doan thua | Nhieu doan 300mm cung ma vat tu | Sinh ma stockBarId moi, in tem neu can | Sau nay them barcode/QR |

### Test case can co

| Muc do | Logic hien tai | Van de | Rui ro | Vi du xay ra | Cach sua | Co phuong an tot hon khong? |
|---|---|---|---|---|---|---|
| Critical | Giu kho | Test 2 nguoi cung giu 1 vat tu cung luc | Oversell | Ton 5, 2 don cung giu 4 | Test concurrency atomic reservation | Dung DB transaction va optimistic locking |
| Critical | Xuat kho | Test loi giua qua trinh xuat | Ton lech | Tru phu kien xong loi cat thanh | Test rollback transaction | Issue document post atomic |
| High | Cat thanh | Test cat thanh co phan thua | Mat hoac trung ton phan thua | 2400 cat 2100 con 300 | Thanh goc issued, thanh con 300 available/scrap | Luu lineage parent-child |
| High | Sua BOM | Test sua BOM sau khi da duyet | Xuat sai BOM | Kho dang xu ly, ky thuat sua so luong | Khoa BOM hoac tao revision | Transition matrix + revision |
| High | Ton kha dung | Test don sau tra ton bi tru phan da giu | Ban trung hang | Don A giu 3, don B phai thay 7 | Tat ca API ton dung available | Central InventoryAvailabilityService |
| Medium | Role | Test NVKD khong duoc chot BOM/xuat kho | Sai phan quyen | NVKD bam xuat kho | RBAC + audit | Permission theo transition |
| Medium | Huy don | Test huy don da giu kho | Hang khong quay lai kha dung | Huy don A, ton van bi tru | Nha giu tu dong khi huy | Reservation state machine |
| Medium | Doi phuong an | Test ky thuat doi ma vat tu | Khong truy vet duoc | Doi GC-A sang GC-B | Luu diff va ly do | Approval neu doi sau khi sep duyet |
| Medium | Partial shortage | Test thieu mot phan BOM | He thong chi bao thieu chung | Du 10 dong, thieu 2 dong | Bao theo tung dong va tong hop | Policy reserve_partial |
| Low | Bao cao | Test bao cao ton vat ly/giu/kha dung | So lieu kho gay nham lan | Physical 10, reserved 3, available 7 | Hien 3 cot rieng | Drill-down don dang giu |
