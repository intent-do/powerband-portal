export default async function handler(req, res) {
    res.setHeader('Set-Cookie', 'payload=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0;');

    res.status(200).json({ message: 'Logged out' });
}