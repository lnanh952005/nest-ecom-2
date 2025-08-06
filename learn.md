# life cycle

1 Middleware

2 Guards

3 Interceptors (pre-controller)

4 Pipes

5 Controller (method handler)

6 Interceptors (post-request)

7 Exception filters

8 Server response

# send email

Email sử dụng giao thức SMTP, IMAP, POP3 để gửi và nhận email. Nó khác gới giao thức HTTP mà chứng ta lướt ưeb.

Vì vậy để gửi email có 2 giải pháp

## 1. Tự build một server riêng để gửi email

cách này tốn TG, chi phí và k hiệu quả. Vì dễ bị các hệ thống email như mail, yahoo, outlook chặn do k đáp ứng các tiêu chuẩn an toàn, chống spam,...

## 2. Sử dụng dịch vụ của các công ty cung cấp DV email như AWS SES, SendGrid, Mailgun, Resend,....

cách này HQ hơn,chi phí thấp, dễ sử dụng, hỗ trợ nhiều tính năng như gửi email theo hàng loạt ,theo dõi email, chống spam,...

# from: ecommerce <nhatanh@nhatanh.top> ecommerce: tên người gửi

# from: nhatanh@nhatanh.top nhatanh trước @ là tên người gửi

✅ Mô hình hoạt động phổ biến nhất: TOTP (Time-based One-Time Password)
🧩 Tổng quan:

1. Khi user bật 2FA:

   Server tạo secret key (chuỗi base32), lưu vào DB của user.

   Server gửi mã QR chứa secret đó → user quét bằng app (Google Authenticator, Authy,...).

2.App di động tạo mã OTP mới mỗi ~30 giây dựa trên:

    Secret key

    Thời gian hiện tại

3.Khi login, sau bước nhập mật khẩu đúng:

    Server yêu cầu user nhập mã OTP hiện tại.

    Server tự tính mã OTP (dùng secret đã lưu) → so sánh với mã user nhập.

    Nếu khớp → ✅ xác thực thành công.
