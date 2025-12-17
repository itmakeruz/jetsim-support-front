export interface CargoType {
  id: string;
  name: {
    uz: string;
    ru: string;
    cyrillic: string;
  } | null;
  description: {
    uz: string;
    ru: string;
    cyrillic: string;
  } | null;
  coefficient: string;
  createdAt?: string;
}
