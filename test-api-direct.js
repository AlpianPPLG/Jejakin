// Test API directly
const jwt = require('jsonwebtoken');

// Generate token for partner
const partnerToken = jwt.sign(
  {
    userId: 'cmkxbhvbd0005riu1ob54cia9', // Partner ID from debug
    email: 'partner@jejakin.com',
    role: 'partner'
  },
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
  { expiresIn: '7d' }
);

console.log('🔑 Partner Token:');
console.log(partnerToken);
console.log('');
console.log('📋 Copy token ini dan test di browser:');
console.log('');
console.log('1. Buka browser console (F12)');
console.log('2. Jalankan command ini:');
console.log('');
console.log(`localStorage.setItem('token', '${partnerToken}');`);
console.log('');
console.log('3. Refresh halaman');
console.log('4. Data harus muncul');
