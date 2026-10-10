/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, ExternalLink, Check, Award, BookOpen, GraduationCap, Users, Calendar, Eye, FileText } from 'lucide-react';
import { CV_PDF_BASE64 } from '../cvPdfBase64';

interface CVSection {
  id: string;
  title: string;
  icon: any;
}

const SECTIONS: CVSection[] = [
  { id: 'trayectoria', title: 'Trayectoria Destacada', icon: Award },
  { id: 'formacion', title: 'Formación', icon: GraduationCap },
  { id: 'docencia', title: 'Docencia y Jurados', icon: Users },
  { id: 'individuales', title: 'Exposiciones Individuales', icon: Eye },
  { id: 'colectivas', title: 'Exposiciones Colectivas', icon: Calendar },
  { id: 'premios', title: 'Premios, Salones y Bienales', icon: Award },
  { id: 'prensa', title: 'Prensa', icon: FileText },
  { id: 'bibliografia', title: 'Bibliografía', icon: BookOpen },
];

export default function Curriculum() {
  const [activeSection, setActiveSection] = useState<string>('all');
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const handleDownload = (e: MouseEvent<HTMLAnchorElement>) => {
    try {
      // Create blob directly from embedded base64 string
      const byteCharacters = atob(CV_PDF_BASE64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);

      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = 'Analia_Sandleris_Curriculum.pdf';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    } catch (err) {
      console.warn('Fallback to direct file link', err);
      // Let default <a> behavior proceed if available
    }
  };

  return (
    <div className="pt-28 md:pt-40 pb-24 md:pb-36 px-5 sm:px-8 md:px-12 max-w-[1200px] mx-auto min-h-screen">
      
      {/* Back and Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-ink/10 print:hidden">
        <Link 
          to="/bio" 
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] font-sans text-ink/60 hover:text-ink transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Volver a Biografía
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/Analia_Sandleris_Curriculum.pdf"
            download="Analia_Sandleris_Curriculum.pdf"
            onClick={handleDownload}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-ink text-paper text-xs uppercase tracking-[0.2em] font-sans font-bold hover:bg-accent transition-all duration-300 shadow-sm group cursor-pointer"
            title="Descargar Currículum en PDF"
          >
            {downloadSuccess ? (
              <>
                <Check size={15} className="text-emerald-400" />
                <span>Descargado</span>
              </>
            ) : (
              <>
                <Download size={15} className="group-hover:translate-y-0.5 transition-transform" />
                <span>Descargar Currículum</span>
              </>
            )}
          </a>

          <a
            href="/Analia_Sandleris_Curriculum.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-ink/20 text-xs uppercase tracking-[0.2em] font-sans hover:bg-ink hover:text-paper transition-all text-ink/80"
            title="Abrir PDF en una nueva pestaña"
          >
            <ExternalLink size={13} />
            <span>Ver PDF</span>
          </a>
        </div>
      </div>

      {/* CV Document Container */}
      <article className="bg-paper-light border border-ink/10 shadow-sm p-6 sm:p-10 md:p-16 print:border-none print:shadow-none print:p-0">
        
        {/* Header */}
        <header className="border-b-2 border-ink pb-8 mb-8">
          <div className="text-[10px] tracking-[0.4em] uppercase font-sans text-ink/40 mb-2">
            Currículum
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight uppercase text-ink mb-3 font-serif">
            Analía Sandleris
          </h1>
          <div className="font-sans text-xs sm:text-sm uppercase tracking-[0.25em] text-accent font-semibold mb-2">
            Artista Visual &middot; Docente &middot; Paisajismo
          </div>
          <p className="font-sans text-xs text-ink/50 tracking-wider">
            Montevideo, Uruguay &middot; Nacida en 1958
          </p>
        </header>

        {/* Quick Navigation / Filter (wraps cleanly on all screen sizes) */}
        <div className="mb-10 print:hidden">
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.15em]">
            <button
              onClick={() => setActiveSection('all')}
              className={`px-3 py-1.5 transition-colors cursor-pointer border ${activeSection === 'all' ? 'bg-ink text-paper border-ink' : 'border-ink/15 hover:border-ink/40 text-ink/70 bg-transparent'}`}
            >
              Ver Todo
            </button>
            {SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`px-3 py-1.5 transition-colors cursor-pointer border ${activeSection === sec.id ? 'bg-ink text-paper border-ink' : 'border-ink/15 hover:border-ink/40 text-ink/70 bg-transparent'}`}
              >
                {sec.title}
              </button>
            ))}
          </div>
        </div>

        {/* ==================== 1. TRAYECTORIA DESTACADA ==================== */}
        {(activeSection === 'all' || activeSection === 'trayectoria') && (
          <section id="trayectoria" className="mb-12 sm:mb-16">
            <h2 className="text-lg sm:text-xl uppercase tracking-[0.25em] font-sans font-bold text-ink border-b border-ink/15 pb-2 mb-6 flex items-center gap-3">
              <Award size={18} className="text-accent" />
              Trayectoria Destacada
            </h2>
            <ul className="space-y-3 font-serif text-sm sm:text-base text-ink/85">
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">2023</span>
                <span>Exposición individual, Museo Juan Manuel Blanes, Montevideo.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">2018</span>
                <span>Exposición individual, Museo Nacional de Artes Visuales, Montevideo.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">2022</span>
                <span>Curaduría de «Respuestas provisorias — Thomas Lowy 1947–2020», MNAV.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">2003</span>
                <span>Primer Premio Beca Batuz, Altzella, Alemania.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">1989</span>
                <span>Premio Especial de Acuarela, Salón del BROU.</span>
              </li>
            </ul>
          </section>
        )}

        {/* ==================== 2. FORMACIÓN ==================== */}
        {(activeSection === 'all' || activeSection === 'formacion') && (
          <section id="formacion" className="mb-12 sm:mb-16">
            <h2 className="text-lg sm:text-xl uppercase tracking-[0.25em] font-sans font-bold text-ink border-b border-ink/15 pb-2 mb-6 flex items-center gap-3">
              <GraduationCap size={18} className="text-accent" />
              Formación
            </h2>
            <ul className="space-y-4 font-serif text-sm sm:text-base text-ink/85">
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[80px]">1976</span>
                <span>Taller Félix Bernasconi.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[80px]">1985</span>
                <div>
                  <p>Taller Nelson Ramos.</p>
                  <p className="text-ink/65 text-xs sm:text-sm mt-1">
                    Beca Fulbright «Técnicas de Grabado» con el profesor David Finkbeiner de la Universidad de Nueva York, Museo Nacional de Artes Plásticas y Visuales.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[80px]">1987</span>
                <span>Taller Guillermo Fernández.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[80px]">2009–2012</span>
                <span>Técnico en Jardinería / Especialización en Jardinería. Escuela de Jardinería. Intendencia de Montevideo.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[80px]">2012</span>
                <span>
                  Asociada con la arquitecta Ximena Ayestarán, crea <em>Estudio Paisajismo Uruguayo</em>, con enfoque interdisciplinario entre arquitectura, arte y paisaje. Realizan obras en el ámbito público y privado, en diversas escalas: plazas, parques, fachadas, patios y azoteas.
                </span>
              </li>
            </ul>
          </section>
        )}

        {/* ==================== 3. ACTIVIDAD DOCENTE Y JURADOS ==================== */}
        {(activeSection === 'all' || activeSection === 'docencia') && (
          <section id="docencia" className="mb-12 sm:mb-16">
            <h2 className="text-lg sm:text-xl uppercase tracking-[0.25em] font-sans font-bold text-ink border-b border-ink/15 pb-2 mb-6 flex items-center gap-3">
              <Users size={18} className="text-accent" />
              Actividad Docente, Jurados y Curaduría
            </h2>
            <ul className="space-y-3 font-serif text-sm sm:text-base text-ink/85">
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[80px]">1985</span>
                <span>Ejerce la docencia en el Taller de Expresión Infantil (tei).</span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[80px]">1990</span>
                <span>Dirección de la Actividad Plástica «Taller de Carnaval» organizado por Adjuntament d’Eivissa, España.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[80px]">1991</span>
                <span>Dirección del Taller de Plástica «Jornadas Culturales». Colegio Sant Ciriac Santa Eulària, Ibiza, España.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[80px]">1997–2003</span>
                <span>Ejerce la docencia en su taller particular.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[80px]">1996</span>
                <span>
                  Integra el jurado del XI Salón de Artes Plásticas del SMU (Sindicato Médico del Uruguay) junto con Alfredo Testoni, Águeda Dicancro, Ignacio Iturria, Jaime Nowinski y Jorge Abbondanza.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[80px]">2017</span>
                <span>
                  Integra el jurado del Premio Montevideo, organizado por la Intendencia de Montevideo, junto con Marcelo Legrand, Cristina Bausero y Ernesto Muñoz (Ch).
                </span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[80px]">2019</span>
                <span>
                  Integra el jurado de los Fondos para la Cultura 2019, organizado por el Ministerio de Educación y Cultura.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[80px]">2022</span>
                <span>
                  Curaduría «Respuestas provisorias — Thomas Lowy 1947–2020». Museo Nacional de Artes Visuales (MNAV), Montevideo, Uruguay.
                </span>
              </li>
            </ul>
          </section>
        )}

        {/* ==================== 4. EXPOSICIONES INDIVIDUALES ==================== */}
        {(activeSection === 'all' || activeSection === 'individuales') && (
          <section id="individuales" className="mb-12 sm:mb-16">
            <h2 className="text-lg sm:text-xl uppercase tracking-[0.25em] font-sans font-bold text-ink border-b border-ink/15 pb-2 mb-6 flex items-center gap-3">
              <Eye size={18} className="text-accent" />
              Exposiciones Individuales
            </h2>
            <ul className="space-y-3 font-serif text-sm sm:text-base text-ink/85">
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">2023</span>
                <span><em>Analía Sandleris</em>. Museo Juan Manuel Blanes, Montevideo, Uruguay.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">2018</span>
                <span><em>Analía Sandleris</em>. Museo Nacional de Artes Visuales (MNAV), Montevideo, Uruguay.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">2011</span>
                <span><em>Escenarios</em>. Centro Cultural Dodecá, Montevideo, Uruguay.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">2006</span>
                <div>
                  <p><em>Fragmentos (de Postales del camino)</em>. Centro Cultural Dodecá, Montevideo, Uruguay.</p>
                  <p className="mt-1"><em>Sandleris en Marte Up Market</em>, Montevideo, Uruguay.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">2005</span>
                <div className="space-y-1">
                  <p><em>Victoria de la des-ilusión</em>. Centro Cultural MEC (Ministerio de Educación y Cultura), Montevideo, Uruguay.</p>
                  <p><em>Postales del camino</em>. Colección Engelman-Ost, Montevideo, Uruguay.</p>
                  <p><em>De la magia</em>. Galería Arteuy, José Ignacio, Maldonado, Uruguay.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">2004</span>
                <div className="space-y-1">
                  <p><em>Magia final - Principio</em>. Unión Latina, Centro Cultural Lapido, Montevideo, Uruguay.</p>
                  <p><em>Magia final</em>. El Sótano, Lawn Tennis, Montevideo, Uruguay.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">2002</span>
                <span><em>Analía Sandleris</em>. Sala Carlos Federico Sáez, Ministerio de Transporte y Obras Públicas (MTOP), Montevideo, Uruguay.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">2000</span>
                <span><em>Analía Sandleris EXPONE</em>, Sala de Dibujo de Mosca Hnos., Montevideo, Uruguay.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">1997</span>
                <div className="space-y-1">
                  <p><em>Acuarelas</em>. Sala Pedro Figari del Ministerio de Relaciones Exteriores, Montevideo, Uruguay.</p>
                  <p><em>Paintings</em>. Jadite Galleries, Nueva York, Estados Unidos.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">1993</span>
                <div className="space-y-1">
                  <p><em>El Lobizón</em>, Montevideo, Uruguay.</p>
                  <p><em>Libertad Libros</em>, Montevideo, Uruguay.</p>
                  <p><em>Museo de Historia del Arte</em>, Intendencia Municipal de Montevideo (IMM), Uruguay.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">1983</span>
                <span><em>Analía Sandleris / Pinturas</em>. Galería Ciudadela, Montevideo, Uruguay.</span>
              </li>
            </ul>
          </section>
        )}

        {/* ==================== 5. EXPOSICIONES COLECTIVAS ==================== */}
        {(activeSection === 'all' || activeSection === 'colectivas') && (
          <section id="colectivas" className="mb-12 sm:mb-16">
            <h2 className="text-lg sm:text-xl uppercase tracking-[0.25em] font-sans font-bold text-ink border-b border-ink/15 pb-2 mb-6 flex items-center gap-3">
              <Calendar size={18} className="text-accent" />
              Exposiciones Colectivas
            </h2>
            <ul className="space-y-3 font-serif text-sm sm:text-base text-ink/85">
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">2021</span>
                <span>COSMICA. «Accionar esperanzas», Tribu, Montevideo, Uruguay.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">2019</span>
                <span><em>Encontrarte con ellos</em>. Museo Juan Manuel Blanes, Montevideo, Uruguay.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">2017</span>
                <span><em>Obras en Esplendor</em>. Hotel Esplendor Montevideo, Montevideo, Uruguay.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">2016</span>
                <span><em>Blanes ocupado, 73 artistas</em>. Museo Juan Manuel Blanes, Montevideo, Uruguay.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">2014</span>
                <span><em>Inmersión</em>. Proyecto Take Me to the River (TMTTR). Fundación Iturria, Montevideo, Uruguay.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">2013</span>
                <span><em>La imagen gráfica: el artista descubriendo</em>. Fundación Unión, Montevideo, Uruguay.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">2012</span>
                <div className="space-y-1">
                  <p><em>11 artistas nacionales</em>. Galería Jacksonville, Canelones, Uruguay.</p>
                  <p><em>En reconstrucción. Arte actual 2012</em>. Museo Torres García, Montevideo, Uruguay. Itinerancia por museos y espacios culturales de San José, Salto, Bella Unión, Artigas, Paso de los Toros, San Gregorio de Polanco y Tacuarembó.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">2011</span>
                <div className="space-y-1">
                  <p><em>Once artistas de Montevideo</em>. Museo de Artes Plásticas de Tacuarembó (MUART), Tacuarembó, Uruguay.</p>
                  <p><em>8 artistas abstractos</em>. Museo de Arte Contemporáneo de El País (MAC), Montevideo, Uruguay.</p>
                  <p><em>Arte contemporáneo uruguayo</em>. Imperiale Art Gallery, Punta del Este, Maldonado, Uruguay.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">2010</span>
                <span><em>Arte Contemporáneo</em>. Castells, Uruguay.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">2009</span>
                <div className="space-y-1">
                  <p><em>Vaivén arte, artistas por la diversidad</em>. Cabildo de Montevideo, Uruguay.</p>
                  <p><em>¡Marte cumple 4 años!</em> Marte Up Market, Montevideo, Uruguay.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">2008</span>
                <div className="space-y-1">
                  <p><em>Cincuenta sí cuentan (Bodas de oro: tiempo compartido)</em>. Sala Carlos Federico Sáez, MTOP, Montevideo, Uruguay.</p>
                  <p><em>Analía Sandleris - Federico Arnaud</em>. Frau María Art Gallery, Montevideo, Uruguay.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">2007</span>
                <div className="space-y-1">
                  <p><em>Marte Up Market, poblado de artistas</em>. Portezuelo, Maldonado, Uruguay.</p>
                  <p><em>Que los derechos sean hechos: mujeres moviendo Montevideo</em>. Atrio de la IMM, Uruguay.</p>
                  <p><em>5.º Festival América do Sul</em>. Corumbá, Mato Grosso, Brasil.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">2006</span>
                <div className="space-y-1">
                  <p><em>Arte / Feria de Arte</em>. Hotel Conrad, Punta del Este, Maldonado, Uruguay.</p>
                  <p><em>Remate de sillas</em>. 121 Restobar, José Ignacio, Maldonado, Uruguay.</p>
                  <p><em>Absorciones</em>. Centro Cultural MEC, Montevideo, Uruguay.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">2005</span>
                <div className="space-y-1">
                  <p><em>13 por 13 / trece artistas, trece curadores</em>. Centro Cultural de España (CCE), Montevideo, Uruguay.</p>
                  <p><em>25 artistas para 25 años</em>. ALADI, Montevideo, Uruguay.</p>
                  <p><em>Papel a la vista</em>. Centro Cultural Lapido - Unión Latina, Montevideo, Uruguay.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">2004</span>
                <div className="space-y-1">
                  <p>Galería del Paseo, Montevideo, Uruguay.</p>
                  <p>Galería de la Matriz, Montevideo, Uruguay.</p>
                  <p><em>Arte Contemporáneo</em>. Castells & Castells, Montevideo, Uruguay.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">2003</span>
                <div className="space-y-1">
                  <p>Centro Cultural Susono-shi Bunka Senta, Susono, Japón.</p>
                  <p>Gotenba Shimin Kaikan. Centro Cultural, Gotenba, Japón.</p>
                  <p><em>14 artistas plásticos contemporáneos</em>. Intendencia Municipal de Montevideo (IMM), Uruguay.</p>
                  <p><em>El poema ilustrado</em>. Dirección de Cultura del MEC, Montevideo, Uruguay.</p>
                  <p><em>Uruguay en Santiago / Cuatro</em>. Municipalidad de Ñuñoa, Santiago de Chile, Chile.</p>
                  <p><em>4: Fló, Hontou, Mendizábal, Sandleris</em>. Uruguay Cultural Foundation for the Arts, Washington, Estados Unidos.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">2002</span>
                <span><em>4: Fló, Hontou, Mendizábal, Sandleris</em>. Embajada de Uruguay en Chile, Galería de Arte Isabel Aninat, Santiago de Chile, Chile.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">2001</span>
                <div className="space-y-1">
                  <p><em>4: Fló, Hontou, Mendizábal, Sandleris</em>. APEU, Molino de Pérez, Montevideo, Uruguay.</p>
                  <p><em>4: Fló, Hontou, Mendizábal, Sandleris</em>. South Art Gallery, Miami, Estados Unidos.</p>
                  <p><em>14 artistas plásticos contemporáneos</em>. Galería El Pie del Pez, Espacio Cultural La Foglia, Montevideo, Uruguay.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">2000</span>
                <span>Mariela González Lerena, Galería de Arte; Punta del Este, Maldonado, Uruguay.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">1998</span>
                <div className="space-y-1">
                  <p><em>5 artistas: Bassi, Cardozo, Escardó, Legrand, Sandleris</em>. Atrio de la IMM, Montevideo, Uruguay.</p>
                  <p><em>Pinturas y esculturas</em>. Galería de Arte Contemporáneo Latinoamericano, Leumi Bank, Punta del Este, Maldonado, Uruguay.</p>
                  <p><em>Homenaje de plásticos uruguayos a los 100 años de la industria</em>. Salón Azul de la Dirección Nacional de Industrias, Montevideo, Uruguay.</p>
                  <p>Museo Mazzoni, Maldonado, Uruguay.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">1997</span>
                <span>Muestra inauguración Escuela Técnica del Buceo, Universidad del Trabajo del Uruguay (UTU), Montevideo, Uruguay.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">1996</span>
                <span><em>Arte do momento</em>. Encuentro Latinoamericano de Artes. Parque Municipal Bruno Nardini, Valinhos, San Pablo, Brasil.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">1995</span>
                <div className="space-y-1">
                  <p>Patio del Cambalache, Maldonado, Uruguay.</p>
                  <p>Centro de Artistas Plásticos, Montevideo, Uruguay.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">1994</span>
                <span>Exposición didáctica infantil. Museo de Historia del Arte (MuHAr), IMM, Uruguay.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">1993</span>
                <span><em>Gen (Artistas plásticos unidos-Uruguay)</em>. Galería Paseo de la Matriz, Montevideo, Uruguay.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">1990</span>
                <span><em>Retratos y autorretratos</em>. Punta del Este Convention & Exhibition Center, Uruguay.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">1989</span>
                <div className="space-y-1">
                  <p><em>Espacio y forma</em>. Sala Vaz Ferreira, Biblioteca Nacional, Montevideo, Uruguay.</p>
                  <p><em>Retratos y autorretratos</em>. Galería Contemporánea, Montevideo, Uruguay.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">1988</span>
                <span><em>Arte por Uruguay</em>. Museo do Rio Grande do Sul, Brasil.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">1987</span>
                <div className="space-y-1">
                  <p><em>Muestra por la paz</em>, Asociación Cristiana de Jóvenes - Automóvil Club del Uruguay.</p>
                  <p>Doble muestra. Galería Zira Guichón, Montevideo, Uruguay.</p>
                  <p><em>Tercera Muestra Nacional de Plásticos Jóvenes</em>. Cabildo de Montevideo, Uruguay.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">1986</span>
                <div className="space-y-1">
                  <p><em>Mujeres uruguayas en el Arte</em>. Organización de los Estados Americanos (OEA), sede en Montevideo, Uruguay.</p>
                  <p>Exposición de grabados. Museo Nacional de Artes Plásticas y Visuales (MNAV), Montevideo, Uruguay.</p>
                  <p>Galería Bruzzone, Montevideo, Uruguay.</p>
                  <p>Galería Zira Guichón, Montevideo, Uruguay.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">1985</span>
                <div className="space-y-1">
                  <p><em>Iberoamérica 85</em>. Intendencia Municipal de Montevideo (IMM), Uruguay.</p>
                  <p>Museo de Arte Moderno de Pretoria, Sudáfrica.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">1984</span>
                <div className="space-y-1">
                  <p><em>Horizontes 84</em>. Auditorio Caravelle, Montevideo, Uruguay.</p>
                  <p>Universidad de Pretoria, Centro de Estudios Latinoamericanos, Sudáfrica.</p>
                  <p>Cooperativa de Viviendas Mesa 2, Montevideo, Uruguay.</p>
                  <p>Cooperativa de Vivienda Rubén Darío, Montevideo, Uruguay.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">1983–87</span>
                <span><em>Arte internacional por Uruguay</em>. Muestra itinerante por Sídney, Melbourne, Caracas, Río de Janeiro, Ciudad de México y 43 ciudades europeas.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">1982</span>
                <div className="space-y-1">
                  <p><em>Mujeres uruguayas en el arte</em>. Secretaría General de la OEA, sede en Montevideo, Uruguay.</p>
                  <p>Taller Bernasconi. Muestra anual de alumnos del taller. Instituto Italiano de Cultura, Montevideo, Uruguay.</p>
                  <p>Exposición permanente en Galería Artema, Punta del Este, Maldonado, Uruguay.</p>
                  <p>Galería de la Brecha, Montevideo, Uruguay.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">1981</span>
                <span><em>Seis pintores nacionales</em>. Durazno, Uruguay. Con el auspicio de la Secretaría General de la OEA.</span>
              </li>
            </ul>
          </section>
        )}

        {/* ==================== 6. PREMIOS, SALONES Y BIENALES ==================== */}
        {(activeSection === 'all' || activeSection === 'premios') && (
          <section id="premios" className="mb-12 sm:mb-16">
            <h2 className="text-lg sm:text-xl uppercase tracking-[0.25em] font-sans font-bold text-ink border-b border-ink/15 pb-2 mb-6 flex items-center gap-3">
              <Award size={18} className="text-accent" />
              Participación en Salones, Premios, Concursos y Bienales
            </h2>
            <ul className="space-y-3 font-serif text-sm sm:text-base text-ink/85">
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">2012</span>
                <span>55 Premio Nacional de Artes Visuales Wifredo Díaz Valdéz.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">2010</span>
                <span>Concurso Intemperie. Museo Figari, Montevideo, Uruguay. <em>Molinete</em>, obra seleccionada, en coautoría con Ximena Ayestarán.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">2007</span>
                <span>52 Premio Nacional de Artes Visuales María Freire.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">2003</span>
                <span>Primer Premio Beca Batuz, Altzella, Alemania.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">2000</span>
                <div className="space-y-1">
                  <p>Salón Municipal de Artes Plásticas y Visuales, Centro de Exposiciones Subte, Montevideo, Uruguay.</p>
                  <p>8.ª Bienal de Primavera de Salto, Uruguay.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">1989</span>
                <div className="space-y-1">
                  <p>Salón de Dibujo, Acuarela y Grabado del Banco de la República Oriental del Uruguay (BROU). <strong>Premio Especial de Acuarela</strong>.</p>
                  <p>Primer Salón Rioplatense de la Mujer. Museo Didáctico Artiguista de Maldonado, Maldonado, Uruguay.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">1988</span>
                <span>Primer Salón Rioplatense de la Mujer en el Arte. Centro de Exposiciones del Palacio Municipal, Montevideo, Uruguay.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">1986</span>
                <div className="space-y-1">
                  <p>Salón Departamental de Maldonado, Maldonado, Uruguay.</p>
                  <p>Premio Nacional de Pintura. Almanaque INCA. Subte Municipal de Montevideo, Uruguay.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">1985</span>
                <div className="space-y-1">
                  <p>Premio Nacional de Pintura. Almanaque INCA. Salón de la Comisión Nacional de Bellas Artes, Montevideo, Uruguay. Artista invitada.</p>
                  <p>Premio Paul Cézanne de pintura joven uruguaya. Artista seleccionada.</p>
                  <p>VI Salón del Automóvil Club del Uruguay.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">1984</span>
                <div className="space-y-1">
                  <p>Premio Nacional de Pintura. Almanaque INCA. Artista invitada.</p>
                  <p>Bienal de Joven Pintura. Museo de Arte Americano de Maldonado (MAAM), Uruguay.</p>
                  <p>Concurso de Arte Nacional Banco Interamericano de Desarrollo (BID), XXV Reunión anual de la Asamblea de Gobernadores. Punta del Este, Maldonado, Uruguay.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">1983</span>
                <div className="space-y-1">
                  <p>IV Salón Departamental de Artes Plásticas de San José, Uruguay.</p>
                  <p>II Salón Sudamericano de la Mujer en las Artes. Galería Caravelle Viajes, Montevideo, Uruguay.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">1982</span>
                <div className="space-y-1">
                  <p>Bienal de Pintura Joven. Museo de Arte Americano de Maldonado (MAAM). Artista invitada.</p>
                  <p>46 Salón Nacional de Artes Plásticas y Visuales. Ministerio de Educación y Cultura, Comisión de Artes Plásticas y Visuales.</p>
                  <p>Jornadas Carolinas. Maldonado, Uruguay.</p>
                  <p>III Salón Departamental de Artes Plásticas de San José, Uruguay.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">1981</span>
                <div className="space-y-1">
                  <p>Salón Departamental de Pintura de Maldonado. <strong>Mención del Jurado</strong>.</p>
                  <p>45 Salón Nacional de Artes Plásticas y Visuales. Ministerio de Educación y Cultura.</p>
                  <p>II Salón Departamental de Artes Plásticas de San José. <strong>Premio Intendencia Municipal de San José</strong>, Uruguay.</p>
                  <p>XXIX Salón Municipal de Artes Plásticas y Visuales. Montevideo, Uruguay.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">1980</span>
                <div className="space-y-1">
                  <p>Primer Salón Departamental de Artes Plásticas y Visuales. Intendencia Municipal de San José, Uruguay. <strong>Mención del Jurado</strong>.</p>
                  <p>XLIV Salón Nacional de Artes Plásticas y Visuales. Ministerio de Educación y Cultura.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">1978</span>
                <span>XXVI Salón Municipal de Artes Plásticas, Montevideo, Uruguay.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-accent min-w-[50px]">1972</span>
                <span>Centro de Vendedores y Viajantes. Dibujo. <strong>Primer Premio</strong>.</span>
              </li>
            </ul>
          </section>
        )}

        {/* ==================== 7. PRENSA ==================== */}
        {(activeSection === 'all' || activeSection === 'prensa') && (
          <section id="prensa" className="mb-12 sm:mb-16">
            <h2 className="text-lg sm:text-xl uppercase tracking-[0.25em] font-sans font-bold text-ink border-b border-ink/15 pb-2 mb-6 flex items-center gap-3">
              <FileText size={18} className="text-accent" />
              Prensa y Crítica
            </h2>
            <ul className="space-y-2.5 font-serif text-xs sm:text-sm text-ink/80 leading-relaxed">
              <li>Gerardo Mantero, Oscar Larroca: «Lo que yo hice fue pintura pintura», <em>La Pupila</em> N° 48 (Montevideo), diciembre 2018.</li>
              <li>Daniel Tomasini: «Una larga y profunda travesía», <em>Revista Dossier</em> (Montevideo), edición 12 aniversario, N° 71, noviembre 2018.</li>
              <li>Pablo Thiago Rocca: «Lloverá siempre», <em>Brecha</em> (Montevideo), 12/10/2018.</li>
              <li>Nelson Di Maggio: «La esquiva madurez», <em>Voces del Frente</em> (Montevideo), 27/9/2018.</li>
              <li>Abbondanza, Jorge: «Las obras que el Premio Nacional eligió», <em>El País</em> (Montevideo), 25/11/2012.</li>
              <li>Boglione, Riccardo: «Periconiada», <em>La Diaria</em> (Montevideo), 22/5/2012.</li>
              <li>«Acrílicos de Analía Sandleris en Dodecá», <em>El País</em> (Montevideo), 11/4/2011.</li>
              <li>Moreno, Inés: «Aquellas pequeñas cosas», <em>La Diaria</em> (Montevideo), 16/4/2008.</li>
              <li>Di Maggio, Nelson: «Balance de temporada: artes plásticas», <em>La República</em> (Montevideo), 2/1/2006.</li>
              <li>Sin firma: «Analía Sandleris presenta ‘Victoria de la des-ilusión’», <em>El Observador</em> (Montevideo), 9/8/2005.</li>
              <li>Haber, Alicia: «La pintura que evoca pérdidas y desencantos», <em>El País</em> (Montevideo), 11/8/2005.</li>
              <li>Rocca, Pablo Thiago: «Modelo para armar», <em>Brecha</em> (Montevideo), 24/5/2002.</li>
              <li>Oroño, Tatiana: «Panes de su propia molienda», <em>Brecha</em> (Montevideo), 15/6/2001.</li>
              <li>Sin firma: «El proyecto ‘4 artistas’ colgará este año en Montevideo y Miami», <em>Búsqueda</em> (Montevideo), 31/5/2001.</li>
              <li>Sin firma: «Los pintores ¿para quién pintan?», <em>El País</em> (Montevideo), 23/5/2001.</li>
              <li>Di Maggio, Nelson: «Balance de temporada: artes plásticas», <em>La República</em> (Montevideo), 2/1/2000.</li>
              <li>Roubaud, Elisa: «Cinco artistas notables», <em>El País</em> (Montevideo), 26/8/1999.</li>
              <li>Haber, Alicia: «Valijas: llegadas y partidas», <em>El País</em> (Montevideo), s. f.</li>
              <li>Carro Amorín, Mailing: «Artista Analía Sandleris. Muestra en la Sala Figari del Ministerio de Relaciones Exteriores», <em>La Mañana</em> (Montevideo), 15/3/1997.</li>
              <li>Di Maggio, Nelson: «Artes plásticas: lo mejor del año», <em>La República</em> (Montevideo), 30/12/1996.</li>
              <li>Carro Amorín, Mailing: «Firme en su propuesta, cuestiona en profundidad», <em>La Mañana</em> (Montevideo), 7/9/1996.</li>
              <li>Abbondanza, Jorge: «¿Trabajos infantiles?», <em>El País</em> (Montevideo), 29/8/1996.</li>
              <li>Di Maggio, Nelson: «Analía Sandleris: dibujo», <em>La República</em> (Montevideo), 26/8/1996.</li>
              <li>Vernazza, Eduardo: «Analía Sandleris: encuentro ansioso del expresionismo», <em>El Día</em> (Montevideo), 17/12/1983.</li>
              <li>Sin firma: «Arte joven en el maam», <em>El País</em> (Montevideo), 19/12/1983.</li>
              <li>Sin firma: «Analía Sandleris y el salto cuantitativo», <em>La Semana Uruguaya</em> (Montevideo), 5/12/1983.</li>
              <li>de Espada, Roberto: «Jóvenes promisorios en galería Brecha», <em>El Día</em> (Montevideo), 5/6/1982.</li>
              <li>Sin firma: «Analía Sandleris», <em>Arte & Diseño</em>, edición 264, mzo.-abr. 2015, Uruguay.</li>
              <li>Devoto, Sandra: «Entrevista a Analía Sandleris», <em>Arte & Diseño</em>, edición 234, ag. 2012, Uruguay.</li>
              <li>Tomassini, Daniel: «Se levanta el telón, Analía Sandleris en Dodecá», <em>Dossier</em>, Año 5/N° 26, my.-jun. 2011, Uruguay.</li>
              <li>Do Pazo, Susana: «Analía Sandleris: sueños, ilusiones, recuerdos», <em>Revista Pluna</em>, nov.-dic. 2005.</li>
              <li>Dubra, Adela: «Artistas uruguayos para adelante», <em>Galería</em>, N° 135, 15/5/2003, Uruguay.</li>
              <li>Guiria, Blanca: «Retrato de artista», <em>Arte & Diseño</em>, edición 78, jul. 1999, Uruguay.</li>
              <li>Sin firma: «Analía: cada obra es una ventana al mundo», <em>Noticias</em>, Año V, N° 202, 10/3/1982, Uruguay.</li>
            </ul>
          </section>
        )}

        {/* ==================== 8. BIBLIOGRAFÍA ==================== */}
        {(activeSection === 'all' || activeSection === 'bibliografia') && (
          <section id="bibliografia" className="mb-8">
            <h2 className="text-lg sm:text-xl uppercase tracking-[0.25em] font-sans font-bold text-ink border-b border-ink/15 pb-2 mb-6 flex items-center gap-3">
              <BookOpen size={18} className="text-accent" />
              Bibliografía
            </h2>
            <ul className="space-y-2.5 font-serif text-xs sm:text-sm text-ink/80 leading-relaxed">
              <li><em>Encontrarte con ellos</em>. Catálogo de exposición. Museo Juan Manuel Blanes, Montevideo, 2020.</li>
              <li>Oscar Bonilla: <em>100 Retratos de la cultura Uruguaya</em>. Libro de Fotografías. Agosto 2019, Montevideo, Uruguay.</li>
              <li><em>Analía Sandleris</em>. Catálogo de exposición. Museo Nacional de Artes Visuales (MNAV), Montevideo, 2018.</li>
              <li>Di Maggio, Nelson: <em>Artes visuales en Uruguay: diccionario crítico</em>, 2.ª ed., Montevideo, 2017.</li>
              <li><em>Obras en Esplendor</em>. Catálogo de exposición. Esplendor Montevideo-pozodeagua, Montevideo, 2017.</li>
              <li><em>Blanes ocupado</em>. Catálogo de exposición. Museo Juan Manuel Blanes, Montevideo, 2016.</li>
              <li><em>55 Premio Nacional de Artes Visuales Wifredo Díaz Valdéz</em>. Catálogo de exposición. Ministerio de Educación y Cultura, Montevideo, 2015.</li>
              <li>Mastromatteo, Juan: <em>El pensamiento creador: apuntes para una reflexión en las artes plásticas y visuales</em>, Montevideo: Rebeca Linke Editoras, 2008.</li>
              <li><em>52 Premio Nacional de Artes Visuales María Freire</em>. Catálogo de exposición. Ministerio de Educación y Cultura, Montevideo, 2007.</li>
              <li>Campodónico, Miguel Ángel: <em>Diccionario de la cultura uruguaya</em>, Montevideo: Editorial Linardi y Risso, 2007.</li>
              <li><em>13 por 13 / trece artistas-trece curadores</em>. Catálogo de exposición. Centro Cultural de España, Montevideo, 2005.</li>
            </ul>
          </section>
        )}

        {/* Footer info inside CV */}
        <footer className="mt-16 pt-8 border-t border-ink/10 text-center font-sans text-[10px] tracking-[0.3em] uppercase text-ink/40">
          Analía Sandleris &middot; Currículum
        </footer>
      </article>

      {/* Floating Bottom Nav for Mobile / Back */}
      <div className="mt-10 flex justify-center print:hidden">
        <Link 
          to="/bio" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-paper text-xs uppercase tracking-[0.3em] font-sans font-bold hover:bg-accent transition-all shadow-md group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Volver a Biografía
        </Link>
      </div>

    </div>
  );
}
