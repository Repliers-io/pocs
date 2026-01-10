import React from 'react';

// Formatting helper functions
const formatPrice = (price) => {
  if (!price) return 'N/A';
  return `$${price.toLocaleString()}`;
};

const formatAddress = (address) => {
  if (!address) return { street: 'Address not available', cityProvince: '' };
  const street = [address.streetNumber, address.streetName, address.streetSuffix]
    .filter(Boolean).join(' ');
  const cityProvince = [address.city, address.province]
    .filter(Boolean).join(', ');
  return { street, cityProvince };
};

const formatDetails = (bedrooms, bathrooms, sqft) => {
  const parts = [];
  if (bedrooms) parts.push(`${bedrooms} bed`);
  if (bathrooms) parts.push(`${bathrooms} bath`);
  if (sqft) parts.push(`${sqft.toLocaleString()} sqft`);
  return parts.join(' • ');
};

// Status badge component
const StatusBadge = ({ status }) => {
  const statusColors = {
    Active: 'bg-green-500',
    Pending: 'bg-yellow-500',
    Sold: 'bg-red-500'
  };

  const bgColor = statusColors[status] || 'bg-gray-500';

  return (
    <div className={`absolute top-2 left-2 ${bgColor} text-white text-xs font-semibold px-2 py-1 rounded`}>
      {status}
    </div>
  );
};

// PropertyCard component
const PropertyCard = ({
  property,
  onClick,
  variant = 'grid'
}) => {
  const { street, cityProvince } = formatAddress(property.address);
  const details = formatDetails(property.bedrooms, property.bathrooms, property.sqft);
  const imageUrl = property.images && property.images.length > 0 ? property.images[0] : null;

  const [imageError, setImageError] = React.useState(false);

  const handleCardClick = () => {
    if (onClick) {
      onClick(property);
    }
  };

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer h-[160px] flex overflow-hidden"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Image Section - 40% width */}
      <div className="relative w-[40%] flex-shrink-0">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={`Property at ${street}`}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-5xl">🏠</span>
          </div>
        )}
        <StatusBadge status={property.status} />
      </div>

      {/* Content Section - 60% width */}
      <div className="flex-1 p-3 flex flex-col justify-between overflow-hidden">
        {/* Price */}
        <div className="font-bold text-lg text-gray-900">
          {formatPrice(property.listPrice)}
        </div>

        {/* Address */}
        <div className="text-sm text-gray-700">
          <div className="truncate">{street}</div>
          <div className="truncate text-gray-500">{cityProvince}</div>
        </div>

        {/* Details Row */}
        <div className="text-xs text-gray-600 flex items-center gap-1">
          <span>🛏️</span>
          <span>{details}</span>
        </div>

        {/* Property Type and Days on Market */}
        <div className="flex items-center justify-between text-xs">
          <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 rounded font-medium">
            {property.propertyType}
          </span>
          {property.daysOnMarket !== undefined && (
            <span className="text-gray-500">
              {property.daysOnMarket} {property.daysOnMarket === 1 ? 'day' : 'days'} on market
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
