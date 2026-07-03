import { useState } from "react";
import { toast } from "react-toastify";
import { addProduct } from "../../services/productService";
import { getToken } from "../../utils/localStorage";
import { FaBoxOpen, FaRupeeSign, FaPlusCircle, FaUndo } from "react-icons/fa";

const AddProduct = () => {

    const [formData, setFormData] = useState({
        name: "",
        size: "",
        currentStock: "",
        purchasePrice: "",
        sellingPrice: ""
    });

    const [loading, setLoading] = useState(false);

    const token = getToken();

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleReset = () => {
        setFormData({
            name: "",
            size: "",
            currentStock: "",
            purchasePrice: "",
            sellingPrice: ""
        });
    };

    const validateForm = () => {

        const trimmedName = formData.name.trim();

        if (!trimmedName) {
            toast.error("Product name is required.");
            return false;
        }

        const nameRegex = /^[A-Za-z ]+$/;

        if (!nameRegex.test(trimmedName)) {
            toast.error("Product name should contain only letters.");
            return false;
        }

        if (!formData.size.trim()) {
            toast.error("Product size is required.");
            return false;
        }

        if (!formData.purchasePrice || Number(formData.purchasePrice) <= 0) {
            toast.error("Purchase price must be greater than 0.");
            return false;
        }

        if (!formData.sellingPrice || Number(formData.sellingPrice) <= 0) {
            toast.error("Selling price must be greater than 0.");
            return false;
        }

        if (Number(formData.sellingPrice) < Number(formData.purchasePrice)) {
            toast.error("Selling price cannot be less than purchase price.");
            return false;
        }

        if (
            formData.currentStock !== "" &&
            Number(formData.currentStock) < 0
        ) {
            toast.error("Opening stock cannot be negative.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!validateForm()) return;

        try {

            setLoading(true);

            const productData = {
                ...formData,
                currentStock: Number(formData.currentStock) || 0,
                purchasePrice: Number(formData.purchasePrice),
                sellingPrice: Number(formData.sellingPrice)
            };

            const response = await addProduct(productData, token);

            toast.success(response.message);

            handleReset();

        } catch (error) {

            toast.error(
                error.response?.data?.message || "Something went wrong."
            );

        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="min-h-screen bg-gray-100 py-3 px-6">

            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg py-4 px-6">

                {/* Title */}
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-4 flex items-center justify-center gap-2">
                    <FaPlusCircle className="text-blue-600" />
                    Add Product
                </h1>

                <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">

                    {/* Product Name */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1 text-lg">
                            Product Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Example: Pepsi"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 text-base font-medium border border-gray-300 rounded-lg
                                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                       shadow-sm transition"
                        />
                    </div>

                    {/* Product Size */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1 text-lg">
                            Product Size
                        </label>

                        <input
                            type="text"
                            name="size"
                            placeholder="Example: 250ml"
                            value={formData.size}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 text-base font-medium border border-gray-300 rounded-lg
                                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                       shadow-sm transition"
                        />
                    </div>

                    {/* Opening Stock */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1 text-lg flex items-center gap-2">
                            <FaBoxOpen className="text-gray-600" />
                            Opening Stock
                        </label>

                        <input
                            type="number"
                            name="currentStock"
                            min="0"
                            placeholder="0"
                            value={formData.currentStock}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 text-base font-medium border border-gray-300 rounded-lg
                                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                       shadow-sm transition"
                        />
                    </div>

                    {/* Purchase Price */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1 text-lg flex items-center gap-2">
                            <FaRupeeSign className="text-green-600" />
                            Purchase Price
                        </label>

                        <input
                            type="number"
                            name="purchasePrice"
                            min="1"
                            placeholder="35"
                            value={formData.purchasePrice}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 text-base font-medium border border-gray-300 rounded-lg
                                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                       shadow-sm transition"
                        />
                    </div>

                    {/* Selling Price */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1 text-lg flex items-center gap-2">
                            <FaRupeeSign className="text-green-600" />
                            Selling Price
                        </label>

                        <input
                            type="number"
                            name="sellingPrice"
                            min="1"
                            placeholder="40"
                            value={formData.sellingPrice}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 text-base font-medium border border-gray-300 rounded-lg
                                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                       shadow-sm transition"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-2">

                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg
                                       bg-gray-500 hover:bg-gray-600 text-white font-semibold
                                       transition cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-400"
                        >
                            <FaUndo />
                            Reset
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg
                                       bg-blue-600 hover:bg-blue-700 text-white font-semibold
                                       transition cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-400"
                        >
                            <FaPlusCircle />
                            {loading ? "Saving..." : "Save Product"}
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
};

export default AddProduct;