import { showToast } from "./toastHelper";

function copyToClipboard(id: string | number): void {
  navigator.clipboard.writeText(String(id)).then(() => {
    showToast.success(`ID скопирован: ${id}`);
  });
}

export default copyToClipboard;
