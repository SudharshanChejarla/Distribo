import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
    Calendar,
    User,
    Package,
    Plus,
    Truck
} from "lucide-react";

import {
    getProducts
} from "../../services/stockService";

import {
    getExecutives
} from "../../services/salesExecutiveService";

import {
    createDispatch
} from "../../services/dispatchService";

const Dispatch = () => {

    // Store all user products
    const [products, setProducts] = useState([]);

    // Store all sales executives
    const [executives, setExecutives] = useState([]);

    // Store products added to dispatch
    const [dispatchItems, setDispatchItems] = useState([]);

    // Store selected product
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Loading state while saving dispatch
    const [loading, setLoading] = useState(false);

    // Form values
    const [formData, setFormData] = useState({
        dispatchDate: "",
        salesExecutive: "",
        product: "",
        dispatchQuantity: ""
    });

    // Load products and executives on page load
    useEffect(() => {

        fetchProducts();

        fetchExecutives();

    }, []);

    // Fetch user products
    const fetchProducts = async () => {

        try {

            const response = await getProducts();

            setProducts(response.products || []);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to fetch products."
            );

        }

    };

    // Fetch sales executives
    const fetchExecutives = async () => {

        try {

            const response = await getExecutives();

            setExecutives(response.executives || []);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to fetch sales executives."
            );

        }

    };

    // Handle form changes
    const handleChange = (e) => {

        const { name, value } = e.target;

        // Allow only numeric quantity
        if (name === "dispatchQuantity") {

            if (!/^\d*$/.test(value)) {
                return;
            }

        }

        // Update selected product
        if (name === "product") {

            const product = products.find(
                (item) => item._id === value
            );

            setSelectedProduct(product || null);

        }

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

    };

    // Add product into dispatch list
    const handleAddProduct = () => {

        // Product validation
        if (!formData.product) {
            toast.error("Please select a product.");
            return;
        }

        // Quantity validation
        if (!formData.dispatchQuantity) {
            toast.error("Please enter dispatch quantity.");
            return;
        }

        const quantity = Number(formData.dispatchQuantity);

        // Quantity greater than zero
        if (quantity <= 0) {
            toast.error("Dispatch quantity must be greater than zero.");
            return;
        }

        // Product exists check
        if (!selectedProduct) {
            toast.error("Invalid product selected.");
            return;
        }

        // Available stock validation
        if (quantity > selectedProduct.currentStock) {
            toast.error("Dispatch quantity exceeds available stock.");
            return;
        }


        // Add product into dispatch list
        setDispatchItems((prev) => [

            ...prev,

            {
                product: selectedProduct._id,
                productName: selectedProduct.name,
                productSize: selectedProduct.size,
                availableStock: selectedProduct.currentStock,
                dispatchQuantity: quantity
            }

        ]);

        // Clear product fields
        setSelectedProduct(null);

        setFormData((prev) => ({
            ...prev,
            product: "",
            dispatchQuantity: ""
        }));

    };

    // Save dispatch
    const handleSaveDispatch = async () => {

        // Date validation
        if (!formData.dispatchDate) {
            toast.error("Please select dispatch date.");
            return;
        }

        // Prevent future dates
        if (new Date(formData.dispatchDate) > new Date()) {
            toast.error("Dispatch date cannot be in the future.");
            return;
        }

        // Executive validation
        if (!formData.salesExecutive) {
            toast.error("Please select a sales executive.");
            return;
        }

        // Product validation
        if (dispatchItems.length === 0) {
            toast.error("Please add at least one product.");
            return;
        }

        try {

            setLoading(true);

            await createDispatch({

                dispatchDate: formData.dispatchDate,

                salesExecutive: formData.salesExecutive,

                products: dispatchItems.map((item) => ({
                    product: item.product,
                    dispatchQuantity: item.dispatchQuantity
                }))

            });

            toast.success("Dispatch created successfully.");

            // Reset form
            setDispatchItems([]);

            setSelectedProduct(null);

            setFormData({
                dispatchDate: "",
                salesExecutive: "",
                product: "",
                dispatchQuantity: ""
            });

            // Refresh products
            fetchProducts();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to save dispatch."
            );

        } finally {

            setLoading(false);

        }

    };

    // Calculate total products
    const totalProducts = dispatchItems.length;

    // Calculate total quantity
    const totalQuantity = dispatchItems.reduce(
        (sum, item) => sum + item.dispatchQuantity,
        0
    );

    return (

        <div className="max-w-5xl mx-auto p-6">

            {/* Main Card */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">

                {/* Page Heading */}
                <div className="flex items-center gap-3 mb-2">

                    <Truck className="text-blue-600" size={30} />

                    <h1 className="text-3xl font-bold">
                        Dispatch Workflow
                    </h1>

                </div>

                <p className="text-gray-600 mb-8">
                    Select dispatch details, add products and save dispatch.
                </p>

                {/* Dispatch Details */}
                <div className="border border-gray-300 hover:bg-gray-50 transition-colors rounded-xl p-6 mb-8">

                    <h2 className="text-xl font-semibold mb-5">
                        Dispatch Details
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">

                        {/* Dispatch Date */}
                        <div>

                            <label className="block font-medium mb-2">
                                Dispatch Date
                            </label>

                            <div className="relative">

                                <Calendar
                                    size={18}
                                    className="absolute left-3 top-3.5 text-gray-400"
                                />

                                <input
                                    type="date"
                                    name="dispatchDate"
                                    value={formData.dispatchDate}
                                    onChange={handleChange}
                                    max={new Date().toISOString().split("T")[0]}
                                    className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>

                        </div>

                        {/* Sales Executive */}
                        <div>

                            <label className="block font-medium mb-2">
                                Sales Executive
                            </label>

                            <div className="relative">

                                <User
                                    size={18}
                                    className="absolute left-3 top-3.5 text-gray-400"
                                />

                                <select
                                    name="salesExecutive"
                                    value={formData.salesExecutive}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                >

                                    <option value="">
                                        Select Executive
                                    </option>

                                    {

                                        executives.map((executive) => (

                                            <option
                                                key={executive._id}
                                                value={executive._id}
                                            >

                                                {executive.name}

                                            </option>

                                        ))

                                    }

                                </select>

                            </div>

                        </div>

                    </div>

                </div>

                {/* Product Section */}
                <div className="border border-gray-300 hover:bg-gray-50 transition-colors rounded-xl p-6 mb-8">

                    <h2 className="text-xl font-semibold mb-5">
                        Add Product
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">

                        {/* Product Dropdown */}
                        <div>

                            <label className="block font-medium mb-2">
                                Product
                            </label>

                            <div className="relative">

                                <Package
                                    size={18}
                                    className="absolute left-3 top-3.5 text-gray-400"
                                />

                                <select
                                    name="product"
                                    value={formData.product}
                                    onChange={handleChange}
                                    disabled={
                                        products.filter(
                                            (product) =>
                                                !dispatchItems.some(
                                                    (item) => item.product === product._id
                                                )
                                        ).length === 0
                                    }
                                    className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                >
                                    <option value="">
                                        {
                                            products.filter(
                                                (product) =>
                                                    !dispatchItems.some(
                                                        (item) => item.product === product._id
                                                    )
                                            ).length === 0
                                                ? "No Products Available"
                                                : "Select Product"
                                        }
                                    </option>

                                    {products
                                        .filter(
                                            (product) =>
                                                !dispatchItems.some(
                                                    (item) => item.product === product._id
                                                )
                                        )
                                        .map((product) => (
                                            <option
                                                key={product._id}
                                                value={product._id}
                                            >
                                                {product.name} ({product.size})
                                            </option>
                                        ))}
                                </select>

                            </div>

                        </div>

                        {/* Available Stock */}
                        <div>

                            <label className="block font-medium mb-2">
                                Available Stock
                            </label>

                            <input
                                type="text"
                                readOnly
                                value={
                                    selectedProduct
                                        ? `${selectedProduct.currentStock} Units`
                                        : ""
                                }
                                className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-100 text-blue-600 font-semibold"
                            />

                        </div>

                    </div>

                    {/* Quantity */}
                    <div className="mt-6">

                        <label className="block font-medium mb-2">
                            Dispatch Quantity
                        </label>

                        <input
                            type="text"
                            name="dispatchQuantity"
                            value={formData.dispatchQuantity}
                            onChange={handleChange}
                            placeholder="Enter quantity"
                            className="w-full border  border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    {/* Add Product */}
                    <button
                        onClick={handleAddProduct}
                        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg flex items-center justify-center gap-2 font-semibold"
                    >

                        <Plus size={18} />

                        Add Product

                    </button>

                </div>

                {/* Dispatch List */}
                <div className="border border-gray-300 hover:bg-gray-50 transition-colors rounded-xl p-6 mb-8">

                    <div className="flex justify-between items-center mb-5">

                        <h2 className="text-xl font-semibold">
                            Dispatch List
                        </h2>

                        <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">

                            {totalProducts} Items

                        </span>

                    </div>

                    <div className="overflow-x-auto">

                        <table className="w-full border border-gray-200">

                            <thead className="bg-blue-600 text-white">

                                <tr>

                                    <th className="text-left px-4 py-3">
                                        Product
                                    </th>

                                    <th className="text-left px-4 py-3">
                                        Available Stock
                                    </th>

                                    <th className="text-left px-4 py-3">
                                        Dispatch Quantity
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {

                                    dispatchItems.length === 0 ?

                                        (

                                            <tr>

                                                <td
                                                    colSpan={3}
                                                    className="text-center py-8 text-gray-500"
                                                >

                                                    No products added.

                                                </td>

                                            </tr>

                                        )

                                        :

                                        dispatchItems.map((item) => (

                                            <tr
                                                key={item.product}
                                                className="border-b"
                                            >

                                                <td className="px-4 py-4">

                                                    {item.productName} ({item.productSize})

                                                </td>

                                                <td className="px-4 py-4">

                                                    {item.availableStock}

                                                </td>

                                                <td className="px-4 py-4">

                                                    {item.dispatchQuantity}

                                                </td>

                                            </tr>

                                        ))

                                }

                            </tbody>

                        </table>

                    </div>

                </div>

                {/* Dispatch Summary */}
                <div className="border border-gray-300 hover:bg-gray-50 transition-colors rounded-xl p-6 mb-8">

                    <h2 className="text-xl font-semibold mb-5">
                        Dispatch Summary
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">

                        {/* Total Products */}
                        <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">

                            <p className="text-gray-600 text-sm">
                                Total Products
                            </p>

                            <h3 className="text-3xl font-bold text-blue-700 mt-2">
                                {totalProducts}
                            </h3>

                        </div>

                        {/* Total Quantity */}
                        <div className="bg-green-50 rounded-lg p-5 border border-green-200">

                            <p className="text-gray-600 text-sm">
                                Total Quantity
                            </p>

                            <h3 className="text-3xl font-bold text-green-700 mt-2">
                                {totalQuantity}
                            </h3>

                        </div>

                    </div>

                </div>

                {/* Save Dispatch */}
                <button
                    onClick={handleSaveDispatch}
                    disabled={loading}
                    className={`w-full py-4 rounded-lg text-white font-semibold transition-all duration-200
                        ${loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-800 cursor-pointer"
                        }`}
                >

                    {

                        loading
                            ? "Saving Dispatch..."
                            : "Save Dispatch"

                    }

                </button>

            </div>

        </div>

    );

};

export default Dispatch;