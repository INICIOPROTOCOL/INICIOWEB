import { Loader2 } from 'lucide-react';

interface LoaderProps {
  text?: string;
  color?: string;
  size?: number;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ text = 'Cargando...', color = '#022550', size = 32, className = '' }) => (
  <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
    <Loader2 className="animate-spin mb-2" style={{ color, width: size, height: size }} />
    <span className="text-gray-600 text-lg font-medium">{text}</span>
  </div>
);

export default Loader;
