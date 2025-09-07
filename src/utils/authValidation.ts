export const validateEmail = (email: string): string => {
  if (!email) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "Please enter a valid email address.";
  return "";
};

const MIN_PASSWORD_LENGTH = 6;

export const validatePassword = (password: string): string => {
  if (!password) return "Password is required.";
  if (password.length < MIN_PASSWORD_LENGTH)
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  return "";
};

export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): string => {
  if (!confirmPassword) return "Please confirm your password.";
  if (password !== confirmPassword) return "Passwords do not match.";
  return "";
};

export const getFirebaseErrorMessage = (error: any): string => {
  const msg = error.message || "An error occurred";

  if (msg.includes("invalid-credential") || msg.includes("user-not-found")) {
    return "The password is invalid or the user does not exist.";
  }
  if (msg.includes("too-many-requests")) {
    return "Access temporarily disabled due to failed attempts.";
  }
  if (msg.includes("email-already-in-use")) {
    return "An account with this email already exists.";
  }
  if (msg.includes("weak-password")) {
    return "Password is too weak. Please choose a stronger password.";
  }

  return msg;
};
