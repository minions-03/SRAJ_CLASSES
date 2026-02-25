const http = require('http');

const data = JSON.stringify({
    name: 'Test Student',
    email: 'srajgs2025@gmail.com',
    message: 'Hello, this is a test message from the automated verification script.'
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/contact',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let responseBody = '';
    res.on('data', (chunk) => responseBody += chunk);
    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        console.log('Response:', responseBody);
        if (res.statusCode === 200) {
            console.log('SUCCESS: API is working correctly.');
        } else {
            console.log('FAILED: API returned an error.');
        }
    });
});

req.on('error', (error) => {
    console.error('Error:', error.message);
    console.log('Make sure the dev server is running on localhost:3000');
});

req.write(data);
req.end();
