export type Message = {
  id: number;
  is_answer: number;
  formatted_time: string;
  date: string;
  base_url: string;
  author: string;
  content_type: string;
  is_ready: boolean;
  message: {
    content: string;
  };
};

export type Ticket = {
  id: number;
  user_name: string;
  color: string;
  last_message: {
    content: string;
  };
  user_id: number;
  last_request_user: string;
  push: number;
  formatted_date: string;
  status: string;
  request_close: boolean;
  is_online: boolean;
};
export type NotificationTicket = {
  id: number;
  ticket_id: number;
  last_message: {
    content: string;
  };
  push: number;
  date: string;
};

export type TicketsResponse = {
  tickets: Ticket[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
};
export type SingleTicketResponse = {
  user: {
    id: number;
    chat_id: string;
    name: string;
    phone: string;
    date: string;
    last_message: string | null;
    is_block: boolean;
    is_online: boolean;
    push: number;
  };
  ticket: Ticket;
  messages: Message[];
};
