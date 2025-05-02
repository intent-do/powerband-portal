export default async function handler(req, res) {
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
