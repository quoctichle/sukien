# Hệ Thống Quản Lý Người Dùng với Phân Quyền

Ứng dụng Nuxt 3 với hệ thống xác thực, phân quyền (Admin/User) và hỗ trợ đa ngôn ngữ (Tiếng Việt/Tiếng Anh).

## Tính Năng Chính

### 1. **Phân Quyền (Roles)**
- **Admin**: Quản lý người dùng, toàn quyền truy cập
- **User**: Người dùng thông thường, xem thông tin cá nhân

### 2. **Đa Ngôn Ngữ (i18n)**
- Tiếng Việt (`vi`) - `/vi` hoặc `/admin`
- Tiếng Anh (`en`) - `/en`
- Admin luôn sử dụng Tiếng Việt

### 3. **Xác Thực (Authentication)**
- Đăng ký người dùng mới
- Đăng nhập với email/password
- JWT Token (7 ngày hết hạn)
- Password hashing với bcrypt

### 4. **Cơ Sở Dữ Liệu**
- MongoDB Atlas (Mongoose ORM)
- Schema User với fields: name, email, password, role, language, isActive

## Cấu Trúc Thư Mục

```
Websukien/
├── pages/
│   ├── index.vue              # Trang chủ
│   ├── login.vue              # Đăng nhập
│   ├── register.vue           # Đăng ký
│   ├── user.vue               # Trang người dùng
│   ├── admin.vue              # Bảng điều khiển admin (Tiếng Việt)
│   └── [lang]/
│       └── user.vue           # Trang người dùng theo ngôn ngữ (/vi/user, /en/user)
├── server/
│   ├── api/
│   │   ├── health.ts          # Health check
│   │   ├── auth/
│   │   │   ├── login.ts       # Đăng nhập
│   │   │   ├── register.ts    # Đăng ký
│   │   │   └── me.ts          # Lấy thông tin người dùng hiện tại
│   │   └── admin/
│   │       ├── users.ts       # Lấy danh sách người dùng
│   │       └── update-user.ts # Cập nhật người dùng
│   ├── middleware/
│   │   └── auth.ts            # Middleware xác thực JWT
│   ├── models/
│   │   └── user.ts            # User schema Mongoose
│   └── utils/
│       ├── auth.ts            # JWT utilities
│       ├── protect.ts         # Route protection
│       └── db.ts              # MongoDB connection
├── locales/
│   ├── vi.ts                  # Tiếng Việt translations
│   └── en.ts                  # Tiếng Anh translations
├── nuxt.config.ts             # Cấu hình Nuxt
├── .env.local                 # Environment variables
└── package.json
```

## Đường Dẫn Routes

### Công Khai (Public)
- `/` - Trang chủ
- `/login` - Đăng nhập
- `/register` - Đăng ký

### Người Dùng (User)
- `/user` - Trang người dùng (sử dụng locale từ user)
- `/vi/user` - Trang người dùng Tiếng Việt
- `/en/user` - Trang người dùng Tiếng Anh

### Quản Trị Viên (Admin) - Tiếng Việt Toàn Bộ
- `/admin` - Bảng điều khiển quản trị

## API Endpoints

### Auth
```bash
# Đăng ký
POST /api/auth/register
Body: { name, email, password, language }

# Đăng nhập
POST /api/auth/login
Body: { email, password, language }

# Lấy thông tin người dùng hiện tại
GET /api/auth/me
Headers: Authorization: Bearer <token>
```

### Admin
```bash
# Lấy danh sách người dùng
GET /api/admin/users
Headers: Authorization: Bearer <admin_token>

# Cập nhật người dùng (admin only)
POST /api/admin/update-user
Headers: Authorization: Bearer <admin_token>
Body: { userId, role, isActive }
```

### Khác
```bash
# Health check
GET /api/health
```

## Cài Đặt

1. **Clone và cài đặt dependencies:**
```bash
npm install
```

2. **Cấu hình environment (.env.local):**
```
MONGODB_URI=mongodb+srv://quoctichle_db_user:xrJ4I1i3TtC4uU70@cluster0.xqhydox.mongodb.net/
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024
```

3. **Chạy dev server:**
```bash
npm run dev
```

4. **Build cho production:**
```bash
npm run build
npm run preview
```

## Sử Dụng

### Tạo Người Dùng Admin

Mặc định, các người dùng được tạo với role `user`. Để tạo admin, hãy:

1. Đăng ký một tài khoản thường
2. Kết nối tới MongoDB và cập nhật role:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

Hoặc sử dụng API update-user nếu bạn đã là admin.

### Luồng Đăng Nhập

1. **User bình thường:**
   - Đăng ký/Đăng nhập
   - Được redirect tới `/vi/user` hoặc `/en/user` (tùy ngôn ngữ)

2. **Admin:**
   - Đăng ký/Đăng nhập
   - Được redirect tới `/admin` (Tiếng Việt)

## Biến Môi Trường

| Biến | Mô Tả | Giá Trị Mặc Định |
|------|-------|-----------------|
| `MONGODB_URI` | Connection string MongoDB | - |
| `JWT_SECRET` | Secret key cho JWT | `your-secret-key-change-in-production` |

## Dependencies

- `nuxt` - Framework Vue 3
- `mongoose` - MongoDB ORM
- `@nuxtjs/i18n` - Đa ngôn ngữ
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT authentication

## Bảo Mật

- Mật khẩu được hash với bcrypt (10 rounds)
- JWT tokens có thời hạn 7 ngày
- API routes được bảo vệ bằng middleware xác thực
- Admin routes yêu cầu role admin
- Passwords không bao giờ được trả về từ API

## Troubleshooting

### MongoDB connection error
- Kiểm tra MONGODB_URI trong .env.local
- Đảm bảo IP whitelist trong MongoDB Atlas

### JWT errors
- Đảm bảo JWT_SECRET được đặt trong .env.local
- Xóa cookies browser và đăng nhập lại

### i18n not working
- Kiểm tra locale files trong thư mục `locales/`
- Đảm bảo `@nuxtjs/i18n` được cài đặt

## License

MIT
