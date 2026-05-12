# Tên đề tài: Ứng dụng Di động Mua bán Xe đạp - BikeWorld

## Giới thiệu hệ thống
BikeWorld là một ứng dụng di động thương mại điện tử chuyên cung cấp các loại xe đạp (xe đạp địa hình, xe đua, xe đạp gấp, xe đạp trẻ em). Ứng dụng hỗ trợ người dùng xem, tìm kiếm sản phẩm, quản lý giỏ hàng, đặt hàng, cũng như hỗ trợ Admin quản lý kho hàng, sản phẩm và đơn hàng trực tiếp trên thiết bị di động.

## Danh sách thành viên
| STT | Họ và Tên | MSSV |
|---|---|---|
| 1 | Lê Đình Hoàng | 23810310289 |
| 2 | Vũ Trường Giang | 23810310293 |
| 3 | Đỗ Trung Kiên | 23810310292 |

## Phân công nhiệm vụ cụ thể
* **Lê Đình Hoàng (Nhóm trưởng)**: 
  - Thiết kế UI/UX tổng thể và xây dựng Kiến trúc hệ thống cốt lõi của ứng dụng.
  - Xây dựng luồng điều hướng phức tạp, các Component dùng chung và toàn bộ giao diện phía Khách hàng (Home, Product, Cart, Profile, Checkout).
  - Đảm nhiệm xử lý logic thanh toán (Checkout) và tối ưu hóa hiệu năng render (chống giật lag) cho toàn bộ ứng dụng.
  - viết tài liệu báo cáo (README) và hướng dẫn chạy dự án.
* **Vũ Trường Giang**: 
  - Thiết kế cấu trúc dữ liệu và mô hình lưu trữ cục bộ bằng `AsyncStorage`.
  - Quản lý State toàn cục bằng React Context (`ProductsContext`, `CartContext`).
  - Xử lý logic nghiệp vụ cho luồng Sản phẩm và Giỏ hàng (CRUD, tính toán giỏ hàng, trừ tồn kho).
  - Làm báo Word
* **Đỗ Trung Kiên**: 
  - Code giao diện và luồng điều hướng cho phân hệ Quản trị viên (Admin Dashboard, Quản lý Sản phẩm/Đơn hàng).
  - Tích hợp các thư viện bên thứ ba (Expo Image Picker, Vector Icons) và xây dựng màn hình Chatbot FAQ.
  - Xử lý logic Xác thực (`AuthContext`).

## Công nghệ sử dụng
* **Nền tảng / Framework**: React Native, Expo.
* **Ngôn ngữ**: JavaScript (ES6+).
* **Quản lý Trạng thái (State)**: React Context API & Custom Hooks.
* **Lưu trữ dữ liệu**: AsyncStorage (Local Storage).
* **Giao diện & Icon**: Flexbox, `@expo/vector-icons`.

## Hướng dẫn cài đặt chi tiết

### 1. Yêu cầu hệ thống (Prerequisites)
- **Node.js**: Đảm bảo máy tính đã cài đặt phiên bản Node.js mới nhất (LTS).
- **Trình soạn thảo mã (IDE)**: Khuyến nghị sử dụng Visual Studio Code (VS Code).
- **Thiết bị di động**: Cài đặt sẵn ứng dụng **Expo Go** từ App Store (iOS) hoặc Google Play (Android).

