import { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import { toast } from "react-toastify";

import {
    getExecutives,
    addExecutive,
    updateExecutive,
    deleteExecutive,
} from "../../services/salesExecutiveService";

const SalesExecutive = () => {
    // Store all executives
    const [executives, setExecutives] = useState([]);

    // Show add/edit form
    const [showForm, setShowForm] = useState(false);

    // Store currently editing executive id
    const [editingId, setEditingId] = useState(null);

    // Show loading spinner
    const [loading, setLoading] = useState(false);

    // Store delete confirmation id
    const [deleteId, setDeleteId] = useState(null);

    // Store form data
    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: "",
    });

    // Load executives on page load
    useEffect(() => {
        fetchExecutives();
    }, []);

    // Fetch all executives
    const fetchExecutives = async () => {
        try {
            setLoading(true);

            const response = await getExecutives();

            setExecutives(response.executives || []);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to load sales executives."
            );
        } finally {
            setLoading(false);
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Allow only digits for phone number
        if (name === "phoneNumber" && !/^\d*$/.test(value)) {
            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Validate form fields
    const validateForm = () => {
        if (!formData.name.trim()) {
            toast.error("Executive name is required.");
            return false;
        }

        if (!formData.phoneNumber.trim()) {
            toast.error("Phone number is required.");
            return false;
        }

        if (!/^[6-9]\d{9}$/.test(formData.phoneNumber)) {
            toast.error("Enter a valid 10-digit phone number.");
            return false;
        }

        return true;
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            name: "",
            phoneNumber: "",
        });

        setEditingId(null);

        setShowForm(false);
    };

    // Open add executive form
    const handleAddClick = () => {
        setEditingId(null);

        setFormData({
            name: "",
            phoneNumber: "",
        });

        setShowForm(true);
    };

    // Save or update executive
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            if (editingId) {
                await updateExecutive(editingId, formData);

                toast.success("Sales Executive updated successfully.");
            } else {
                await addExecutive(formData);

                toast.success("Sales Executive added successfully.");
            }

            resetForm();

            fetchExecutives();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Something went wrong."
            );
        }
    };

    // Populate form for editing
    const handleEdit = (executive) => {
        setEditingId(executive._id);

        setFormData({
            name: executive.name,
            phoneNumber: executive.phoneNumber,
        });

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // Open delete confirmation
    const openDeleteModal = (id) => {
        setDeleteId(id);
    };

    // Close delete confirmation
    const closeDeleteModal = () => {
        setDeleteId(null);
    };

    // Delete executive
    const handleDelete = async () => {
        try {
            await deleteExecutive(deleteId);

            toast.success("Sales Executive deleted successfully.");

            closeDeleteModal();

            fetchExecutives();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to delete sales executive."
            );
        }
    };


    return (
        <div className="min-h-screen bg-gray-100 p-6">

            {/* Page Header */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>

                    <h1 className="text-3xl font-bold text-gray-800">
                        Sales Executives
                    </h1>

                    <p className="mt-1 text-gray-500">
                        Add, update and manage your sales executives.
                    </p>

                </div>

                {/* Add Executive Button */}
                {!showForm && (
                    <button
                        onClick={handleAddClick}
                        className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white shadow transition duration-200 hover:bg-blue-700"
                    >
                        <FiPlus size={18} />
                        Add Executive
                    </button>
                )}

            </div>

            {/* Add / Edit Form */}
            {showForm && (

                <div className="mb-8 rounded-xl bg-white p-6 shadow">

                    {/* Form Header */}
                    <div className="mb-6 flex items-center justify-between">

                        <h2 className="text-xl font-semibold text-gray-800">

                            {editingId
                                ? "Update Sales Executive"
                                : "Add Sales Executive"}

                        </h2>

                        <button
                            onClick={resetForm}
                            className="rounded-full p-2 transition hover:bg-gray-100"
                        >
                            <FiX size={22} />
                        </button>

                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 gap-6 md:grid-cols-2"
                    >

                        {/* Executive Name */}
                        <div>

                            <label className="mb-2 block font-medium text-gray-700">
                                Executive Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter executive name"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />

                        </div>

                        {/* Phone Number */}
                        <div>

                            <label className="mb-2 block font-medium text-gray-700">
                                Phone Number
                            </label>

                            <input
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                maxLength={10}
                                placeholder="Enter phone number"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />

                        </div>

                        {/* Buttons */}
                        <div className="col-span-full flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={resetForm}
                                className="rounded-lg border border-gray-300 px-5 py-3 font-medium transition hover:bg-gray-100"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow transition hover:bg-blue-700"
                            >
                                {editingId ? "Update Executive" : "Save Executive"}
                            </button>

                        </div>

                    </form>

                </div>

            )}

            {/* Executive List */}
            <div className="overflow-hidden rounded-xl bg-white shadow">

                {/* Table Header */}
                <div className=" px-6 py-4">

                    <h2 className="text-lg font-semibold text-gray-800">
                        Executive List
                    </h2>

                </div>

                {/* Loading */}
                {loading ? (

                    <div className="flex h-44 items-center justify-center">

                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>

                    </div>

                ) : executives.length === 0 ? (

                    <div className="flex h-44 flex-col items-center justify-center gap-2">

                        <p className="text-lg font-medium text-gray-600">
                            No Sales Executives Found
                        </p>

                        <p className="text-sm text-gray-400">
                            Click "Add Executive" to create your first executive.
                        </p>

                    </div>

                ) : (

                    <div className="max-h-[500px] overflow-y-auto">

                        <table className="min-w-full">

                            <thead className="sticky top-0 bg-gray-200">

                                <tr>

                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide text-gray-700">
                                        Name
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide text-gray-700">
                                        Phone Number
                                    </th>

                                    <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wide text-gray-700">
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {executives.map((executive) => (

                                    <tr
                                        key={executive._id}
                                        className="border-b border-gray-300 transition hover:bg-gray-50"
                                    >

                                        {/* Name */}
                                        <td className="px-6 py-4 font-medium text-gray-800">
                                            {executive.name}
                                        </td>

                                        {/* Phone */}
                                        <td className="px-6 py-4 text-gray-600">
                                            {executive.phoneNumber}
                                        </td>

                                        {/* Action Buttons */}
                                        <td className="px-6 py-4">

                                            <div className="flex justify-center gap-3">

                                                {/* Edit */}
                                                <button
                                                    onClick={() => handleEdit(executive)}
                                                    className="rounded-lg bg-yellow-100 p-2 text-yellow-600 transition hover:bg-yellow-200"
                                                >
                                                    <FiEdit2 size={18} />
                                                </button>

                                                {/* Delete */}
                                                <button
                                                    onClick={() => openDeleteModal(executive._id)}
                                                    className="rounded-lg bg-red-100 p-2 text-red-600 transition hover:bg-red-200"
                                                >
                                                    <FiTrash2 size={18} />
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">

                        {/* Modal Title */}
                        <h2 className="text-xl font-semibold text-gray-800">
                            Delete Sales Executive
                        </h2>

                        {/* Modal Message */}
                        <p className="mt-3 text-gray-600">
                            Are you sure you want to delete this sales executive?
                        </p>

                        <p className="mt-1 text-sm text-red-500">
                            This action cannot be undone.
                        </p>

                        {/* Modal Buttons */}
                        <div className="mt-6 flex justify-end gap-3">

                            <button
                                onClick={closeDeleteModal}
                                className="rounded-lg border border-gray-300 px-5 py-2 font-medium text-gray-700 transition hover:bg-gray-100"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDelete}
                                className="rounded-lg bg-red-600 px-5 py-2 font-medium text-white transition hover:bg-red-700"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
};

export default SalesExecutive;

