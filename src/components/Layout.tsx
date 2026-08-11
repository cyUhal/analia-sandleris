/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram, ArrowLeft } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on navigate
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Obras', href: '/obras' },
    { name: 'Bio', href: '/bio' },
    { name: 'Prensa', href: '/prensa' },
    { name: 'Contacto', href: '/contacto' },
  ];

  const isNegative = pathname !== '/' && pathname !== '';

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${
      isNegative 
        ? `${scrolled ? 'py-4 md:py-6 border-b border-paper/10 bg-ink/95' : 'py-6 md:py-8 bg-ink border-b border-paper/10'} backdrop-blur-md opacity-100 translate-y-0 text-paper` 
        : scrolled 
          ? 'bg-paper/95 backdrop-blur-md py-4 md:py-6 border-b border-ink/5 opacity-100 translate-y-0 text-ink' 
          : 'opacity-0 -translate-y-4 pointer-events-none text-ink'
    }`}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex justify-between items-center">
        <Link to="/" className={`z-50 hover:text-accent transition-all flex items-center justify-center p-1.5 md:p-2 -ml-2 ${isNegative ? 'text-paper' : 'text-ink'}`} aria-label="Volver al Inicio">
          <ArrowLeft size={20} className="stroke-[2.5]" />
        </Link>
 
        {/* Desktop Nav */}
        <div className="hidden md:flex gap-12 items-center">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.href}
              className={`font-sans text-[10px] uppercase tracking-[0.3em] font-bold hover:line-through transition-all ${pathname === link.href ? 'line-through' : ''}`}
            >
              {link.name}
            </Link>
          ))}
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:opacity-50 transition-opacity">
            <Instagram size={18} />
          </a>
        </div>
 
        {/* Mobile Toggle */}
        <button 
          className={`md:hidden z-50 p-2 -mr-2 hover:text-accent transition-colors ${isNegative ? 'text-paper' : 'text-ink'}`} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
 
      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className={`fixed inset-0 w-full h-screen flex flex-col justify-center items-center gap-10 shadow-2xl z-40 px-6 transition-colors duration-500 ${isNegative ? 'bg-ink text-paper' : 'bg-paper text-ink'}`}
          >
            <div className="flex flex-col items-center gap-8">
              <Link 
                to="/" 
                className="text-4xl sm:text-5xl font-serif font-black italic tracking-tighter hover:text-accent transition-colors flex items-center gap-3"
                onClick={() => setIsOpen(false)}
              >
                <ArrowLeft size={32} /> Inicio
              </Link>
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.href}
                  className="text-4xl sm:text-5xl font-serif font-black italic tracking-tighter hover:text-accent transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className={`h-[1px] w-12 my-4 transition-colors duration-500 ${isNegative ? 'bg-paper/10' : 'bg-ink/10'}`}></div>
              <a 
                href="https://instagram.com/analiasandlerisartista" 
                target="_blank" 
                rel="noreferrer" 
                className={`flex items-center gap-2 text-xs uppercase tracking-widest font-sans font-bold hover:text-accent transition-all ${isNegative ? 'text-paper/60' : 'text-ink/60'}`}
                onClick={() => setIsOpen(false)}
              >
                <Instagram size={16} /> @analiasandlerisartista
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export function Footer() {
  const [activeModal, setActiveModal] = useState<null | 'privacy' | 'cookies'>(null);
  const { pathname } = useLocation();
  const isNegative = pathname !== '/' && pathname !== '';

  return (
    <footer className={`border-t py-24 md:py-48 px-6 md:px-10 overflow-hidden relative transition-colors duration-500 ${isNegative ? 'bg-ink text-paper border-paper/10' : 'bg-paper text-ink border-ink/10'}`}>
      <div className={`absolute top-0 left-0 w-full h-full opacity-[0.03] flex items-center justify-center pointer-events-none transition-colors duration-500 ${isNegative ? 'text-paper' : 'text-ink'}`}>
          <span className="text-[40vw] font-black tracking-tighter">ART</span>
      </div>

      <div className="max-w-[1400px] mx-auto flex flex-col items-center text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-24 md:mb-32 w-full max-w-full px-4"
        >
          <span className="font-sans text-[11px] uppercase tracking-[0.6em] text-accent font-black mb-12 block">Contacto</span>
          <a 
            href="mailto:analiasandleris@gmail.com" 
            className="text-lg sm:text-2xl md:text-5xl font-light underline decoration-accent decoration-1 md:decoration-2 underline-offset-[12px] md:underline-offset-[20px] hover:text-accent transition-all font-sans break-all inline-block"
          >
            analiasandleris@gmail.com
          </a>
        </motion.div>
        
        <div className={`w-full border-t pt-16 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 text-left transition-colors duration-500 ${isNegative ? 'border-paper/10' : 'border-ink/10'}`}>
          <div className={`font-light text-2xl md:text-3xl uppercase tracking-tighter transition-colors duration-500 ${isNegative ? 'text-paper' : 'text-ink'}`}>
            Analía <span className="text-accent inline-block whitespace-nowrap" style={{ fontStyle: 'oblique' }}>
              Sa<span className="inline-block" style={{ fontStyle: 'normal', transform: 'skewX(-11deg)' }}>n</span>dleris
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row flex-wrap gap-8 sm:gap-12">
             {[
               { label: 'Taller', value: 'Parque Batlle, Montevideo, Uruguay' },
               { label: 'Redes', value: '@analiasandlerisartista', href: 'https://instagram.com/analiasandlerisartista' }
             ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-start gap-1">
                   <span className="font-sans text-[9px] uppercase tracking-[0.4em] font-black opacity-30">{item.label}</span>
                   {item.href ? (
                     <a href={item.href} target="_blank" rel="noreferrer" className="font-sans text-xs font-bold hover:text-accent transition-colors">
                       {item.value}
                     </a>
                   ) : (
                     <span className={`font-sans text-xs font-bold transition-colors duration-500 ${isNegative ? 'text-paper' : 'text-ink'}`}>
                       {item.value}
                     </span>
                   )}
                </div>
             ))}
          </div>

          <div className="flex flex-col md:items-start lg:items-end gap-3 font-sans text-[10px] uppercase tracking-widest w-full lg:w-auto">
            <div className="flex flex-wrap gap-4 font-bold opacity-40">
              <button 
                onClick={() => setActiveModal('privacy')}
                className="hover:text-accent transition-colors cursor-pointer"
              >
                Política de Privacidad
              </button>
              <span>•</span>
              <button 
                onClick={() => setActiveModal('cookies')}
                className="hover:text-accent transition-colors cursor-pointer"
              >
                Cookies
              </button>
            </div>
            <div className="font-bold opacity-30">
              © {new Date().getFullYear()} • Todos los derechos reservados
            </div>
          </div>
        </div>
      </div>

      {/* Policies Interactive Modal */}
      <AnimatePresence>
        {activeModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModal(null)}
            className="fixed inset-0 bg-ink/90 backdrop-blur-md z-50 flex items-center justify-center p-6 cursor-pointer"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-paper text-ink p-16 max-w-lg w-full relative cursor-default border border-ink/10"
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-6 right-6 font-sans text-xs uppercase tracking-widest font-black opacity-40 hover:opacity-100 transition-opacity"
              >
                Cerrar
              </button>

              {activeModal === 'privacy' ? (
                <div>
                  <h3 className="font-serif text-4xl italic font-black tracking-tight mb-8">Política de Privacidad</h3>
                  <div className="space-y-6 font-sans text-sm font-light leading-relaxed text-ink/80">
                    <p>
                      La privacidad de los visitantes de este portfolio artístico es de suma importancia. Todo dato personal proporcionado voluntariamente a través del correo de contacto o el formulario se utiliza única y exclusivamente para responder a sus inquietudes lícitas o de índole profesional.
                    </p>
                    <p>
                      No se recopila de manera activa información sensible, ni se realiza cesión de datos a organizaciones terceras con fines publicitarios o promocionales.
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="font-serif text-4xl italic font-black tracking-tight mb-8">Política de Cookies</h3>
                  <div className="space-y-6 font-sans text-sm font-light leading-relaxed text-ink/80">
                    <p>
                      Este sitio web utiliza cookies exclusivamente técnicas y esenciales para ofrecer una navegación segura y fluida en su experiencia interactiva. 
                    </p>
                    <p>
                      No se emplean cookies de seguimiento comercial ni de analíticas de terceros que irrumpan en su navegación.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
