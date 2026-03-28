/**
 * ============================================
 * QUICK API TEST SCRIPT
 * ============================================
 * 
 * Copy and paste these commands into your browser console (F12)
 * to test the authentication API endpoints
 * 
 * Make sure Backend is running on http://localhost:8000
 */

// ─────────────────────────────────────────────
// TEST 1: Register a Student User
// ─────────────────────────────────────────────
async function testRegister() {
  console.log("📝 Testing: User Registration");
  try {
    const res = await fetch('http://localhost:8000/User/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Test Student',
        email: 'teststudent@my.sliit.lk',
        password: 'TestPass123',
        studentId: 'IT21000000',
        faculty: 'IT',
        academicYear: 'Year 1',
        semester: 1
      })
    });
    const data = await res.json();
    console.log("✓ Response:", data);
    return data;
  } catch (err) {
    console.error("✗ Error:", err.message);
  }
}

// ─────────────────────────────────────────────
// TEST 2: Login as Admin
// ─────────────────────────────────────────────
async function testAdminLogin() {
  console.log("\n🔐 Testing: Admin Login");
  try {
    const res = await fetch('http://localhost:8000/User/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@my.sliit.lk',
        password: 'Admin@12345'
      })
    });
    const data = await res.json();
    console.log("✓ Response:", data);
    
    if (data.user) {
      console.log("✓ User Role:", data.user.role);
      console.log("✓ Should redirect to: /admin");
    }
    return data;
  } catch (err) {
    console.error("✗ Error:", err.message);
  }
}

// ─────────────────────────────────────────────
// TEST 3: Login as Student
// ─────────────────────────────────────────────
async function testStudentLogin() {
  console.log("\n👤 Testing: Student Login");
  try {
    const res = await fetch('http://localhost:8000/User/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'teststudent@my.sliit.lk',
        password: 'TestPass123'
      })
    });
    const data = await res.json();
    console.log("✓ Response:", data);
    
    if (data.user) {
      console.log("✓ User Role:", data.user.role);
      console.log("✓ Should redirect to: /home");
    }
    return data;
  } catch (err) {
    console.error("✗ Error:", err.message);
  }
}

// ─────────────────────────────────────────────
// TEST 4: Get All Users
// ─────────────────────────────────────────────
async function testGetUsers() {
  console.log("\n📋 Testing: Get All Users");
  try {
    const res = await fetch('http://localhost:8000/User/', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    console.log("✓ Response:", data);
    return data;
  } catch (err) {
    console.error("✗ Error:", err.message);
  }
}

// ─────────────────────────────────────────────
// RUN ALL TESTS
// ─────────────────────────────────────────────
async function runAllTests() {
  console.log("╔════════════════════════════════════════╗");
  console.log("║    UNISHARE API TEST SUITE            ║");
  console.log("╚════════════════════════════════════════╝\n");
  
  await testRegister();
  await testAdminLogin();
  // await testStudentLogin();
  await testGetUsers();
  
  console.log("\n╔════════════════════════════════════════╗");
  console.log("║    ALL TESTS COMPLETED                ║");
  console.log("╚════════════════════════════════════════╝");
}

// Quick note: Uncomment and run in browser console
// Copy the commands you want to run:

// To test admin login:
// testAdminLogin();

// To test student login (after registration):
// testStudentLogin();

// To get all users:
// testGetUsers();

// To run all tests:
// runAllTests();

// ─────────────────────────────────────────────
// MANUAL CURL COMMANDS (Backend Terminal)
// ─────────────────────────────────────────────

/*

# Register Student
curl -X POST http://localhost:8000/User/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test Student",
    "email": "teststudent@my.sliit.lk",
    "password": "TestPass123",
    "studentId": "IT21000000",
    "faculty": "IT",
    "academicYear": "Year 1",
    "semester": 1
  }'

# Login as Admin
curl -X POST http://localhost:8000/User/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@my.sliit.lk",
    "password": "Admin@12345"
  }'

# Get All Users
curl http://localhost:8000/User/

*/
