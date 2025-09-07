import React, { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonText,
  IonIcon,
} from "@ionic/react";
import { eyeOutline, eyeOffOutline } from "ionicons/icons";
import { useAuthContext } from "../../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import {
  validateEmail,
  validatePassword,
  getFirebaseErrorMessage,
} from "../../utils/authValidation";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const [touched, setTouched] = useState({ email: false, password: false });
  const { signIn, user } = useAuthContext();
  const history = useHistory();

  const validate = (field: string, value: string) => {
    if (field === "email") return validateEmail(value);
    if (field === "password") return validatePassword(value);
    return "";
  };

  const handleChange =
    (field: "email" | "password") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      field === "email" ? setEmail(value) : setPassword(value);
      if (touched[field]) {
        setErrors((prev) => ({ ...prev, [field]: validate(field, value) }));
      }
    };

  const handleBlur = (field: "email" | "password") => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const value = field === "email" ? email : password;
    setErrors((prev) => ({ ...prev, [field]: validate(field, value) }));
  };

  // Redirect if user is already logged in
  React.useEffect(() => {
    if (user) {
      history.push("/people");
    }
  }, [user, history]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    setErrors({ email: emailErr, password: passwordErr, general: "" });
    setTouched({ email: true, password: true });

    if (emailErr || passwordErr) return;

    setLoading(true);

    try {
      await signIn(email, password);
      history.push("/people");
    } catch (err: any) {
      const errorMsg = getFirebaseErrorMessage(err);
      if (
        errorMsg.includes("password is invalid") ||
        errorMsg.includes("temporarily disabled")
      ) {
        setErrors((prev) => ({ ...prev, email: errorMsg, general: "" }));
      } else {
        setErrors((prev) => ({ ...prev, general: errorMsg }));
      }
    } finally {
      setLoading(false);
    }
  };

  // Don't render if user is logged in
  if (user) {
    return null;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Sign In</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="flex min-h-full items-center justify-center bg-gray-50">
          <div className="w-full max-w-md bg-white rounded-2xl p-12 shadow-lg">
            {/* Title */}
            <div className="text-4xl font-extrabold leading-tight tracking-tight mb-2">
              Sign in
            </div>
            <div className="flex items-baseline font-medium text-sm mb-8">
              <span>Don't have an account?</span>
              <a href="/signup" className="ml-1 text-blue-500 hover:underline">
                Sign up
              </a>
            </div>

            {/* Error Alert */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <IonText color="danger">
                  <p className="text-sm">{errors.general}</p>
                </IonText>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={handleChange("email")}
                    onBlur={handleBlur("email")}
                    className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none ${
                      errors.email
                        ? "border-red-500 focus:ring-red-500"
                        : touched.email && !errors.email
                        ? "border-green-500 focus:ring-green-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {touched.email && (
                    <IonIcon
                      icon={
                        errors.email
                          ? "alert-circle-outline"
                          : "checkmark-outline"
                      }
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                        errors.email ? "text-red-500" : "text-green-500"
                      }`}
                    />
                  )}
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handleChange("password")}
                    onBlur={handleBlur("password")}
                    className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none ${
                      errors.password
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <IonIcon
                      icon={showPassword ? eyeOffOutline : eyeOutline}
                      className="text-lg"
                    />
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Remember me
                  </span>
                </label>
                <a
                  href="/forgot-password"
                  className="text-sm text-blue-500 hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={
                  loading ||
                  !!errors.email ||
                  !!errors.password ||
                  !email ||
                  !password
                }
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
