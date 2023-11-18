interface IProduct {
  id?: number;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  categories?: number[];
}

export default IProduct;
