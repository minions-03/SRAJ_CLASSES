const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/student/me',
    method: 'GET',
    headers: {
        'Cookie': 'student_token=dummy_token' // We'll just see if it hits the 401 or 500
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log('BODY:', data);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();
