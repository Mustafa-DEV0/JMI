import dotenv from "dotenv";
import cloudinary from "cloudinary";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Convert Buffer to Base64
    const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: "uploads",
    });

    res.json( result.secure_url );
    console.log(result.secure_url)
  } catch (error) {
    console.error("Upload error:", error);
    console.log("error:",error)
    res.status(500).json({ message: "Upload failed" });
  }
};