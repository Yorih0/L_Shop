export interface Review {
  id: number,
  userId: number;
  userName:string;
  productId: number;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  date: string;
}