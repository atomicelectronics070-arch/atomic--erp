
export type UserRole = 'ADMIN' | 'SALESPERSON' | 'MANAGEMENT' | 'AFILIADO' | 'DISTRIBUIDOR' | 'CONSUMIDOR' | 'CLIENTE' | 'CURSOS';

export const DISCOUNTS = {
    SALESPERSON: 0.20, // Vendedor: 20%
    AFILIADO: 0.15,    // Afiliado: 15%
    CONSUMIDOR: 0,      // Consumidor: 0%
} as const;

/**
 * Calculates the discounted price based on the user role.
 * @param basePrice The original price of the product.
 * @param role The role of the authenticated user.
 * @returns The final price after applying the corresponding discount.
 */
export function calculateDiscountedPrice(basePrice: number, role?: string | null): number {
    if (!role) return basePrice;
    
    const upperRole = role.toUpperCase();
    
    if (upperRole === 'SALESPERSON') {
        return basePrice * (1 - DISCOUNTS.SALESPERSON);
    }
    
    if (upperRole === 'AFILIADO') {
        return basePrice * (1 - DISCOUNTS.AFILIADO);
    }
    
    return basePrice;
}

/**
 * Formats a number as currency.
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(amount);
}
