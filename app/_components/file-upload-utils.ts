export function createFilesFromNames(fileNames: string[]) {
  return fileNames.map(
    (fileName, index) =>
      new File([""], fileName, {
        lastModified: index,
        type: "application/octet-stream",
      }),
  );
}
