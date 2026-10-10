import React, { useEffect, useState } from "react";
import "./Products.css";
import AnimatedBackground from "../Components/AnimatedBackground";
import { useNavigate } from "react-router-dom";

function Products() {

    const navigate = useNavigate();

    // ==========================================
    // STATE
    // ==========================================

    const [products, setProducts] = useState([]);

    const [form, setForm] = useState({
        product_name: "",
        description: "",
        price: "",
        quantity: "",
        category: ""
    });

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);


    // ==========================================
    // GET VENDOR ID
    // ==========================================

    const getVendorId = () => {

        return localStorage.getItem("vendor_id");

    };


    // ==========================================
    // LOAD PRODUCTS
    // ==========================================

    useEffect(() => {

        fetchProducts();

    }, []);


    // ==========================================
    // FETCH PRODUCTS
    // ==========================================

    const fetchProducts = async () => {

        try {

            setFetching(true);

            const vendorId = getVendorId();

            console.log(
                "Vendor ID:",
                vendorId
            );


            if (!vendorId) {

                alert(
                    "Vendor information not found. Please login again."
                );

                navigate("/login");

                return;
            }


            // ==============================
            // GET /products/vendor/{vendor_id}
            // ==============================

            const response = await fetch(
                `http://127.0.0.1:8000/products/vendor/${vendorId}`
            );


            const data = await response.json();


            console.log(
                "PRODUCT RESPONSE:",
                data
            );


            if (!response.ok) {

                alert(
                    data.detail ||
                    "Unable to fetch products."
                );

                return;
            }


            if (Array.isArray(data)) {

                setProducts(data);

            } else {

                setProducts([]);

            }


        } catch (error) {

            console.error(
                "Product fetch error:",
                error
            );

            alert(
                "Unable to connect to server."
            );


        } finally {

            setFetching(false);

        }

    };


    // ==========================================
    // HANDLE INPUT
    // ==========================================

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]:
                e.target.value

        });

    };


    // ==========================================
    // ADD PRODUCT
    // ==========================================

    const handleAddProduct = async (e) => {

        e.preventDefault();


        // ==============================
        // VALIDATION
        // ==============================

        if (
            !form.product_name ||
            !form.price ||
            !form.quantity ||
            !form.category
        ) {

            alert(
                "Please fill all required fields."
            );

            return;

        }


        try {

            setLoading(true);


            const vendorId =
                getVendorId();


            if (!vendorId) {

                alert(
                    "Vendor information not found. Please login again."
                );

                navigate("/login");

                return;

            }


            // ==============================
            // POST /products/
            // ==============================

            const response = await fetch(
                "http://127.0.0.1:8000/products/",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        product_name:
                            form.product_name,

                        description:
                            form.description,

                        price:
                            Number(form.price),

                        quantity:
                            Number(form.quantity),

                        category:
                            form.category,

                        vendor_id:
                            Number(vendorId)

                    })

                }
            );


            const data =
                await response.json();


            console.log(
                "ADD PRODUCT RESPONSE:",
                data
            );


            if (!response.ok) {

                alert(
                    data.detail ||
                    "Failed to add product."
                );

                return;

            }


            // ==============================
            // SUCCESS
            // ==============================

            alert(
                "Product added successfully!"
            );


            // ==============================
            // CLEAR FORM
            // ==============================

            setForm({

                product_name: "",
                description: "",
                price: "",
                quantity: "",
                category: ""

            });


            // ==============================
            // REFRESH PRODUCTS
            // ==============================

            await fetchProducts();


        } catch (error) {

            console.error(
                "Add product error:",
                error
            );

            alert(
                "Server error while adding product."
            );


        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // DELETE PRODUCT
    // ==========================================

    const handleDeleteProduct = async (
        productId
    ) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this product?"
            );


        if (!confirmDelete) {

            return;

        }


        try {

            const response =
                await fetch(
                    `http://127.0.0.1:8000/products/${productId}`,
                    {
                        method: "DELETE"
                    }
                );


            const data =
                await response.json();


            console.log(
                "DELETE RESPONSE:",
                data
            );


            if (!response.ok) {

                alert(
                    data.detail ||
                    "Unable to delete product."
                );

                return;

            }


            alert(
                "Product deleted successfully!"
            );


            await fetchProducts();


        } catch (error) {

            console.error(
                "Delete product error:",
                error
            );

            alert(
                "Server error while deleting product."
            );

        }

    };


    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("role");

        localStorage.removeItem("email");

        localStorage.removeItem("vendor_id");

        navigate("/login");

    };


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <>

            <AnimatedBackground />


            <div className="products-page">


                {/* =================================
                    HEADER
                ================================= */}

                <header className="products-header">

                    <h1>
                        ShopSense
                    </h1>


                    <div>

                        <button
                            onClick={() =>
                                navigate(
                                    "/Vendordashboard"
                                )
                            }
                        >
                            ← Dashboard
                        </button>

                    </div>

                </header>


                {/* =================================
                    MAIN CONTAINER
                ================================= */}

                <div className="products-container">


                    {/* =================================
                        ADD PRODUCT
                    ================================= */}

                    <div className="product-form-card">

                        <h2>
                            Add New Product
                        </h2>


                        <form
                            onSubmit={
                                handleAddProduct
                            }
                        >


                            <label>
                                Product Name
                            </label>

                            <input
                                type="text"
                                name="product_name"
                                value={
                                    form.product_name
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter product name"
                            />


                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={
                                    form.description
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter product description"
                            />


                            <label>
                                Price
                            </label>

                            <input
                                type="number"
                                name="price"
                                value={
                                    form.price
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter price"
                                min="0"
                            />


                            <label>
                                Quantity
                            </label>

                            <input
                                type="number"
                                name="quantity"
                                value={
                                    form.quantity
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter quantity"
                                min="0"
                            />


                            <label>
                                Category
                            </label>

                            <input
                                type="text"
                                name="category"
                                value={
                                    form.category
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter category"
                            />


                            <button
                                type="submit"
                                disabled={loading}
                            >

                                {loading
                                    ? "Adding..."
                                    : "+ Add Product"
                                }

                            </button>


                        </form>

                    </div>


                    {/* =================================
                        PRODUCT LIST
                    ================================= */}

                    <div className="product-list-card">


                        <div className="product-list-heading">

                            <h2>
                                My Products
                            </h2>


                            <button
                                onClick={
                                    fetchProducts
                                }
                                disabled={fetching}
                            >

                                {fetching
                                    ? "Loading..."
                                    : "Refresh"
                                }

                            </button>

                        </div>


                        {/* =================================
                            LOADING
                        ================================= */}

                        {fetching ? (

                            <p className="no-products">
                                Loading products...
                            </p>


                        ) : products.length === 0 ? (

                            <p className="no-products">
                                No products added yet.
                            </p>


                        ) : (

                            <div className="product-table-wrapper">

                                <table>

                                    <thead>

                                        <tr>

                                            <th>
                                                Product
                                            </th>

                                            <th>
                                                Category
                                            </th>

                                            <th>
                                                Price
                                            </th>

                                            <th>
                                                Quantity
                                            </th>

                                            <th>
                                                Action
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {products.map(
                                            (product) => (

                                                <tr
                                                    key={
                                                        product.product_id
                                                    }
                                                >

                                                    <td>
                                                        {
                                                            product.product_name
                                                        }
                                                    </td>


                                                    <td>
                                                        {
                                                            product.category
                                                        }
                                                    </td>


                                                    <td>
                                                        ₹{" "}
                                                        {
                                                            product.price
                                                        }
                                                    </td>


                                                    <td>
                                                        {
                                                            product.quantity
                                                        }
                                                    </td>


                                                    <td>

                                                        <button
                                                            className="delete-btn"
                                                            onClick={() =>
                                                                handleDeleteProduct(
                                                                    product.product_id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </>

    );

}


export default Products;