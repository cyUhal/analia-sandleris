/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CATEGORIES_DATA, WORKS } from '../data';
import { Work } from '../types';
import { ArrowLeft, ArrowRight, X, ZoomIn, ZoomOut } from 'lucide-react';

const renderSeriesTitleContent = (title: string) => {
  if (!title) return null;

  const upper = title.toUpperCase();
  if (upper.includes('~DES~') || upper.includes('DES-ILUSIÓN') || upper.includes('DES-ILUSION')) {
    const cleanTitle = title.replace(/\s*\([^)]*\)/g, ''); // strip any parenthetical subtitle if present
    let prefix = 'SERIE VICTORIA DE LA ';
    let suffix = '-ILUSIÓN';

    if (cleanTitle.includes('~DES~')) {
      const parts = cleanTitle.split('~DES~');
      prefix = parts[0];
      suffix = parts[1];
    } else if (cleanTitle.toUpperCase().includes('DES-ILUSIÓN')) {
      const parts = cleanTitle.split(/DES-ILUSIÓN/i);
      prefix = parts[0];
      suffix = '-ILUSIÓN' + (parts[1] || '');
    } else if (cleanTitle.toUpperCase().includes('DES-ILUSION')) {
      const parts = cleanTitle.split(/DES-ILUSION/i);
      prefix = parts[0];
      suffix = '-ILUSION' + (parts[1] || '');
    }

    return (
      <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.35em] font-black text-accent inline-flex items-center flex-wrap">
        <span>{prefix}</span>
        <span className="relative inline-block px-[1px] mx-[1px] select-none">
          <span>DES</span>
          <svg
            className="absolute -inset-[3px] w-[calc(100%+6px)] h-[calc(100%+6px)] pointer-events-none overflow-visible text-accent"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <line x1="8" y1="92" x2="92" y2="8" stroke="currentColor" strokeWidth="14" strokeLinecap="round" />
            <line x1="8" y1="8" x2="92" y2="92" stroke="currentColor" strokeWidth="14" strokeLinecap="round" />
          </svg>
        </span>
        <span>{suffix}</span>
      </span>
    );
  }

  return (
    <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.35em] font-black text-accent block">
      {title}
    </span>
  );
};

