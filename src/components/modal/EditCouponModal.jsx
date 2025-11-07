import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  FormControl,
  FormLabel,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import baseUrl from "../../api/baseUrl";

const EditCouponModal = ({ isOpen, onClose, coupon, onSuccess }) => {
  const [form, setForm] = useState({
    code: "",
    discountPercentage: "",
    maxDiscountAmount: "",
    expiryDate: "",
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (coupon) {
      setForm({
        code: coupon.code || "",
        discountPercentage: coupon.discountPercentage || "",
        maxDiscountAmount: coupon.maxDiscountAmount || "",
        expiryDate: coupon.expiryDate?.slice(0, 10) || "",
      });
    } else {
      setForm({
        code: "",
        discountPercentage: "",
        maxDiscountAmount: "",
        expiryDate: "",
      });
    }
  }, [coupon]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        ...form,
        discountPercentage: Number(form.discountPercentage),
        maxDiscountAmount: form.maxDiscountAmount
          ? Number(form.maxDiscountAmount)
          : null,
        expiryDate: new Date(form.expiryDate).toISOString(),
      };

      const token = localStorage.getItem("token");
      if (coupon?.id) {
        await baseUrl.put(`api/coupons/${coupon.id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast({ title: "تم التحديث", status: "success" });
      } else {
        await baseUrl.post("api/coupons", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast({ title: "تمت الإضافة", status: "success" });
      }

      onSuccess();
    } catch (err) {
      toast({ title: "خطأ", description: "تحقق من الحقول", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent dir="rtl">
        <ModalHeader>{coupon ? "تعديل القسيمة" : "إضافة كوبون"}</ModalHeader>
        <ModalCloseButton position="absolute" right="auto" left='4' top="4" />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>رمز الكوبون</FormLabel>
              <Input name="code" value={form.code} onChange={handleChange} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>نسبة الخصم</FormLabel>
              <Input
                type="number"
                name="discountPercentage"
                value={form.discountPercentage}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>أقصى خصم (اختياري)</FormLabel>
              <Input
                type="number"
                name="maxDiscountAmount"
                value={form.maxDiscountAmount}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>تاريخ الانتهاء</FormLabel>
              <Input
                type="date"
                name="expiryDate"
                value={form.expiryDate}
                onChange={handleChange}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose} mr={3}>
            إلغاء
          </Button>
          <Button colorScheme="blue" onClick={handleSave} isLoading={loading}>
            {coupon ? "تحديث" : "إضافة"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditCouponModal;
