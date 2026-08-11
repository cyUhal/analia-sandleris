/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Mail, Instagram, MapPin, ArrowRight } from 'lucide-react';

export default function Contacto() {
  return (
    <div className="pt-32 md:pt-48 pb-20 md:pb-32 px-6 md:px-10 max-w-[1400px] mx-auto min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
        {/* Info Column */}
        <div className="lg:col-span-5">
          <span className="font-sans text-[11px] uppercase tracking-[0.6em] text-accent font-black mb-6 md:mb-12 block">Contacto</span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light uppercase tracking-tighter mb-10 md:mb-16 leading-none text-ink">Analía <br className="hidden sm:inline" /> Sandleris</h1>
          
          <div className="space-y-10 md:space-y-16">
             <div className="flex flex-col gap-3">
                <span className="font-sans text-[10px] uppercase tracking-[0.4em] font-black opacity-30 flex items-center gap-2">
                   <Mail size={12} /> Correo
                </span>
                <a href="mailto:analiasandleris@gmail.com" className="text-lg sm:text-2xl md:text-3xl font-serif italic hover:text-accent transition-colors underline decoration-1 underline-offset-8 break-all">
                  analiasandleris@gmail.com
                </a>
             </div>

             <div className="flex flex-col gap-3">
                <span className="font-sans text-[10px] uppercase tracking-[0.4em] font-black opacity-30 flex items-center gap-2">
                   <Instagram size={12} /> Redes
                </span>
                <a href="https://instagram.com/analiasandlerisartista" target="_blank" rel="noreferrer" className="text-lg sm:text-2xl md:text-3xl font-serif italic hover:text-accent transition-colors break-all">
                  @analiasandlerisartista
                </a>
             </div>

             <div className="flex flex-col gap-3">
                <span className="font-sans text-[10px] uppercase tracking-[0.4em] font-black opacity-30 flex items-center gap-2">
                   <MapPin size={12} /> Estudio
                </span>
                <p className="text-lg sm:text-xl md:text-2xl font-sans font-light leading-snug">
                  Parque Batlle, Montevideo, Uruguay
                </p>
             </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-7">
           <motion.div 
             initial={{ opacity: 0, scale: 0.98 }}
             animate={{ opacity: 1, scale: 1 }}
             className="bg-paper-dark p-6 sm:p-12 md:p-20 shadow-2xl relative"
           >
              <h2 className="text-2xl sm:text-4xl font-black italic tracking-tight mb-8 md:mb-12 italic">Enviar un Mensaje</h2>
              <form className="space-y-6 md:space-y-10" onSubmit={(e) => e.preventDefault()}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                    <div className="flex flex-col gap-3">
                       <label className="font-sans text-[10px] uppercase tracking-[0.3em] font-black opacity-40">Nombre</label>
                       <input type="text" className="bg-transparent border-b border-ink/20 py-3 md:py-4 focus:border-accent outline-none font-sans transition-colors" placeholder="Tu nombre..." />
                    </div>
                    <div className="flex flex-col gap-3">
                       <label className="font-sans text-[10px] uppercase tracking-[0.3em] font-black opacity-40">Correo</label>
                       <input type="email" className="bg-transparent border-b border-ink/20 py-3 md:py-4 focus:border-accent outline-none font-sans transition-colors" placeholder="tu@email.com" />
                    </div>
                 </div>
                 
                 <div className="flex flex-col gap-3">
                    <label className="font-sans text-[10px] uppercase tracking-[0.3em] font-black opacity-40">Mensaje</label>
                    <textarea rows={4} className="bg-transparent border-b border-ink/20 py-3 md:py-4 focus:border-accent outline-none font-sans transition-colors resize-none" placeholder="Escribe tu consulta o mensaje aquí..."></textarea>
                 </div>

                 <button type="submit" className="w-full md:w-fit px-12 md:px-16 py-4 md:py-6 bg-ink text-paper text-xs uppercase tracking-[0.4em] font-sans font-black flex items-center justify-center gap-4 hover:bg-accent transition-all group">
                    Enviar Mensaje <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                 </button>
              </form>


           </motion.div>
        </div>
      </div>
    </div>
  );
}
