import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLE_HOME } from '../../constants/roles';
import AuthLayout from '../../components/auth/AuthLayout';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';

export default function ForgotPassword() {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROLE_HOME[user.role] ?? '/dashboard'} replace />;
  }

  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}