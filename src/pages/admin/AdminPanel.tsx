import React, { useState } from 'react';
import { 
  Home, 
  MapPin, 
  Tag, 
  Tags, 
  ArrowLeftRight, 
  Building,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TiposPropiedad from './TiposPropiedad';
import Ubicaciones from './Ubicaciones';
import Caracteristicas from './Caracteristicas';
import TiposCaracteristica from './TiposCaracteristica';
import TiposOperacion from './TiposOperacion';
import Propiedades from './Propiedades';

type AdminSection = 
  | 'dashboard' 
  | 'tipos-propiedad' 
  | 'ubicaciones' 
  | 'caracteristicas' 
  | 'tipos-caracteristica'
  | 'tipos-operacion' 
  | 'propiedades';

const AdminPanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    {
      id: 'dashboard' as AdminSection,
      label: 'Panel Principal',
      icon: Home,
      description: 'Resumen del sistema'
    },
    {
      id: 'propiedades' as AdminSection,
      label: 'Propiedades',
      icon: Building,
      description: 'Gestionar propiedades'
    },
    {
      id: 'tipos-propiedad' as AdminSection,
      label: 'Tipos de Propiedad',
      icon: Home,
      description: 'Casa, Departamento, etc.'
    },
    {
      id: 'ubicaciones' as AdminSection,
      label: 'Ubicaciones',
      icon: MapPin,
      description: 'Provincias y ciudades'
    },
    {
      id: 'tipos-caracteristica' as AdminSection,
      label: 'Tipos de Características',
      icon: Tags,
      description: 'Comodidades, Servicios, etc.'
    },
    {
      id: 'caracteristicas' as AdminSection,
      label: 'Características',
      icon: Tag,
      description: 'Piscina, Garage, etc.'
    },
    {
      id: 'tipos-operacion' as AdminSection,
      label: 'Tipos de Operación',
      icon: ArrowLeftRight,
      description: 'Venta, Alquiler, etc.'
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'tipos-propiedad':
        return <TiposPropiedad />;
      case 'ubicaciones':
        return <Ubicaciones />;
      case 'caracteristicas':
        return <Caracteristicas />;
      case 'tipos-caracteristica':
        return <TiposCaracteristica />;
      case 'tipos-operacion':
        return <TiposOperacion />;
      case 'propiedades':
        return <Propiedades />;
      default:
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-[#022550]">Panel de Administración</h1>
              <p className="text-gray-600 mt-1">Gestiona todos los aspectos del sistema inmobiliario</p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {menuItems.slice(1).map(item => (
                <Card 
                  key={item.id} 
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
                  onClick={() => setActiveSection(item.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-r from-[#ec520b] to-[#ff6b1a] rounded-lg">
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg text-[#022550]">{item.label}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header móvil */}
      <div className="lg:hidden bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#022550]">Admin Panel</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:sticky top-0 z-30 lg:z-auto w-64 h-screen bg-white shadow-lg transition-transform duration-300 ease-in-out`}>
          
          {/* Logo/Header */}
          <div className="p-6 border-b bg-gradient-to-r from-[#022550] to-[#033366]">
            <h2 className="text-xl font-bold text-white">INICIO Admin</h2>
            <p className="text-blue-200 text-sm">Panel de Control</p>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-[#ec520b] to-[#ff6b1a] text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Overlay móvil */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Contenido principal */}
        <div className="flex-1 lg:ml-0">
          <div className="p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
