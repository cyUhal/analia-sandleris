/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, X, Quote, Calendar, MapPin, Eye, FileText } from 'lucide-react';
import { PRESS_ARTICLES } from '../data';

interface ExhibitionDetail {
  year: string;
  place: string;
  event: string;
  summary: string;
  images: string[];
  critiques: { quote: string; author: string }[];
}

const EXHIBITION_DETAILS: ExhibitionDetail[] = [
  {
    year: '2023',
    place: 'Museo de Bellas Artes Juan Manuel Blanes',
    event: 'Exposición "Del discurrir inmóvil" — 10 de marzo de 2023, Montevideo, Uruguay',
    summary: 'La exposición "Del discurrir inmóvil" de Analía Sandleris, presentada en la sala María Freire del Museo Juan Manuel Blanes, propuso un diálogo entre sus obras más recientes (2022-2023) y una selección de sus trabajos de los años 80. La muestra abarcó cerca de 40 años de trayectoria plástica.',
    images: [
      'https://res.cloudinary.com/dnwhnbfrd/image/upload/v1784033600/ana%20sandleris/Blanes2023_1_uvxp0g.png',
      'https://res.cloudinary.com/dnwhnbfrd/image/upload/v1784033600/ana%20sandleris/Blanes2023_fudwdi.png'
    ],
    critiques: [
      {
        quote: 'El estilo rotundo de Analía Sandleris vuelve sobre sí mismo. Sus obras acumulan nuevas capas vitales que discurren por los hondos recovecos de un temperamento enérgico, capaz de exquisitas sutilezas. El diseño de la muestra invita al visitante a adentrarse sin rispideces al universo plástico de Sandleris. Siempre tuvo algo de visceral y de animal su pintura: la paleta baja, de tonos marrones y cetrinos, mucho negro, manchas como sangrados y escurrimientos. Una evolución creativa impecable desde los años ochenta.',
        author: 'Pablo Thiago Rocca, Semanario Brecha (5 de abril de 2023)'
      }
    ]
  },
  {
    year: '2018',
    place: 'Museo Nacional de Artes Visuales',
    event: 'Exposición — 31 de Agosto de 2018, Montevideo, Uruguay',
    summary: 'La exposición de Analía Sandleris en el MNAV (2018), curada por María E. Yuguero, presentó pinturas monumentales de 2014 a 2018 que exploran la genealogía personal y la tensión entre opuestos mediante escenarios enigmáticos. El análisis curatorial subraya una estética de la incertidumbre y la transgresión, donde la pintura funciona como un laberinto de sensaciones que deconstruye la sensualidad tradicional.',
    images: [
      'https://res.cloudinary.com/dnwhnbfrd/image/upload/v1784033802/ana%20sandleris/MNAV2018_1_j3cxru.png',
      'https://res.cloudinary.com/dnwhnbfrd/image/upload/v1784033802/ana%20sandleris/MNAV2018_2_vvxian.png'
    ],
    critiques: [
      {
        quote: 'Analía Sandleris pertenece a una generación que procesó los legados de los grandes talleres montevideanos. En su muestra del MNAV, la artista ensaya un quiebre formal mediante el imperativo de los grandes planos y formatos XL, donde la violencia de su trazo pictórico convive con el remanso emergente de un recuerdo. Su obra actual se debate de manera elocuente en un persistente mutismo y una honda sustancia desasosegada, alcanzando una madurez compleja que elude las clasificaciones complacientes.',
        author: 'Nelson Di Maggio, Voces (2018)'
      }
    ]
  }
];

