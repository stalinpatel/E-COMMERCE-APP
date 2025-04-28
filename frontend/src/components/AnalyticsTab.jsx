import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { Users, Package, ShoppingCart, IndianRupee } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const AnalyticsTab = () => {
  const [analyticsData, setAnalyticsData] = useState({
    users: 0,
    products: 0,
    totalSales: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [dailySalesData, setDailySalesData] = useState([]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await axios.get("/analytics");
        setAnalyticsData(response.data.analyticsData);
        setDailySalesData(response.data.dailySalesData);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (isLoading) {
    return <div className="text-center text-emerald-400">Loading Analytics...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <AnalyticsCard title="Total Users" value={analyticsData.users.toLocaleString()} icon={Users} color="from-cyan-500 to-cyan-700" />
        <AnalyticsCard title="Total Products" value={analyticsData.products.toLocaleString()} icon={Package} color="from-violet-500 to-indigo-700" />
        <AnalyticsCard title="Total Sales" value={analyticsData.totalSales.toLocaleString()} icon={ShoppingCart} color="from-emerald-500 to-emerald-700" />
        <AnalyticsCard title="Total Revenue" value={`₹${analyticsData.totalRevenue.toLocaleString()}`} icon={IndianRupee} color="from-lime-500 to-lime-700" />
      </div>

      <motion.div
        className="bg-gray-900 rounded-2xl p-8 shadow-2xl ring-1 ring-emerald-700/20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-emerald-400 mb-6">Daily Sales Overview 📈</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={dailySalesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis yAxisId="left" stroke="#94a3b8" />
            <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: "#1f2937", borderColor: "#10b981", color: "#f9fafb" }} />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="sales"
              stroke="#22c55e"
              activeDot={{ r: 8 }}
              name="Sales"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              activeDot={{ r: 8 }}
              name="Revenue"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default AnalyticsTab;

const AnalyticsCard = ({ title, value, icon: Icon, color }) => (
  <motion.div
    className="relative overflow-hidden rounded-2xl shadow-xl"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <div className={`p-6 bg-gradient-to-br ${color} h-full`}>
      <div className="relative z-10">
        <p className="text-gray-300 text-xs font-semibold uppercase">{title}</p>
        <h3 className="text-white text-2xl font-bold mt-2">{value}</h3>
      </div>
      <div className="absolute right-4 bottom-4 opacity-30">
        <Icon className="w-20 h-20" />
      </div>
    </div>
  </motion.div>
);
