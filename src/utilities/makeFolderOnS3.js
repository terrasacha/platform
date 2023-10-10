import { Storage } from "aws-amplify";

export async function makeFolderOnS3(folderPath) {
  try {
    const folderResult = await Storage.put(folderPath, "", {
      level: "public",
      contentType: "application/x-directory",
    });
    console.log("folderPath", folderPath);
    console.log("folderResult", folderResult);
  } catch (error) {
    console.error("Error al crear la carpeta:", error);
    throw new Error("Error al crear la carpeta");
  }
}