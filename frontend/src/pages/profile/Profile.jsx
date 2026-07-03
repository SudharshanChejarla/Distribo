import { useEffect, useState } from "react";
import {
    getProfile,
    changePassword,
    deleteAccount
} from "../../services/profileService";

import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

const Profile = () => {

    const [profile, setProfile] = useState({

        fullName: "",
        email: ""

    });

    const [formData, setFormData] = useState({

        currentPassword: "",
        newPassword: "",
        confirmPassword: ""

    });

    const navigate = useNavigate();

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [deletePassword, setDeletePassword] = useState("");

    const [deleting, setDeleting] = useState(false);

    // Read form values
    const handleChange = (event) => {

        setFormData({

            ...formData,
            [event.target.name]: event.target.value

        });

    };

    // Get profile details
    const fetchProfile = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await getProfile(token);

            setProfile(response.profile);

        }

        catch (error) {

            console.log(error);

        }

    };

    // Update password
    const handleSubmit = async (event) => {

        event.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {

            toast.error("Passwords do not match.");
            return;

        }

        try {

            const token = localStorage.getItem("token");

            const response = await changePassword(

                {
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                },

                token

            );

            toast.success(response.message);
            setFormData({

                currentPassword: "",
                newPassword: "",
                confirmPassword: ""

            });

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||
                "Something went wrong."

            );

        }

    };

    const handleDeleteAccount = async () => {

        if (!deletePassword.trim()) {

            toast.error("Please enter your password.");

            return;

        }

        try {

            setDeleting(true);

            const token = localStorage.getItem("token");

            const response = await deleteAccount(deletePassword, token);

            toast.success(response.message);

            localStorage.clear();

            navigate("/");

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Unable to delete account."

            );

        }

        finally {

            setDeleting(false);

        }

    };

    useEffect(() => {

        fetchProfile();

    }, []);


    return (

        <div className="max-w-4xl mx-auto p-8">

            {/* Heading */}

            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">

                Profile

            </h1>

            {/* Personal Information */}

            <div className="bg-white rounded-2xl shadow-md p-8 mb-8">

                <h2 className="text-2xl font-semibold text-gray-800 mb-8">

                    Personal Information

                </h2>

                <div className="space-y-6">

                    <div>

                        <p className="text-sm font-medium text-gray-500 mb-2">

                            Full Name

                        </p>

                        <div className="bg-slate-50 rounded-xl px-5 py-4">

                            <p className="text-lg font-semibold text-gray-800">

                                {profile.fullName}

                            </p>

                        </div>

                    </div>

                    <div>

                        <p className="text-sm font-medium text-gray-500 mb-2">

                            Email

                        </p>

                        <div className="bg-slate-50 rounded-xl px-5 py-4">

                            <p className="text-lg text-gray-700">

                                {profile.email}

                            </p>

                        </div>

                    </div>

                </div>

            </div>

            {/* Change Password */}

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl shadow-md p-8"
            >

                <h2 className="text-2xl font-semibold text-gray-800 mb-8">

                    Change Password

                </h2>

                <div className="mb-6">

                    <label className="block text-sm font-medium text-gray-600 mb-2">

                        Current Password

                    </label>

                    <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        required
                        className="
                        w-full
                        px-4
                        py-3
                        rounded-xl
                        bg-slate-50
                        border
                        border-slate-200
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500
                        focus:border-blue-500
                        transition-all
                    "
                    />

                </div>

                <div className="mb-6">

                    <label className="block text-sm font-medium text-gray-600 mb-2">

                        New Password

                    </label>

                    <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                        className="
                        w-full
                        px-4
                        py-3
                        rounded-xl
                        bg-slate-50
                        border
                        border-slate-200
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500
                        focus:border-blue-500
                        transition-all
                    "
                    />

                </div>

                <div className="mb-8">

                    <label className="block text-sm font-medium text-gray-600 mb-2">

                        Confirm Password

                    </label>

                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="
                        w-full
                        px-4
                        py-3
                        rounded-xl
                        bg-slate-50
                        border
                        border-slate-200
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500
                        focus:border-blue-500
                        transition-all
                    "
                    />

                </div>

                <button
                    type="submit"
                    className="
                    w-full
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    font-semibold
                    py-3
                    rounded-xl
                    shadow-sm
                    transition-all
                    duration-200
                "
                >

                    Update Password

                </button>

            </form>

            <div className="bg-white rounded-2xl shadow-md border border-red-200 p-8 mt-8">

                <h2 className="text-2xl font-semibold text-red-600">

                    Danger Zone

                </h2>

                <p className="text-gray-600 mt-3">

                    Deleting your account will permanently remove:

                </p>

                <ul className="list-disc ml-6 mt-4 text-gray-700 space-y-2">

                    <li>Profile</li>

                    <li>Products</li>

                    <li>Stock Entries</li>

                    <li>Sales Executives</li>

                    <li>Dispatch Records</li>

                    <li>Return Records</li>

                </ul>

                <p className="text-red-600 font-medium mt-5">

                    This action cannot be undone.

                </p>

                <button

                    onClick={() => setShowDeleteModal(true)}

                    className="
        mt-6
        bg-red-600
        hover:bg-red-700
        text-white
        px-6
        py-3
        rounded-xl
        transition
        "

                >

                    Delete Account

                </button>

            </div>

            {
                showDeleteModal && (

                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

                        <div className="bg-white rounded-2xl p-8 w-[90%] max-w-md">

                            <h2 className="text-2xl font-bold text-red-600">

                                Delete Account

                            </h2>

                            <p className="text-gray-600 mt-4">

                                This action is permanent.

                                <br />

                                Enter your password to continue.

                            </p>

                            <input

                                type="password"

                                placeholder="Password"

                                value={deletePassword}

                                onChange={(e) => setDeletePassword(e.target.value)}

                                className="
            mt-6
            w-full
            px-4
            py-3
            rounded-xl
            border
            border-gray-300
            focus:ring-2
            focus:ring-red-500
            outline-none
            "

                            />

                            <div className="flex justify-end gap-3 mt-8">

                                <button

                                    onClick={() => {

                                        setShowDeleteModal(false);

                                        setDeletePassword("");

                                    }}

                                    className="px-5 py-2 rounded-xl border"

                                >

                                    Cancel

                                </button>

                                <button

                                    onClick={handleDeleteAccount}

                                    disabled={deleting}

                                    className="
                bg-red-600
                hover:bg-red-700
                text-white
                px-5
                py-2
                rounded-xl
                disabled:opacity-50
                "

                                >

                                    {

                                        deleting

                                            ?

                                            "Deleting..."

                                            :

                                            "Delete Account"

                                    }

                                </button>

                            </div>

                        </div>

                    </div>

                )
            }

        </div>

    );
};

export default Profile;