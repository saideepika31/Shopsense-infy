import React, { useState, useEffect } from "react";
import "./Products.css";
import AnimatedBackground from "../Components/AnimatedBackground";

function Products() {

    const [products, setProducts] = useState([]);

    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [category, setCategory] = useState("");

    useEffect(() => {

        fetchProducts();

    }, []);

    const fetchProducts = async () => {

        try {

            const response = await fetch("http://127.0.0.1:8000/vendor/products");

            const data = await response.json();

            if (response.ok) {

                setProducts(data);

            }

        } catch (error) {

            console.log(error);

        }

    };

    const addProduct = async () => {

        if (!productName || !price || !quantity || !category) {

            alert("Please fill all fields");
            return;

        }

        const response = await fetch("http://127.0.0.1:8000/vendor/product", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                product_name: productName,
                description: description,
                price: Number(price),
                quantity: Number(quantity),
                category: category,
                vendor_id: 1

            })

        });

        if (response.ok) {

            alert("Product Added Successfully!");

            setProductName("");
            setDescription("");
            setPrice("");
            setQuantity("");
            setCategory("");

            fetchProducts();

        } else {

            alert("Failed to add product");

        }

    };

    return (

        <>
            <AnimatedBackground />

            <div className="products-page">

                <h1>📦 Products</h1>

                <div className="product-form">

                    <input
                        type="text"
                        placeholder="Product Name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <input
                        type="number"
                        placeholder="Price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />

                    <input
                        type="number"
                        placeholder="Quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />

                    <button onClick={addProduct}>
                        + Add Product
                    </button>

                </div>

                <table>

                    <thead>

                        <tr>

                            <th>Name</th>

                            <th>Description</th>

                            <th>Category</th>

                            <th>Price</th>

                            <th>Quantity</th>

                        </tr>

                    </thead>

                    <tbody>

                        {products.map((product) => (

                            <tr key={product.product_id}>

                                <td>{product.product_name}</td>

                                <td>{product.description}</td>

                                <td>{product.category}</td>

                                <td>₹ {product.price}</td>

                                <td>{product.quantity}</td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </>

    );

}

export default Products;