/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center px-6 md:px-10 overflow-hidden bg-ink">
        {/* Full screen Background Image */}
        <div className="absolute inset-0 w-full h-full z-0 select-none">
          <div className="absolute inset-0 bg-black/55 z-10"></div>
          <img 
            src="https://res.cloudinary.com/dnwhnbfrd/image/upload/v1784033277/ana%20sandleris/hero2_ixbopj.jpg" 
            alt="Fondo Analía Sandleris Studio"
            className="w-full h-full object-cover grayscale brightness-[0.45] contrast-125 select-none"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Content Overlay */}
        <div className="relative z-20 max-w-[1400px] w-full text-center flex flex-col items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <h1 className="text-5xl sm:text-8xl md:text-9xl lg:text-[130px] font-light leading-none tracking-tighter text-paper mb-6 uppercase">
              Analía <br className="sm:hidden" />
              <span className="text-accent inline-block whitespace-nowrap" style={{ fontStyle: 'oblique' }}>
                Sa<span className="inline-block" style={{ fontStyle: 'normal', transform: 'skewX(-11deg)' }}>n</span>dleris
              </span>
            </h1>
            
            <div className="text-[10px] md:text-xs tracking-[0.5em] uppercase font-sans font-black text-paper/85 mb-12 sm:mb-16">
              Montevideo / Uruguay
            </div>

            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block"
            >
              <Link 
                to="/obras"
                className="inline-block px-8 py-3.5 border border-paper/30 text-paper text-xs uppercase tracking-[0.25em] font-sans font-light hover:border-accent hover:text-accent transition-all duration-300 backdrop-blur-xs"
              >
                Ver Obras
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
