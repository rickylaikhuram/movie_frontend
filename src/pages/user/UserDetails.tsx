// pages/profile/Profile.tsx
import React, { useState, useEffect } from "react";
import instance from "../../utils/axios";
import { User, Edit3, Check, X } from "lucide-react";

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
      const response = await instance.get('/api/user');
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
        
        const response = await instance.patch('/api/user/name', {
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
        
        const response = await instance.patch('api/user/email', {
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
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-4xl mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="space-y-4">
                <div className="h-12 bg-gray-700 rounded-lg"></div>
                <div className="h-12 bg-gray-700 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
            <div className="text-center">
              <div className="text-red-400 text-5xl mb-4">⚠️</div>
              <p className="text-gray-300 text-lg">Unable to load profile data</p>
              <button 
                onClick={fetchUserData}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-600 rounded-lg">
              <User size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Account Profile</h1>
              <p className="text-gray-400">Manage your personal information</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 mt-6">
            <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center border border-gray-600">
              {user.profileUrl ? (
                <img 
                  src={user.profileUrl} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="text-gray-400 w-8 h-8"/>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{user.name}</h2>
              <p className="text-gray-300 mt-1">{user.email}</p>
              <p className="text-gray-400 text-sm mt-1">
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
          <div className="bg-green-900/50 border border-green-700 text-green-300 px-4 py-3 rounded-lg flex items-center">
            <Check className="w-5 h-5 mr-3" />
            {successMessage}
          </div>
        )}

        {/* Personal Information Section */}
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-white">Personal Information</h2>
                <p className="text-sm text-gray-400 mt-1">Update your personal details</p>
              </div>
              {!editing.personalInfo && (
                <button
                  onClick={() => handleEdit("personalInfo")}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-300 bg-blue-900/30 rounded-lg hover:bg-blue-900/50 transition-colors"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  readOnly={!editing.personalInfo}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors bg-gray-700 text-white placeholder-gray-400 ${
                    editing.personalInfo
                      ? "border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      : "border-gray-600 cursor-not-allowed opacity-75"
                  } ${errors.name ? "border-red-500 focus:ring-red-500" : ""}`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400 flex items-center">
                    <X className="w-4 h-4 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              {editing.personalInfo && (
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => handleCancel("personalInfo")}
                    className="px-6 py-2 text-gray-400 hover:text-gray-300 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSave("personalInfo")}
                    disabled={saving === "personalInfo"}
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-white">Email Address</h2>
                <p className="text-sm text-gray-400 mt-1">Manage your email address</p>
              </div>
              {!editing.email && (
                <button
                  onClick={() => handleEdit("email")}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-300 bg-blue-900/30 rounded-lg hover:bg-blue-900/50 transition-colors"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  readOnly={!editing.email}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors bg-gray-700 text-white placeholder-gray-400 ${
                    editing.email
                      ? "border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      : "border-gray-600 cursor-not-allowed opacity-75"
                  } ${errors.email ? "border-red-500 focus:ring-red-500" : ""}`}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400 flex items-center">
                    <X className="w-4 h-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              {editing.email && (
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => handleCancel("email")}
                    className="px-6 py-2 text-gray-400 hover:text-gray-300 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSave("email")}
                    disabled={saving === "email"}
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <div>
              <h2 className="text-xl font-semibold text-white">Account Information</h2>
              <p className="text-sm text-gray-400 mt-1">View your account details</p>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  User ID
                </label>
                <div className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 font-mono text-sm">
                  {user.id}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Account Created
                </label>
                <div className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-300">
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
    </div>
  );
};

export default Profile;