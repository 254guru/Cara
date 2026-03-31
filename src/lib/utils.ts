export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function buildStarClasses(fullRating: boolean, count: number = 5): string[] {
  return Array.from({ length: count }, (_, i) => {
    if (fullRating) return 'fas fa-star';
    return i < count - 1 ? 'fas fa-star' : 'fas fa-star-half-alt';
  });
}
