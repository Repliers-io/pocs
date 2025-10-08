/**
 * Format price for map price bubbles based on property type
 */
export const formatMapPrice = (price: number, type: string): string => {
  const formatToMaxDigits = (value: number, suffix: string): string => {
    if (value >= 100) {
      // 3 digits: 189K, 999K, 234M
      return `${Math.round(value)}${suffix}`;
    } else if (value >= 10) {
      // 2 digits + 1 decimal: 39.9K, 12.5M
      return `${Math.round(value * 10) / 10}${suffix}`;
    } else {
      // 1 digit + 2 decimals: 6.56K, 1.45M
      return `${Math.round(value * 100) / 100}${suffix}`;
    }
  };

  if (type === "Lease") {
    // Lease properties - always show as K
    if (price >= 1000) {
      const thousands = price / 1000;
      return formatToMaxDigits(thousands, 'K');
    }
    return Math.round(price).toString(); // Round small values to whole numbers
  } else {
    // Sale properties - prefer M over K when >= 1M, and handle edge cases better
    if (price >= 999500) { // Treat 999.5K+ as 1M for better UX
      const millions = price / 1000000;
      return formatToMaxDigits(millions, 'M');
    } else if (price >= 1000) {
      const thousands = price / 1000;
      return formatToMaxDigits(thousands, 'K');
    }
    return Math.round(price).toString(); // Round small values to whole numbers
  }
};

/**
 * Determine the background color for a price bubble based on status and listing type
 */
const getPriceBubbleColor = (status?: string, lastStatus?: string, type?: string): string => {
  // Check if this is a sold property (status='U' and lastStatus='Sld' or 'Sc')
  if (status === 'U' && (lastStatus === 'Sld' || lastStatus === 'Sc')) {
    return '#8b7fa8'; // Purple/gray for sold properties
  }

  // Check if this is an unavailable property (status='U' but not sold)
  if (status === 'U') {
    return '#f59e0b'; // Orange for unavailable properties
  }

  // Active listings (status='A' or default) - use listing type
  const isLease = type === "Lease";
  return isLease ? '#a855f7' : '#22c55e'; // Purple for lease, brighter green for sale
};

/**
 * Create a price bubble HTML element for map markers
 */
export const createPriceBubble = (
  price: number,
  type: string,
  status?: string,
  lastStatus?: string
): HTMLElement => {
  const formattedPrice = formatMapPrice(price, type);
  const backgroundColor = getPriceBubbleColor(status, lastStatus, type);

  const bubble = document.createElement('div');
  bubble.style.cssText = `
    background-color: ${backgroundColor};
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    white-space: nowrap;
    pointer-events: auto;
    cursor: pointer;
  `;
  bubble.textContent = formattedPrice;

  return bubble;
};
