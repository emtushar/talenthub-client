import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Briefcase,
  AlertCircle,
  ArrowRight,
  Shield,
  Users,
  Award,
} from "lucide-react";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/profile";

  // Compact password requirements
  const getPasswordScore = () => {
    const checks = [
      formData.password.length >= 8,
      /[A-Z]/.test(formData.password),
      /[a-z]/.test(formData.password),
      /\d/.test(formData.password),
      /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
    ];
    return checks.filter(Boolean).length;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = "Email required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email";

    if (!formData.password) newErrors.password = "Password required";

    if (!isLogin) {
      if (!formData.fullName) newErrors.fullName = "Name required";
      else if (formData.fullName.length < 2)
        newErrors.fullName = "Name too short";

      if (!formData.confirmPassword)
        newErrors.confirmPassword = "Confirm password";
      else if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords don't match";

      if (getPasswordScore() < 4) newErrors.password = "Password too weak";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const endpoint = isLogin
        ? `${API_BASE_URL}/login`
        : `${API_BASE_URL}/register`;
      const requestData = isLogin
        ? { email: formData.email, password: formData.password }
        : {
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
          };

      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/profile");
      } else {
        setErrors({
          general: response.message || data.error || "Authentication failed",
        });
      }
    } catch (error) {
      setErrors(error);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordScore = !isLogin ? getPasswordScore() : 0;
  const passwordStrength = ["Very Weak", "Weak", "Fair", "Good", "Strong"][
    passwordScore
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl mx-auto">
        {/* Mobile Layout */}
        <div className="lg:hidden max-w-sm mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-3">
                <Briefcase className="h-7 w-7 text-blue-600 mr-2" />
                <span className="text-xl font-bold text-blue-600">
                  TalentHub
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-1">
                {isLogin ? "Welcome Back" : "Join Us"}
              </h2>
              <p className="text-sm text-slate-600">
                {isLogin ? "Sign in to continue" : "Create your account"}
              </p>
            </div>
            {renderForm()}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-8 items-center">
          {/* Left Side - Branding (3 columns) */}
          <div className="col-span-3 px-8">
            <div className="max-w-lg">
              <div className="flex items-center mb-6">
                <div className="relative mr-3">
                  <Briefcase className="h-10 w-10 text-blue-600" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"></div>
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  TalentHub
                </span>
              </div>

              <h1 className="text-3xl font-bold text-slate-800 mb-4 leading-tight">
                Your Professional <br />
                <span className="text-blue-600">Journey Awaits</span>
              </h1>

              <p className="text-lg text-slate-600 mb-8">
                Connect with opportunities, showcase your talents, and grow your
                career.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  {
                    icon: Shield,
                    text: "Secure & trusted platform",
                    color: "text-blue-600",
                  },
                  {
                    icon: Users,
                    text: "Connect with top employers",
                    color: "text-green-600",
                  },
                  {
                    icon: Award,
                    text: "Skill-based matching",
                    color: "text-purple-600",
                  },
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <feature.icon className={`h-5 w-5 ${feature.color} mr-3`} />
                    <span className="text-slate-700">{feature.text}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200">
                {[
                  { value: "50K+", label: "Jobs", color: "text-blue-600" },
                  {
                    value: "15K+",
                    label: "Companies",
                    color: "text-green-600",
                  },
                  { value: "100K+", label: "Users", color: "text-purple-600" },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className={`text-xl font-bold ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-slate-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Form (2 columns) */}
          <div className="col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  {isLogin ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="text-slate-600 text-sm">
                  {isLogin
                    ? "Sign in to your account"
                    : "Join our professional community"}
                </p>
              </div>
              {renderForm()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function renderForm() {
    return (
      <>
        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={`w-full pl-9 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                    errors.fullName
                      ? "border-red-300 bg-red-50"
                      : "border-slate-300"
                  }`}
                  required
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className={`w-full pl-9 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                  errors.email ? "border-red-300 bg-red-50" : "border-slate-300"
                }`}
                required
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={isLogin ? "Enter password" : "Create password"}
                className={`w-full pl-9 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                  errors.password
                    ? "border-red-300 bg-red-50"
                    : "border-slate-300"
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Compact Password Strength Indicator */}
            {!isLogin && formData.password && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      passwordScore === 5
                        ? "bg-green-500"
                        : passwordScore >= 4
                        ? "bg-blue-500"
                        : passwordScore >= 3
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${(passwordScore / 5) * 100}%` }}
                  />
                </div>
                <span
                  className={`text-xs font-medium ${
                    passwordScore === 5
                      ? "text-green-600"
                      : passwordScore >= 4
                      ? "text-blue-600"
                      : passwordScore >= 3
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {passwordStrength}
                </span>
              </div>
            )}

            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password}</p>
            )}
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm password"
                  className={`w-full pl-9 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                    errors.confirmPassword
                      ? "border-red-300 bg-red-50"
                      : "border-slate-300"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2 text-sm ${
              isLoading ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <>
                <span>{isLogin ? "Sign In" : "Create Account"}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-4 pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({
                  email: "",
                  password: "",
                  fullName: "",
                  confirmPassword: "",
                });
                setErrors({});
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </>
    );
  }
};

export default AuthPage;
