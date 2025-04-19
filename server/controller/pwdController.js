const cloudinary = require("cloudinary").v2;
const { getFirestore } = require("firebase-admin/firestore");

// Firestore ref
const db = getFirestore();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadPwDCertificate = async (req, res) => {
  try {
    const { userId, file } = req.body;

    if (!file || !userId) {
      return res.status(400).json({ error: "Missing file or user ID" });
    }

    // Upload to Cloudinary
    const uploadRes = await cloudinary.uploader.upload(file, {
      folder: "opportUNITY/pwd_certificates",
      public_id: `pwd_cert_${userId}_${Date.now()}`
    });

    // Save to Firestore under user doc
    const userRef = db.collection("users").doc(userId);
    await userRef.update({
      pwdCertificate: {
        url: uploadRes.secure_url,
        uploadedAt: new Date().toISOString()
      }
    });

    return res.status(200).json({
      message: "PwD Certificate uploaded and linked successfully",
      url: uploadRes.secure_url
    });

  } catch (err) {
    console.error("PwD Upload Error:", err);
    res.status(500).json({ error: "Failed to upload certificate" });
  }
};

module.exports = { uploadPwDCertificate };
