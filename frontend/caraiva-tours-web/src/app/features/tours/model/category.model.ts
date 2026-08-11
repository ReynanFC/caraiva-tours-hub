export interface Category {
  id: number;
  name: string;
}

export interface CategoryListItem extends Category {
  tourCount: number;
}

export interface CategoryRequest {
  name: string;
}
