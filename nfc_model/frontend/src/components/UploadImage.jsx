// frontend/src/components/UploadImage.jsx
import React from "react";

const UploadImage = ({ setPhotoFile }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhotoFile(file);
  };

  return (
    <div>
      <label className="block font-semibold mb-1">Upload Product Photo</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="border p-2 rounded-md w-full"
      />
    </div>
  );
};

export default UploadImage;
