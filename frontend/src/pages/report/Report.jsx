import { useState } from "react";
import { FaChartLine } from "react-icons/fa";
import { toast } from "react-toastify";

import { getReports } from "../../services/reportService";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";

const Report = () => {
    // Store filter values
    const [filters, setFilters] = useState({

        startDate: "",

        endDate: ""

    });

    // Store report data
    const [reportData, setReportData] = useState(null);

    // Store loading state
    const [loading, setLoading] = useState(false);

    // Handle input changes
    const handleChange = (e) => {

        setFilters({

            ...filters,

            [e.target.name]: e.target.value

        });

    };

    // Generate report
    const handleGenerateReport = async () => {

        try {

            // Validate dates
            if (!filters.startDate || !filters.endDate) {

                toast.error("Please select start and end dates.");

                return;

            }

            // Validate range
            if (filters.startDate > filters.endDate) {

                toast.error("Start date cannot be after end date.");

                return;

            }

            setLoading(true);

            const token = localStorage.getItem("token");

            const data = await getReports(

                filters.startDate,

                filters.endDate,

                token

            );

            setReportData(data);

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Failed to generate report."

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">

                {/* Page Title */}
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8 flex items-center justify-center gap-3">

                    <FaChartLine className="text-blue-600" />

                    Reports

                </h1>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div>

                        <label className="block text-gray-700 font-semibold mb-2">

                            Start Date

                        </label>

                        <input

                            type="date"

                            name="startDate"

                            value={filters.startDate}

                            onChange={handleChange}

                            disabled={loading}

                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"

                        />

                    </div>

                    <div>

                        <label className="block text-gray-700 font-semibold mb-2">

                            End Date

                        </label>

                        <input

                            type="date"

                            name="endDate"

                            value={filters.endDate}

                            onChange={handleChange}

                            disabled={loading}

                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"

                        />

                    </div>

                    <div className="flex items-end">

                        <button

                            onClick={handleGenerateReport}

                            disabled={loading}

                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition disabled:bg-gray-400"

                        >

                            {

                                loading

                                    ? "Generating..."

                                    : "Generate Report"

                            }

                        </button>

                    </div>

                </div>

                {/* summary cards  */}
                {
                    reportData && (

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

                            {/* Total Sold Quantity */}
                            <div className="bg-blue-100 rounded-xl shadow p-6">

                                <h3 className="text-gray-700 font-semibold">

                                    Total Sold Quantity

                                </h3>

                                <p className="text-3xl font-bold text-blue-700 mt-3">

                                    {reportData.summary.totalSoldQuantity}

                                </p>

                            </div>

                            {/* Total Revenue */}
                            <div className="bg-green-100 rounded-xl shadow p-6">

                                <h3 className="text-gray-700 font-semibold">

                                    Total Revenue

                                </h3>

                                <p className="text-3xl font-bold text-green-700 mt-3">

                                    ₹ {reportData.summary.totalRevenue.toLocaleString()}

                                </p>

                            </div>

                            {/* Total Profit */}
                            <div className="bg-purple-100 rounded-xl shadow p-6">

                                <h3 className="text-gray-700 font-semibold">

                                    Total Profit

                                </h3>

                                <p className="text-3xl font-bold text-purple-700 mt-3">

                                    ₹ {reportData.summary.totalProfit.toLocaleString()}

                                </p>

                            </div>

                        </div>

                    )
                }

                {/* daily report table  */}
                {
                    reportData && (

                        <div className="mt-10">

                            {/* Table Title */}
                            <h2 className="text-2xl font-bold text-gray-800 mb-5">

                                Daily Report

                            </h2>

                            <div className="overflow-x-auto rounded-xl shadow">

                                <table className="min-w-full bg-white">

                                    <thead className="bg-blue-600 text-white">

                                        <tr>

                                            <th className="px-5 py-3 text-left">

                                                Date

                                            </th>

                                            <th className="px-5 py-3 text-left">

                                                Sales Executive

                                            </th>

                                            <th className="px-5 py-3 text-left">

                                                Products Dispatched

                                            </th>

                                            <th className="px-5 py-3 text-center">

                                                Sold Quantity

                                            </th>

                                            <th className="px-5 py-3 text-center">

                                                Revenue

                                            </th>

                                            <th className="px-5 py-3 text-center">

                                                Profit

                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {

                                            reportData.dailyReports.map((report, index) => (

                                                <tr
                                                    key={index}
                                                    className="border border-gray-300 hover:bg-gray-50"
                                                >

                                                    <td className="px-5 py-4">

                                                        {report.date}

                                                    </td>

                                                    <td className="px-5 py-4">

                                                        {report.salesExecutive}

                                                    </td>

                                                    <td className="px-5 py-4">

                                                        {

                                                            report.productsDispatched.map((product, idx) => (

                                                                <div key={idx}>

                                                                    • {product}

                                                                </div>

                                                            ))

                                                        }

                                                    </td>

                                                    <td className="px-5 py-4 text-center">

                                                        {report.soldQuantity}

                                                    </td>

                                                    <td className="px-5 py-4 text-center">

                                                        ₹ {report.revenue.toLocaleString()}

                                                    </td>

                                                    <td className="px-5 py-4 text-center">

                                                        ₹ {report.profit.toLocaleString()}

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

                {/* Empty report message  */}
                {
                    reportData &&
                    reportData.dailyReports.length === 0 && (

                        <div className="mt-10 bg-yellow-100 border border-yellow-100 rounded-lg p-5 text-center text-yellow-700 font-semibold">

                            No report found for the selected date range.

                        </div>

                    )
                }

                {/* profit trend chart  */}
                {
                    reportData &&
                    reportData.profitTrend.length > 0 && (

                        <div className="mt-10 bg-white rounded-xl shadow-lg p-6">

                            {/* Chart Title */}
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">

                                Profit Trend

                            </h2>

                            <ResponsiveContainer
                                width="100%"
                                height={400}
                            >

                                <LineChart
                                    data={reportData.profitTrend}
                                >

                                    <CartesianGrid strokeDasharray="3 3" />

                                    <XAxis
                                        dataKey="date"
                                    />

                                    <YAxis />

                                    <Tooltip />

                                    <Legend />

                                    <Line
                                        type="monotone"
                                        dataKey="profit"
                                        stroke="#16a34a"
                                        strokeWidth={3}
                                        dot={{ r: 5 }}
                                        activeDot={{ r: 8 }}
                                        name="Profit"
                                    />

                                </LineChart>

                            </ResponsiveContainer>

                        </div>

                    )
                }



            </div>

        </div>

    );


}

export default Report;