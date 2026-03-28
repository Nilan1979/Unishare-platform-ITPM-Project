# ⚡ 5-Minute Quick Start

**Complete this in 5 minutes to get your admin dashboard working!**

---

## 🚀 Three Commands

### Command 1: Create Admin User
```bash
cd Backend
node seeds/createAdmin.js
```

**Expected Output:**
```
✓ Admin user created successfully!
📧 Email:    admin@my.sliit.lk
🔐 Password: Admin@12345
```

### Command 2: Start Backend
```bash
cd Backend
npm install  # Only first time
node server.js
```

**Expected Output:**
```
✓ Server Running on http://localhost:8000
✓ Connected to MongoDB
```

### Command 3: Start Frontend (New Terminal)
```bash
cd frontend
npm install  # Only first time
npm start
```

**Expected Output:**
```
✓ Local: http://localhost:3000
✓ Browser opens automatically
```

---

## ✅ Test It (30 seconds)

1. **URL**: `http://localhost:3000/login` (already open)
2. **Email**: `admin@my.sliit.lk`
3. **Password**: `Admin@12345`
4. **Click**: "Sign In →"
5. **Result**: Should redirect to `/admin` ✅

**That's it! You're done.** 🎉

---

## 📚 Need More Details?

| Need | Read |
|------|------|
| Complete setup | [ADMIN_SETUP_GUIDE.md](ADMIN_SETUP_GUIDE.md) |
| How it works | [VISUAL_REFERENCE.md](VISUAL_REFERENCE.md) |
| Implementation details | [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) |
| Testing API | [API_TEST_GUIDE.md](API_TEST_GUIDE.md) |
| Verify everything | [VERIFICATION_CHECKLIST.md](VERIFICATION_CHECKLIST.md) |

---

## 🆘 Common Issues

| Problem | Fix |
|---------|-----|
| Script not found | Run from `Backend` directory |
| Port already in use | Kill process on 8000/3000 or use different ports |
| MongoDB error | Start MongoDB service |
| Admin already exists | Use existing credentials or delete and recreate |
| Login doesn't redirect | Check browser console (F12) for errors |

---

## 🔑 Test Credentials

**Admin Account:**
```
📧 Email:    admin@my.sliit.lk
🔐 Password: Admin@12345
```

---

## 📋 What Got Installed

✅ Backend admin seed script  
✅ Frontend admin redirect logic  
✅ Frontend admin authorization check  
✅ Input validation for admins only  
✅ Role-based dashboard navigation  

---

## 🎯 Flow Diagram (Simple)

```
Login with admin creds
        ↓
Backend validates
        ↓
Returns user with role: "admin"
        ↓
Frontend checks role
        ↓
Redirects to /admin
        ↓
Admin Dashboard! ✅
```

---

## 💡 Pro Tips

- **Register Test Student**: Go to `/register` and create one
- **Test Student Login**: Login will redirect to `/home` instead
- **Non-Admin Block**: Students trying `/admin` get redirected home
- **Logout**: Clear localStorage to logout

---

**Questions?** Check the full documentation or browser console for error messages!

---

**Status**: ✅ READY TO USE
