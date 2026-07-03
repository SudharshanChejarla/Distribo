import { useEffect, useState } from "react";
import { getDispatchProducts, saveReturnEntry } from "../../services/returnService";
import { getExecutives } from "../../services/salesExecutiveService";
import { toast } from "react-toastify";
import { FaUndoAlt } from "react-icons/fa";


const ReturnSales = () => {

    // Store form data
    const [formData, setFormData] = useState({
        dispatchDate: "",
        salesExecutive: ""
    });

    // Store sales executives
    const [salesExecutives, setSalesExecutives] = useState([]);

    // Store dispatch details
    const [dispatchData, setDispatchData] = useState({
        dispatchId: "",
        products: []
    });

    // Store loading state
    const [loading, setLoading] = useState(false);

    // Store sales calculation
    const [salesData, setSalesData] = useState({
        products: [],
        totalSoldQuantity: 0,
        totalReturnedQuantity: 0,
        totalRevenue: 0,
        totalProfit: 0
    });

    // Handle form input changes
    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    // Handle returned quantity change
    // Handle returned quantity change
    const handleReturnedQuantity = (index, value) => {

        // Allow empty input
        if (value === "") {

            const updatedProducts = [...dispatchData.products];

            updatedProducts[index].returnedQuantity = "";

            setDispatchData({
                ...dispatchData,
                products: updatedProducts
            });

            setSalesData({
                products: [],
                totalSoldQuantity: 0,
                totalReturnedQuantity: 0,
                totalRevenue: 0,
                totalProfit: 0
            });

            return;
        }

        const quantity = Number(value);

        // Prevent negative quantity
        if (quantity < 0) {

            toast.error("Returned quantity cannot be negative.");

            return;
        }

        // Prevent returned quantity exceeding dispatched quantity
        if (quantity > dispatchData.products[index].dispatchQuantity) {

            toast.error("Returned quantity cannot exceed dispatched quantity.");

            return;
        }

        // Update returned quantity
        const updatedProducts = [...dispatchData.products];

        updatedProducts[index].returnedQuantity = quantity;

        setDispatchData({
            ...dispatchData,
            products: updatedProducts
        });

        setSalesData({
            products: [],
            totalSoldQuantity: 0,
            totalReturnedQuantity: 0,
            totalRevenue: 0,
            totalProfit: 0
        });

    };

    // Calculate sales details
    const calculateSales = () => {

        let totalSoldQuantity = 0;
        let totalReturnedQuantity = 0;
        let totalRevenue = 0;
        let totalProfit = 0;

        const calculatedProducts = dispatchData.products.map((product) => {

            const returnedQuantity = Number(product.returnedQuantity) || 0;

            // Calculate sold quantity
            const soldQuantity = product.dispatchQuantity - returnedQuantity;

            // Calculate revenue
            const revenue = soldQuantity * product.product.sellingPrice;

            // Calculate profit
            const profit =
                soldQuantity *
                (
                    product.product.sellingPrice -
                    product.product.purchasePrice
                );

            totalSoldQuantity += soldQuantity;
            totalReturnedQuantity += returnedQuantity;
            totalRevenue += revenue;
            totalProfit += profit;

            return {

                ...product,

                soldQuantity,

                revenue,

                profit

            };

        });

        setSalesData({

            products: calculatedProducts,

            totalSoldQuantity,

            totalReturnedQuantity,

            totalRevenue,

            totalProfit

        });

        toast.success("Sales calculated successfully.");

    };

    // Save return entry
    const handleSaveReturn = async () => {

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            const returnData = {

                dispatchId: dispatchData.dispatchId,

                totalReturnedQuantity: salesData.totalReturnedQuantity,

                totalSoldQuantity: salesData.totalSoldQuantity,

                totalRevenue: salesData.totalRevenue,

                totalProfit: salesData.totalProfit,

                returnedProducts: dispatchData.products.map((product) => ({

                    productId: product.product._id,

                    returnedQuantity: Number(product.returnedQuantity) || 0

                }))

            };

            const data = await saveReturnEntry(
                returnData,
                token
            );

            toast.success(data.message);

            // Reset form
            setFormData({
                dispatchDate: "",
                salesExecutive: ""
            });

            // Clear dispatch
            setDispatchData({
                dispatchId: "",
                products: []
            });

            // Clear sales
            setSalesData({
                products: [],
                totalSoldQuantity: 0,
                totalReturnedQuantity: 0,
                totalRevenue: 0,
                totalProfit: 0
            });

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to save return entry."
            );

        } finally {

            setLoading(false);

        }

    };

    // Fetch all sales executives
    const fetchSalesExecutives = async () => {

        try {

            const token = localStorage.getItem("token");

            const data = await getExecutives(token);


            setSalesExecutives(data.executives);

        } catch (error) {

            console.error(error);

        }

    };

    // Fetch dispatched products
    const fetchDispatchProducts = async () => {

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            const data = await getDispatchProducts(
                formData.dispatchDate,
                formData.salesExecutive,
                token
            );

            setDispatchData({
                dispatchId: data.dispatch._id,
                products: data.dispatch.products.map((item) => ({
                    ...item,
                    returnedQuantity: ""
                }))
            });

        } catch (error) {

            setDispatchData({
                dispatchId: "",
                products: []
            });

            toast.error(
                error.response?.data?.message || "Failed to fetch dispatch."
            );

        } finally {

            setLoading(false);

        }

    };

    // Load sales executives on page load
    useEffect(() => {

        fetchSalesExecutives();

    }, []);

    // Load dispatch when both fields are selected
    useEffect(() => {

        if (!formData.dispatchDate || !formData.salesExecutive) {
            return;
        }

        fetchDispatchProducts();

    }, [formData.dispatchDate, formData.salesExecutive]);

    return (

        <div className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">

                {/* Page Title */}
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8 flex items-center justify-center gap-3">

                    <FaUndoAlt className="text-blue-600" />

                    Return & Sales Management

                </h1>

                {/* Filter Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Dispatch Date */}
                    <div>

                        <label className="block text-gray-700 font-semibold mb-2">

                            Dispatch Date

                        </label>

                        <input
                            type="date"
                            name="dispatchDate"
                            value={formData.dispatchDate}
                            onChange={handleChange}
                            disabled={loading}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200"
                        />

                    </div>

                    {/* Sales Executive */}
                    <div>

                        <label className="block text-gray-700 font-semibold mb-2">

                            Sales Executive

                        </label>

                        <select
                            name="salesExecutive"
                            value={formData.salesExecutive}
                            onChange={handleChange}
                            disabled={loading}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200"
                        >

                            <option value="">

                                Select Sales Executive

                            </option>

                            {
                                salesExecutives.map((executive) => (

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

                {/* Loading */}
                {
                    loading && (

                        <div className="text-center mt-8 text-blue-600 font-semibold">

                            Loading dispatched products...

                        </div>

                    )
                }

                {/* dispatched products table */}
                {
                    dispatchData.products.length > 0 && (

                        <div className="mt-10">

                            <h2 className="text-2xl font-bold text-gray-800 mb-5">

                                Dispatched Products

                            </h2>

                            <div className="overflow-x-auto">

                                <table className="min-w-full border border-gray-300">

                                    <thead className="bg-blue-600 text-white">

                                        <tr>

                                            <th className="px-4 py-3 border ">
                                                Product
                                            </th>

                                            <th className="px-4 py-3 border text-center">
                                                Dispatched Quantity
                                            </th>

                                            <th className="px-4 py-3 border text-center">
                                                Returned Quantity
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {
                                            dispatchData.products.map((product, index) => (

                                                <tr
                                                    key={product.product._id}
                                                    className="hover:bg-gray-50"
                                                >

                                                    <td className="border border-gray-200 px-4 py-3">

                                                        {product.productName}
                                                        {" "}
                                                        ({product.productSize})

                                                    </td>

                                                    <td className="border border-gray-200 px-4 py-3 text-center">

                                                        {product.dispatchQuantity}

                                                    </td>

                                                    <td className="border border-gray-200 px-4 py-3 text-center">

                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max={product.dispatchQuantity}
                                                            value={product.returnedQuantity}
                                                            onChange={(e) =>
                                                                handleReturnedQuantity(
                                                                    index,
                                                                    e.target.value
                                                                )
                                                            }
                                                            className="w-24 text-center border-gray-300 border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />

                                                    </td>

                                                </tr>

                                            ))
                                        }

                                    </tbody>

                                </table>

                            </div>

                            <div className="flex justify-end mt-6">

                                <button
                                    onClick={calculateSales}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
                                >

                                    Calculate Sales

                                </button>

                            </div>

                        </div>

                    )
                }


                {/* sales calc table */}
                {
                    salesData.products.length > 0 && (

                        <div className="mt-10">

                            <h2 className="text-2xl font-bold text-gray-800 mb-5">

                                Sales Calculation

                            </h2>

                            <div className="overflow-x-auto">

                                <table className="min-w-full border border-gray-300">

                                    <thead className="bg-green-600 text-white">

                                        <tr>

                                            <th className="border  px-4 py-3">
                                                Product
                                            </th>

                                            <th className="border px-4 py-3 text-center">
                                                Sold Qty
                                            </th>

                                            <th className="border px-4 py-3 text-center">
                                                Revenue
                                            </th>

                                            <th className="border px-4 py-3 text-center">
                                                Profit
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {
                                            salesData.products.map((product) => (

                                                <tr
                                                    key={product.product._id}
                                                    className="hover:bg-gray-50"
                                                >

                                                    <td className="border border-gray-200 px-4 py-3">

                                                        {product.productName}
                                                        {" "}
                                                        ({product.productSize})

                                                    </td>

                                                    <td className="border border-gray-200 px-4 py-3 text-center">

                                                        {product.soldQuantity}

                                                    </td>

                                                    <td className="border border-gray-200 px-4 py-3 text-center">

                                                        ₹ {product.revenue}

                                                    </td>

                                                    <td className="border border-gray-200 px-4 py-3 text-center">

                                                        ₹ {product.profit}

                                                    </td>

                                                </tr>

                                            ))
                                        }

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    )
                }

                {/* summary cards  */}
                {
                    salesData.products.length > 0 && (

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-8">

                            <div className="bg-blue-100 rounded-lg p-5 shadow">

                                <h3 className="font-semibold text-gray-700">

                                    Total Sold Quantity

                                </h3>

                                <p className="text-3xl font-bold mt-2">

                                    {salesData.totalSoldQuantity}

                                </p>

                            </div>

                            <div className="bg-yellow-100 rounded-lg p-5 shadow">

                                <h3 className="font-semibold text-gray-700">

                                    Total Returned Quantity

                                </h3>

                                <p className="text-3xl font-bold mt-2">

                                    {salesData.totalReturnedQuantity}

                                </p>

                            </div>

                            <div className="bg-green-100 rounded-lg p-5 shadow">

                                <h3 className="font-semibold text-gray-700">

                                    Total Revenue

                                </h3>

                                <p className="text-3xl font-bold mt-2">

                                    ₹ {salesData.totalRevenue}

                                </p>

                            </div>

                            <div className="bg-purple-100 rounded-lg p-5 shadow">

                                <h3 className="font-semibold text-gray-700">

                                    Total Profit

                                </h3>

                                <p className="text-3xl font-bold mt-2">

                                    ₹ {salesData.totalProfit}

                                </p>

                            </div>

                        </div>

                    )
                }

                {/* Save Button  */}
                {
                    salesData.products.length > 0 && (

                        <div className="flex justify-end mt-8">

                            <button
                                onClick={handleSaveReturn}
                                disabled={loading}
                                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold px-8 py-3 rounded-lg transition"
                            >

                                {
                                    loading
                                        ? "Saving..."
                                        : "Save Return Entry"
                                }

                            </button>

                        </div>

                    )
                }

            </div>

        </div>

    );
}

export default ReturnSales;