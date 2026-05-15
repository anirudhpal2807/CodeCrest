/**
 * Development Script: Promote Current User to Admin
 * 
 * This script sends a POST request to promote the logged-in user to admin.
 * Make sure you're logged in (have a valid token cookie) before running this.
 * 
 * Usage (with curl):
 *   curl -X POST http://localhost:3000/user/promote-admin \
 *     -H "Content-Type: application/json" \
 *     -b "token=YOUR_TOKEN_HERE" \
 *     --cookie-jar cookies.txt \
 *     --cookie cookies.txt
 * 
 * Or use the browser console while logged in:
 *   fetch('http://localhost:3000/user/promote-admin', {
 *     method: 'POST',
 *     credentials: 'include'
 *   }).then(r => r.json()).then(console.log)
 */

const axios = require('axios');

// This script requires you to be logged in
// Run this from browser console instead, or use curl with your token cookie
console.log(`
To promote yourself to admin:

OPTION 1 (Browser Console - Easiest):
1. Login to your application
2. Open browser console (F12)
3. Run this:
   fetch('http://localhost:3000/user/promote-admin', {
     method: 'POST',
     credentials: 'include'
   })
   .then(r => r.json())
   .then(data => {
     console.log('Success:', data);
     alert('You are now an admin! Refresh the page.');
   })
   .catch(err => console.error('Error:', err));

OPTION 2 (cURL - requires token):
   curl -X POST http://localhost:3000/user/promote-admin \\
     -H "Content-Type: application/json" \\
     -b "token=YOUR_TOKEN_COOKIE_VALUE" \\
     -c cookies.txt

OPTION 3 (Using MongoDB directly):
   In MongoDB shell or Compass:
   db.users.updateOne(
     { emailId: "your-email@example.com" },
     { $set: { role: "admin" } }
   )
   Then logout and login again to get a new token with admin role.
`);






