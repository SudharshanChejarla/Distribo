import { Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import AddProduct from "./pages/inventory/AddProduct";
import AddStock from "./pages/inventory/AddStock";
import SalesExecutive from "./pages/salesExecutive/salesExecutive";
import Dispatch from "./pages/dispatch/Dispatch";
import ReturnSales from "./pages/returnSales/ReturnSales";
import Report from "./pages/report/Report";
import Profile from "./pages/profile/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<DashboardLayout />}>

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile  />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />


        <Route
          path="/inventory/add-product"
          element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory/add-stock"
          element={
            <ProtectedRoute>
              <AddStock />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sales-executives"
          element={
            <ProtectedRoute>
              <SalesExecutive />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dispatch"
          element={
            <ProtectedRoute>
              <Dispatch />
            </ProtectedRoute>
          }
        />

         <Route
          path="/returns-sales"
          element={
            <ProtectedRoute>
              <ReturnSales />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Report />
            </ProtectedRoute>
          }
        />


      </Route>
    </Routes>
  );
}


export default App;