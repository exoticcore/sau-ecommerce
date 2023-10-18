export type CreateProductType = {
  name: string;
  description: string;
  price: number;
  category_id: number;
};

export type CreateImagesProduct = {
  title?: string;
  url: string;
};

export type CreateColor = {
  title: string;
  description?: string;
  add_price?: number;
};

export type UpdateProductType = {
  name?: string;
  description?: string;
  price?: string;
  category_id?: number;
};
