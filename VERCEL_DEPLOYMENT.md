# Hướng dẫn Deploy lên Vercel

## 1. Chuẩn bị MongoDB

### Tùy chọn A: MongoDB Atlas (Recommended)
1. Đăng ký tại https://www.mongodb.com/cloud/atlas
2. Tạo cluster mới (free tier)
3. Tạo database user
4. Lấy connection string: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`

### Tùy chọn B: MongoDB Compass Local
- Không khuyến khích cho production vì Vercel không thể kết nối đến local machine

---

## 2. Deploy trên Vercel

### Bước 1: Chuẩn bị dự án
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Bước 2: Kết nối Vercel
1. Truy cập https://vercel.com
2. Click "Add New..." → "Project"
3. Chọn repository `sukien`
4. Click "Import"

### Bước 3: Cấu hình Environment Variables
Trong Vercel Dashboard, vào project → Settings → Environment Variables

Thêm các biến sau:
```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
JWT_SECRET = your-random-secret-key-here
```

### Bước 4: Deploy
Click "Deploy" - Vercel sẽ tự động build và deploy

---

## 3. Xác minh kết nối

Sau khi deploy xong:
1. Truy cập domain của dự án
2. Kiểm tra API health: `https://your-domain.vercel.app/api/health`
3. Nếu thành công sẽ trả về `{ "status": "ok" }`

---

## 4. Troubleshooting

### Lỗi: "Server Error"
- Kiểm tra Environment Variables đã được set chưa
- Xem Vercel Logs: Dashboard → Deployments → View Logs

### Lỗi: "MongoDB connection error"
- Kiểm tra connection string có đúng không
- Kiểm tra IP whitelist trên MongoDB Atlas (phải add 0.0.0.0/0)
- Kiểm tra database user có quyền truy cập không

### Lỗi: "ECONNREFUSED" 
- Có nghĩa MongoDB URI sai hoặc không cấu hình
- Kiểm tra lại `.env.local` và Vercel settings

---

## 5. Local Testing

Để test trước khi deploy:

1. Tạo file `.env.local`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
JWT_SECRET=test-secret
```

2. Run dev server:
```bash
npm run dev
```

3. Test API: http://localhost:3000/api/health

---

## 6. Cấu hình MongoDB Atlas Network Access

1. Login vào MongoDB Atlas
2. Vào Network Access (hoặc IP Whitelist)
3. Click "Add IP Address"
4. Chọn "Allow access from anywhere" (0.0.0.0/0)
5. Confirm

⚠️ **Lưu ý**: Chỉ khuyến khích cho development. Cho production, add IP cụ thể của Vercel nếu có thể.
