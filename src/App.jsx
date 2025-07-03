import React, { useState } from "react";
import { Loader2, Upload, Image as ImageIcon, Video } from "lucide-react";
import { motion } from "framer-motion";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function App() {
  const [mediaUrl, setMediaUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [embedLink, setEmbedLink] = useState("");
  const [type, setType] = useState("image");

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      setMediaUrl(data.secure_url);

      const isVideo = data.resource_type === "video";
      const embed = isVideo
        ? `<iframe src="${data.secure_url}" frameborder="0" allowfullscreen width="560" height="315"></iframe>`
        : `<img src="${data.secure_url}" alt="Uploaded Image" />`;

      setType(isVideo ? "video" : "image");
      setEmbedLink(embed);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white p-6 text-center">
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl font-bold mb-6"
      >
        Cloud Media Hosting
      </motion.h1>

      <div className="flex justify-center mb-4">
        <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Media
          <input type="file" className="hidden" onChange={handleUpload} />
        </label>
      </div>

      {isLoading && (
        <div className="text-blue-600 flex justify-center items-center gap-2 animate-pulse">
          <Loader2 className="animate-spin w-5 h-5" />
          Uploading...
        </div>
      )}

      {mediaUrl && (
        <div className="mt-6 space-y-4">
          <div className="max-w-xl mx-auto bg-white p-4 rounded-2xl shadow">
            {type === "video" ? (
              <video src={mediaUrl} controls className="w-full rounded-lg" />
            ) : (
              <img src={mediaUrl} alt="Uploaded" className="w-full rounded-lg" />
            )}
          </div>

          <div className="bg-gray-100 rounded-xl p-4 text-left text-sm font-mono whitespace-pre-wrap break-all max-w-xl mx-auto">
            <strong>Embed HTML:</strong>
            <pre>{embedLink}</pre>
          </div>

          <a
            href={mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-blue-600 hover:underline"
          >
            🔗 View Public Link
          </a>
        </div>
      )}
    </div>
  );
}
