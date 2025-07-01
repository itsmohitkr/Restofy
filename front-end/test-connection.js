const axios = require('axios');

// Test the connection to the backend
async function testConnection() {
  try {
    console.log('🔍 Testing connection to backend...');
    
    // Test 1: Basic connectivity
    const response = await axios.get('http://localhost:3001/api/auth/verifyToken', {
      withCredentials: true
    });
    console.log('✅ Backend is reachable');
    console.log('Response:', response.status, response.data);
    
  } catch (error) {
    if (error.response) {
      console.log('✅ Backend is reachable (expected error for no token)');
      console.log('Status:', error.response.status);
      console.log('Message:', error.response.data.message);
    } else if (error.code === 'ECONNREFUSED') {
      console.log('❌ Backend is not running on port 3001');
      console.log('Please start your backend server first');
    } else {
      console.log('❌ Connection error:', error.message);
    }
  }
}

testConnection(); 