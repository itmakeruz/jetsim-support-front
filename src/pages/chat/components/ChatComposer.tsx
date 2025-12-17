import { Image as ImageIcon, Paperclip, Send, Smile } from "lucide-react";

function ChatComposer() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
        className="text-gray-500 hover:text-main-color transition-colors"
      >
        <ImageIcon className="w-5 h-5" />
      </button>
      <button
        type="button"
        className="text-gray-500 hover:text-main-color transition-colors"
      >
        <Paperclip className="w-5 h-5" />
      </button>
      <input
        type="text"
        placeholder="Введите сообщение..."
        className="flex-1 bg-[#F5F7FB] border border-gray-200 rounded px-3 py-2 outline-none transition-colors"
      />
      <button
        type="submit"
        className="bg-main-color text-white rounded px-4 py-2 flex items-center gap-2 hover:opacity-90 transition-opacity"
      >
        <Send className="w-4 h-4" />
        <span className="hidden sm:inline">Отправить</span>
      </button>
    </form>
  );
}

export default ChatComposer;
