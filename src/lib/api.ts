import axios from "@/lib/axios";
import type { LoginResponse } from "@/types/auth";
import type { TicketsResponse, SingleTicketResponse } from "@/types/chat";
import type { GetProfileResponse } from "@/types/profile";

// Auth API - Exact match from api-data.json
export const authAPI = {
  login: (data: { login: string; password: string }): Promise<LoginResponse> =>
    axios.post<LoginResponse>("/chat/auth/login", data).then((res) => res.data),
  logout: () => axios.post("/logout"),
  getProfile: (): Promise<GetProfileResponse> =>
    axios.get<GetProfileResponse>("/chat/auth/me").then((res) => res.data),
};

export const chatAPI = {
  getTickets: (size?: number, page?: number): Promise<TicketsResponse> => {
    const params: {
      size?: number;
      page?: number;
    } = {};

    params.size = size;
    params.page = page;

    return axios
      .get<TicketsResponse>("/chat/operator/user/tickets", { params })
      .then((res) => res.data);
  },
  getSingleTicket: (
    ticketId?: number | null
  ): Promise<SingleTicketResponse> => {
    return axios
      .get<SingleTicketResponse>(`/chat/operator/ticket/${ticketId}/chats`)
      .then((res) => res.data);
  },
  uploadFile: (ticketId: number, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append("ticket_id", ticketId.toString());
    formData.append("file", file);
    return axios.post("/chat/client/upload", formData).then((res) => res.data);
  },
};
