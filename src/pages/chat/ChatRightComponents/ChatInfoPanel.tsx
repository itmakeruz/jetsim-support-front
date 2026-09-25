import { Check, Copy, X } from "lucide-react";
import { useState } from "react";
import UserAvatar from "@/components/UserAvatar";
import type { Ticket, User } from "@/types/chat";

interface ChatInfoPanelProps {
  user: User;
  ticket: Ticket;
  onClose: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  active: "Активен",
  answered: "Отвечен",
  awaiting: "Ожидает",
  expired: "Истёк",
  closed: "Закрыт",
  success: "Завершён",
};

const CopyValue = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard недоступен вне https — молча пропускаем
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Скопировать"
      className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-600" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
};

const Row = ({
  label,
  value,
  copyable,
  href,
}: {
  label: string;
  value?: string | null;
  copyable?: boolean;
  href?: string;
}) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
      {label}
    </span>
    <div className="flex items-center gap-1">
      {value ? (
        href ? (
          <a href={href} className="text-[14px] text-blue-600 hover:underline break-all">
            {value}
          </a>
        ) : (
          <span className="text-[14px] text-foreground break-all">{value}</span>
        )
      ) : (
        <span className="text-[14px] text-muted-foreground">—</span>
      )}
      {value && copyable && <CopyValue value={value} />}
    </div>
  </div>
);

function ChatInfoPanel({ user, ticket, onClose }: ChatInfoPanelProps) {
  const phone = user?.phone ? `+${user.phone.replace(/^\+/, "")}` : "";

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-[15px] font-semibold text-foreground">О клиенте</h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть панель"
          className="rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col items-center gap-2 border-b border-border px-4 py-5">
        <UserAvatar
          size="lg"
          name={user?.name || ""}
          image={user?.user_image ? `${user.base_url}/${user.user_image}` : undefined}
        />
        <p className="text-[16px] font-semibold text-foreground">{user?.name || "—"}</p>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium ${
            user?.is_online
              ? "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400"
              : "bg-muted text-muted-foreground"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              user?.is_online ? "bg-green-500" : "bg-gray-400"
            }`}
          />
          {user?.is_online ? "В сети" : "Не в сети"}
        </span>

        {user?.is_block && (
          <span className="rounded-full bg-red-100 px-2.5 py-1 text-[12px] font-medium text-red-700 dark:bg-red-500/15 dark:text-red-400">
            Заблокирован
          </span>
        )}
      </div>

      <div className="flex flex-col gap-4 border-b border-border px-4 py-4">
        <Row label="Телефон" value={phone} copyable href={phone ? `tel:${phone}` : undefined} />
        <Row label="Chat ID" value={user?.chat_id} copyable />
        <Row label="ID пользователя" value={user?.id ? String(user.id) : null} />
        <Row label="Последняя активность" value={user?.date} />
      </div>

      <div className="flex flex-col gap-4 px-4 py-4">
        <h4 className="text-[13px] font-semibold text-foreground">Обращение</h4>

        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
            Тема
          </span>
          <span
            className="mt-1 inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[12px] font-medium text-white"
            style={{ backgroundColor: ticket?.color || "#64748b" }}
          >
            {(ticket as unknown as { subject?: string })?.subject || "—"}
          </span>
        </div>

        <Row label="Номер обращения" value={ticket?.id ? `#${ticket.id}` : null} />
        <Row
          label="Статус"
          value={ticket?.status ? (STATUS_LABELS[ticket.status] ?? ticket.status) : null}
        />
        <Row label="Создано" value={ticket?.formatted_date} />

        {ticket?.request_close && (
          <span className="w-fit rounded-full bg-orange-100 px-2.5 py-1 text-[12px] font-medium text-orange-700 dark:bg-orange-500/15 dark:text-orange-400">
            Клиент просит закрыть
          </span>
        )}
      </div>
    </div>
  );
}

export default ChatInfoPanel;
