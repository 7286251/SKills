import JSZip from "jszip";
import { saveAs } from "file-saver";

export const downloadPackage = async (fileName: string, files: Record<string, string>) => {
  const zip = new JSZip();

  for (const [path, content] of Object.entries(files)) {
    zip.file(path, content);
  }

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `${fileName}.zip`);
};
