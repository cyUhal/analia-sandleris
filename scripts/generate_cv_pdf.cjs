const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function generateCV() {
  const doc = await PDFDocument.create();
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await doc.embedFont(StandardFonts.HelveticaOblique);

  const pageWidth = 595.28; // A4
  const pageHeight = 841.89;
  const margin = 50;
  const contentWidth = pageWidth - margin * 2;

  let currentPage = doc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  function checkPage(neededHeight = 40) {
    if (y - neededHeight < margin) {
      currentPage = doc.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
      drawHeaderFooter();
    }
  }

  function drawHeaderFooter() {
    currentPage.drawText('ANALÍA SANDLERIS · CURRÍCULUM', {
      x: margin,
      y: pageHeight - 30,
      size: 8,
      font: fontRegular,
      color: rgb(0.5, 0.5, 0.5),
    });
    currentPage.drawLine({
      start: { x: margin, y: pageHeight - 35 },
      end: { x: pageWidth - margin, y: pageHeight - 35 },
      thickness: 0.5,
      color: rgb(0.8, 0.8, 0.8),
    });
  }

  // Cover / Header on first page
  currentPage.drawText('CURRÍCULUM', {
    x: margin,
    y: y,
    size: 10,
    font: fontRegular,
    color: rgb(0.5, 0.5, 0.5),
  });
  y -= 25;

  currentPage.drawText('ANALÍA SANDLERIS', {
    x: margin,
    y: y,
    size: 24,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  });
  y -= 18;

  currentPage.drawText('ARTISTA VISUAL / DOCENTE / PAISAJISMO', {
    x: margin,
    y: y,
    size: 11,
    font: fontBold,
    color: rgb(0.4, 0.25, 0.2),
  });
  y -= 15;

  currentPage.drawText('Montevideo, Uruguay · Nacida en 1958', {
    x: margin,
    y: y,
    size: 9,
    font: fontRegular,
    color: rgb(0.4, 0.4, 0.4),
  });
  y -= 20;

  currentPage.drawLine({
    start: { x: margin, y: y },
    end: { x: pageWidth - margin, y: y },
    thickness: 1,
    color: rgb(0.2, 0.2, 0.2),
  });
  y -= 25;

  function wrapText(text, maxWidth, font, size) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const width = font.widthOfTextAtSize(testLine, size);
      if (width <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  }

  function addSectionTitle(title) {
    checkPage(45);
    y -= 10;
    currentPage.drawText(title.toUpperCase(), {
      x: margin,
      y: y,
      size: 12,
      font: fontBold,
      color: rgb(0.15, 0.15, 0.15),
    });
    y -= 6;
    currentPage.drawLine({
      start: { x: margin, y: y },
      end: { x: pageWidth - margin, y: y },
      thickness: 0.5,
      color: rgb(0.7, 0.7, 0.7),
    });
    y -= 16;
  }

  function addEntry(yearOrTag, text) {
    const yearWidth = 70;
    const textWidth = contentWidth - yearWidth;
    const lines = wrapText(text, textWidth, fontRegular, 9.5);
    const itemHeight = Math.max(14, lines.length * 13) + 4;

    checkPage(itemHeight);

    if (yearOrTag) {
      currentPage.drawText(yearOrTag, {
        x: margin,
        y: y,
        size: 9,
        font: fontBold,
        color: rgb(0.3, 0.3, 0.3),
      });
    }

    let lineY = y;
    for (const line of lines) {
      currentPage.drawText(line, {
        x: margin + yearWidth,
        y: lineY,
        size: 9.5,
        font: fontRegular,
        color: rgb(0.2, 0.2, 0.2),
      });
      lineY -= 13;
    }
    y -= itemHeight;
  }

  // 1. TRAYECTORIA DESTACADA
  addSectionTitle('Trayectoria Destacada');
  addEntry('2023', 'Exposición individual, Museo Juan Manuel Blanes, Montevideo.');
  addEntry('2018', 'Exposición individual, Museo Nacional de Artes Visuales, Montevideo.');
  addEntry('2022', 'Curaduría de «Respuestas provisorias — Thomas Lowy 1947–2020», MNAV.');
  addEntry('2003', 'Primer Premio Beca Batuz, Altzella, Alemania.');
  addEntry('1989', 'Premio Especial de Acuarela, Salón del BROU.');

  // 2. FORMACIÓN
  addSectionTitle('Formación');
  addEntry('1976', 'Taller Félix Bernasconi.');
  addEntry('1985', 'Taller Nelson Ramos. Beca Fulbright «Técnicas de Grabado» con el profesor David Finkbeiner de la Universidad de Nueva York, Museo Nacional de Artes Plásticas y Visuales.');
  addEntry('1987', 'Taller Guillermo Fernández.');
  addEntry('2009–2012', 'Técnico en Jardinería / Especialización en Jardinería. Escuela de Jardinería. Intendencia de Montevideo.');
  addEntry('2012', 'Asociada con la arquitecta Ximena Ayestarán, crea Estudio Paisajismo Uruguayo, con enfoque interdisciplinario entre arquitectura, arte y paisaje. Realizan obras en el ámbito público y privado: plazas, parques, fachadas, patios y azoteas.');

  // 3. ACTIVIDAD DOCENTE Y JURADOS
  addSectionTitle('Actividad Docente, Jurados y Curaduría');
  addEntry('1985', 'Ejerce la docencia en el Taller de Expresión Infantil (tei).');
  addEntry('1990', 'Dirección de la Actividad Plástica «Taller de Carnaval» organizado por Adjuntament d’Eivissa, España.');
  addEntry('1991', 'Dirección del Taller de Plástica «Jornadas Culturales». Colegio Sant Ciriac Santa Eulària, Ibiza, España.');
  addEntry('1997–2003', 'Ejerce la docencia en su taller.');
  addEntry('1996', 'Integra el jurado del XI Salón de Artes Plásticas del SMU junto con Alfredo Testoni, Águeda Dicancro, Ignacio Iturria, Jaime Nowinski y Jorge Abbondanza.');
  addEntry('2017', 'Integra el jurado del Premio Montevideo, organizado por la Intendencia de Montevideo, junto con Marcelo Legrand, Cristina Bausero y Ernesto Muñoz (Ch).');
  addEntry('2019', 'Integra el jurado de los Fondos para la Cultura 2019, organizado por el Ministerio de Educación y Cultura.');
  addEntry('2022', 'Curaduría «Respuestas provisorias — Thomas Lowy 1947–2020». Museo Nacional de Artes Visuales, Montevideo, Uruguay.');

  // 4. EXPOSICIONES INDIVIDUALES
  addSectionTitle('Exposiciones Individuales');
  addEntry('2023', 'Analía Sandleris. Museo Juan Manuel Blanes, Montevideo, Uruguay.');
  addEntry('2018', 'Analía Sandleris. Museo Nacional de Artes Visuales (MNAV), Montevideo, Uruguay.');
  addEntry('2011', 'Escenarios. Centro Cultural Dodecá, Montevideo, Uruguay.');
  addEntry('2006', 'Fragmentos (de Postales del camino). Centro Cultural Dodecá, Montevideo, Uruguay.');
  addEntry('2006', 'Sandleris en Marte Up Market, Montevideo, Uruguay.');
  addEntry('2005', 'Victoria de la des-ilusión. Centro Cultural MEC, Montevideo, Uruguay.');
  addEntry('2005', 'Postales del camino. Colección Engelman-Ost, Montevideo, Uruguay.');
  addEntry('2005', 'De la magia. Galería Arteuy, José Ignacio, Maldonado, Uruguay.');
  addEntry('2004', 'Magia final - Principio. Unión Latina, Centro Cultural Lapido, Montevideo, Uruguay.');
  addEntry('2004', 'Magia final. El Sótano, Lawn Tennis, Montevideo, Uruguay.');
  addEntry('2002', 'Analía Sandleris. Sala Carlos Federico Sáez, Ministerio de Transporte y Obras Públicas (MTOP), Montevideo, Uruguay.');
  addEntry('2000', 'Analía Sandleris EXPONE, Sala de Dibujo de Mosca Hnos., Montevideo, Uruguay.');
  addEntry('1997', 'Acuarelas. Sala Pedro Figari del Ministerio de Relaciones Exteriores, Montevideo, Uruguay.');
  addEntry('1997', 'Paintings. Jadite Galleries, Nueva York, Estados Unidos.');
  addEntry('1993', 'El Lobizón, Montevideo, Uruguay.');
  addEntry('1993', 'Libertad Libros, Montevideo, Uruguay.');
  addEntry('1993', 'Museo de Historia del Arte, Intendencia Municipal de Montevideo (IMM), Uruguay.');
  addEntry('1983', 'Analía Sandleris / Pinturas. Galería Ciudadela, Montevideo, Uruguay.');

  // 5. EXPOSICIONES COLECTIVAS
  addSectionTitle('Exposiciones Colectivas');
  addEntry('2021', 'COSMICA. «Accionar esperanzas», Tribu, Montevideo, Uruguay.');
  addEntry('2019', 'Encontrarte con ellos. Museo Juan Manuel Blanes, Montevideo, Uruguay.');
  addEntry('2017', 'Obras en Esplendor. Hotel Esplendor Montevideo, Montevideo, Uruguay.');
  addEntry('2016', 'Blanes ocupado, 73 artistas. Museo Juan Manuel Blanes, Montevideo, Uruguay.');
  addEntry('2014', 'Inmersión. Proyecto Take Me to the River (TMTTR). Fundación Iturria, Montevideo, Uruguay.');
  addEntry('2013', 'La imagen gráfica: el artista descubriendo. Fundación Unión, Montevideo, Uruguay.');
  addEntry('2012', '11 artistas nacionales. Galería Jacksonville, Canelones, Uruguay.');
  addEntry('2012', 'En reconstrucción. Arte actual 2012. Museo Torres García, Montevideo, Uruguay. Itinerancia nacional por 7 departamentos.');
  addEntry('2011', 'Once artistas de Montevideo, Museo de Artes Plásticas de Tacuarembó (MUART), Uruguay.');
  addEntry('2011', '8 artistas abstractos. Museo de Arte Contemporáneo de El País (MAC), Montevideo, Uruguay.');
  addEntry('2011', 'Arte contemporáneo uruguayo. Imperiale Art Gallery, Punta del Este, Maldonado, Uruguay.');
  addEntry('2010', 'Arte Contemporáneo. Castells, Uruguay.');
  addEntry('2009', 'Vaivén arte, artistas por la diversidad. Cabildo de Montevideo, Uruguay.');
  addEntry('2009', '¡Marte cumple 4 años! Marte Up Market, Montevideo, Uruguay.');
  addEntry('2008', 'Cincuenta sí cuentan. Sala Carlos Federico Sáez, MTOP, Montevideo, Uruguay.');
  addEntry('2008', 'Analía Sandleris - Federico Arnaud. Frau María Art Gallery, Montevideo, Uruguay.');
  addEntry('2007', 'Marte Up Market, poblado de artistas. Portezuelo, Maldonado, Uruguay.');
  addEntry('2007', 'Que los derechos sean hechos: mujeres moviendo Montevideo. Atrio de la IMM, Uruguay.');
  addEntry('2007', '5.º Festival América do Sul. Corumbá, Mato Grosso, Brasil.');
  addEntry('2006', 'Arte / Feria de Arte. Hotel Conrad, Punta del Este, Maldonado, Uruguay.');
  addEntry('2006', 'Remate de sillas. 121 Restobar, José Ignacio, Maldonado, Uruguay.');
  addEntry('2006', 'Absorciones. Centro Cultural MEC, Montevideo, Uruguay.');
  addEntry('2005', '13 por 13 / trece artistas, trece curadores. Centro Cultural de España (CCE), Montevideo, Uruguay.');
  addEntry('2005', '25 artistas para 25 años. ALADI, Montevideo, Uruguay.');
  addEntry('2005', 'Papel a la vista. Centro Cultural Lapido - Unión Latina, Montevideo, Uruguay.');
  addEntry('2004', 'Galería del Paseo, Montevideo, Uruguay.');
  addEntry('2004', 'Galería de la Matriz, Montevideo, Uruguay.');
  addEntry('2004', 'Arte Contemporáneo. Castells & Castells, Montevideo, Uruguay.');
  addEntry('2003', 'Centro Cultural Susono-shi Bunka Senta, Susono, Japón.');
  addEntry('2003', 'Gotenba Shimin Kaikan. Centro Cultural, Gotenba, Japón.');
  addEntry('2003', '14 artistas plásticos contemporáneos. IMM, Montevideo, Uruguay.');
  addEntry('2003', 'El poema ilustrado. Dirección de Cultura del MEC, Montevideo, Uruguay.');
  addEntry('2003', 'Uruguay en Santiago / Cuatro. Municipalidad de Ñuñoa, Santiago de Chile, Chile.');
  addEntry('2003', '4: Fló, Hontou, Mendizábal, Sandleris. Uruguay Cultural Foundation for the Arts, Washington, EE. UU.');
  addEntry('2002', '4: Fló, Hontou, Mendizábal, Sandleris. Embajada de Uruguay en Chile, Galería Isabel Aninat, Santiago de Chile.');
  addEntry('2001', '4: Fló, Hontou, Mendizábal, Sandleris. APEU, Molino de Pérez, Montevideo, Uruguay.');
  addEntry('2001', '4: Fló, Hontou, Mendizábal, Sandleris. South Art Gallery, Miami, Estados Unidos.');
  addEntry('2001', '14 artistas plásticos contemporáneos. Galería El Pie del Pez, Espacio Cultural La Foglia, Montevideo.');
  addEntry('2000', 'Mariela González Lerena, Galería de Arte, Punta del Este, Maldonado, Uruguay.');
  addEntry('1998', '5 artistas: Bassi, Cardozo, Escardó, Legrand, Sandleris. Atrio de la IMM, Montevideo, Uruguay.');
  addEntry('1998', 'Pinturas y esculturas. Galería de Arte Contemporáneo Latinoamericano, Leumi Bank, Punta del Este.');
  addEntry('1998', 'Homenaje de plásticos uruguayos a los 100 años de la industria. Salón Azul de Industrias, Montevideo.');
  addEntry('1998', 'Museo Mazzoni, Maldonado, Uruguay.');
  addEntry('1997', 'Muestra inauguración Escuela Técnica del Buceo, UTU, Montevideo, Uruguay.');
  addEntry('1996', 'Arte do momento. Encuentro Latinoamericano de Artes. Parque Bruno Nardini, Valinhos, San Pablo, Brasil.');
  addEntry('1995', 'Patio del Cambalache, Maldonado, Uruguay.');
  addEntry('1995', 'Centro de Artistas Plásticos, Montevideo, Uruguay.');
  addEntry('1994', 'Exposición didáctica infantil. Museo de Historia del Arte (MuHAr), IMM, Uruguay.');
  addEntry('1993', 'Gen (Artistas plásticos unidos-Uruguay). Galería Paseo de la Matriz, Montevideo, Uruguay.');
  addEntry('1990', 'Retratos y autorretratos. Punta del Este Convention & Exhibition Center, Uruguay.');
  addEntry('1989', 'Espacio y forma. Sala Vaz Ferreira, Biblioteca Nacional, Montevideo, Uruguay.');
  addEntry('1989', 'Retratos y autorretratos. Galería Contemporánea, Montevideo, Uruguay.');
  addEntry('1988', 'Arte por Uruguay. Museo do Rio Grande do Sul, Brasil.');
  addEntry('1987', 'Muestra por la paz, Asociación Cristiana de Jóvenes - Automóvil Club del Uruguay.');
  addEntry('1987', 'Doble muestra. Galería Zira Guichón, Montevideo, Uruguay.');
  addEntry('1987', 'Tercera Muestra Nacional de Plásticos Jóvenes. Cabildo de Montevideo, Uruguay.');
  addEntry('1986', 'Mujeres uruguayas en el Arte. Organización de los Estados Americanos (OEA), Montevideo.');
  addEntry('1986', 'Exposición de grabados. Museo Nacional de Artes Plásticas y Visuales (MNAV), Montevideo.');
  addEntry('1986', 'Galería Bruzzone, Montevideo, Uruguay.');
  addEntry('1986', 'Galería Zira Guichón, Montevideo, Uruguay.');
  addEntry('1985', 'Iberoamérica 85. Intendencia Municipal de Montevideo (IMM), Uruguay.');
  addEntry('1985', 'Museo de Arte Moderno de Pretoria, Sudáfrica.');
  addEntry('1984', 'Horizontes 84. Auditorio Caravelle, Montevideo, Uruguay.');
  addEntry('1984', 'Universidad de Pretoria, Centro de Estudios Latinoamericanos, Sudáfrica.');
  addEntry('1984', 'Cooperativa de Viviendas Mesa 2 / Rubén Darío, Montevideo, Uruguay.');
  addEntry('1983–87', 'Arte internacional por Uruguay. Muestra itinerante por Sídney, Melbourne, Caracas, Río de Janeiro, CDMX y 43 ciudades europeas.');
  addEntry('1982', 'Mujeres uruguayas en el arte. Secretaría General de la OEA, Montevideo, Uruguay.');
  addEntry('1982', 'Taller Bernasconi. Muestra anual de alumnos del taller. Instituto Italiano de Cultura, Montevideo.');
  addEntry('1982', 'Exposición permanente en Galería Artema, Punta del Este / Galería de la Brecha, Montevideo.');
  addEntry('1981', 'Seis pintores nacionales. Durazno, Uruguay. Auspicio OEA.');

  // 6. PREMIOS, SALONES Y BIENALES
  addSectionTitle('Participación en Salones, Premios, Concursos y Bienales');
  addEntry('2012', '55 Premio Nacional de Artes Visuales Wifredo Díaz Valdéz.');
  addEntry('2010', 'Concurso Intemperie. Museo Figari, Montevideo. Molinete, obra seleccionada en coautoría con Ximena Ayestarán.');
  addEntry('2007', '52 Premio Nacional de Artes Visuales María Freire.');
  addEntry('2003', 'Primer Premio Beca Batuz, Altzella, Alemania.');
  addEntry('2000', 'Salón Municipal de Artes Plásticas y Visuales, Subte, Montevideo. / 8.ª Bienal de Primavera de Salto.');
  addEntry('1989', 'Salón de Dibujo, Acuarela y Grabado del BROU. Premio Especial de Acuarela.');
  addEntry('1989', 'Primer Salón Rioplatense de la Mujer. Museo Didáctico Artiguista de Maldonado.');
  addEntry('1988', 'Primer Salón Rioplatense de la Mujer en el Arte. Palacio Municipal, Montevideo.');
  addEntry('1986', 'Salón Departamental de Maldonado. / Premio Nacional de Pintura Almanaque INCA, Subte.');
  addEntry('1985', 'Premio Nacional de Pintura Almanaque INCA, Bellas Artes. Artista invitada.');
  addEntry('1985', 'Premio Paul Cézanne de pintura joven uruguaya. Artista seleccionada.');
  addEntry('1985', 'VI Salón del Automóvil Club del Uruguay.');
  addEntry('1984', 'Premio Nacional de Pintura Almanaque INCA. Artista invitada.');
  addEntry('1984', 'Bienal de Joven Pintura. Museo de Arte Americano de Maldonado (MAAM).');
  addEntry('1984', 'Concurso de Arte Nacional BID, XXV Reunión Anual de Gobernadores, Punta del Este.');
  addEntry('1983', 'IV Salón Departamental de Artes Plásticas de San José.');
  addEntry('1983', 'II Salón Sudamericano de la Mujer en las Artes. Galería Caravelle Viajes, Montevideo.');
  addEntry('1982', 'Bienal de Pintura Joven. MAAM. Artista invitada. / 46 Salón Nacional de Artes Plásticas y Visuales.');
  addEntry('1982', 'Jornadas Carolinas, Maldonado. / III Salón Departamental de Artes Plásticas de San José.');
  addEntry('1981', 'Salón Departamental de Pintura de Maldonado. Mención del Jurado.');
  addEntry('1981', '45 Salón Nacional de Artes Plásticas y Visuales.');
  addEntry('1981', 'II Salón Departamental de San José. Premio Intendencia Municipal de San José.');
  addEntry('1981', 'XXIX Salón Municipal de Artes Plásticas y Visuales, Montevideo.');
  addEntry('1980', 'Primer Salón Departamental de San José. Mención del Jurado. / XLIV Salón Nacional.');
  addEntry('1978', 'XXVI Salón Municipal de Artes Plásticas, Montevideo.');
  addEntry('1972', 'Centro de Vendedores y Viajantes. Dibujo. Primer Premio.');

  // 7. PRENSA
  addSectionTitle('Prensa');
  const prensaItems = [
    'Gerardo Mantero, Oscar Larroca: «Lo que yo hice fue pintura pintura», La Pupila N° 48 (Montevideo), dic. 2018.',
    'Daniel Tomasini: «Una larga y profunda travesía», Revista Dossier N° 71 (Montevideo), nov. 2018.',
    'Pablo Thiago Rocca: «Lloverá siempre», Brecha (Montevideo), 12/10/2018.',
    'Nelson Di Maggio: «La esquiva madurez», Voces del Frente (Montevideo), 27/9/2018.',
    'Abbondanza, Jorge: «Las obras que el Premio Nacional eligió», El País (Montevideo), 25/11/2012.',
    'Boglione, Riccardo: «Periconiada», La Diaria (Montevideo), 22/5/2012.',
    '«Acrílicos de Analía Sandleris en Dodecá», El País (Montevideo), 11/4/2011.',
    'Moreno, Inés: «Aquellas pequeñas cosas», La Diaria (Montevideo), 16/4/2008.',
    'Di Maggio, Nelson: «Balance de temporada: artes plásticas», La República (Montevideo), 2/1/2006.',
    'Sin firma: «Analía Sandleris presenta ‘Victoria de la des-ilusión’», El Observador (Montevideo), 9/8/2005.',
    'Haber, Alicia: «La pintura que evoca pérdidas y desencantos», El País (Montevideo), 11/8/2005.',
    'Rocca, Pablo Thiago: «Modelo para armar», Brecha (Montevideo), 24/5/2002.',
    'Oroño, Tatiana: «Panes de su propia molienda», Brecha (Montevideo), 15/6/2001.',
    'Sin firma: «El proyecto ‘4 artistas’ colgará este año en Montevideo y Miami», Búsqueda, 31/5/2001.',
    'Sin firma: «Los pintores ¿para quién pintan?», El País (Montevideo), 23/5/2001.',
    'Di Maggio, Nelson: «Balance de temporada: artes plásticas», La República (Montevideo), 2/1/2000.',
    'Roubaud, Elisa: «Cinco artistas notables», El País (Montevideo), 26/8/1999.',
    'Haber, Alicia: «Valijas: llegadas y partidas», El País (Montevideo), s. f.',
    'Carro Amorín, Mailing: «Artista Analía Sandleris», La Mañana (Montevideo), 15/3/1997.',
    'Di Maggio, Nelson: «Artes plásticas: lo mejor del año», La República (Montevideo), 30/12/1996.',
    'Carro Amorín, Mailing: «Firme en su propuesta, cuestiona en profundidad», La Mañana, 7/9/1996.',
    'Abbondanza, Jorge: «¿Trabajos infantiles?», El País (Montevideo), 29/8/1996.',
    'Di Maggio, Nelson: «Analía Sandleris: dibujo», La República (Montevideo), 26/8/1996.',
    'Vernazza, Eduardo: «Analía Sandleris: encuentro ansioso del expresionismo», El Día, 17/12/1983.',
    'Sin firma: «Arte joven en el maam», El País (Montevideo), 19/12/1983.',
    'Sin firma: «Analía Sandleris y el salto cuantitativo», La Semana Uruguaya, 5/12/1983.',
    'de Espada, Roberto: «Jóvenes promisorios en galería Brecha», El Día, 5/6/1982.',
    'Sin firma: «Analía Sandleris», Arte & Diseño N° 264, mzo.-abr. 2015, Uruguay.',
    'Devoto, Sandra: «Entrevista a Analía Sandleris», Arte & Diseño N° 234, ag. 2012, Uruguay.',
    'Tomassini, Daniel: «Se levanta el telón, Analía Sandleris en Dodecá», Dossier N° 26, my.-jun. 2011.',
    'Do Pazo, Susana: «Analía Sandleris: sueños, ilusiones, recuerdos», Revista Pluna, nov.-dic. 2005.',
    'Dubra, Adela: «Artistas uruguayos para adelante», Galería N° 135, 15/5/2003, Uruguay.',
    'Guiria, Blanca: «Retrato de artista», Arte & Diseño N° 78, jul. 1999, Uruguay.',
    'Sin firma: «Analía: cada obra es una ventana al mundo», Noticias N° 202, 10/3/1982, Uruguay.'
  ];
  for (const p of prensaItems) {
    addEntry('•', p);
  }

  // 8. BIBLIOGRAFÍA
  addSectionTitle('Bibliografía');
  const biblioItems = [
    'Encontrarte con ellos. Catálogo de exposición. Museo Juan Manuel Blanes, Montevideo, 2020.',
    'Oscar Bonilla: 100 Retratos de la cultura Uruguaya. Libro de Fotografías. Agosto 2019, Montevideo.',
    'Analía Sandleris. Catálogo de exposición. Museo Nacional de Artes Visuales (MNAV), Montevideo, 2018.',
    'Di Maggio, Nelson: Artes visuales en Uruguay: diccionario crítico, 2.ª ed., Montevideo, 2017.',
    'Obras en Esplendor. Catálogo de exposición. Esplendor Montevideo-pozodeagua, Montevideo, 2017.',
    'Blanes ocupado. Catálogo de exposición. Museo Juan Manuel Blanes, Montevideo, 2016.',
    '55 Premio Nacional de Artes Visuales Wifredo Díaz Valdéz. Catálogo MEC, Montevideo, 2015.',
    'Mastromatteo, Juan: El pensamiento creador: apuntes para una reflexión, Rebeca Linke Editoras, 2008.',
    '52 Premio Nacional de Artes Visuales María Freire. Catálogo de exposición MEC, Montevideo, 2007.',
    'Campodónico, Miguel Ángel: Diccionario de la cultura uruguaya, Linardi y Risso, 2007.',
    '13 por 13 / trece artistas-trece curadores. Catálogo CCE, Montevideo, 2005.'
  ];
  for (const b of biblioItems) {
    addEntry('•', b);
  }

  const pdfBytes = await doc.save();
  const publicDir = path.join(__dirname, '..', 'public');
  fs.mkdirSync(publicDir, { recursive: true });
  const outputPath = path.join(publicDir, 'Analia_Sandleris_Curriculum.pdf');
  fs.writeFileSync(outputPath, pdfBytes);
  console.log(`Generated ${outputPath} (${pdfBytes.length} bytes, ${doc.getPageCount()} pages)`);
}

generateCV().catch(console.error);
