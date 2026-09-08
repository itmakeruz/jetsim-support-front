import { useRef, useState, useEffect, useCallback } from "react";
import { Image as ImageIcon, Paperclip, Send, Smile, X } from "lucide-react";
import { sendMessage } from "@/lib/socket";
import { chatAPI } from "@/lib/api";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import type { Message } from "@/types/chat";

interface ChatComposerProps {
  ticketId: number | null;
  replyMessage?: Message | null;
  onReplyCancel?: () => void;
  editMessage?: Message | null;
  onEditCancel?: () => void;
  onEditSubmit?: (messageId: number, content: string) => Promise<boolean>;
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
  const [isSending, setIsSending] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [retryFile, setRetryFile] = useState<File | null>(null);
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

  // A draft from the previous ticket must never be sent after a quick chat switch.
  useEffect(() => {
    setMessage("");
  }, [ticketId]);

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (message.trim() && ticketId && !isSending) {
      // Edit mode
      if (editMessage && onEditSubmit) {
        const wasEdited = await onEditSubmit(editMessage.id, message.trim());
        if (wasEdited) {
          setMessage("");
          onEditCancel?.();
        }
        return;
      }
      const text = message.trim();
      const targetTicketId = ticketId;
      setIsSending(true);
      const result = await sendMessage(targetTicketId, text, replyMessage?.id);
      setIsSending(false);
      if (!result.ok) {
        toast.error(result.error?.message || "Xabar yuborilmadi. Qayta urinib ko'ring.");
        return;
      }
      // Clear only after the server has accepted the exact ticket/message pair.
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
      setUploadProgress(0);
      await chatAPI.uploadFile(ticketId, file, setUploadProgress);
      toast.success("Файл успешно загружен");
      setRetryFile(null);
      // Tickets va singleTicket ni qayta fetch qilish
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["singleTicket", ticketId.toString()] });
    } catch (error: unknown) {
      console.error("File upload error:", error);
      setRetryFile(file);
      const responseMessage = (error as AxiosError<{ message?: string }>).response?.data?.message;
      toast.error(
        responseMessage || "Ошибка при загрузке файла"
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
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
    <div className="bg-card border-t border-border shrink-0">
      {/* Edit preview */}
      {editMessage && (
        <div className="px-4 py-2 bg-blue-50 dark:bg-blue-500/15 border-b border-border flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400">
                Редактирование:
              </span>
            </div>
            <p className="text-[12px] text-foreground line-clamp-1">
              {editMessage.message.content}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            className="ml-2 p-1 hover:bg-blue-100 dark:hover:bg-blue-500/25 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-blue-500 dark:text-blue-400" />
          </button>
        </div>
      )}

      {/* Reply preview */}
      {replyMessage && !editMessage && (
        <div className="px-4 py-2 bg-muted/60 border-b border-border flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-medium text-muted-foreground">
                Reply to:
              </span>
            </div>
            <p className="text-[12px] text-foreground line-clamp-1">
              {replyMessage.message.content}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            className="ml-2 p-1 hover:bg-accent rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="px-4 py-3 flex items-end gap-3"
      >
        <button
          type="button"
          className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <Smile className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={handleImageClick}
          disabled={isUploading || !ticketId || !!editMessage}
          className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          className="flex-1 bg-muted/50 dark:bg-muted/40 text-foreground placeholder:text-muted-foreground border border-border rounded px-3 py-2 outline-none transition-colors resize-none min-h-[40px] max-h-[150px] overflow-y-auto scrollbar-none focus-visible:ring-2 focus-visible:ring-ring/50"
        />
        <button
          type="submit"
          disabled={!message.trim() || !ticketId || isUploading || isSending}
          className="bg-main-color text-white rounded px-4 py-2 flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">
            {isSending ? "Yuborilmoqda..." : editMessage ? "Сохранить" : "Отправить"}
          </span>
        </button>
      </form>

      {(isUploading || retryFile) && (
        <div className="px-4 pb-3 text-xs text-muted-foreground flex items-center gap-3">
          {isUploading ? <span>Fayl yuklanmoqda: {uploadProgress}%</span> : <span>Fayl yuborilmadi: {retryFile?.name}</span>}
          {retryFile && !isUploading && (
            <button type="button" onClick={() => handleFileUpload(retryFile)} className="text-blue-600 hover:underline">
              Qayta yuborish
            </button>
          )}
        </div>
      )}

      {/* Pasted image confirmation modal */}
      {pastedImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-popover text-popover-foreground rounded-lg p-6 max-w-md w-full mx-4 shadow-xl border border-border">
            <h3 className="text-lg font-semibold mb-4">Rasmni yuborish</h3>
            <div className="mb-4 rounded-lg overflow-hidden border border-border">
              <img
                src={pastedImage.preview}
                alt="Pasted preview"
                className="w-full h-auto max-h-[300px] object-contain bg-muted"
              />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Bu rasmni yuborishni xohlaysizmi?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handlePastedImageCancel}
                className="px-4 py-2 text-foreground bg-muted hover:bg-accent rounded-lg transition-colors"
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
