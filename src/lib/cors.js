import Cors from "cors";

// Initialize CORS middleware
export const cors = Cors({
  origin: "*", // Allow all origins. Change this to a specific domain if needed.
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
});

// Helper function to run the middleware
export function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}
