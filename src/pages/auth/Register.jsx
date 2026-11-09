import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLE_HOME } from '../../constants/roles';
import AuthLayout from '../../components/auth/AuthLayout';
import RegisterForm from '../../components/auth/RegisterForm';

export default function Register() {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROLE_HOME[user.role] ?? '/dashboard'} replace />;
  }

  return (
    <AuthLayout wide>
      <RegisterForm />
    </AuthLayout>
  );
}