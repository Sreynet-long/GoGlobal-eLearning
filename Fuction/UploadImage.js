// import { apiClient } from "../Config/StorageAPI";
import { FILE_BASE_URL } from "../config/env";

const storageName = "goglobalit_hrms";
const folderName = "hrms_images";

// export async function DeleteImage(fileName) {
//   // console.log("delet", fileName);
//   const response = await apiClient.post(`/storages/delete-file`, {
//     storage: storageName,
//     folder: folderName,
//     file: fileName,
//   });
//   return response?.data;
// }

export async function UploadImage(file, fileName) {
  if (!file) return;
  const formData = new FormData();
  console.log("formData:", formData);
  let newFile = file?._parts[0];

  console.log("file:::::::", file, fileName);

  formData.append("file", newFile[1]);
  formData.append("storage", storageName);
  formData.append("folder", folderName);

  try {
    // console.log("formData-->", formData, newFile[1]);
    const response = await fetch(`${FILE_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json", //Ensure the server responds with JSON
      },
    });

    const uploadImageServer = await response.json();
    // (response?._bodyBlob?.type === "text/html"
    //   ? response.text()
    //   :
    // console.log("uploadImageServer", uploadImageServer);
    if (uploadImageServer?.status) {
      //   return `https://goglobalit-storage-v2.go-globalit.com/client/storage:${storageName}/folder:${folderName}/fileName:${fileName}.png/user:65f900d7f1cf8bddbfe5cd3d/key:eoIyOFQi6SXDQkyt0WhtAZyMh0bwZNGkM6j6fvkzJ7T`;
      return `${FILE_BASE_URL}/file/${fileName}`;
    } else {
      console.error("Upload failed:", uploadImageServer);
      return "";
    }
  } catch (error) {
    console.log("error upload image", error.message);
    return "";
  }
}