export default function Prensa() {
  const [selectedExhibition, setSelectedExhibition] = useState<ExhibitionDetail | null>(null);

  // Lock scroll when modal is open
  useEffect(() => {
    if (selectedExhibition) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedExhibition]);

  return (
    <div className="pt-32 md:pt-48 pb-20 md:pb-32 px-6 md:px-10 max-w-[1400px] mx-auto min-h-screen">
      <div className="mb-12 md:mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light uppercase tracking-tight leading-none text-ink">Prensa</h1>
      </div>

      {/* Sección de Artículos y Ensayos */}
      <div className="mb-20 md:mb-32">
        <div className="mb-10 md:mb-14">
          <h2 className="text-4xl sm:text-5xl font-serif font-black italic tracking-tighter">Artículos destacados</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 relative z-10">
          {PRESS_ARTICLES.filter(art => art.type === 'Artículo').map((article, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className="group p-6 sm:p-10 bg-white border border-ink/5 shadow-sm hover:shadow-[30px_30px_80px_rgba(0,0,0,0.05)] transition-all duration-700 flex flex-col justify-between min-h-[320px] rounded-sm"
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="font-sans text-[9px] uppercase tracking-[0.3em] font-black text-accent">{article.source}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black italic leading-snug text-ink mb-4 group-hover:text-accent transition-colors">
                  "{article.title}"
                </h3>
                {article.summary && (
                  <p className="text-ink/60 font-sans font-light text-xs sm:text-sm leading-relaxed mb-6">
                    {article.summary}
                  </p>
                )}
              </div>
              
              <a 
                href={article.link || "#"} 
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[10px] uppercase tracking-[0.3em] font-black border-b border-ink/15 pb-1 w-fit hover:border-accent hover:text-accent transition-all flex items-center gap-1 mt-auto"
              >
                Ver Artículo <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sección de Entrevistas */}
      <div className="mb-24 md:mb-40">
        <div className="mb-10 md:mb-14">
          <span className="font-sans text-[10px] uppercase tracking-[0.4em] font-black text-accent block mb-2">Conversaciones</span>
          <h2 className="text-4xl sm:text-5xl font-serif font-black italic tracking-tighter">Entrevistas</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 relative z-10">
          {PRESS_ARTICLES.filter(art => art.type === 'Entrevista').map((interview, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className="group p-8 sm:p-12 bg-white/70 border border-ink/5 shadow-sm hover:shadow-[45px_45px_100px_rgba(0,0,0,0.06)] backdrop-blur-sm transition-all duration-700 flex flex-col justify-between min-h-[350px] relative overflow-hidden rounded-md"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/2 rounded-full blur-3xl -z-10 group-hover:bg-accent/5 transition-all duration-1000" />
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="font-sans text-[9px] uppercase tracking-[0.3em] font-black text-accent bg-accent/5 px-2.5 py-1 rounded-sm">
                    {interview.source}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black italic tracking-tight leading-tight text-ink mb-4 group-hover:text-accent transition-colors">
                  "{interview.title}"
                </h3>
                {interview.summary && (
                  <p className="text-ink/65 font-sans font-light text-sm sm:text-base leading-relaxed mb-8">
                    {interview.summary}
                  </p>
                )}
              </div>
              
              <a 
                href={interview.link || "#"} 
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[10px] uppercase tracking-[0.3em] font-black border-b border-ink/20 pb-1.5 w-fit hover:border-accent hover:text-accent transition-all flex items-center gap-1.5"
              >
                Ver Entrevista <ChevronRight size={13} className="group-hover:translate-x-1.5 transition-transform" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Exhibitions Timeline */}
      <div className="max-w-4xl">
         <h2 className="text-5xl font-serif font-black italic mb-10 tracking-tighter">Últimas exposiciones</h2>
         <p className="font-sans text-xs text-ink/40 uppercase tracking-widest mb-16">
            Selecciona una exposición para ver su resumen, imágenes de sala y críticas destacadas
         </p>
         
         <div className="space-y-4">
            {EXHIBITION_DETAILS.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                onClick={() => setSelectedExhibition(item)}
                className="flex flex-col sm:flex-row items-start sm:items-baseline gap-4 sm:gap-20 border-b border-ink/5 py-8 px-4 group cursor-pointer hover:bg-accent/[0.02] hover:translate-x-2 transition-all duration-500 rounded-lg"
              >
                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-serif text-4xl italic text-accent font-black tracking-tighter opacity-40 group-hover:opacity-100 transition-opacity w-20">
                    {item.year}
                  </span>
                </div>
                <div className="flex-1">
                   <h4 className="text-xl md:text-2xl font-sans font-bold uppercase tracking-widest group-hover:text-accent transition-colors">
                     {item.place}
                   </h4>
                   <p className="font-sans font-light text-ink/60 mt-1 mb-4">{item.event}</p>
                   <span className="text-[10px] uppercase tracking-[0.2em] bg-accent/10 text-accent border border-accent/20 px-3.5 py-1.5 font-sans rounded-md group-hover:bg-accent group-hover:text-white transition-all duration-300 flex items-center gap-1.5 font-bold w-fit">
                     <FileText size={12} /> Ver Resumen
                   </span>
                </div>
              </motion.div>
            ))}
         </div>
      </div>

      {/* Interactive Detail Modal with Framer Motion */}
      <AnimatePresence>
        {selectedExhibition && (
          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 bg-ink/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-8 md:p-12 overflow-y-auto"
             onClick={() => setSelectedExhibition(null)}
          >
            <motion.div 
               initial={{ scale: 0.95, y: 20, opacity: 0 }}
               animate={{ scale: 1, y: 0, opacity: 1 }}
               exit={{ scale: 0.95, y: 20, opacity: 0 }}
               transition={{ type: "spring", damping: 30, stiffness: 300 }}
               className="bg-paper text-ink w-full max-w-5xl rounded-lg shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh] md:max-h-[80vh] border border-ink/15"
               onClick={(e) => e.stopPropagation()}
            >
               {/* Mobile sticky header for closing */}
               <div className="flex justify-end p-4 border-b border-ink/5 bg-paper-dark sm:hidden sticky top-0 z-50">
                 <button 
                   onClick={() => setSelectedExhibition(null)}
                   className="font-sans text-[10px] uppercase tracking-[0.2em] font-black opacity-60 hover:opacity-100 flex items-center gap-1.5"
                 >
                   <X size={14} /> Cerrar Detalle
                 </button>
               </div>

               {/* Close button (Desktop only) */}
               <button 
                 onClick={() => setSelectedExhibition(null)}
                 className="hidden sm:block absolute top-4 right-4 z-50 p-3 bg-paper/90 rounded-full hover:bg-accent hover:text-white transition-all cursor-pointer shadow-md border border-ink/5"
                 aria-label="Cerrar modal"
               >
                 <X size={18} />
               </button>
 
               {/* Grid Layout - unified scroll on mobile, independent on lg screens */}
               <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-0 overflow-y-auto lg:overflow-hidden">
                 
                 {/* Visual Album Column - Left */}
                 <div className="lg:col-span-5 bg-paper-dark p-6 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-ink/10 lg:overflow-y-auto lg:max-h-[80vh]">
                   <div>
                     <span className="font-sans text-[10px] uppercase tracking-[0.4em] text-accent font-black flex items-center gap-2 mb-6">
                       <Calendar size={12} /> Exposición {selectedExhibition.year}
                     </span>
                     
                     {/* Images Stack */}
                     <div className="space-y-6">
                       {selectedExhibition.images.slice(0, 2).map((img, i) => (
                         <div key={i} className="aspect-[4/3] w-full overflow-hidden shadow-md group relative bg-ink/10">
                           <img 
                             src={img} 
                             alt={`Exposición Analía Sandleris ${selectedExhibition.year}`} 
                             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                             referrerPolicy="no-referrer"
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                         </div>
                       ))}
                     </div>
                   </div>
 
                   <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-ink/40 mt-6 block border-t border-ink/5 pt-4">
                     Imágenes evocativas del dossier de prensa oficial de la artista.
                   </p>
                 </div>
 
                 {/* Curatorial and Critiques Column - Right */}
                 <div className="lg:col-span-7 p-6 sm:p-10 md:p-12 lg:overflow-y-auto lg:max-h-[80vh]">
                   <div className="mb-6 sm:mb-8">
                     <span className="font-sans text-[10px] uppercase tracking-[0.5em] font-black text-ink/40 flex items-center gap-2 mb-3">
                       <MapPin size={12} /> {selectedExhibition.place}
                     </span>
                     <h3 className="text-2xl sm:text-4xl font-serif font-black italic tracking-tight text-ink leading-tight">
                       {selectedExhibition.event.replace('Exposición ', '')}
                     </h3>
                   </div>
 
                   {/* Resumen / Sala Context */}
                   <div className="space-y-4 sm:space-y-6 text-sm sm:text-lg text-ink/80 leading-relaxed font-sans font-light mb-8 md:mb-10 border-b border-ink/10 pb-6 sm:pb-8">
                     <h5 className="font-sans text-xs uppercase tracking-[0.3em] font-black text-accent">
                       Resumen Curatorial
                     </h5>
                     <p>{selectedExhibition.summary}</p>
                   </div>
 
                   {/* Critiques */}
                   <div className="space-y-6 sm:space-y-8">
                     <h5 className="font-sans text-xs uppercase tracking-[0.3em] font-black text-accent">
                       Críticas de Prensa & Recepción
                     </h5>
                     
                     <div className="space-y-4 sm:space-y-6">
                       {selectedExhibition.critiques.map((crit, index) => (
                         <div key={index} className="bg-paper-dark p-4 sm:p-6 border-l-2 border-accent/40 relative">
                           <Quote size={24} className="text-accent/15 absolute top-4 right-4" />
                           <p className="font-serif italic text-sm sm:text-lg text-ink/80 leading-relaxed mb-4">
                             "{crit.quote}"
                           </p>
                           <span className="font-sans text-[10px] uppercase tracking-widest font-black text-ink/50 block">
                             — {crit.author}
                           </span>
                         </div>
                       ))}
                     </div>
                   </div>
                 </div>
 
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

