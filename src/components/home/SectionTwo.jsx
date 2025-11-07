import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { Fade } from "react-awesome-reveal";
import { Link } from "react-router-dom";
import Slider from "../slider/Slider";
import baseUrl from "../../api/baseUrl";

const SectionTwo = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const { data } = await baseUrl.get("/api/categories/sub");
        setSubCategories(data);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategories();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container className="py-2">
     
      <Slider>
        {subCategories.map((cat) => (
          <Link key={cat.id} to={`/categories/${cat.id}`}>
         <div  className="mx-3 text-center">
<img src={cat.cover || "https://via.placeholder.com/300x200?text=No+Image"} style={{borderRadius:"50%"}}  className="w-[100px] border h-[100px]  mx-3" />
   <p>{cat.name}</p>
         </div>
          </Link>
        ))}
      </Slider>
    </Container>
  );
};

export default SectionTwo;
