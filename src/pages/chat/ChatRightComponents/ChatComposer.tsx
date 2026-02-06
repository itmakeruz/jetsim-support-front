import { useRef, useState, useEffect, useCallback } from "react";
import { Image as ImageIcon, Paperclip, Send, Smile, X } from "lucide-react";
import { sendMessage } from "@/lib/socket";
import { chatAPI } from "@/lib/api";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import type { Message } from "@/types/chat";

interface ChatComposerProps {
  ticketId: number | null;
  replyMessage?: Message | null;
  onReplyCancel?: () => void;
  editMessage?: Message | null;
  onEditCancel?: () => void;
  onEditSubmit?: (messageId: number, content: string) => void;
}

function ChatComposer({
  ticketId,
  replyMessage,
  onReplyCancel,
  editMessage,
  onEditCancel,
  onEditSubmit,
}: ChatComposerProps) {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [pastedImage, setPastedImage] = useState<{
    file: File;
    preview: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Cleanup pasted image preview on unmount
  useEffect(() => {
    return () => {
      if (pastedImage) {
        URL.revokeObjectURL(pastedImage.preview);
      }
    };
  }, [pastedImage]);

  // Edit mode bo'lganda message'ni set qilish
  useEffect(() => {
    if (editMessage) {
      setMessage(editMessage.message.content);
      setTimeout(() => {
        textareaRef.current?.focus();
        // Cursor ni oxiriga qo'yish
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.value.length;
          textareaRef.current.selectionEnd = textareaRef.current.value.length;
        }
      }, 100);
    }
  }, [editMessage]);

  // Reply qilganda input'ga focus qilish
  useEffect(() => {
    if (replyMessage && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [replyMessage]);

  // Textarea auto-resize
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [message, adjustTextareaHeight]);

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (message.trim() && ticketId) {
      // Edit mode
      if (editMessage && onEditSubmit) {
        onEditSubmit(editMessage.id, message.trim());
        setMessage("");
        onEditCancel?.();
        return;
      }
      // Normal send
      sendMessage(ticketId, message.trim(), replyMessage?.id);
      setMessage("");
      onReplyCancel?.();
    }
  };

  // Keyboard handler - Enter yuborish, Shift+Enter yangi qator
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Ctrl+V paste handler - screenshot uchun (preview ko'rsatish)
  const handlePaste = useCallback(
    (e: ClipboardEvent | React.ClipboardEvent) => {
      // Edit mode'da paste qilmaslik
      if (editMessage) return;
      
      const clipboardData = 'clipboardData' in e ? e.clipboardData : null;
      const items = clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith("image/")) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            // Fayl nomini yaratish
            const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
            const newFile = new File([file], `screenshot-${timestamp}.png`, {
              type: file.type,
            });
            // Preview yaratish
            const preview = URL.createObjectURL(newFile);
            setPastedImage({ file: newFile, preview });
          }
          return;
        }
      }
    },
    [editMessage]
  );

  // Document darajasida paste listener - chat ochiq bo'lsa ishlaydi
  useEffect(() => {
    if (!ticketId) return;

    const handleDocumentPaste = (e: ClipboardEvent) => {
      // Agar input/textarea'da bo'lsa, textarea handler ishlaydi
      const target = e.target as HTMLElement;
      if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
        return;
      }
      handlePaste(e);
    };

    document.addEventListener('paste', handleDocumentPaste);
    return () => {
      document.removeEventListener('paste', handleDocumentPaste);
    };
  }, [ticketId, handlePaste]);

  // Pasted image confirm
  const handlePastedImageConfirm = async () => {
    if (pastedImage) {
      await handleFileUpload(pastedImage.file);
      // Preview URL ni tozalash
      URL.revokeObjectURL(pastedImage.preview);
      setPastedImage(null);
    }
  };

  // Pasted image cancel
  const handlePastedImageCancel = () => {
    if (pastedImage) {
      URL.revokeObjectURL(pastedImage.preview);
      setPastedImage(null);
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
      // Tickets va singleTicket ni qayta fetch qilish
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["singleTicket", ticketId.toString()] });
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

  // Cancel handler (edit yoki reply)
  const handleCancel = () => {
    if (editMessage) {
      onEditCancel?.();
      setMessage("");
    } else if (replyMessage) {
      onReplyCancel?.();
    }
  };

  return (
    <div className="bg-white border-t">
      {/* Edit preview */}
      {editMessage && (
        <div className="px-4 py-2 bg-blue-50 border-b flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-medium text-blue-600">
                Редактирование:
              </span>
            </div>
            <p className="text-[12px] text-gray-700 line-clamp-1">
              {editMessage.message.content}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            className="ml-2 p-1 hover:bg-blue-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-blue-500" />
          </button>
        </div>
      )}

      {/* Reply preview */}
      {replyMessage && !editMessage && (
        <div className="px-4 py-2 bg-gray-50 border-b flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-medium text-gray-600">
                Reply to:
              </span>
            </div>
            <p className="text-[12px] text-gray-700 line-clamp-1">
              {replyMessage.message.content}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            className="ml-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="px-4 py-3 flex items-end gap-3"
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
          disabled={isUploading || !ticketId || !!editMessage}
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
          disabled={isUploading || !ticketId || !!editMessage}
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
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder="Введите сообщение... (Shift+Enter для новой строки)"
          rows={1}
          className="flex-1 bg-[#F5F7FB] text-title-color border border-gray-200 rounded px-3 py-2 outline-none transition-colors resize-none min-h-[40px] max-h-[150px] overflow-y-auto scrollbar-none"
        />
        <button
          type="submit"
          disabled={!message.trim() || !ticketId || isUploading}
          className="bg-main-color text-white rounded px-4 py-2 flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">
            {editMessage ? "Сохранить" : "Отправить"}
          </span>
        </button>
      </form>

      {/* Pasted image confirmation modal */}
      {pastedImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Rasmni yuborish
            </h3>
            <div className="mb-4 rounded-lg overflow-hidden border border-gray-200">
              <img
                src={pastedImage.preview}
                alt="Pasted preview"
                className="w-full h-auto max-h-[300px] object-contain bg-gray-100"
              />
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Bu rasmni yuborishni xohlaysizmi?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handlePastedImageCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={handlePastedImageConfirm}
                disabled={isUploading}
                className="px-4 py-2 text-white bg-main-color hover:opacity-90 rounded-lg transition-colors disabled:opacity-50"
              >
                {isUploading ? "Yuklanmoqda..." : "Yuborish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatComposer;
