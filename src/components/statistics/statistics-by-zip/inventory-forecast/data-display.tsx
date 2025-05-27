import React from "react";

interface AIInventoryForecastProps {
  zipCode: string;
  riskLevel: string;
  location: string;
  averagePrice: number;
  priceChange: number;
  currentInventory: number;
  daysOnMarket: number;
  inventoryForecast: {
    month: string;
    value: number;
  }[];
  sixMonthAverage: number;
  sixMonthChange: number;
  yearOverYearAverage: number;
  yearOverYearChange: number;
}

const AIInventoryForecast: React.FC<AIInventoryForecastProps> = ({
  zipCode,
  riskLevel,
  location,
  averagePrice,
  priceChange,
  currentInventory,
  daysOnMarket,
  inventoryForecast,
  sixMonthAverage,
  sixMonthChange,
  yearOverYearAverage,
  yearOverYearChange,
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow border border-gray-200">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-full">
              {zipCode}
            </span>
            <span className="text-sm bg-yellow-100 text-yellow-700 font-semibold px-3 py-1 rounded-full">
              {riskLevel}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{location}</h2>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-gray-500">Last 30 Days Average Price</p>
              <p className="text-xl font-semibold text-gray-900">
                ${averagePrice.toLocaleString()}
              </p>
              <p
                className={`text-sm ${
                  priceChange >= 0 ? "text-green-600" : "text-red-600"
                } mt-1`}
              >
                {priceChange >= 0 ? "↑" : "↓"} {Math.abs(priceChange)}%{" "}
                {priceChange >= 0 ? "up" : "down"} vs previous month
              </p>
            </div>

            <div>
              <p className="text-gray-500">6-Month Average Price</p>
              <p className="text-xl font-semibold text-gray-900">
                ${sixMonthAverage.toLocaleString()}
              </p>
              <p
                className={`text-sm ${
                  sixMonthChange >= 0 ? "text-green-600" : "text-red-600"
                } mt-1`}
              >
                {sixMonthChange >= 0 ? "↑" : "↓"} {Math.abs(sixMonthChange)}%{" "}
                {sixMonthChange >= 0 ? "up" : "down"} vs previous 6 months
              </p>
            </div>

            <div>
              <p className="text-gray-500">Year Over Year</p>
              <p className="text-xl font-semibold text-gray-900">
                ${yearOverYearAverage.toLocaleString()}
              </p>
              <p
                className={`text-sm ${
                  yearOverYearChange >= 0 ? "text-green-600" : "text-red-600"
                } mt-1`}
              >
                {yearOverYearChange >= 0 ? "↑" : "↓"}{" "}
                {Math.abs(yearOverYearChange)}%{" "}
                {yearOverYearChange >= 0 ? "up" : "down"} vs last year
              </p>
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="text-gray-500">Current Inventory</p>
          <p className="text-2xl font-bold text-gray-900">
            {currentInventory} homes
          </p>
        </div>
      </div>

      {/* TODO: Add days on market */}
      {/* <div className="mt-6 flex flex-col sm:flex-row justify-between gap-6">
        <div>
          <p className="text-gray-500">Days on Market</p>
          <p className="text-xl font-bold text-gray-900">{daysOnMarket} days</p>
          <p className="text-sm text-gray-500">median time to sell</p>
        </div>
      </div> */}

      <hr className="my-6 border-gray-200" />

      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">
          3-Month Inventory Forecast
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {inventoryForecast.map((forecast, index) => (
          <div key={index} className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-500">{forecast.month}</p>
            <p className="text-lg font-semibold text-gray-800">
              {forecast.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIInventoryForecast;
