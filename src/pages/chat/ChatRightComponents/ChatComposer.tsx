import { useRef, useState } from "react";
import { Image as ImageIcon, Paperclip, Send, Smile } from "lucide-react";
import { sendMessage } from "@/lib/socket";
import { chatAPI } from "@/lib/api";
import { toast } from "react-toastify";

interface ChatComposerProps {
  ticketId: number | null;
}

function ChatComposer({ ticketId }: ChatComposerProps) {
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() && ticketId) {
      sendMessage(ticketId, message.trim());
      setMessage("");
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!ticketId) {
      toast.error("Пожалуйста, выберите чат");
      return;
    }

    setIsUploading(true);
    try {
      await chatAPI.uploadFile(ticketId, file);
      toast.success("Файл успешно загружен");
    } catch (error: any) {
      console.error("File upload error:", error);
      toast.error(
        error?.response?.data?.message || "Ошибка при загрузке файла"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageClick = () => {
    imageInputRef.current?.click();
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Faqat rasm fayllarini qabul qilish
      if (file.type.startsWith("image/")) {
        handleFileUpload(file);
      } else {
        toast.error("Пожалуйста, выберите изображение");
      }
    }
    // Input ni tozalash
    e.target.value = "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    // Input ni tozalash
    e.target.value = "";
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border-t px-4 py-3 flex items-center gap-3"
    >
      <button
        type="button"
        className="text-gray-500 hover:text-main-color transition-colors"
      >
        <Smile className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={handleImageClick}
        disabled={isUploading || !ticketId}
        className="text-gray-500 hover:text-main-color transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ImageIcon className="w-5 h-5" />
      </button>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={handleFileClick}
        disabled={isUploading || !ticketId}
        className="text-gray-500 hover:text-main-color transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Paperclip className="w-5 h-5" />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Введите сообщение..."
        className="flex-1 bg-[#F5F7FB] text-title-color border border-gray-200 rounded px-3 py-2 outline-none transition-colors"
      />
      <button
        type="submit"
        disabled={!message.trim() || !ticketId || isUploading}
        className="bg-main-color text-white rounded px-4 py-2 flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="w-4 h-4" />
        <span className="hidden sm:inline">Отправить</span>
      </button>
    </form>
  );
}

export default ChatComposer;
