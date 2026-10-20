# Kỹ thuật robot

Trang web học tập mô phỏng động học thuận và ngược của cánh tay robot 3 bậc tự do.

## Chức năng

1. Nhập góc ba khớp để tính vị trí X, Y, Z.
2. Nhập vị trí để tính hai nhánh nghiệm động học ngược.
3. Quan sát mô hình Three.js với các khối đơn giản trên nền đen.
4. Xem ma trận biến đổi 4 × 4, phép nhân ma trận và các bước thế số.
5. Thay đổi chiều dài khâu, chiều cao đế và xuất kết quả JSON.

## Sử dụng

Mở `dist/index.html` trong trình duyệt có hỗ trợ WebGL. Các thư viện được lưu trong kho nên trang có thể chạy ngoại tuyến.

Có thể phục vụ bằng HTTP từ thư mục gốc:

```sh
python -m http.server 8000 --directory dist
```

Sau đó truy cập http://localhost:8000.

## Mô hình

Cấu hình RRR gồm khớp đế quay quanh Z, khớp vai và khớp khuỷu. Góc vai đo từ phương ngang, góc khuỷu là góc tương đối giữa hai khâu. Chiều dài dùng mm, góc dùng độ. Mô hình lý tưởng không xét va chạm và giới hạn cơ khí. Bài toán ngược điều khiển vị trí, không đặt hướng đầu công tác độc lập.

## Kiểm tra

```sh
node test.cjs
```

Kiểm tra 1.331 cấu hình thuận rồi ngược, cả hai nhánh khuỷu và các biên vùng làm việc.

## Thư viện

Three.js phiên bản 0.160.0, giấy phép MIT. Xem `dist/vendor/THREE-LICENSE.txt`.
