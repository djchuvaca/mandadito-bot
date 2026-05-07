const fs = require('fs')

const colonias = [
  'Mercado de abastos',
  'Ampliación El Paraíso',
  'Ampliación Santa Teresita',
  'Ampliación Unidad Obrera',
  'Aztlán El Verde',
  'Benito Juárez Oriente',
  'Burócrata Federal',
  'Cantera del Nayar',
  'Colinas del Nayar',
  'Comerciantes',
  'Conasupo',
  'Ecologistas',
  'El Faisán',
  'El Naranjal',
  'El Palomar',
  'El Parián',
  'El Rubí',
  'FOVISSSTE 1a Etapa',
  'FOVISSSTE 2a Etapa',
  'Islas del Paraíso',
  'Jardines del Parque',
  'Jardines del Valle',
  'Ladrilleras',
  'La Floresta',
  'La Lomita',
  'Las Conchas',
  'Lomas Altas',
  'Lomas de Cortez',
  'Lomas de La Laguna',
  'Los Viveros',
  'Magisterial',
  'Nayarabastos',
  'Nueva Aviación',
  'Obrera CTM',
  'Paseo de La Constitución',
  'Pedregal de San Juan',
  'Periodistas',
  'Puerta de La Laguna',
  'Puesta del Sol',
  'Real Montecarlo',
  'Residencial La Esmeralda',
  'Residencial La Loma',
  'Residencial los Olivos',
  'Riveras de La Laguna',
  'Santa Fe',
  'Senderos del Monte',
  'Simancas',
  'Sindicalistas',
  'Solidaridad INFONAVIT',
  'Solidaridad Primavera',
  'Tabacos Aztecas',
  'Unidad Deportiva Santa Teresita',
  'Unidad Obrera',
  'Versalles Norte',
  'Villa las Rosas',
  'Villa San Ángel',
  'Villas Arana',
  'Villas de la Cruz',
  'Villas de la Laguna',
  'Villas del Nayar',
  'Villas del Paraíso',
  'Villas del Roble',
  'Villas de Matatipac'
]

async function buscarColonia(nombre) {
  await new Promise(r => setTimeout(r, 1100))
  const query = encodeURIComponent(`${nombre}, Tepic, Nayarit, Mexico`)
  const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`, {
    headers: { 'User-Agent': 'MandaditoBot/1.0' }
  })
  const data = await res.json()
  if (data.length === 0) return null
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) }
}

async function generarCatalogo() {
  const catalogo = {}
  let encontradas = 0
  let noEncontradas = []

  for (const colonia of colonias) {
    process.stdout.write(`Buscando: ${colonia}... `)
    const coords = await buscarColonia(colonia)
    if (coords) {
      catalogo[colonia] = coords
      console.log(`✅ ${coords.lat}, ${coords.lon}`)
      encontradas++
    } else {
      console.log('❌ No encontrada')
      noEncontradas.push(colonia)
    }
  }

  fs.writeFileSync('colonias.json', JSON.stringify(catalogo, null, 2))
  console.log(`\n✅ Encontradas: ${encontradas}`)
  console.log(`❌ No encontradas: ${noEncontradas.length}`)
  console.log('No encontradas:', noEncontradas)
  console.log('\n📁 Catálogo guardado en colonias.json')
}

generarCatalogo()