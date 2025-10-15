// Versión de build generada automáticamente
export const BUILD_VERSION = Date.now().toString();
export const BUILD_DATE = new Date().toISOString();

// Función para verificar si hay una nueva versión
export const checkVersion = () => {
  const storedVersion = localStorage.getItem('app-build-version');
  if (storedVersion && storedVersion !== BUILD_VERSION) {
    console.log(`🔄 Nueva versión detectada: ${BUILD_VERSION} (anterior: ${storedVersion})`);
    return true;
  }
  localStorage.setItem('app-build-version', BUILD_VERSION);
  return false;
};