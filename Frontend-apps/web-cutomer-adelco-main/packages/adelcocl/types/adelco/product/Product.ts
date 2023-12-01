export type Product = {
    id: string;
    brandName: string;
    description: string;
    imageUrl: string;
    price: string;
    discountPrice?: string;
    discount?: string;
    unitPrice: string;
    unitSize: string;
    packUnits: number;
    showPrices: boolean;
    outOfStock: boolean;
    slug: string;
    sku: string;
    quantity?: number;
}