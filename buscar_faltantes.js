const fs = require('fs')

const faltantes = [
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

function quitarAcentos(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function generarVariantes(nombre) {
  const variantes = []

  // Original
  variantes.push(nombre)

  // Sin acentos
  const sinAcentos = quitarAcentos(nombre)
  if (sinAcentos !== nombre) variantes.push(sinAcentos)

  // Quitar prefijos comunes
  const prefijos = ['Ampliación ', 'Residencial ', 'Fraccionamiento ', 'Unidad Habitacional ']
  for (const p of prefijos) {
    if (nombre.startsWith(p)) {
      const sinPrefijo = nombre.slice(p.length)
      variantes.push(sinPrefijo)
      variantes.push(quitarAcentos(sinPrefijo))
    }
  }

  // Reemplazar abreviaciones
  variantes.push(nombre.replace('1a Etapa', 'Primera Etapa'))
  variantes.push(nombre.replace('2a Etapa', 'Segunda Etapa'))
  variantes.push(nombre.replace('1a Etapa', '1'))
  variantes.push(nombre.replace('2a Etapa', '2'))

  // Quitar El/La/Las/Los al inicio
  variantes.push(nombre.replace(/^(El|La|Las|Los) /, ''))

  // Dedup
  return [...new Set(variantes)].filter(v => v.trim().length > 0)
}

async function buscarVariante(variante) {
  await new Promise(r => setTimeout(r, 1100))
  const query = encodeURIComponent(`${variante}, Tepic, Nayarit, Mexico`)
  const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`, {
    headers: { 'User-Agent': 'MandaditoBot/1.0' }
  })
  const data = await res.json()
  if (data.length === 0) return null
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) }
}

async function buscarConVariantes(nombre) {
  const variantes = generarVariantes(nombre)
  for (const v of variantes) {
    const coords = await buscarVariante(v)
    if (coords) return { coords, varianteUsada: v }
  }
  return null
}

async function main() {
  // Cargar catalogo existente si hay
  let catalogo = {}
  if (fs.existsSync('colonias.json')) {
    catalogo = JSON.parse(fs.readFileSync('colonias.json', 'utf8'))
    console.log(`📂 Catálogo existente cargado con ${Object.keys(catalogo).length} colonias\n`)
  }

  const aun_faltantes = []

  for (const colonia of faltantes) {
    process.stdout.write(`Buscando: ${colonia}... `)
    const resultado = await buscarConVariantes(colonia)
    if (resultado) {
      catalogo[colonia] = resultado.coords
      const extra = resultado.varianteUsada !== colonia ? ` (variante: "${resultado.varianteUsada}")` : ''
      console.log(`✅ ${resultado.coords.lat}, ${resultado.coords.lon}${extra}`)
    } else {
      console.log('❌ No encontrada con ninguna variante')
      aun_faltantes.push(colonia)
    }
  }

  fs.writeFileSync('colonias.json', JSON.stringify(catalogo, null, 2))
  console.log(`\n📁 Catálogo actualizado guardado en colonias.json`)
  console.log(`✅ Total en catálogo: ${Object.keys(catalogo).length}`)
  console.log(`❌ Aún sin encontrar (${aun_faltantes.length}):`)
  aun_faltantes.forEach(c => console.log(`  - ${c}`))

  // Guardar las que siguen faltando para revisión manual
  if (aun_faltantes.length > 0) {
    fs.writeFileSync('sin_coordenadas.json', JSON.stringify(aun_faltantes, null, 2))
    console.log(`\n📋 Lista guardada en sin_coordenadas.json`)
  }
}

main()