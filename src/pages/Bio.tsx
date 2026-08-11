/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FileText, ArrowUpRight } from 'lucide-react';

export default function Bio() {
  return (
    <div className="pt-32 md:pt-48 pb-20 md:pb-32 px-6 md:px-10 max-w-[1400px] mx-auto min-h-screen">
      <div className="mb-12 md:mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight uppercase leading-none text-ink">
          Analía Sandleris
        </h1>
      </div>

      {/* Bio Body - Floating Image to have Text Surround it without any Empty Spaces */}
      <div className="font-sans text-lg md:text-xl text-ink/85 leading-relaxed font-light text-justify">
        
        {/* Floating Image Container */}
        <div className="w-full md:w-[420px] mb-8 md:mb-12 md:float-right md:ml-12 lg:ml-16 bg-paper-dark p-6 sm:p-8 shadow-2xl border border-ink/5 relative group">
          <div className="aspect-[2/3] relative overflow-hidden bg-ink/10">
            <img 
              src="https://res.cloudinary.com/dnwhnbfrd/image/upload/v1784990241/ana%20sandleris/Dise%C3%B1o_sin_t%C3%ADtulo_38_jwd7lk.png" 
              alt="Analía Sandleris"
              className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-[1.02]"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <p className="mb-8">
          Analía Sandleris comienza su actividad formándose y creando desde finales de la década de 1970. Su labor creativa ha sido continua e ininterrumpida, siendo seleccionada de forma constante en numerosos salones nacionales, premios y concursos internacionales de artes plásticas. Asimismo, cuenta con una destacada trayectoria participando como jurado en diversas ocasiones, tanto para la Intendencia de Montevideo (IMM) como para el Ministerio de Educación y Cultura (MEC). A su vez, ha ejercido la docencia en su taller particular.
        </p>

        <div className="pl-8 border-l-2 border-accent/40 py-4 my-10 italic font-serif text-xl md:text-2xl text-ink/65 leading-snug bg-accent/[0.02] pr-6">
          "Su obra plástica se centra en la pintura, a la que integra dinámicamente el grabado, el dibujo y la materialidad fragmentada del collage."
        </div>

        <p className="mb-8">
          Su obra plástica se centra en la pintura, a la que integra dinámicamente el grabado, el dibujo y la materialidad fragmentada del collage. En 2009, expandió sus horizontes de investigación formal obteniendo la Tecnicatura en Jardinería en la Escuela de Jardinería (EMJ) de Montevideo. Actualmente combina de manera singular su actividad artística con su labor de paisajista, proyectando y materializando jardines tanto públicos como privados bajo un sofisticado enfoque interdisciplinario que entrelaza la arquitectura de exteriores, el arte y la naturaleza viva del paisaje.
        </p>
      </div>

      <div className="clear-both pt-16 md:pt-24 flex justify-center">
        <a 
          href="https://docs.google.com/document/d/e/2PACX-1vStijoY4fvvrTkNvYAX09DLeSH3wmjihY8qttX8tDttfI56fRHULNFUBbWwn2yQjZfdQurgNTFh6DUv/pub"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 bg-ink text-paper text-xs uppercase tracking-[0.4em] font-sans font-black hover:bg-accent transition-all duration-300 group shadow-lg"
        >
          <FileText size={16} />
          Ver Currículum
          <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </a>
      </div>
    </div>
  );
}
