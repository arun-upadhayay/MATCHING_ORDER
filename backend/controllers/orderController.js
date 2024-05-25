import CompletedOrder from "../models/completedOrder.js";
import BuyerOrder from "../models/buyerOrder.js";
import SellerOrder from "../models/sellerOrder.js";

// get all buyer
export const getAllBuyerOrders = async (req, res) => {
  try {
    const orders = await BuyerOrder.find();
    res.json(orders);
  } catch (error) {
    console.error("Error fetching buyer orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get all seller
export const getAllSellerOrders = async (req, res) => {
  try {
    const orders = await SellerOrder.find();
    res.json(orders);
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add a new buyer order
export const addNewBuyerOrder = async (req, res) => {
  const { buyer_qty, buyer_price } = req.body;
  const newOrder = new BuyerOrder({ buyer_qty, buyer_price });
  await newOrder.save();
  res.sendStatus(201);
};

// Add a new seller order
export const addNewSellerOrder = async (req, res) => {
  const { seller_qty, seller_price } = req.body;
  const newOrder = new SellerOrder({ seller_qty, seller_price });
  await newOrder.save();
  res.sendStatus(201);
};


// this is better code 
export const getAllCompletedOrders = async (req, res) => {
  try {
    const buyerOrders = await BuyerOrder.find();
    const sellerOrders = await SellerOrder.find();

    const matchedOrders = [];
    const completedOrders = [];
    const buyerIdsToDelete = [];
    const sellerIdsToDelete = [];

    for (const buyerOrder of buyerOrders) {
      for (const sellerOrder of sellerOrders) {
        if (buyerOrder.buyer_price === sellerOrder.seller_price) {
          matchedOrders.push({ buyerOrder, sellerOrder });

          const completedOrder = await CompletedOrder.create({
            price: sellerOrder.seller_price,
            qty: sellerOrder.seller_qty,
            sellerOrderId: sellerOrder._id,
            buyerOrderId: buyerOrder._id,
          });

          completedOrders.push(completedOrder);
          buyerIdsToDelete.push(buyerOrder._id);
          sellerIdsToDelete.push(sellerOrder._id);

          const sellerIndex = sellerOrders.findIndex((order) =>
            order._id.equals(sellerOrder._id)
          );
          if (sellerIndex > -1) {
            sellerOrders.splice(sellerIndex, 1);
          }

          break; // Move to the next buyerOrder
        }
      }
      // console.log(
      //   "All Matching Buyer Orders:",
      //   matchedOrders.map((order) => order.buyerOrder)
      // );
    }

    // Deleting matched orders from the database
    if (buyerIdsToDelete.length > 0) {
      await BuyerOrder.deleteMany({ _id: { $in: buyerIdsToDelete } });
    }
    if (sellerIdsToDelete.length > 0) {
      await SellerOrder.deleteMany({ _id: { $in: sellerIdsToDelete } });
    }

    console.log("Completed Orders Array:", completedOrders);
    try {
      const completedMatchedOrders = await CompletedOrder.find();
      res.status(200).json({
        message: "Matching orders moved to Completed Order Table and removed from Pending Orders",
        completedMatchedOrders 
      });
    } catch (error) {
      console.error("Error fetching completed orders:", error);
      res.status(500).json({ message: "Internal server error" });
    }

  } catch (error) {
    console.error(
      "Error moving matching orders to Completed Order Table:",
      error
    );
    res.status(500).json({ message: "Internal server error" });
  }
};



// export const getAllCompletedOrders = async (req, res) => {
//   try {
//     const buyerOrders = await BuyerOrder.find();
//     const sellerOrders = await SellerOrder.find();

//     const matchedOrders = [];
//     const completedOrders = [];
//     const buyerIdsToDelete = [];
//     const sellerIdsToDelete = [];

//     for (const buyerOrder of buyerOrders) {
//       for (const sellerOrder of sellerOrders) {
//         if (buyerOrder.buyer_price === sellerOrder.seller_price) {
//           matchedOrders.push({ buyerOrder, sellerOrder });

//           const completedOrder = await CompletedOrder.create({
//             price: sellerOrder.seller_price,
//             qty: sellerOrder.seller_qty,
//             sellerOrderId: sellerOrder._id,
//             buyerOrderId: buyerOrder._id,
//           });

//           completedOrders.push(completedOrder);
//           buyerIdsToDelete.push(buyerOrder._id);
//           sellerIdsToDelete.push(sellerOrder._id);

//           const sellerIndex = sellerOrders.findIndex((order) =>
//             order._id.equals(sellerOrder._id)
//           );
//           if (sellerIndex > -1) {
//             sellerOrders.splice(sellerIndex, 1);
//           }

//           break; // Move to the next buyerOrder
//         }
//       }
//     }

//     // Deleting matched orders from the database
//     if (buyerIdsToDelete.length > 0) {
//       await BuyerOrder.deleteMany({ _id: { $in: buyerIdsToDelete } });
//     }
//     if (sellerIdsToDelete.length > 0) {
//       await SellerOrder.deleteMany({ _id: { $in: sellerIdsToDelete } });
//     }

//     console.log("Completed Orders Array:", completedOrders);

//     try {
//       const completedMatchedOrders = await CompletedOrder.find();
//       res.status(200).json({
//         message: "Matching orders moved to Completed Order Table and removed from Pending Orders",
//         completedMatchedOrders 
//       });
//     } catch (error) {
//       console.error("Error fetching completed orders:", error);
//       res.status(500).json({ message: "Internal server error" });
//     }

//   } catch (error) {
//     console.error(
//       "Error moving matching orders to Completed Order Table:",
//       error
//     );
//     res.status(500).json({ message: "Internal server error" });
//   }
// };


