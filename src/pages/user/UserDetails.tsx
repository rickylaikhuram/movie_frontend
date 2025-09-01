// pages/profile/Profile.tsx
import React, { useState, useEffect } from "react";
import instance from "../../utils/axios"; // Adjust path as needed
import { User } from "lucide-react";

interface User {
  name: string;
  id: string;
  email: string;
  profileUrl: string | null;
  createdAt: Date;
}

interface EditingState {
  personalInfo: boolean;
  email: boolean;
}

interface FormData {
  name: string;
  email: string;
}

interface FormErrors {
  name?: string;
  email?: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
  });
  const [originalData, setOriginalData] = useState<FormData>({
    name: "",
    email: "",
  });
  const [editing, setEditing] = useState<EditingState>({
    personalInfo: false,
    email: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<keyof EditingState | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await instance.get('/api/user'); // Adjust endpoint as needed
      const userData = response.data.user;
      setUser(userData);
      
      const formattedData = {
        name: userData.name || "",
        email: userData.email || "",
      };
      setFormData(formattedData);
      setOriginalData(formattedData);
    } catch (error: any) {
      setErrors({ email: error.response?.data?.message || "Failed to load user data" });
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return undefined;
  };

  const validateName = (name: string): string | undefined => {
    if (!name.trim()) return "Name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    return undefined;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear specific error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    setSuccessMessage("");
  };

  const handleEdit = (section: keyof EditingState) => {
    setEditing({
      personalInfo: false,
      email: false,
      [section]: true,
    });
    setErrors({});
    setSuccessMessage("");
  };

  const handleCancel = (section: keyof EditingState) => {
    setFormData(originalData);
    setEditing({
      ...editing,
      [section]: false,
    });
    setErrors({});
    setSuccessMessage("");
  };

  const handleSave = async (section: keyof EditingState) => {
    setErrors({});
    setSuccessMessage("");
    
    try {
      setSaving(section);
      
      if (section === "personalInfo") {
        const nameError = validateName(formData.name);
        if (nameError) {
          setErrors({ name: nameError });
          return;
        }
        
        const response = await instance.patch('/user/profile', {
          name: formData.name.trim()
        });
        
        setUser(response.data);
        setOriginalData(formData);
        setEditing({ ...editing, [section]: false });
        setSuccessMessage("Name updated successfully!");
        
      } else if (section === "email") {
        const emailError = validateEmail(formData.email);
        if (emailError) {
          setErrors({ email: emailError });
          return;
        }
        
        const response = await instance.patch('/user/profile', {
          email: formData.email
        });
        
        setUser(response.data);
        setOriginalData(formData);
        setEditing({ ...editing, [section]: false });
        setSuccessMessage("Email updated successfully!");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to update profile";
      setErrors({ [section]: errorMessage });
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 rounded-lg"></div>
              <div className="h-12 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <p className="text-gray-600 text-lg">Unable to load profile data</p>
            <button 
              onClick={fetchUserData}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
            {user.profileUrl ? (
              <img 
                src={user.profileUrl} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-5xl font-bold">
                <User className="text-blue-600 w-15 h-15"/>
              </span>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-blue-100 mt-1">{user.email}</p>
            <p className="text-blue-200 text-sm mt-2">
              Member since {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long"
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center">
          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {successMessage}
        </div>
      )}

      {/* Personal Information Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
              <p className="text-sm text-gray-500 mt-1">Update your personal details</p>
            </div>
            {!editing.personalInfo && (
              <button
                onClick={() => handleEdit("personalInfo")}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                readOnly={!editing.personalInfo}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                  editing.personalInfo
                    ? "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    : "bg-gray-50 border-gray-200 cursor-not-allowed"
                } ${errors.name ? "border-red-500 focus:ring-red-500" : ""}`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.name}
                </p>
              )}
            </div>

            {editing.personalInfo && (
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => handleCancel("personalInfo")}
                  className="px-6 py-2 text-gray-600 hover:text-gray-700 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSave("personalInfo")}
                  disabled={saving === "personalInfo"}
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving === "personalInfo" ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Email Address Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Email Address</h2>
              <p className="text-sm text-gray-500 mt-1">Manage your email address</p>
            </div>
            {!editing.email && (
              <button
                onClick={() => handleEdit("email")}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                readOnly={!editing.email}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                  editing.email
                    ? "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    : "bg-gray-50 border-gray-200 cursor-not-allowed"
                } ${errors.email ? "border-red-500 focus:ring-red-500" : ""}`}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>

            {editing.email && (
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => handleCancel("email")}
                  className="px-6 py-2 text-gray-600 hover:text-gray-700 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSave("email")}
                  disabled={saving === "email"}
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving === "email" ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account Information Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
            <p className="text-sm text-gray-500 mt-1">View your account details</p>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User ID
              </label>
              <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 font-mono text-sm">
                {user.id}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Created
              </label>
              <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;