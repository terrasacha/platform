import { Storage } from "aws-amplify";
import { PutObjectCommand } from "@aws-sdk/client-s3";
/* export async function makeFolderOnS3(folderPath) {
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
} */
export async function makeFolderOnS3(s3Client, bucketName, folderPath) {
  try {
    if (!folderPath.endsWith('/')) {
      folderPath += '/';
    }

    const params = {
      Bucket: bucketName,
      Key: folderPath,
      Body: '',
      ContentType: 'application/x-directory',
    };

    const command = new PutObjectCommand(params);
    const folderResult = await s3Client.send(command);

    return { status: 'success', msg: 'Carpeta creada'}
  } catch (error) {
    console.error('Error al crear la carpeta:', error);
    return { status: 'error', msg: 'Error al crear la carpeta'}

    
  }
}
