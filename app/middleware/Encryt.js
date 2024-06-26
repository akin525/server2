const crypto = require('crypto');

// Define the constant key and IV
const key = Buffer.from('12345678901234567890123456789012', 'utf-8'); // 32-byte key

function encryptMiddleware(req, res, next) {
    const text = req.body.text;

    let cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    req.encryptedData = {
        iv: iv.toString('hex'),
        encryptedData: encrypted.toString('hex')
    };

    next();
}

function decryptMiddleware(req, res, next) {
    const iv = Buffer.from(req.headers.timestamp, 'utf-8');                  // 16-byte IV

    const encryptedData = req.body.data;

    let encryptedText = Buffer.from(encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    let value = JSON.parse(decrypted.toString());
    req.decryptedData = value;

    next();
}

module.exports = {
    encryptMiddleware,
    decryptMiddleware
};
