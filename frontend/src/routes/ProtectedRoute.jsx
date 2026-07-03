// User opens /dashboard

// Token Exists?
//     YES → Allow Access
//     NO  → Redirect to Login

import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {

  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;

// Currently if token exists:
// token = abc123
// ProtectedRoute allows access.
// But what if:
// token = garbagevalue ?
// ProtectedRoute still allows access because it only checks existence.
// For your Phase 1 MVP, that's okay.

// Later we'll improve it:
// Token Exists
// ↓
// Call /auth/profile
// ↓
// Backend verifies JWT
// ↓
// Allow Dashboard

// That's the production-grade version