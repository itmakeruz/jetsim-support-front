export enum DeliveryStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  FAILED = "FAILED",
}

export interface OrderPhoto {
  id: string;
  url: string;
  originalName: string;
}

export interface OrderPersonBase {
  id: string;
  username: string;
  passport?: string | null;
  pinfl?: string | null;
  tin?: string | null;
  type?: string | null;
  birthDate?: string | null;
}

export interface OrderCustomer extends OrderPersonBase {
  fullName: string;
}

export interface OrderDriver extends OrderPersonBase {
  firstName?: string | null;
  lastName?: string | null;
  patronymicName?: string | null;
  licenseNumber?: number | null;
  experienceYear?: number | null;
  driverStatus?: string | null;
  searchRadiusKm?: number | null;
  createdAt?: string | null;
}

export interface OrderItem {
  id: string;
  customer: OrderCustomer;
  driver: OrderDriver | null;
  deliveryStatus?: DeliveryStatus;
  loadingStatus?: DeliveryStatus;
  pickupDate: string;
  arrivalDate: string;
  weight: number;
  cargoValue: number;
  orderType: string;
  transportType: string;
  senderNumber: string | null;
  recipientNumber: string | null;
  fromPointId: string;
  toPointId: string;
  price: number;
  comment: string | null;
  photos: OrderPhoto[];
  createdAt: string;
  status?: DeliveryStatus; // fallback
}

export interface PaginatedResponse<T> {
  content?: T[]; // generic fallbacks
  items?: T[];
  data?: T[];
  meta?: {
    page: number;
    limit: number;
    totalData: number;
    totalPage: number;
  };
  total?: number; // other backends
  totalElements?: number;
  totalPages?: number;
  page?: number;
  size?: number;
}
