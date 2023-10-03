const { Storage } = require("aws-amplify");

export async function moveToBackupFolderS3(sourceKey) {
  const segments = sourceKey.split("/");

  const productID = segments[0]
  const item = segments.pop();

  console.log(item);
  try {
    await Storage.copy(
      { key: sourceKey },
      { key: `${productID}/backup/${item}` }
    );

    await Storage.remove(sourceKey);

    console.log(`File moved from ${sourceKey} to ${productID}/backup/${item}`);
  } catch (error) {
    if (error.code === "NoSuchKey") {
      console.log(
        `El objeto ${item} no existe. Continuando con el siguiente objeto.`
      );
    } else {
      console.error("Error moving the file:", error);
    }
  }
}