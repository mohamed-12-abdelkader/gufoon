import React from "react";
import {
    BrowserRouter as Router,
    Navigate,
    useParams,
} from "react-router-dom";

export default function ProductsCategories() {
    const { name } = useParams();
    <p>{name}</p>
};
