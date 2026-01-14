import { FILE_BASE_URL } from "../../../config/env";

export default async function deleteImage(fileName) {
  const response = await fetch(`${FILE_BASE_URL}/file/${fileName}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const resultDelete = await response.json();
  console.log(resultDelete, "resultDelete");
}
