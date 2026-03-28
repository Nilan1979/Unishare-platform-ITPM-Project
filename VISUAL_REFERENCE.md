# 🎯 UniShare Admin Authentication - Visual Quick Reference

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  localStorage: {                    Frontend Routes:             │
│    "user": {                         • /login (public)            │
│      role: "admin"  ──────┐         • /register (public)         │
│      email: "..."         │         • /home (protected)          │
│      ...                  │         • /admin (admin only) ◄──┐   │
│    }                      │                                 │   │
│  }                        │         App.js checks:          │   │
│                           │         ✓ localStorage.user     │   │
│                           │         ✓ user.role             │   │
│                           └────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP POST /User/login
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND SERVER :8000                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  UserController.js                                               │
│  • Receive { email, password }                                  │
│  • Query User.findByEmail()                                     │
│  • Compare passwords (bcrypt)                                   │
│  • Return: { message, user { ...role, ... } }                  │
│                                                                  │
│  Response includes:                                              │
│  {                                                               │
│    message: "Login successful",                                 │
│    user: {                                                       │
│      role: "admin" ◄── This determines redirect!               │
│      fullName: "...",                                           │
│      email: "...",                                              │
│      ...                                                         │
│    }                                                             │
│  }                                                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │ Query
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    MONGODB DATABASE                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  usermanagements collection:                                    │
│  [                                                               │
│    {                                                             │
│      _id: ObjectId(...),                                        │
│      fullName: "System Administrator",                          │
│      email: "admin@my.sliit.lk",                               │
│      password: "hash_bcrypt_....",                             │
│      studentId: "ADMIN001",                                    │
│      role: "admin" ◄── Key field for authorization             │
│      ...                                                         │
│    },                                                            │
│    {                                                             │
│      ...                                                         │
│      role: "student"                                            │
│    }                                                             │
│  ]                                                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow - Step by Step

```
STEP 1: USER VISITS LOGIN PAGE
       ┌─────────────────────┐
       │ http://localhost:3000/login
       └──────────┬──────────┘
                  │
                  ▼
       ┌──────────────────────────┐
       │  Login Form              │
       │  [Email    ]             │
       │  [Password ]             │
       │  [Sign In →]             │
       └──────────┬───────────────┘

STEP 2: USER SUBMITS CREDENTIALS
       ┌──────────────────────────┐
       │ POST /User/login         │
       │ {                        │
       │   email: "admin@...",    │
       │   password: "Admin@..."  │
       │ }                        │
       └──────────┬───────────────┘
                  │
                  ▼
       ┌──────────────────────────┐
       │ Backend Validation       │
       │ ✓ Find user by email    │
       │ ✓ Compare password      │
       │ ✓ Return user object    │
       └──────────┬───────────────┘
                  │
                  ▼
       ┌──────────────────────────────┐
       │ Response:                    │
       │ {                            │
       │   user: {                    │
       │     role: "admin",           │
       │     email: "admin@...",      │
       │     ... more fields ...      │
       │   }                          │
       │ }                            │
       └──────────┬────────────────────┘

STEP 3: FRONTEND PROCESSES RESPONSE
       ┌──────────────────────────┐
       │ Save to localStorage:    │
       │ localStorage.setItem(    │
       │   "user",                │
       │   JSON.stringify(user)   │
       │ )                        │
       └──────────┬───────────────┘
                  │
                  ▼
       ┌──────────────────────────┐
       │ Check user.role          │
       └──────────┬───────────────┘
                  │
         ┌────────┴────────┐
         │                 │
    IF role =          IF role = 
    "admin"            "student"
         │                 │
         ▼                 ▼
   NAVIGATE TO        NAVIGATE TO
   /admin            /home
   (Dashboard)       (Student Home)
         │                 │
         └────────┬────────┘
                  │
                  ▼
       ┌──────────────────────┐
       │ User Logged In! ✅    │
       └──────────────────────┘
```

---

## Component Protection - AdminUsers

```
USER TRIES TO ACCESS /admin
       │
       ├─ ProtectedRoute checks: Is user logged in?
       │   ├─ YES → Continue to AdminUsers
       │   └─ NO → Redirect to /login
       │
       ▼
ADMIN USERS COMPONENT LOADS
       │
       ├─ useEffect runs on mount
       │   │
       │   ├─ Read localStorage.user
       │   │
       │   ├─ Is user.role === "admin"?
       │   │   ├─ YES ┐
       │   │   │      └─► setIsAuthorized(true)
       │   │   │          Render Dashboard ✅
       │   │   │
       │   │   └─ NO ┐
       │   │         └─► navigate("/", replace: true)
       │   │             Redirect to Home ❌
       │   │
       │   └─ Invalid JSON?
       │       └─► navigate("/login")
       │           Redirect to Login ❌
       │
       ▼
IF isAuthorized = false
       │
       └─► SHOW LOADING STATE
           "Verifying Access..."
           "Redirecting..."
           
       ▼
IF isAuthorized = true
       │
       └─► RENDER FULL DASHBOARD
           Sidebar ✓
           User Management ✓
           Reports ✓
           Actions ✓
```

