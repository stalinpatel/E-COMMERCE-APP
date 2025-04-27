import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";

export const getAnalyticsData = async () => {
  //    1= total user ,2-total products ,3- total sales, 4-total revenue
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();
  const salesData = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalSales: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);
  const { totalSales, totalRevenue } = salesData[0] || {
    totalSales: 0,
    totalRevenue: 0,
  };

  return {
    users: totalUsers,
    products: totalProducts,
    totalSales,
    totalRevenue,
  };
};

export const getDailySalesData = async (startDate, endDate) => {
  try {
    const dailySalesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }, // Group by date
          },
          sales: { $sum: 1 }, // Count the number of orders
          revenue: { $sum: "$totalAmount" }, // Sum the total amount
        },
      },
      {
        $sort: { _id: 1 }, // Sort by date in ascending order
      },
    ]);

    const dateArray = getDatesInRange(startDate, endDate);


    // Return data with sales and revenue for each day in the date range
    const result = dateArray.map((date) => {
      const foundData = dailySalesData.find((item) => item._id === date);
      return {
        date,
        sales: foundData?.sales || 0,
        revenue: foundData?.revenue || 0,
      };
    });
    return result;
  } catch (error) {
    console.error("Error fetching daily sales data:", error);
    throw error;
  }
};

const getDatesInRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

// example of dailySalesData
// [
// 	{
// 		_id: "2024-08-18",
// 		sales: 12,
// 		revenue: 1450.75
// 	},
// ]
