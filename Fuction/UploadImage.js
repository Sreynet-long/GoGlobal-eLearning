import * as ImageManipulator from "expo-image-manipulator";
import { FILE_BASE_URL } from "../config/env";

const storageName = "goglobalit_hrms";
const folderName = "hrms_images";

export async function UploadImage(uri, fileName) {
  if (!uri) return "";

  try {
    // Convert HEIC/large images to JPEG and resize
    const manipulated = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1024 } }], // optional resize to reduce size
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG },
    );
    // console.log("manipulated", manipulated);
    const formData = new FormData();
    formData?.append("files", {
      uri: manipulated?.uri,
      name: fileName + ".jpg",
      type: "image/jpeg",
    });
    formData?.append("storage", storageName);
    formData?.append("folder", folderName);
    // console.log("FORM DATA:", formData);
    const response = await fetch(`${FILE_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json", // let fetch set the Content-Type boundary
      },
    });

    // Parse JSON
    const result = await response?.json();
    if (result?.status) {
      // return `${FILE_BASE_URL}/file/${result?.files[0]?.filename}`;
      return result?.files[0]?.filename;
    } else {
      console.error("Upload failed:", result);
      return "";
    }
  } catch (error) {
    console.log("error upload image:", error.message);
    return "";
  }
}
