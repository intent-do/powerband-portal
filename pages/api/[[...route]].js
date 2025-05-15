export default async function handler(req, res) {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://portal.powerbandelectrical.com.au'
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  try {
    let routePath = req.query.route ? req.query.route.join("/") : "";

    if (routePath && !(await import(`../../src/api/${routePath}.js`).catch(() => null))) {
      routePath += "/index";
    }

    console.log("🔍 Requested API:", routePath);

    const apiHandler = (await import(`../../src/api/${routePath}.js`)).default;

    return apiHandler(req, res);
  } catch (error) {
    console.error("❌ API route not found:", error);
    res.status(404).json({ message: "API route not found." });
  }
}
