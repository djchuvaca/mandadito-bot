const { Client, LocalAuth } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const { GRUPO_ID, RADIO_KM } = require('./config')
const { analizarMensaje } = require('./ia')
const { geocodificarColonia, calcularDistancia, setUbicacionRepartidor, getUbicacionRepartidor } = require('./ubicacion')

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ]
  }
})

client.on('qr', (qr) => {
  console.log('\n📱 Escanea este QR con WhatsApp:\n')
  qrcode.generate(qr, { small: true })
})

client.on('ready', () => {
  console.log('✅ Bot conectado a WhatsApp')
})

client.on('message', async (msg) => {
    
  console.log('--- mensaje ---', msg.type, msg.from)
  
  if (!msg.from.endsWith('@g.us')) {
    if (msg.location) {
      setUbicacionRepartidor(msg.location.latitude, msg.location.longitude)
      await msg.reply('📍 Ubicación recibida, estoy listo para aceptar pedidos cercanos.')
    }
    return
  }

  if (msg.from !== GRUPO_ID && msg.from !== '133363717374154@lid') {
    console.log('❌ Grupo incorrecto:', msg.from, '!==', GRUPO_ID)
    return
  }

  console.log('✅ Grupo correcto')

  if (msg.type === 'location' || msg.type === 'live_location') {
    setUbicacionRepartidor(msg.location.latitude, msg.location.longitude)
    console.log('📍 Ubicación del repartidor actualizada desde el grupo')
    return
  }

  const texto = msg.body
  if (!texto) { console.log('❌ Sin texto'); return }
  if (texto.length < 10) { console.log('❌ Texto muy corto:', texto); return }
  if (!texto.match(/\d/)) { console.log('❌ Sin números'); return }
  if (!texto.match(/[a-zA-ZáéíóúÁÉÍÓÚñÑ]{3,}/)) { console.log('❌ Sin letras'); return }

  console.log('Mensaje recibido:', texto)

  const analisis = await analizarMensaje(texto)
  console.log('Análisis:', analisis)

  if (!analisis.esMandadito) return
  if (!analisis.coloniaOrigen) {
    console.log('⚠️ No se detectó colonia de origen')
    return
  }

  const ubicacion = getUbicacionRepartidor()
  if (!ubicacion) {
    console.log('⚠️ No hay ubicación del repartidor')
    return
  }

  const coordenadas = await geocodificarColonia(analisis.coloniaOrigen)
  if (!coordenadas) {
    console.log('⚠️ No se pudo geocodificar:', analisis.coloniaOrigen)
    return
  }

  const distancia = calcularDistancia(
    ubicacion.lat, ubicacion.lon,
    coordenadas.lat, coordenadas.lon
  )

  console.log(`📏 Distancia a ${analisis.coloniaOrigen}: ${distancia.toFixed(2)} km`)

  if (distancia <= RADIO_KM) {
    console.log('✅ Pedido cercano, respondiendo...')
    await msg.reply('yo')
  } else {
    console.log(`❌ Muy lejos (${distancia.toFixed(2)} km)`)
  }
})

client.on('message_create', async (msg) => {
  if (!msg.fromMe) return
  
  const esGrupo = msg.from === GRUPO_ID || msg.from === '133363717374154@lid'
  if (!esGrupo) return
  
  if (msg.type === 'location' || msg.type === 'live_location') {
    setUbicacionRepartidor(msg.location.latitude, msg.location.longitude)
    console.log('📍 Ubicación del repartidor actualizada desde el grupo')
  }
})


module.exports = { client }