---

## Data Model - User Schema

```javascript
userSchema = {
  // Personal Info
  fullName: String,           // Required
  email: String,              // Required, unique, @my.sliit.lk
  password: String,           // Hashed with bcrypt
  
  // Academic Info
  studentId: String,          // Required, unique
  faculty: String,            // IT, Engineering, Business, etc.
  academicYear: String,       // Year 1-4
  semester: Number,           // 1 or 2
  
  // Authorization - KEY FIELD ⭐
  role: String,               // "student" (default) or "admin"
  
  // Profile
  profilePicture: String,     // Optional URL
  isActive: Boolean,          // true (default)
  
  // Metadata
  timestamps: true,           // createdAt, updatedAt
}
```

---

## Security Layers

```
┌─────────────────────────────────────────┐
│   LAYER 1: Password Hashing             │
│   ─────────────────────────────────────  │
│   • bcrypt with 12 salt rounds          │
│   • Passwords never stored in plain     │
│   • Only hashes stored in DB            │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│   LAYER 2: Email Domain Validation      │
│   ─────────────────────────────────────  │
│   • Must end with @my.sliit.lk          │
│   • Prevents unauthorized registrations │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│   LAYER 3: Role-Based Access Control    │
│   ─────────────────────────────────────  │
│   • Only admin role can access /admin   │
│   • Frontend checks role before render  │
│   • Backend can later protect routes    │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│   LAYER 4: localStorage Session         │
│   ─────────────────────────────────────  │
│   • User object stored after login      │
│   • Persists across page reloads        │
│   • Cleared on logout                   │
└─────────────────────────────────────────┘
```

---

## Setup Command Reference

```bash
# 1️⃣ CREATE ADMIN USER
$ node Backend/seeds/createAdmin.js

Output:
✓ Connected to MongoDB
✓ Admin user created successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN CREDENTIALS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Email:    admin@my.sliit.lk
🔐 Password: Admin@12345
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# 2️⃣ START BACKEND
$ cd Backend && node server.js

Output:
✓ Server Running on http://localhost:8000
✓ Connected to MongoDB

# 3️⃣ START FRONTEND (New Terminal)
$ cd frontend && npm start

Output:
✓ React Development Server
✓ http://localhost:3000

# 4️⃣ TEST ADMIN LOGIN
# Open http://localhost:3000/login
# Enter: admin@my.sliit.lk / Admin@12345
# Should auto-redirect to /admin ✅
```

---

## File Structure

```
Unishare-platform-ITPM-Project/
│
├── Backend/
│   ├── models/
│   │   └── Usermanagement.js       ⭐ Has role field
│   ├── controllers/
│   │   └── UserController.js       ⭐ Returns role in response
│   ├── routes/
│   │   └── UserRoutes.js           ⭐ /login endpoint
│   └── seeds/
│       └── createAdmin.js          ⭐ NEW: Create admin user
│
├── frontend/src/
│   ├── pages/UserManagement/
│   │   ├── Login.jsx               ⭐ UPDATED: Role-based redirect
│   │   ├── AdminUsers.jsx          ⭐ UPDATED: Authorization check
│   │   └── Register.jsx
│   └── App.js                      ⭐ Routes including /admin
│
├── ADMIN_SETUP_GUIDE.md            ⭐ NEW: Complete setup guide
├── API_TEST_GUIDE.md               ⭐ NEW: API testing guide
└── IMPLEMENTATION_SUMMARY.md       ⭐ NEW: Technical summary
```

---

## Troubleshooting Quick Lookup

| Problem | Solution |
|---------|----------|
| Admin doesn't redirect | Check user.role in network tab |
| Can't find createAdmin.js | cd to Backend directory first |
| Admin already exists | Use existing credentials or delete & recreate |
| Non-admin sees admin panel | Clear localStorage, refresh, re-login |
| API returns 400 error | Verify MongoDB is running |
| Frontend won't start | Check npm install completed |

---

## Success Criteria ✅

- [x] Passwords hashed with bcrypt
- [x] Admin users have role='admin'
- [x] Login returns user with role
- [x] Frontend checks role after login
- [x] Admin redirects to /admin
- [x] Student redirects to /home
- [x] Non-admin cannot access /admin
- [x] Seed script creates sample admin
- [x] Complete documentation provided

---

## Next Steps (Optional)

- [ ] Add JWT token authentication
- [ ] Implement refresh tokens
- [ ] Add backend route protection middleware
- [ ] Create dynamic role assignment UI
- [ ] Add audit logging
- [ ] Implement 2FA for admin accounts
- [ ] Add email verification

---

**🎉 Your admin authentication system is ready to use!**

Read `ADMIN_SETUP_GUIDE.md` for detailed instructions.
