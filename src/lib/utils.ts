export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 2,
  }).format(price);
}

export function buildStarClasses(fullRating: boolean, count: number = 5): string[] {
  return Array.from({ length: count }, (_, i) => {
    if (fullRating) return 'fas fa-star';
    return i < count - 1 ? 'fas fa-star' : 'fas fa-star-half-alt';
  });
}