export default function Obras() {
  const { category } = useParams();
  const navigate = useNavigate();
  
  // Works state synchronized directly with static WORKS
  const [customWorks, setCustomWorks] = useState<Work[]>(WORKS);

  useEffect(() => {
    // Clear any stale local storage overrides
    try {
      localStorage.removeItem('analia_custom_works');
    } catch (e) {
      // ignore
    }
    setCustomWorks(WORKS);
  }, []);

  const [filteredWorks, setFilteredWorks] = useState<Work[]>(WORKS);
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [zoomScale, setZoomScale] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);

  const isZoomed = zoomScale > 1;
  const [viewMode, setViewMode] = useState<'detail' | 'perspective'>('perspective');
  const [isUploading, setIsUploading] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const compressAndResizeImage = (file: File, maxWidth = 1600): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.8));
          } else {
            resolve(event.target?.result as string);
          }
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleDirectPerspectiveUpload = async (file: File) => {
    if (!selectedWork) return;
    try {
      setIsUploading(true);
      const base64Data = await compressAndResizeImage(file, 1600);
      
      const updated = customWorks.map(w => {
        if (w.id === selectedWork.id) {
          return { 
            ...w, 
            fullImageUrl: base64Data 
          };
        }
        return w;
      });
      setCustomWorks(updated);
      localStorage.setItem('analia_custom_works', JSON.stringify(updated.map(w => ({
        id: w.id,
        imageUrl: w.imageUrl,
        fullImageUrl: w.fullImageUrl,
        title: w.title
      }))));

      setSelectedWork({
        ...selectedWork,
        fullImageUrl: base64Data
      });
      setViewMode('perspective');
      setZoomScale(1);
      setPanPosition({ x: 0, y: 0 });
    } catch (err) {
      alert('Error al procesar el archivo de imagen.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleDirectPerspectiveUpload(file);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomScale <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    setHasDragged(false);
    setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomScale <= 1) return;
    e.preventDefault();
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    
    if (Math.abs(dx - panPosition.x) > 5 || Math.abs(dy - panPosition.y) > 5) {
      setHasDragged(true);
    }

    const maxPanX = (zoomScale - 1) * 500;
    const maxPanY = (zoomScale - 1) * 450;
    setPanPosition({
      x: Math.max(-maxPanX, Math.min(maxPanX, dx)),
      y: Math.max(-maxPanY, Math.min(maxPanY, dy))
    });
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoomScale <= 1) return;
    const touch = e.touches[0];
    setIsDragging(true);
    setHasDragged(false);
    setDragStart({ x: touch.clientX - panPosition.x, y: touch.clientY - panPosition.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || zoomScale <= 1) return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragStart.x;
    const dy = touch.clientY - dragStart.y;

    if (Math.abs(dx - panPosition.x) > 5 || Math.abs(dy - panPosition.y) > 5) {
      setHasDragged(true);
    }

    const maxPanX = (zoomScale - 1) * 500;
    const maxPanY = (zoomScale - 1) * 450;
    setPanPosition({
      x: Math.max(-maxPanX, Math.min(maxPanX, dx)),
      y: Math.max(-maxPanY, Math.min(maxPanY, dy))
    });
  };

  useEffect(() => {
    setZoomScale(1);
    setPanPosition({ x: 0, y: 0 });
    if (selectedWork) {
      setViewMode(selectedWork.fullImageUrl ? 'perspective' : 'detail');
    }
  }, [selectedWork]);

  const normalizeText = (text: string) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  const normCategory = category ? normalizeText(category) : '';
  
  const catObj = category ? CATEGORIES_DATA.find(c => 
    normalizeText(c.id) === normCategory || 
    normalizeText(c.name) === normCategory
  ) : undefined;

  const matchedWork = (!catObj && category) 
    ? customWorks.find(w => normalizeText(w.category) === normCategory) 
    : null;

  const activeCategoryName = catObj 
    ? catObj.name 
    : (matchedWork ? matchedWork.category : category || '');

  useEffect(() => {
    if (!category || category === 'all') {
      setFilteredWorks(customWorks);
    } else {
      if (catObj) {
        setFilteredWorks(
          customWorks.filter(w => {
            if (!w.year) return false;
            const y = parseInt(w.year, 10);
            if (catObj.id === '2018-2011' && normalizeText(w.category) === 'collage') {
              return false;
            }
            return y >= catObj.startYear && y <= catObj.endYear;
          })
        );
      } else {
        setFilteredWorks(customWorks.filter(w => normalizeText(w.category) === normCategory));
      }
    }
  }, [category, catObj, normCategory, customWorks]);

  useEffect(() => {
    if (!selectedWork) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedWork(null);
      } else if (e.key === 'ArrowRight') {
        const idx = filteredWorks.findIndex(w => w.id === selectedWork.id);
        if (idx !== -1 && filteredWorks.length > 1) {
          const nextIdx = (idx + 1) % filteredWorks.length;
          setSelectedWork(filteredWorks[nextIdx]);
        }
      } else if (e.key === 'ArrowLeft') {
        const idx = filteredWorks.findIndex(w => w.id === selectedWork.id);
        if (idx !== -1 && filteredWorks.length > 1) {
          const prevIdx = (idx - 1 + filteredWorks.length) % filteredWorks.length;
          setSelectedWork(filteredWorks[prevIdx]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedWork, filteredWorks]);

  // 1. Antes del return, verifica qué tiene la imagen:
  if (selectedWork) {
    console.log("URL de imagen a renderizar:", viewMode === 'detail' ? selectedWork.fullImageUrl : selectedWork.imageUrl);
  }

  return (
    <div className="pt-32 md:pt-48 pb-20 md:pb-32 px-6 md:px-10 max-w-[1400px] mx-auto min-h-screen">
      <div className="mb-12 md:mb-24">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-light uppercase tracking-widest mb-4 leading-none text-ink">Obras</h1>
        <p className="text-ink/60 font-sans font-light text-base sm:text-lg max-w-2xl">
          Recorrido cronologico a través de algunas series y periodos
        </p>
      </div>

      {/* Category Timeline Section */}
      {!category && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative ml-2 sm:ml-6 md:ml-12 pl-8 sm:pl-12 md:pl-16 space-y-16 md:space-y-24 py-4"
        >
          {/* Timeline Dashed Connector Line */}
          <div className="absolute left-0 top-6 bottom-6 w-[2px] bg-gradient-to-b from-accent via-ink/20 to-ink/5 border-l border-dashed border-ink/20"></div>

          {CATEGORIES_DATA.map((cat, idx) => (
            <div key={cat.id} className="relative group">
              {/* Timeline Bullet/Node Indicator */}
              <div className="absolute -left-[39px] sm:-left-[55px] md:-left-[72px] top-6 flex items-center justify-center">
                {/* Floating active ring pulse */}
                <div className="w-5 h-5 rounded-full border border-ink/10 bg-paper flex items-center justify-center group-hover:border-accent transition-colors duration-500 shadow-sm relative z-10">
                  <div className="w-2.5 h-2.5 rounded-full bg-ink/30 group-hover:bg-accent transition-colors duration-500"></div>
                </div>
                {/* Numeric Indicator */}
                <span className="hidden md:inline absolute right-8 font-mono text-[9px] tracking-[0.2em] font-black text-ink/20 uppercase">
                  PERÍODO 0{idx + 1}
                </span>
              </div>

              {/* Layout Split Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-start">
                
                {/* Visual Metadata column */}
                <div className="md:col-span-4 lg:col-span-3 pt-2">
                  <span className="font-sans text-[9px] tracking-widest font-black text-accent uppercase block mb-1">
                    Cronología
                  </span>
                  <h3 className="text-3xl sm:text-5xl font-black italic tracking-tighter leading-none text-ink">
                    {cat.name}
                  </h3>
                </div>

                {/* Cover Interactive Gallery Card Column */}
                <div className="md:col-span-8 lg:col-span-9">
                  <Link
                    to={`/obras/${cat.id}`}
                    className="block group-hover:-translate-y-1.5 transition-all duration-500"
                  >
                    <div className="bg-white border border-ink/5 shadow-sm hover:shadow-[30px_30px_80px_rgba(0,0,0,0.06)] overflow-hidden rounded-sm transition-all duration-500">
                      <div className="grid grid-cols-1 sm:grid-cols-12">
                        {/* Artwork Cover Preview */}
                        <div className="sm:col-span-5 aspect-[16/10] sm:aspect-square overflow-hidden bg-paper-dark relative">
                          <img 
                            src={cat.imageUrl} 
                            alt={cat.name}
                            loading="lazy"
                            className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-[1200ms]"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        {/* description metadata */}
                        <div className="sm:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
                          <div className="flex items-center gap-2 text-ink text-[10px] uppercase tracking-[0.25em] font-black">
                            <span>Ver período</span>
                            <ArrowRight size={12} className="group-hover:translate-x-2 transition-transform duration-300 text-accent" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Gallery Mode */}
      {category && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 sm:mb-20 border-b border-ink/5 pb-8 gap-6">
            <div className="flex items-center gap-4 sm:gap-6">
              <button 
                onClick={() => navigate('/obras')}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-ink/10 flex items-center justify-center hover:bg-ink hover:text-paper transition-all shrink-0 cursor-pointer"
                title="Volver"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <span className="font-sans text-[9px] sm:text-[10px] uppercase tracking-widest font-black text-accent block mb-1">
                  {catObj ? 'Filtrando por Período' : 'Filtrando por Categoría'}
                </span>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black italic tracking-tighter capitalize">{activeCategoryName}</h2>
              </div>
            </div>
            <button 
              onClick={() => navigate('/obras')}
              className="font-sans text-[10px] uppercase tracking-[0.3em] font-black opacity-35 hover:opacity-100 transition-opacity self-start md:self-auto pl-14 md:pl-0 cursor-pointer"
            >
              Ver todos los Períodos
            </button>
          </div>

            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 md:gap-x-16 gap-y-16 md:gap-y-24"
            >
              <AnimatePresence mode='popLayout'>
                {filteredWorks.flatMap((work) => {
                  const items = [];
                  if (work.seriesTitle) {
                    items.push(
                      <motion.div
                        key={`series-${work.id}`}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="col-span-full pt-2 pb-4 border-b border-ink/10 mb-2"
                      >
                        {renderSeriesTitleContent(work.seriesTitle)}
                      </motion.div>
                    );
                  }
                  items.push(
                    <motion.div
                      key={work.id}
                      layout
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.8 }}
                      className="group cursor-pointer"
                      onClick={() => setSelectedWork(work)}
                    >
                      <div className="aspect-[3/4] overflow-hidden mb-6 sm:mb-8 bg-paper-dark relative ring-1 ring-ink/5 art-card-reveal shadow-sm hover:shadow-2xl transition-all duration-700">
                        <img 
                          src={work.imageUrl} 
                          alt={work.title}
                          loading="lazy"
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1200ms]"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      
                      <div className="flex flex-col gap-2 sm:gap-3">
                        <div className="flex justify-between items-baseline">
                          <span className="font-sans text-[10px] uppercase tracking-[0.4em] font-black opacity-30 italic">{work.year}</span>
                          <span className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">{work.technique}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                  return items;
                })}
              </AnimatePresence>
            </motion.div>
        </motion.div>
      )}

      {category && filteredWorks.length === 0 && (
        <div className="py-48 text-center font-sans">
            <p className="font-serif text-3xl italic opacity-30">No se encontraron obras bajo esta categoría.</p>
        </div>
      )}

      <AnimatePresence>
        {selectedWork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col justify-between bg-[#0b0b0b]/98 text-paper p-4 sm:p-6 md:p-8 overflow-hidden"
            id="artwork-lightbox"
            onClick={() => setSelectedWork(null)}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* Drag & Drop Visual Overlay */}
            {isDraggingOver && (
              <div className="absolute inset-0 z-55 bg-accent/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 transition-all duration-300 pointer-events-none">
                <div className="border-4 border-dashed border-white/40 rounded-lg p-12 max-w-sm w-full flex flex-col items-center justify-center">
                  <span className="text-5xl mb-4 animate-bounce">🖼️</span>
                  <h4 className="text-xl font-black italic tracking-tight uppercase text-white mb-2">Suelta la foto aquí</h4>
                  <p className="text-white/80 text-xs font-sans">Se cargará automáticamente como la perspectiva alejada (marco/pared) para esta obra.</p>
                </div>
              </div>
            )}

            {/* Local uploader loading state */}
            {isUploading && (
              <div className="absolute inset-0 z-55 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center text-center p-6">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
                  <h4 className="text-sm font-bold tracking-widest uppercase text-paper font-sans">Procesando Imagen...</h4>
                  <p className="text-paper/40 text-[10px] uppercase tracking-wider mt-1.5">Redimensionando y guardando localmente</p>
                </div>
              </div>
            )}

            {/* Top Bar controls */}
            <div 
              className={`flex justify-between items-center w-full mb-4 md:mb-6 transition-opacity duration-300 ${isZoomed ? 'opacity-20 hover:opacity-100' : 'opacity-100'}`} 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-paper/40">
                {selectedWork.category}  —  {filteredWorks.findIndex(w => w.id === selectedWork.id) + 1} / {filteredWorks.length}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (zoomScale > 1) {
                      setZoomScale(1);
                      setPanPosition({ x: 0, y: 0 });
                    } else {
                      setZoomScale(3);
                      setPanPosition({ x: 0, y: 0 });
                    }
                  }}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-paper/10 flex items-center justify-center hover:bg-paper hover:text-ink hover:border-paper transition-all cursor-pointer bg-white/5 backdrop-blur-xs text-paper"
                  aria-label={isZoomed ? "Ajustar" : "Zoom"}
                  title={isZoomed ? "Ajustar pantalla" : "Ampliar imagen"}
                >
                  {isZoomed ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
                </button>
                <button
                  onClick={() => setSelectedWork(null)}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-paper/10 flex items-center justify-center hover:bg-paper hover:text-ink hover:border-paper transition-all cursor-pointer bg-white/5 backdrop-blur-xs text-paper"
                  aria-label="Cerrar"
                  id="close-lightbox-btn"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Middle row: Image with navigation arrows */}
            <div className="flex-1 flex items-center justify-center w-full h-[80vh] sm:h-[84vh] md:h-[86vh] relative" onClick={(e) => e.stopPropagation()}>
              {/* Prev Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const idx = filteredWorks.findIndex(w => w.id === selectedWork.id);
                  if (idx !== -1 && filteredWorks.length > 1) {
                    const prevIdx = (idx - 1 + filteredWorks.length) % filteredWorks.length;
                    setSelectedWork(filteredWorks[prevIdx]);
                  }
                }}
                className={`hidden md:flex absolute left-2 lg:left-6 z-50 w-12 h-12 rounded-full border border-paper/10 items-center justify-center hover:bg-paper hover:text-ink hover:border-paper transition-all shrink-0 cursor-pointer bg-white/5 backdrop-blur-xs text-paper transition-opacity duration-300 ${isZoomed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                aria-label="Obra anterior"
                id="prev-artwork-btn"
              >
                <ArrowLeft size={18} />
              </button>

              {/* Main Artwork Container */}
              <div 
                className="w-full max-w-[100vw] px-1 sm:px-2 md:px-4 flex flex-col items-center justify-center select-none h-full relative overflow-visible"
                onClick={() => setSelectedWork(null)}
              >
                <div
                  className={`relative flex items-center justify-center max-h-[92%] w-full z-40 overflow-hidden rounded-xs ${
                    zoomScale > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'
                  }`}
                  id="lightbox-art-wrapper"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUpOrLeave}
                  onMouseLeave={handleMouseUpOrLeave}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleMouseUpOrLeave}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!hasDragged) {
                      if (zoomScale > 1) {
                        setZoomScale(1);
                        setPanPosition({ x: 0, y: 0 });
                      } else {
                        setZoomScale(3);
                        setPanPosition({ x: 0, y: 0 });
                      }
                    }
                  }}
                  title={zoomScale > 1 ? "Arrastra para recorrer la obra • Haz clic para ajustar" : "Haz clic para ampliar y recorrer la obra"}
                >
                  <img
                    key={`lightbox-img-${selectedWork.id}`}
                    src={selectedWork.fullImageUrl || selectedWork.imageUrl}
                    alt={selectedWork.title || "Obra de arte"}
                    className="max-h-[68vh] sm:max-h-[72vh] md:max-h-[76vh] w-full max-w-[96vw] object-contain shadow-[0_25px_60px_rgba(0,0,0,0.85)] border border-paper/10 ring-1 ring-white/10 select-none pointer-events-none origin-center"
                    style={{
                      transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomScale})`,
                      transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (selectedWork.fullImageUrl && target.src === selectedWork.fullImageUrl && selectedWork.imageUrl) {
                        target.src = selectedWork.imageUrl;
                      } else {
                        console.error("Error cargando la imagen:", target.src);
                      }
                    }}
                  />
                </div>

                {/* Caption below the artwork */}
                <motion.div
                  key={`caption-${selectedWork.id}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={isZoomed ? { opacity: 0, y: 5 } : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`mt-4 md:mt-5 text-center max-w-3xl px-4 transition-opacity duration-300 ${isZoomed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-center gap-3 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-paper/70 font-sans font-medium">
                    <span>{selectedWork.dimensions || "100 x 80 cm"}</span>
                  </div>
                </motion.div>
              </div>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const idx = filteredWorks.findIndex(w => w.id === selectedWork.id);
                  if (idx !== -1 && filteredWorks.length > 1) {
                    const nextIdx = (idx + 1) % filteredWorks.length;
                    setSelectedWork(filteredWorks[nextIdx]);
                  }
                }}
                className={`hidden md:flex absolute right-2 lg:right-6 z-50 w-12 h-12 rounded-full border border-paper/10 items-center justify-center hover:bg-paper hover:text-ink hover:border-paper transition-all shrink-0 cursor-pointer bg-white/5 backdrop-blur-xs text-paper transition-opacity duration-300 ${isZoomed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                aria-label="Siguiente obra"
                id="next-artwork-btn"
              >
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Advanced Floating Zoom Controls Panel */}
            <div 
              className="absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 z-55 bg-black/75 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center gap-3 shadow-2xl pointer-events-auto transition-opacity duration-300 hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => {
                  const newScale = Math.max(1, zoomScale - 0.5);
                  setZoomScale(newScale);
                  if (newScale === 1) setPanPosition({ x: 0, y: 0 });
                }}
                disabled={zoomScale <= 1}
                className="w-8 h-8 rounded-full flex items-center justify-center text-paper hover:bg-white/10 active:scale-95 disabled:opacity-20 disabled:pointer-events-none transition-all cursor-pointer animate-none bg-transparent"
                title="Alejar"
              >
                <ZoomOut size={14} />
              </button>
              
              <input 
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={zoomScale}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setZoomScale(val);
                  if (val === 1) setPanPosition({ x: 0, y: 0 });
                }}
                className="w-20 sm:w-28 h-1 bg-white/25 rounded-lg appearance-none cursor-pointer accent-accent"
              />
              
              <button 
                onClick={() => {
                  const newScale = Math.min(5, zoomScale + 0.5);
                  setZoomScale(newScale);
                }}
                disabled={zoomScale >= 5}
                className="w-8 h-8 rounded-full flex items-center justify-center text-paper hover:bg-white/10 active:scale-95 disabled:opacity-20 disabled:pointer-events-none transition-all cursor-pointer animate-none bg-transparent"
                title="Acercar"
              >
                <ZoomIn size={14} />
              </button>
              
              <span className="font-mono text-[9px] sm:text-[10px] text-paper/70 min-w-[32px] text-right">
                {Math.round(zoomScale * 100)}%
              </span>
            </div>

            {/* Bottom row: Swipe or Mobile navigation indicators */}
            <div 
              className={`flex md:hidden justify-between items-center w-full mt-4 text-[9px] sm:text-[10px] font-sans uppercase tracking-[0.2em] text-paper/30 py-4 border-t border-paper/5 transition-opacity duration-300 ${isZoomed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} 
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  const idx = filteredWorks.findIndex(w => w.id === selectedWork.id);
                  if (idx !== -1 && filteredWorks.length > 1) {
                    const prevIdx = (idx - 1 + filteredWorks.length) % filteredWorks.length;
                    setSelectedWork(filteredWorks[prevIdx]);
                  }
                }}
                className="flex items-center gap-1.5 hover:text-accent font-bold py-2 px-3 hover:bg-white/5 rounded-sm transition-colors active:scale-95 shrink-0"
              >
                <ArrowLeft size={12} /> Anterior
              </button>
              
              <span className="opacity-40 italic text-center text-[8px] sm:text-[10px] truncate max-w-[50%]">Pulsa fuera para cerrar</span>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  const idx = filteredWorks.findIndex(w => w.id === selectedWork.id);
                  if (idx !== -1 && filteredWorks.length > 1) {
                    const nextIdx = (idx + 1) % filteredWorks.length;
                    setSelectedWork(filteredWorks[nextIdx]);
                  }
                }}
                className="flex items-center gap-1.5 hover:text-accent font-bold py-2 px-3 hover:bg-white/5 rounded-sm transition-colors active:scale-95 shrink-0"
              >
                Siguiente <ArrowRight size={12} />
              </button>
            </div>
            
            {/* Desktop hint bottom center */}
            <div className={`hidden md:block text-center w-full text-[9px] font-sans uppercase tracking-[0.25em] text-paper/20 pointer-events-none mt-2 transition-opacity duration-300 ${isZoomed ? 'opacity-20' : 'opacity-100'}`}>
              Arrastra la foto para recorrer la obra  •  Usa las flechas ← → para cambiar
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
