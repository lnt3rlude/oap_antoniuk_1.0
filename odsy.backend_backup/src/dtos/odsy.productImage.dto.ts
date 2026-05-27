export interface CreateProductImageDto {
    productId: string;
    url: string;
};

export interface ProductImageResponceDto {
    id: string;
    productId: string;
    url: string;
};

export interface UpdateProductImageDto {
    productId?: string;
    url?: string;
};