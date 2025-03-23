import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box, Input, Button, VStack, HStack, Text, Spinner
} from "@chakra-ui/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { FiFilter } from "react-icons/fi";

const SalesDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [periodFilter, setPeriodFilter] = useState("monthly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSalesData();
  }, [statusFilter, periodFilter, startDate, endDate]);

  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const summaryRes = await axios.get("/sales/summary", {
        params: { status: statusFilter, startDate, endDate },
      });
      setSummary(summaryRes.data);

      const trendsRes = await axios.get("/sales/trends", {
        params: { period: periodFilter, status: statusFilter, startDate, endDate },
      });
      setTrends(trendsRes.data);
    } catch (error) {
      console.error("Error fetching data", error.response.data.stack);
    }
    setLoading(false);
  };

  return (
    <Box p={6} maxW="1200px" mx="auto" dir="rtl">
      <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={6}>
        لوحة تحكم المبيعات
      </Text>

      {/* ✅ Filters */}
      <VStack spacing={4} mb={6} align="stretch">
        <HStack spacing={4} align="center">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "16px",
              minWidth: "180px",
            }}
          >
            <option value="">جميع الطلبات</option>
            <option value="Delivered">تم التوصيل</option>
            <option value="Pending">قيد الانتظار</option>
          </select>

          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "16px",
              minWidth: "180px",
            }}
          >
            <option value="daily">يومي</option>
            <option value="monthly">شهري</option>
            <option value="yearly">سنوي</option>
          </select>
        </HStack>

        <div className="flex gap-4">
          <Input type="date" placeholder="تاريخ البدء" onChange={(e) => setStartDate(e.target.value)} />
          <Input type="date" placeholder="تاريخ الانتهاء" onChange={(e) => setEndDate(e.target.value)} />
          <button className="bg-blue-700 rounded-md font-bold text-white px-3 py-1 text-nowrap" onClick={fetchSalesData}>
            تطبيق الفلاتر
          </button>
        </div>
      </VStack>

      {/* ✅ Sales Summary Cards */}
      {loading ? (
        <Spinner size="xl" />
      ) : summary && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <HStack spacing={4} mb={6} justifyContent="center" wrap="wrap">
            <Box p={4} bg="gray.100" borderRadius="md" minW="200px">
              <Text fontSize="lg" fontWeight="bold">إجمالي الإيرادات</Text>
              <Text fontSize="xl">${summary.totalRevenue}</Text>
            </Box>
            <Box p={4} bg="gray.100" borderRadius="md" minW="200px">
              <Text fontSize="lg" fontWeight="bold">إجمالي الطلبات</Text>
              <Text fontSize="xl">{summary.totalOrders}</Text>
            </Box>
            <Box p={4} bg="gray.100" borderRadius="md" minW="200px">
              <Text fontSize="lg" fontWeight="bold">إجمالي العملاء</Text>
              <Text fontSize="xl">{summary.totalCustomers}</Text>
            </Box>
            <Box p={4} bg="gray.100" borderRadius="md" minW="200px">
              <Text fontSize="lg" fontWeight="bold">متوسط قيمة الطلب</Text>
              <Text fontSize="xl">${summary.averageOrderValue}</Text>
            </Box>
          </HStack>
        </motion.div>
      )}

      {/* ✅ Sales Trends Chart */}
      <Text fontSize="lg" fontWeight="bold" mb={4}>اتجاهات المبيعات</Text>
      {loading ? (
        <p className="text-center">جار التحميل...</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={trends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} name="الإيرادات" />
            <Line type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={2} name="عدد الطلبات" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default SalesDashboard;
