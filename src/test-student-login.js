const http = require('http');

const testStudentId = 'SRAJ/2026/001'; // Adjust if you know a better ID from your DB

const loginData = JSON.stringify({ studentId: testStudentId });

const loginOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/student/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': loginData.length
    }
};

console.log(`Testing Login with ID: ${testStudentId}...`);

const req = http.request(loginOptions, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        console.log('Response:', body);

        const cookies = res.headers['set-cookie'];
        if (cookies && cookies.some(c => c.includes('student_token'))) {
            console.log('SUCCESS: student_token cookie received.');
        } else if (res.statusCode === 200) {
            console.log('WARNING: Login success but no cookie found (check if dev server issues cookies on localhost).');
        } else {
            console.log('FAILED: Login failed. Make sure the student ID exists in the DB.');
        }
    });
});

req.on('error', (e) => {
    console.error('Error connecting to dev server:', e.message);
});

req.write(loginData);
req.end();
