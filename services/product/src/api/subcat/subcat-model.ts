export type SubCatCreateType = {
  title: string;
  category_id: number;
  description?: string;
};

export type SubCatUpdateType = {
  title?: string;
  category_id?: number;
  description?: string;
};
