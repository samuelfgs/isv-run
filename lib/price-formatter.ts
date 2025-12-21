export const formatPrice = (price: string | number): string => {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numericPrice)) {
    return 'R$ --,--'; // Or throw an error, depending on desired behavior
  }
  return `R$ ${numericPrice.toFixed(2).replace('.', ',')}`;
};