import verifyToken from "@/middleware/verifyToken";
import axios from "axios";

async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { fileUrl } = req.body;
    if (!fileUrl) {
      return res.status(400).json({ message: "File URL is required" });
    }

    // Fetch the file
    const response = await axios.get(fileUrl, {
      responseType: "arraybuffer", // Ensures binary format
    });

    // Get content type from response headers
    const fileType = response.headers["content-type"] || "application/pdf";

    // Set headers for correct file download
    res.setHeader("Content-Type", fileType);
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="downloaded_file.pdf"'
    );
    res.setHeader("Content-Length", response.data.byteLength);

    // Send the binary file
    res.status(200).send(Buffer.from(response.data));
  } catch (error) {
    console.error("Download error:", error);
    res
      .status(500)
      .json({ message: "Error downloading file", error: error.message });
  }
}

export default verifyToken(handler);
