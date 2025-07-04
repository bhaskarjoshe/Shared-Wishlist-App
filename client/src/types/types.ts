export interface WishlistType{
    id: number,
    name: string,
    added_by: string,
    created_at: string
}

export interface ProductType {
  id: number;
  name: string;
  price: number;
  imageurl: string;
  created_at: string;
  added_by: string;
}