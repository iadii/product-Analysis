import { Product, RecommendationResponse, RecommendationFilters } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    gender?: string;
}): Promise<{ data: Product[]; pagination: { total: number; totalPages: number } }> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.category) searchParams.set('category', params.category);
    if (params?.gender) searchParams.set('gender', params.gender);

    const response = await fetch(`${API_BASE_URL}/products?${searchParams.toString()}`);
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    return response.json();
}

export async function getProductById(id: string): Promise<{ data: Product }> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch product');
    }
    return response.json();
}

export async function getRecommendations(
    productId: string,
    filters?: RecommendationFilters
): Promise<RecommendationResponse> {
    const response = await fetch(`${API_BASE_URL}/recommendations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            productId,
            filters,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to get recommendations');
    }

    return response.json();
}

export async function searchProducts(query: string): Promise<{ data: Product[] }> {
    const response = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
        throw new Error('Failed to search products');
    }
    return response.json();
}

export function formatPrice(price: number, currency: string = 'INR'): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    }).format(price);
}
