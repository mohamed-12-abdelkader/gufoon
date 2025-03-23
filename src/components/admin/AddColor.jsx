import React, { useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";

const AddColor = () => {
    const [color, setColor] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAddColor = async (e) => {
        e.preventDefault();

        if (!color.trim()) {
            toast.error("الرجاء إدخال اسم اللون");
            return;
        }

        try {
            setLoading(true);
            await axios.post(
                "/colors",
                { name: color },
            );

            toast.success("تم إضافة اللون بنجاح");
            setColor(""); // Clear input after success
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "حدث خطأ أثناء إضافة اللون");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h3 className="text-center mb-4">إضافة لون جديد</h3>
            <Form onSubmit={handleAddColor}>
                <Form.Group className="mb-3">
                    <Form.Label>اسم اللون</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="أدخل اسم اللون"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                    />
                </Form.Group>

                <div className="text-center">
                    <Button type="submit" variant="primary" disabled={loading} className="w-50">
                        {loading ? <Spinner animation="border" size="sm" /> : "إضافة اللون"}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default AddColor;
