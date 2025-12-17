interface Branch {
  id: number;
  name: string;
  address: string;
}

interface SelectOption {
  id: number | string;
  name: string;
  address?: string;
}

interface SelectConfigs {
  [key: string]: SelectOption[];
}

const selectConfigs: SelectConfigs = {
  "/": [
    { id: 1, name: "Склад 1" },
    { id: 2, name: "Склад 2" },
  ],
  "/products": [
    { id: "1", name: "Товар 1" },
    { id: "2", name: "Товар 2" },
  ],
  "/warehouse/purchase": JSON.parse(
    localStorage.getItem("branches") || "null"
  )?.map((item: Branch) => {
    return { ...item, name: `Филиал ${item.name.toLowerCase()}` };
  }) || [
    {
      id: 1,
      name: "Ташкент",
      address: "ул. Буюк Ипак Йули, 60, офис 87",
    },
    {
      id: 2,
      name: "самарканд",
      address: "м-в Юнусабад-8, 1, офис 1",
    },
  ],
  "/warehouse/arrival": JSON.parse(
    localStorage.getItem("branches") || "null"
  )?.map((item: Branch) => {
    return { ...item, name: `Филиал ${item.name.toLowerCase()}` };
  }) || [
    {
      id: 1,
      name: "Ташкент",
      address: "ул. Буюк Ипак Йули, 60, офис 87",
    },
    {
      id: 2,
      name: "самарканд",
      address: "м-в Юнусабад-8, 1, офис 1",
    },
  ],
};

export default selectConfigs;
export type { SelectOption, Branch, SelectConfigs };
