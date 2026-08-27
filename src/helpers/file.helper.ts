/** Déclenche le téléchargement d'un `Blob` sous le nom `fileName`. Navigateur uniquement (DOM requis). */
export const downloadFile = (blob: Blob, fileName: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/** Construit un fichier texte à partir de `content` et déclenche son téléchargement. Navigateur uniquement (DOM requis). */
export const downloadContent = (content: string, fileName: string, mimeType: string = "text/plain;charset=utf-8"): void => {
  downloadFile(new Blob([content], { type: mimeType }), fileName);
};
