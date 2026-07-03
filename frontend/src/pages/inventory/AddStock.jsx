import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaBox, FaPlusCircle, FaWarehouse } from "react-icons/fa";

import { getProducts, addStock } from "../../services/stockService";

function AddStock() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        productId: "",
        quantity: ""
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await getProducts();

            if (response?.success) {
                setProducts(response.products || []);
            } else {
                toast.error("Failed to load products.");
            }

        } catch (error) {
            console.error("Fetch Products Error:", error);
            toast.error("Failed to fetch products.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const selectedProduct = products.find(
        (p) => p._id === formData.productId
    );

    const currentStock = selectedProduct?.currentStock || 0;
    const enteredQty = Number(formData.quantity) || 0;
    const updatedStock = currentStock + enteredQty;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.productId) {
            return toast.error("Please select a product.");
        }

        if (enteredQty <= 0) {
            return toast.error("Please enter valid quantity.");
        }

        try {
            setLoading(true);

            const response = await addStock({
                productId: formData.productId,
                quantity: enteredQty
            });

            if (!response?.success) {
                return toast.error(response.message || "Failed to add stock.");
            }

            toast.success(response.message || "Stock updated successfully.");

            await fetchProducts();

            setFormData({
                productId: "",
                quantity: ""
            });

        } catch (error) {
            console.error("Add Stock Error:", error);
            toast.error(error?.response?.data?.message || "Failed to add stock.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto bg-white shadow-lg rounded-xl">

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FaPlusCircle className="text-blue-600" />
                Add Stock
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

                {/* Product Dropdown */}
                <select
                    name="productId"
                    value={formData.productId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-lg font-medium border border-gray-300 rounded-lg
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                               shadow-sm transition"
                >
                    <option value="">Select Product</option>

                    {products.map((product) => (
                        <option key={product._id} value={product._id}>
                            {product.name} ({product.size})
                        </option>
                    ))}
                </select>

                {/* Quantity Input */}
                <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="Enter quantity"
                    className="w-full px-4 py-3 text-lg font-medium border border-gray-300 rounded-lg
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                               shadow-sm transition"
                />

                {/* Stock Preview */}
                {formData.productId && (
                    <div className="bg-gray-50 p-4 rounded-lg text-gray-700 space-y-2">

                        <p className="flex items-center gap-2 text-base font-semibold">
                            <FaWarehouse className="text-gray-600" />
                            Current Stock: <span className="font-bold">{currentStock}</span>
                        </p>

                        <p className="flex items-center gap-2 text-base font-semibold">
                            <FaBox className="text-green-600" />
                            Updated Stock: <span className="font-bold text-green-600">{updatedStock}</span>
                        </p>

                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg text-white font-semibold text-lg
                               bg-blue-600 hover:bg-blue-700 transition
                               disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
                >
                    {loading ? "Updating..." : "Add Stock"}
                </button>

            </form>
        </div>
    );
}

export default AddStock;