### 2. Cài đặt dự án
- **Bước 1**: Mở thư mục chứa mã nguồn dự án (`d:\LT_MOBLIE\BikeWorld`) bằng phần mềm VS Code.
- **Bước 2**: Mở Terminal tích hợp trong VS Code (Chọn `Terminal` -> `New Terminal` trên thanh menu, hoặc dùng phím tắt `` Ctrl + ` ``).
- **Bước 3**: Chạy lệnh sau để cài đặt tất cả các thư viện và dependencies cần thiết:
  ```bash
  npm install
  ```
  *(Quá trình này có thể mất từ 1-3 phút tùy thuộc vào tốc độ mạng, vui lòng chờ đến khi chạy xong 100%).*

## Hướng dẫn chạy project chi tiết

### 1. Khởi động Server Expo
Tại cửa sổ Terminal đang mở ở thư mục dự án, nhập lệnh sau để khởi chạy:
```bash
npx expo start
```
*Sau vài giây, một mã **QR Code** sẽ xuất hiện trên màn hình Terminal.*

### 2. Xem ứng dụng trên thiết bị thật (Khuyến nghị)
*Lưu ý quan trọng: Máy tính và Điện thoại của bạn **BẮT BUỘC** phải đang kết nối chung một mạng Wi-Fi.*
- **Với iPhone (iOS)**: Mở ứng dụng **Camera** mặc định, quét mã QR trên màn hình máy tính. Một thông báo "Mở trong Expo Go" sẽ hiện ra, hãy bấm vào đó.
- **Với Android**: Mở ứng dụng **Expo Go**, chọn mục **"Scan QR code"** và quét mã QR trên màn hình.

### 3. Xem ứng dụng trên Máy ảo (Emulator/Simulator)
Nếu máy tính của bạn có cấu hình mạnh và đã cài đặt sẵn Android Studio (đã bật thiết bị ảo) hoặc Xcode (trên macOS):
- Nhấn phím `a` trên Terminal để tự động cài và mở ứng dụng trên **Android Emulator**.
- Nhấn phím `i` trên Terminal để tự động cài và mở ứng dụng trên **iOS Simulator**.

### Mẹo khắc phục sự cố (Troubleshooting)
Nếu gặp lỗi trong quá trình chạy (như load bị kẹt ở 100%, báo lỗi Network, hoặc không cập nhật giao diện mới), hãy dừng server (nhấn `Ctrl + C` trong Terminal) và chạy lại lệnh sau để xóa bộ nhớ đệm (clear cache):
```bash
npx expo start -c
```

## Tài khoản demo (nếu có)
*Lưu ý: Vì hệ thống hiện tại đang sử dụng bộ nhớ tạm Local Storage, bạn có thể tự nhấn nút "Đăng ký" ở ngoài màn hình để tạo 1 tài khoản mới. Trạng thái phân quyền được xác định qua đuôi email hoặc cấu hình bên trong Context.*

**Tài khoản Khách hàng (User):**
* Email: `demo@bikeworld.com`
* Mật khẩu: `123456`
* Ghi chú: Bạn cũng có thể bấm Đăng ký tài khoản mới ngoài màn hình đăng nhập.

**Tài khoản Quản trị viên (Admin):**
* Email: `admin@bikeworld.com`
* Mật khẩu: `admin`
* Ghi chú: Tài khoản này có quyền truy cập vào màn hình Dashboard và Quản lý kho hàng.

## Link online đã deploy
* **Link trải nghiệm:** [👉 Nhấn vào đây để xem dự án thực tế](https://deploybikeworld.netlify.app)
* **Ghi chú**: Đây là bản Web Build từ nền tảng ứng dụng di động React Native Expo. Để có trải nghiệm tốt nhất trên máy tính, vui lòng nhấn `F12` và bật chế độ giả lập điện thoại (Toggle device toolbar).

## Video Demo & Thuyết trình
* **Link Video:** [👉 Nhấn vào đây để xem Video Demo của nhóm](https://[DIEN-LINK-VIDEO-CUA-BAN-VAO-DAY])
* **Ghi chú**: Trong video này, nhóm chúng em có trình bày chi tiết về kiến trúc hệ thống, giải thích các logic code cốt lõi và demo trực tiếp các luồng chức năng thực tế của ứng dụng.

## Hình ảnh minh họa hệ thống

Dưới đây là các hình ảnh giao diện thực tế của ứng dụng BikeWorld được sắp xếp theo chức năng:

### Xác thực & Đăng ký
<p align="center">
  <img src="./assets/Image/HinhAnh_MinhHoa/dangnhap.jpg" width="200" hspace="8" alt="Đăng nhập" />
  <img src="./assets/Image/HinhAnh_MinhHoa/dangky.jpg" width="200" hspace="8" alt="Đăng ký" />
</p>

### Trang chủ & Danh sách sản phẩm
<p align="center">
  <img src="./assets/Image/HinhAnh_MinhHoa/trangchu.jpg" width="200" hspace="8" alt="Trang chủ" />
  <img src="./assets/Image/HinhAnh_MinhHoa/trangchu1.jpg" width="200" hspace="8" alt="Trang chủ 1" />
  <img src="./assets/Image/HinhAnh_MinhHoa/sanpham.jpg" width="200" hspace="8" alt="Danh sách sản phẩm" />
</p>

### Chi tiết sản phẩm
<p align="center">
  <img src="./assets/Image/HinhAnh_MinhHoa/chitietsanpham.jpg" width="200" hspace="8" alt="Chi tiết sản phẩm 1" />
  <img src="./assets/Image/HinhAnh_MinhHoa/chitietsanpham2.jpg" width="200" hspace="8" alt="Chi tiết sản phẩm 2" />
</p>

### Sản phẩm yêu thích
<p align="center">
  <img src="./assets/Image/HinhAnh_MinhHoa/yeuthich.jpg" width="200" hspace="8" alt="Danh sách yêu thích" />
</p>

### Giỏ hàng
<p align="center">
  <img src="./assets/Image/HinhAnh_MinhHoa/giohang.jpg" width="200" hspace="8" alt="Giỏ hàng" />
</p>

### Thanh toán
<p align="center">
  <img src="./assets/Image/HinhAnh_MinhHoa/thanhtoan.jpg" width="200" hspace="8" alt="Chọn phương thức thanh toán" />
</p>

### Đặt hàng
<p align="center">
  <img src="./assets/Image/HinhAnh_MinhHoa/dathang.jpg" width="200" hspace="8" alt="Đặt hàng" />
  <img src="./assets/Image/HinhAnh_MinhHoa/dathang2.jpg" width="200" hspace="8" alt="Đặt hàng 2" />
  <img src="./assets/Image/HinhAnh_MinhHoa/dathangthanhcong.jpg" width="200" hspace="8" alt="Đặt hàng thành công" />
</p>

### Đơn hàng của tôi
<p align="center">
  <img src="./assets/Image/HinhAnh_MinhHoa/donhang.jpg" width="200" hspace="8" alt="Danh sách đơn hàng" />
</p>

### Hồ sơ & Cài đặt
<p align="center">
  <img src="./assets/Image/HinhAnh_MinhHoa/profile.jpg" width="200" hspace="8" alt="Hồ sơ người dùng" />
  <img src="./assets/Image/HinhAnh_MinhHoa/diachi.jpg" width="200" hspace="8" alt="Quản lý địa chỉ" />
  <img src="./assets/Image/HinhAnh_MinhHoa/caidat.jpg" width="200" hspace="8" alt="Cài đặt" />
</p>

### Bảng điều khiển Admin
<p align="center">
  <img src="./assets/Image/HinhAnh_MinhHoa/dashboard.jpg" width="200" hspace="8" alt="Dashboard 1" />
  <img src="./assets/Image/HinhAnh_MinhHoa/dashboard1.jpg" width="200" hspace="8" alt="Dashboard 2" />
  <img src="./assets/Image/HinhAnh_MinhHoa/dashboard2.jpg" width="200" hspace="8" alt="Dashboard 3" />
</p>

### Quản lý sản phẩm (Admin)
<p align="center">
  <img src="./assets/Image/HinhAnh_MinhHoa/quanlysanpham.jpg" width="200" hspace="8" alt="Quản lý sản phẩm" />
  <img src="./assets/Image/HinhAnh_MinhHoa/themsanpham.jpg" width="200" hspace="8" alt="Thêm sản phẩm" />
  <img src="./assets/Image/HinhAnh_MinhHoa/themdanhmuc.jpg" width="200" hspace="8" alt="Thêm danh mục" />
</p>

### Quản lý đơn hàng (Admin)
<p align="center">
  <img src="./assets/Image/HinhAnh_MinhHoa/quanlydonhang.jpg" width="200" hspace="8" alt="Quản lý đơn hàng" />
</p>
