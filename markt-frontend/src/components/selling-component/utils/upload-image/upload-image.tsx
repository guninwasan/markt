import axios from "axios";

const uploadImage = async (file: File): Promise<string> => {
  const uploadData = new FormData();
  uploadData.append("file", file);
  uploadData.append(
    "upload_preset",
    process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || ""
  );

  try {
    const apiUrl = `${process.env.REACT_APP_CLOUDINARY}/${process.env.REACT_APP_CLOUDINARY_VERSION}/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME_1}/${process.env.REACT_APP_CLOUDINARY_UPLOAD}`;
    const response = await axios.post<{ secure_url: string }>(
      apiUrl,
      uploadData
    );
    return response.data.secure_url;
  } catch (error) {
    throw new Error("Failed to upload image");
  }
};

export { uploadImage };
