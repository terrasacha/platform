import TerrasachaLogo from "components/common/TerrasachaLogo";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-terrasacha-secondary1 text-white py-12 px-4 border-t-4 border-terrasacha-primary">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <TerrasachaLogo className="h-8 w-auto" />
            </div>
            <p className="text-terrasacha-light text-lg mb-4">
              <strong className="text-terrasacha-earth">Pioneros del Mañana</strong>
            </p>
            <p className="text-terrasacha-light text-sm leading-relaxed">
              Aceleramos la transición hacia un mundo de carbono neutral a través de 
              tecnología blockchain y activos ambientales sostenibles.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-terrasacha-earth font-bold text-lg mb-4">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-terrasacha-light hover:text-terrasacha-earth transition-all duration-300 hover:translate-x-1 block"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link 
                  to="/products" 
                  className="text-terrasacha-light hover:text-terrasacha-earth transition-all duration-300 hover:translate-x-1 block"
                >
                  Productos
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-terrasacha-light hover:text-terrasacha-earth transition-all duration-300 hover:translate-x-1 block"
                >
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-terrasacha-light hover:text-terrasacha-earth transition-all duration-300 hover:translate-x-1 block"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Information */}
          <div>
            <h3 className="text-terrasacha-earth font-bold text-lg mb-4">
              Información Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/tradicion-libertad" 
                  className="text-terrasacha-light hover:text-terrasacha-earth transition-all duration-300 hover:translate-x-1 block flex items-center"
                >
                  <span className="w-2 h-2 bg-terrasacha-earth rounded-full mr-3"></span>
                  Tradición y Libertad
                </Link>
              </li>
              <li>
                <Link 
                  to="/escrituras" 
                  className="text-terrasacha-light hover:text-terrasacha-earth transition-all duration-300 hover:translate-x-1 block flex items-center"
                >
                  <span className="w-2 h-2 bg-terrasacha-earth rounded-full mr-3"></span>
                  Escrituras
                </Link>
              </li>
              <li>
                <Link 
                  to="/planos-catastrales" 
                  className="text-terrasacha-light hover:text-terrasacha-earth transition-all duration-300 hover:translate-x-1 block flex items-center"
                >
                  <span className="w-2 h-2 bg-terrasacha-earth rounded-full mr-3"></span>
                  Planos Catastrales
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy-policy" 
                  className="text-terrasacha-light hover:text-terrasacha-earth transition-all duration-300 hover:translate-x-1 block flex items-center"
                >
                  <span className="w-2 h-2 bg-terrasacha-earth rounded-full mr-3"></span>
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-terrasacha-light hover:text-terrasacha-earth transition-all duration-300 hover:translate-x-1 block flex items-center"
                >
                  <span className="w-2 h-2 bg-terrasacha-earth rounded-full mr-3"></span>
                  Términos y Condiciones
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-terrasacha-primary pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-terrasacha-light text-sm">
              Copyright © {year} Terrasacha. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-terrasacha-earth text-sm font-semibold">
                Siguenos en:
              </span>
              <div className="flex gap-3">
                <a 
                  href="#" 
                  className="w-8 h-8 bg-terrasacha-primary hover:bg-terrasacha-secondary2 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-terrasacha"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-8 h-8 bg-terrasacha-primary hover:bg-terrasacha-secondary2 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-terrasacha"
                  aria-label="Twitter"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-8 h-8 bg-terrasacha-primary hover:bg-terrasacha-secondary2 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-terrasacha"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.928-.875-1.418-2.026-1.418-3.323s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
