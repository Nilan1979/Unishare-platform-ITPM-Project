# 🔐 UniShare User Authentication & Admin Dashboard Setup Guide

## Overview
This guide explains the complete user authentication flow, how to set up admin users, and access the Admin Dashboard.

---

## 📋 Authentication Flow

### User Registration
1. User visits `/register`
2. Fills in registration form with:
   - Full Name
   - Email (must be @my.sliit.lk domain)
   - Password (min 8 characters)
   - Student ID
   - Faculty
   - Academic Year
   - Semester
3. Backend validates and creates user with `role: 'student'` (default)
4. User is redirected to login page

### User Login
1. User visits `/login`
2. Enters email and password
3. Backend authenticates credentials
4. **Role-based redirect:**
   - ✅ **Admin user** → Redirects to `/admin` (Admin Dashboard)
   - ✅ **Student user** → Redirects to previous location or `/home`
5. User object stored in localStorage with role information

### Authorization
- Frontend checks `user.role` from localStorage
- AdminUsers component protects `/admin` route
- Non-admin users attempting `/admin` are redirected to home

---

## 🛠️ Setup Instructions

### Step 1: Create Admin User (Backend)

#### Option A: Using Seed Script (Recommended)

```bash
cd Backend
node seeds/createAdmin.js
```

**Output:**
```
✓ Connected to MongoDB
✓ Admin user created successfully!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN CREDENTIALS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Email:    admin@my.sliit.lk
🔐 Password: Admin@12345
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### Option B: Manual Database Entry

Use MongoDB to insert:
```javascript
{
  fullName: "System Administrator",
  email: "admin@my.sliit.lk",
  password: "Admin@12345",  // Will be hashed
  studentId: "ADMIN001",
  faculty: "IT",
  academicYear: "Year 4",
  semester: 1,
  role: "admin",
  isActive: true
}
```

### Step 2: Start Backend Server

```bash
cd Backend
npm install
node server.js
```

Server runs on: `http://localhost:8000`

### Step 3: Start Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on: `http://localhost:3000`

---

## 🚀 Testing the Flow

### Test 1: Admin Login
1. Navigate to `http://localhost:3000/login`
2. Enter credentials:
   - 📧 Email: `admin@my.sliit.lk`
   - 🔐 Password: `Admin@12345`
3. Click "Sign In"
4. ✅ You should be redirected to `/admin` (Admin Dashboard)

### Test 2: Student Login
1. Navigate to `/register`
2. Create a new student account:
   - Email: `it21000001@my.sliit.lk`
   - Password: `Student@123`
   - Student ID: `IT21000001`
   - Faculty: `IT`
   - Academic Year: `Year 1`
   - Semester: `1`
3. Navigate to `/login` and sign in
4. ✅ You should be redirected to `/home` (Student Home)

### Test 3: Authorization Check
1. Log out from admin account
2. Log in as student
3. Try to access `http://localhost:3000/admin` directly
4. ✅ You should be redirected to home (`/`)

---

## 📁 File Structure & Changes

### Backend Changes
```
Backend/
├── models/Usermanagement.js          # User schema with role field
├── controllers/UserController.js     # Login returns user with role
├── routes/UserRoutes.js              # /login endpoint
└── seeds/createAdmin.js              # ✨ NEW: Admin creation script
```

### Frontend Changes
```
frontend/src/
├── pages/UserManagement/
│   ├── Login.jsx                     # ✨ UPDATED: Admin redirect logic
│   ├── AdminUsers.jsx                # ✨ UPDATED: Admin authorization check
│   └── Register.jsx
└── App.js                            # Routes including /admin
```

---

## 🔄 Data Flow

### Login Response Structure
```javascript
{
  message: "Login successful",
  user: {
    _id: "...",
    fullName: "System Administrator",
    email: "admin@my.sliit.lk",
    studentId: "ADMIN001",
    faculty: "IT",
    academicYear: "Year 4",
    semester: 1,
    role: "admin",              // ← Key field for routing
    isActive: true,
    createdAt: "...",
    updatedAt: "..."
    // password is NOT included (removed by toSafeObject())
  }
}
```

### Admin Authorization Check (Frontend)
```javascript
useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  
  if (!user || user.role !== "admin") {
    navigate("/", { replace: true });  // Redirect non-admins
    return;
  }
  
  setIsAuthorized(true);
}, [navigate]);
```

---

## 🎯 Key Features

| Feature | Status |
|---------|--------|
| User Registration | ✅ Implemented |
| User Login | ✅ Implemented |
| Password Hashing (bcrypt) | ✅ Implemented |
| Role-based Access Control | ✅ Implemented |
| Admin Redirect | ✅ Implemented |
| Student Redirect | ✅ Implemented |
| Authorization Guards | ✅ Implemented |
| Logout | ✅ Via localStorage clear |

---

## 🔧 Troubleshooting

### Problem: Admin doesn't redirect to dashboard
**Solution:** Check browser console for errors. Ensure:
- Backend is running and returning user with `role: "admin"`
- Frontend is receiving role in login response
- localStorage has user object with role field

### Problem: Getting "Invalid email or password"
**Solution:**
- Ensure admin user was created: `node seeds/createAdmin.js`
- Check exact credentials in seed script
- Verify MongoDB connection is working

### Problem: Non-admin can still access /admin
**Solution:**
- Clear localStorage: `localStorage.clear()`
- Refresh page
- Check browser console for authorization check errors

---

## 📝 Next Steps (Optional Enhancements)

- [ ] Add JWT token authentication
- [ ] Implement refresh tokens
- [ ] Add role-based API endpoint protection
- [ ] Create UI for dynamic role assignment
- [ ] Add audit logs for admin actions
- [ ] Implement admin activity dashboard
- [ ] Add email verification for registration

---

## 📞 Support

For issues or questions, check:
1. Browser console (F12) for error messages
2. Backend logs (terminal where server runs)
3. MongoDB connection status
4. CORS settings in backend (if cross-origin errors)
