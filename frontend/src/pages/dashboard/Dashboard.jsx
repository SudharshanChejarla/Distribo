import { useEffect, useState } from "react";
import { getDashboardData } from "../../services/dashboardService";

const Dashboard = () => {

  const [dashboard, setDashboard] = useState(null);

  // Fetch dashboard data
  const fetchDashboardData = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await getDashboardData(token);

      setDashboard(response.dashboard);

    }

    catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    fetchDashboardData();

  }, []);

  if (!dashboard) {

    return (

      <div className="p-6">

        Loading...

      </div>

    );

  }

  return (

    <div className="p-8 bg-slate-50 min-h-screen">

      {/* Header */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-gray-800">

          Welcome to Distribo

        </h1>

        <p className="mt-2 text-gray-500 text-lg">

          View inventory insights and stock availability.

        </p>

      </div>

      {/* Dashboard Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-blue-50 rounded-2xl shadow-md p-6 transition hover:shadow-lg">

          <p className="text-gray-600 font-medium">

            Total Products

          </p>

          <h2 className="text-4xl font-bold text-blue-700 mt-3">

            {dashboard.totalProducts}

          </h2>

        </div>

        <div className="bg-green-50 rounded-2xl shadow-md p-6 transition hover:shadow-lg">

          <p className="text-gray-600 font-medium">

            Total Stock Units

          </p>

          <h2 className="text-4xl font-bold text-green-700 mt-3">

            {dashboard.totalStockUnits}

          </h2>

        </div>

        <div className="bg-red-50 rounded-2xl shadow-md p-6 transition hover:shadow-lg">

          <p className="text-gray-600 font-medium">

            Low Stock Products

          </p>

          <h2 className="text-4xl font-bold text-red-600 mt-3">

            {dashboard.lowStockProducts}

          </h2>

        </div>

        <div className="bg-violet-50 rounded-2xl shadow-md p-6 transition hover:shadow-lg">

          <p className="text-gray-600 font-medium">

            Sales Executives

          </p>

          <h2 className="text-4xl font-bold text-violet-700 mt-3">

            {dashboard.salesExecutives}

          </h2>

        </div>

      </div>

      {/* Bottom Section */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

        {/* Low Stock Products */}

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md overflow-hidden">

          <div className="px-6 py-5 border-b  border-gray-100 ">

            <h2 className="text-2xl font-bold text-gray-800">

              Low Stock Products

            </h2>

          </div>

          <table className="w-full">

            <thead className="bg-blue-600 text-white">

              <tr>

                <th className="text-left px-6 py-4 font-semibold">

                  Product

                </th>

                <th className="text-left px-6 py-4 font-semibold">

                  Available Stock

                </th>

                <th className="text-left px-6 py-4 font-semibold">

                  Status

                </th>

              </tr>

            </thead>

            <tbody>

              {

                dashboard.lowStockTable.length > 0 ? (

                  dashboard.lowStockTable.map((product) => (

                    <tr
                      key={product._id}
                      className="border-b border-gray-100 hover:bg-gray- transition-colors"
                    >
                      <td className="px-6 py-4 text-gray-700 font-medium">
                        {product.name} ({product.size})
                      </td>

                      <td className="px-6 py-4 font-semibold text-gray-700">
                        {product.currentStock}
                      </td>

                      <td className="px-6 py-4">
                        <span className="bg-red-100 text-red-600 px-4 py-1 rounded-full text-sm font-medium">
                          Low Stock
                        </span>
                      </td>
                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="3"
                      className="text-center py-10 text-gray-500"
                    >

                      No low stock products available.

                    </td>

                  </tr>

                )

              }

            </tbody>

          </table>

        </div>

        {/* Inventory Summary */}

        <div className="bg-white rounded-2xl shadow-md p-6">

          <h2 className="text-2xl font-bold text-gray-800 mb-6">

            Inventory Summary

          </h2>

          <div className="space-y-5">

            <div className="flex justify-between items-center bg-green-50 rounded-xl px-4 py-3">

              <span className="text-gray-700 font-medium">

                Healthy Stock

              </span>

              <span className="text-green-700 font-bold text-xl">

                {dashboard.inventorySummary.healthyStock}

              </span>

            </div>

            <div className="flex justify-between items-center bg-yellow-50 rounded-xl px-4 py-3">

              <span className="text-gray-700 font-medium">

                Low Stock

              </span>

              <span className="text-yellow-600 font-bold text-xl">

                {dashboard.inventorySummary.lowStock}

              </span>

            </div>

            <div className="flex justify-between items-center bg-red-50 rounded-xl px-4 py-3">

              <span className="text-gray-700 font-medium">

                Out of Stock

              </span>

              <span className="text-red-600 font-bold text-xl">

                {dashboard.inventorySummary.outOfStock}

              </span>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

};

export default Dashboard;