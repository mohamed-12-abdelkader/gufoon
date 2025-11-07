import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useToast,
  Spinner,
  HStack,
} from "@chakra-ui/react";
import axios from "axios";
import EditCouponModal from "../modal/EditCouponModal";
import baseUrl from "../../api/baseUrl";

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toast = useToast();

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await baseUrl.get("api/coupons", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCoupons(res.data);
    } catch (err) {
      toast({
        title: "خطأ",
        description: "فشل تحميل الكوبونات",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await baseUrl.delete(`api/coupons/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast({ title: "تم حذف الكوبون", status: "success" });
      fetchCoupons();
    } catch {
      toast({ title: "خطأ أثناء حذف الكوبون", status: "error" });
    }
  };

  return (
    <Box p={6} maxW="1000px" mx="auto" dir="rtl">
      <HStack justify="space-between" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">
          إدارة الكوبونات
        </Text>
        <Button
          colorScheme="blue"
          onClick={() => {
            setEditingCoupon(null);
            setIsModalOpen(true);
          }}
        >
          كوبون جديد
        </Button>
      </HStack>

      {loading ? (
        <Spinner size="xl" />
      ) : (
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>الرمز</Th>
                <Th>نسبة الخصم</Th>
                <Th>الحد الأقصى للخصم</Th>
                <Th>تاريخ الانتهاء</Th>
                <Th>الإجراءات</Th>
              </Tr>
            </Thead>
            <Tbody>
              {coupons.map((coupon) => (
                <Tr key={coupon.id}>
                  <Td>{coupon.code}</Td>
                  <Td>{coupon.discountPercentage}%</Td>
                  <Td>{coupon.maxDiscountAmount ?? "-"}</Td>
                  <Td>{new Date(coupon.expiryDate).toLocaleDateString()}</Td>
                  <Td>
                    <HStack>
                      <Button
                        size="sm"
                        onClick={() => {
                          setEditingCoupon(coupon);
                          setIsModalOpen(true);
                        }}
                      >
                        تعديل
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDelete(coupon.id)}
                      >
                        حذف
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      <EditCouponModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        coupon={editingCoupon}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchCoupons();
        }}
      />
    </Box>
  );
};

export default Coupons;
