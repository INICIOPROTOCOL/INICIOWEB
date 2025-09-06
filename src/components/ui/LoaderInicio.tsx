import { Home } from 'lucide-react';

interface LoaderInicioProps {
  text?: string;
  color?: string;
  size?: number;
  className?: string;
}

const LoaderInicio = ({ text = 'Cargando...', color = '#022550', size = 48, className = '' }: LoaderInicioProps) => (
  <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
    <div className="animate-spin-slow">
      <Home style={{ color }} className="mx-auto" width={size} height={size} />
    </div>
    <span className="mt-4 text-lg text-[#022550] font-semibold">{text}</span>
  </div>
);

export default LoaderInicio;
export type { LoaderInicioProps };
