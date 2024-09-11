const { Storage } = require("aws-amplify");

export async function moveToBackupFolderS3(sourceKey) {
  console.log(sourceKey, "sourceKey");

  // Codifica la ruta sourceKey
  const encodedSourceKey = encodeURIComponent(sourceKey);
  console.log(encodedSourceKey, "encodedSourceKey");
  const segments = sourceKey.split("/");

  const productID = segments[0];
  const item = segments.pop();

  console.log(item);
  try {
    // Copia el archivo codificado a la carpeta de respaldo
    await Storage.copy(
      { key: encodedSourceKey },
      { key: `${productID}/backup/${item}` }
    );

    // Elimina el archivo original codificado
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

export async function removeFolderS3(path) {
  try {
    const list = await Storage.list(path);
    console.log(list,"list")
    await Promise.all(
      list.results.map(async (item) => {
        console.log(item,"item")
        await Storage.remove(item.key);
      })
    );
  } catch (error) {
    console.error("Error removing the folder:", error);
  }
}