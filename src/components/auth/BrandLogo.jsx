import { Landmark } from 'lucide-react';
import { INSTITUTION_NAME, LOGO_SRC } from '../../config/appConfig';

export default function BrandLogo({ size = 56 }) {
  if (LOGO_SRC) {
    return <img src={LOGO_SRC} alt={`Logo ${INSTITUTION_NAME}`} style={{ height: size }} />;
  }
  return (
    <div className="logo-box" style={{ width: size, height: size }}>
      <Landmark size={size * 0.5} />
    </div>
  );
}