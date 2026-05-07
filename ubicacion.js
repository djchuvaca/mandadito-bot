const { getDistance } = require('geolib')
const colonias = require('./colonias')

let ubicacionRepartidor = null

function geocodificarColonia(colonia) {
  if (!colonia) return null
  
  // Buscar coincidencia exacta
  if (colonias[colonia]) return colonias[colonia]
  
  // Buscar coincidencia sin importar mayúsculas
  const coloniaLower = colonia.toLowerCase()
  const key = Object.keys(colonias).find(k => k.toLowerCase() === coloniaLower)
  if (key) return colonias[key]
  
  // Buscar coincidencia parcial
  const keyParcial = Object.keys(colonias).find(k => 
    k.toLowerCase().includes(coloniaLower) || 
    coloniaLower.includes(k.toLowerCase())
  )
  if (keyParcial) return colonias[keyParcial]
  
  return null
}

function calcularDistancia(lat1, lon1, lat2, lon2) {
  const distancia = getDistance(
    { latitude: lat1, longitude: lon1 },
    { latitude: lat2, longitude: lon2 }
  )
  return distancia / 1000
}

function setUbicacionRepartidor(lat, lon) {
  ubicacionRepartidor = { lat, lon }
  console.log(`📍 Ubicación del repartidor actualizada: ${lat}, ${lon}`)
}

function getUbicacionRepartidor() {
  return ubicacionRepartidor
}

module.exports = {
  geocodificarColonia,
  calcularDistancia,
  setUbicacionRepartidor,
  getUbicacionRepartidor
}