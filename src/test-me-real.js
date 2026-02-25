const { SignJWT } = require('jose');
const http = require('http');

async function testMe() {
    const secret = new TextEncoder().encode("a2b1829b-a266-4fcc-939d-fbdb3a079c05962aa068-a44f-40df-b2a4-b80b6d9cd8b8");

    // Create token (same as my login route)
    const token = await new SignJWT({
        id: "69994f7999d26517d8520bae", // Corrected real 24-char ID
        studentId: "SRAJ/2026/003",
        role: 'student'
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('24h')
        .sign(secret);

    console.log('Using Token:', token);

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/student/me',
        method: 'GET',
        headers: {
            'Cookie': `student_token=${token}`
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
}

testMe();
