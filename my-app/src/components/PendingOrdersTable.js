import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../config/config";
import Loader from "./Loader"; // Import Loader component

const PendingOrdersTable = () => {
  const [pendingBuyer, setPendingBuyer] = useState([]);
  const [pendingSeller, setPendingSeller] = useState([]);
  const [loading, setLoading] = useState(true); // Initialize loading state to true

  useEffect(() => {
    fetchOrders();
  }, [pendingBuyer,pendingSeller]);

  const fetchOrders = async () => {
    try {
      const PendignBuyersResponse = await axios.get(
        `${config.apiUrl}/orders/getAllBuyer`
      );
      const PendignSellerResponse = await axios.get(
        `${config.apiUrl}/orders/getAllSeller`
      );
      setPendingBuyer(PendignBuyersResponse.data);
      setPendingSeller(PendignSellerResponse.data);
      setLoading(false); // Set loading to false when data is fetched



    } catch (error) {
      console.error("Error fetching completed orders:", error);
    }
  };

  

  return (
    <div>
      {loading ? ( // Conditional rendering of Loader component while data is being fetched
        <Loader />
      ) : (
        <div className="overflow-hidden border border-gray-200 rounded-lg shadow-md">
          <h2 className="px-4 py-2 bg-gray-100 border-b border-gray-200 font-semibold text-gray-700">
            Pending Orders
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Buyer Qty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Buyer Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seller Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seller Qty
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingBuyer.map((buyerOrder, index) => {
                  // Get the corresponding seller order for the current buyer order
                  const correspondingSellerOrder = pendingSeller[index] || {}; // Ensure correspondingSellerOrder exists or use an empty object
  
                  return (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      {/* Buyer data */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {buyerOrder.buyer_qty || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {buyerOrder.buyer_price || "-"}
                      </td>
  
                      {/* Seller data */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {correspondingSellerOrder.seller_price || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {correspondingSellerOrder.seller_qty || "-"}
                      </td>
                    </tr>
                  );
                })}
                {/* If there are more seller entries than buyer entries, display remaining seller entries */}
                {pendingSeller
                  .slice(pendingBuyer.length)
                  .map((sellerOrder, index) => (
                    <tr
                      key={pendingBuyer.length + index}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      {/* Empty cells for buyer data */}
                      <td className="px-6 py-4 whitespace-nowrap">-</td>
                      <td className="px-6 py-4 whitespace-nowrap">-</td>
  
                      {/* Seller data */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {sellerOrder.seller_price || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {sellerOrder.seller_qty || "-"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default PendingOrdersTable;
