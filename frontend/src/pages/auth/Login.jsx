import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

import axiosInstance from "../../api/axiosInstance";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const { email, password } =
      formData;

    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {

      setLoading(true);

      const response =
        await axiosInstance.post(
          "/auth/login",
          formData
        );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      localStorage.setItem(
        "username",
        response.data.user.fullName
      );

      toast.success(
        response.data.message
      );

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Something went wrong"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center mb-2">
          Login
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Welcome back to Distribo
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* Email */}

          <div>

            <label className="block mb-1 text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* Password */}

          <div>

            <label className="block mb-1 text-sm font-medium">
              Password
            </label>

            <div className="relative">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-3 top-3 text-gray-500"
              >
                {
                  showPassword
                    ? <FaEyeSlash />
                    : <FaEye />
                }
              </button>

            </div>

          </div>

          {/* Submit */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition disabled:bg-gray-400"
          >
            {
              loading
                ? "Logging In..."
                : "Login"
            }
          </button>

        </form>

        <p className="text-center text-sm text-gray-600 mt-5">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline"
          >
            Register
          </Link>
        </p>

      </div>

    </div>

  );
}

export default Login;