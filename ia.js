const Groq = require('groq-sdk')
const { GROQ_API_KEY } = require('./config')

const groq = new Groq({ apiKey: GROQ_API_KEY })

async function analizarMensaje(texto) {
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'user',
          content: `Eres un asistente que analiza mensajes de mandaditos en Tepic, Nayarit, México.
Extrae la información y responde SOLO en JSON sin texto adicional.

Cuando identifiques una colonia, normaliza su nombre usando esta lista oficial de colonias y calles de Tepic:
Mercado de abastos, 12 de Diciembre, 15 de Mayo, 18 de Agosto, 20 de Noviembre, 26 de Septiembre, 2 de Agosto, 4 Milpas, 5 de Febrero, Acayapan, Adolfo López Mateos, Alaska, Amado Nervo, América Manríquez, Ampliación El Paraíso, Ampliación Santa Teresita, Ampliación Tierra y Libertad, Ampliación Unidad Obrera, Aramara, Arboledas, Aves del Paraíso, Aviación, Aztlán El Verde, Aztlán Solidaridad, Benito Juárez, Benito Juárez Oriente, Bethel, Bonaterra, Brisas de San Juan, Buenos Aires, Bugambilias, Burócrata Estatal, Burócrata Federal, Caja de Agua, Caminera, Camino Real, Cantera del Nayar, Cáp. Orozco, Castilla, Centro SCT Nayarit, Chapultepec, Ciudad del Valle, Ciudad Industrial, Ciudad Industrial Microindustria, Colinas del Nayar, Colinas del Rey, Colonial, Comerciantes, Conasupo, Cora, Corralón, Cuauhtémoc, Cuitlahuac, Del Bosque, Del Sol, Dieciséis de Septiembre, Dr. Cuesta Barrios, Dr. Lucas Vallarta, Ecologistas, Ejidal, El 8, El Aguacate, El Armadillo, El Capomo, Electricistas, El Faisán, El Mirador INFONAVIT, El Naranjal, El Palomar, El Paraíso, El Parián, El Pedregal, El Puerto, El Punto, El Rodeo, El Rubí, El Tecolote, El Tecolote INFONAVIT, Emiliano Zapata, Emilio M. González, Estadios, Esteban Baca Calderón, Extamex, Félix Peña, Ferrocarrilero 1a Secc., Ferrocarrilero 2a Secc., Flamingos, Florencia, Flores Magón, FOVISSSTE 1a Etapa, FOVISSSTE 2a Etapa, Francisco Villa, Fray Junipero Serra, Gardenias, Genaro Vázquez, Gilberto Flores Muñoz, Gobernadores, Gobierno del Cambio I, Guadalupe, Gustavo Díaz Ordaz, Heriberto Casas, Heriberto Jara, Hermosa Provincia, IMSS, INDECO, Independencia, Ingeniero Agrónomo, Ingeniero Aguayo, Instituto Tecnológico de Tepic, Insurgentes, Islas del Paraíso, Jacarandas, Jagüey, Jardines de La Cruz, Jardines del Parque, Jardines del Valle, Jazmines, Jesús García, José María Martínez, Juan Escutia, Justino Ávila Arce, Juventud, Labores de Godínez, Ladrilleras, La Esperanza, La Floresta, Lagos del Country, La Huerta, La Joya, La Loma, La Lomita, Las Aves, Las Brisas, Las Brisas FOVISSSTE, Las Conchas, Las Flores, Las Islas, Las Palomas, Las Pares, Lázaro Cárdenas, Leonardo Rodríguez Alcaine, Leyva Medina, Lindavista, Lirios, Loma Hermosa, Lomas Altas, Lomas Bonitas, Lomas de Cortez, Lomas de La Cruz, Lomas de La Cruz Sutse, Lomas de La Laguna, Lomas del Valle, Lomas del Valle Ampliación, Lomas de San Juan, Los Arcos, Los Colomos, Los Fresnos, Los Fresnos INFONAVIT, Los Fresnos Oriente, Los Fresnos Poniente, Los Llanitos, Los Pinos, Los Sauces, Los Sauces INFONAVIT, Los Viveros, Luis Donaldo Colosio, Luis Donaldo Colosio Murrieta, Luis Echeverría A., Magisterial, Marco Antonio Fernández, Menchaca, México, Miguel Ángel Paredes, Miguel Hidalgo, Miravalles, Moctezuma, Molinos del Rey, Mololoa, Morelos, Nayarabastos, Niños Héroes, Nueva Alemania, Nueva Aviación, Nuevas Delicias, Nuevas Palomas, Nuevo Progreso, Obrera CTM, Ojo de Agua, Olimpo, Oriental, Parque Ecológico, Paseo de La Constitución, Paseo del Valle Real, Pedregal de San Juan, Peñita, Periodistas, Plan de Ayala, Predio San Martín, Prieto Crispín, Primero de Mayo, Puente de San Cayetano, Puerta de La Laguna, Puerta Encanto, Puesta del Sol, Rancho las Cruces, Real Montecarlo, Reforma, Residencial La Esmeralda, Residencial La Loma, Residencial los Olivos, Revolución, Rey Nayar, Rinconada Residencial, Rincón de San Juan, Rivas Allende, Riveras de La Laguna, Rodeo de La Punta, Ruinas de Jauja, Sacristán, San Antonio, Sanchez Ibarra, Sandino, San José, San Juan, San Juanito, Santa Cecilia, Santa Fe, Santa Teresita, Secretaria de La Reforma Agraria, Senderos del Monte, Severiano Ocegueda, Simancas, Sindicalistas, Social Progresivo Cuba, Solidaridad INFONAVIT, Solidaridad Primavera, SPAUAN, Tabacos Aztecas, Tepic Centro, Tierra y Libertad, Tío Baltazar, Tulipanes, Unidad Deportiva Santa Teresita, Unidad Obrera, Unidos por Tu Tranquilidad, Universidad Autónoma de Nayarit, Universitario, Valle de La Cruz, Valle del Country, Valle de Matatipac, Valle de Nayarit, Valle de Zaragoza, Valle Dorado, Valle Magno, Valle Verde, Valle Verde Conalep, Venceremos, Versalles Norte, Versalles Sur, Villa las Rosas, Villa San Ángel, Villas Arana, Villas de La Cantera, Villas de la Cruz, Villas de la Laguna, Villas de La Paz, Villas del Molino, Villas del Nayar, Villas del Paraíso, Villas del Parque, Villas del Roble, Villas de Matatipac, Villas de San Juan, Vistas de La Cantera, Vistas de La Cantera Etapa 2, Zapopan, Zitacua, Avenida México, Avenida Insurgentes, Periférico, Avenida Aguamilpa, Avenida Prisciliano Sánchez, Avenida Brasil, Boulevard Colosio, Boulevard Tepic Xalisco, Calzada de la Cruz, Calzada del Ejército, Paseo de la Loma, Avenida de la Cultura, Avenida 12 de Octubre, Avenida Francisco I. Madero, Avenida Río Suchiate, Boulevard Estudiantes, Avenida Zapopan, Calle I, Avenida Allende, Calle Ejido, Avenida Victoria, Paseo de la Alameda, Avenida Flores Magón, Avenida Proyecto, Avenida Juárez, Avenida Jacarandas, Avenida Xalisco, Boulevard Gobernadores, Avenida Independencia, Avenida Principal, Avenida Rey Nayar, Avenida Universidad, Avenida del Valle, Avenida Villa de León, Paseo del Geranio

REGLA CRÍTICA — COLONIAS:
- Para identificar coloniaOrigen: analiza la primera línea palabra por palabra de izquierda a derecha, compara cada palabra y combinaciones de palabras consecutivas con la lista. La primera que coincida es coloniaOrigen
- Lo mismo aplica para coloniaDestino en la segunda línea o después de "a" o "x"
- Si el lugar identificado es un negocio, restaurante o referencia que no está en la lista, se ignora y se sigue buscando
- Si ninguna palabra coincide con la lista, devuelve null
- Ejemplos:
  "Pollo feliz vistas" → "Pollo" no, "feliz" no, "vistas" sí → coloniaOrigen: "Vistas de La Cantera"
  "Sushi UAN Gobernadores" → "Sushi" no, "UAN" no, "Gobernadores" sí → coloniaOrigen: "Gobernadores"
  "Puerta jardín x villas de la cantera" → ninguna coincide como origen → coloniaOrigen: null, "villas de la cantera" → coloniaDestino: "Vistas de La Cantera"
  "Flores magon e insurgentes" → "Flores Magon" sí → coloniaOrigen: "Flores Magón", "insurgentes" es vialidad se ignora
  "Gobernadores a Moctezuma x Brasil" → coloniaOrigen: "Gobernadores", coloniaDestino: "Moctezuma", "Brasil" es vialidad se ignora

Normalización de nombres cortos o abreviados comunes:
- "Tecolote" → "El Tecolote"
- "Paraiso" o "Paraíso" → "El Paraíso"
- "Vistas" → "Vistas de La Cantera"
- "Fresnos" → "Los Fresnos"
- "Sauces" → "Los Sauces"
- "Inf Sauces" → "Los Sauces INFONAVIT"
- "Mirador" → "El Mirador INFONAVIT"
- "Centro" → "Tepic Centro"
- "Montecarlo" → "Real Montecarlo"
- "H Casas" o "H CASAS" → "Heriberto Casas"
- "Aviación" → "Nueva Aviación"
- "Lagos" → "Lagos del Country"
- "Cd del valle" → "Ciudad del Valle"

Ejemplos:

Mensaje: "Xalisco\nCentro\n950\n60"
{"esMandadito":true,"coloniaOrigen":"Xalisco","coloniaDestino":"Tepic Centro","pagoOrigen":950,"pagoServicio":60,"extras":null}

Mensaje: "H CASAS\n114\nVISTAS\n65\nLISTO"
{"esMandadito":true,"coloniaOrigen":"Heriberto Casas","coloniaDestino":"Vistas de La Cantera","pagoOrigen":114,"pagoServicio":65,"extras":null}

Mensaje: "Tecolote\nInf Sauces\n500\n50\nMochila termica"
{"esMandadito":true,"coloniaOrigen":"El Tecolote","coloniaDestino":"Los Sauces INFONAVIT","pagoOrigen":500,"pagoServicio":50,"extras":"mochila térmica"}

Mensaje: "Gobernadores a Moctezuma x Brasil 300/45"
{"esMandadito":true,"coloniaOrigen":"Gobernadores","coloniaDestino":"Moctezuma","pagoOrigen":300,"pagoServicio":45,"extras":null}

Mensaje: "Forum x dentro\nA\nPuente de San Cayetano\n-500\n55"
{"esMandadito":true,"coloniaOrigen":"Forum","coloniaDestino":"Puente de San Cayetano","pagoOrigen":500,"pagoServicio":55,"extras":null}

Mensaje: "Tecolote\nParaiso\n500\n60"
{"esMandadito":true,"coloniaOrigen":"El Tecolote","coloniaDestino":"El Paraíso","pagoOrigen":500,"pagoServicio":60,"extras":null}

Mensaje: "Lagos a valle de matatipac 00/45 accesorios"
{"esMandadito":true,"coloniaOrigen":"Lagos del Country","coloniaDestino":"Valle de Matatipac","pagoOrigen":0,"pagoServicio":45,"extras":"accesorios"}

Mensaje: "con mochila\n\nLuis Donaldo Colosio por tierra y libertad\n\nCentro\n\n150/50"
{"esMandadito":true,"coloniaOrigen":"Luis Donaldo Colosio","coloniaDestino":"Tepic Centro","pagoOrigen":150,"pagoServicio":50,"extras":"mochila"}

Mensaje: "México y Zapopan\nValle de matatipac\n000/50\nAlitas listo"
{"esMandadito":true,"coloniaOrigen":"México","coloniaDestino":"Valle de Matatipac","pagoOrigen":0,"pagoServicio":50,"extras":"alitas"}

Mensaje: "Nuevo progreso Xalisco Libramiento frente a Castilla\n0000\n55 servicio"
{"esMandadito":true,"coloniaOrigen":"Nuevo Progreso","coloniaDestino":"Castilla","pagoOrigen":0,"pagoServicio":55,"extras":null}

Mensaje: "Xalisco\nJardines del valle\n600/70\nRamo"
{"esMandadito":true,"coloniaOrigen":"Xalisco","coloniaDestino":"Jardines del Valle","pagoOrigen":600,"pagoServicio":70,"extras":"ramo"}

Mensaje: "Compra de botes a nueva Alemania 300/50"
{"esMandadito":true,"coloniaOrigen":null,"coloniaDestino":"Nueva Alemania","pagoOrigen":300,"pagoServicio":50,"extras":"botes"}

Mensaje: "San Juan 000\n\nSanta Teresita 50\n\nComida lista"
{"esMandadito":true,"coloniaOrigen":"San Juan","coloniaDestino":"Santa Teresita","pagoOrigen":0,"pagoServicio":50,"extras":"comida"}

Mensaje: "San juan\n-500\n\nVillas del parque\n60"
{"esMandadito":true,"coloniaOrigen":"San Juan","coloniaDestino":"Villas del Parque","pagoOrigen":500,"pagoServicio":60,"extras":null}

Mensaje: "Centro\n400\n\nLindavista\n60\n\nComprar una rosca crusita"
{"esMandadito":true,"coloniaOrigen":"Tepic Centro","coloniaDestino":"Lindavista","pagoOrigen":400,"pagoServicio":60,"extras":"rosca"}

Mensaje: "Lindavista\nFracc alaska (alaska e insurgentes)\n$300//$45\nTacos listos"
{"esMandadito":true,"coloniaOrigen":"Lindavista","coloniaDestino":"Alaska","pagoOrigen":300,"pagoServicio":45,"extras":"tacos"}

Mensaje: "Fresnos a san Antonio 200/55"
{"esMandadito":true,"coloniaOrigen":"Los Fresnos","coloniaDestino":"San Antonio","pagoOrigen":200,"pagoServicio":55,"extras":null}

Mensaje: "Lomas bonitas x Alaska a Montecarlo 00/60\nPEDIDO LISTO A LAS 7\nCON MOCHILA TÉRMICA"
{"esMandadito":true,"coloniaOrigen":"Lomas Bonitas","coloniaDestino":"Real Montecarlo","pagoOrigen":0,"pagoServicio":60,"extras":"mochila térmica"}

Mensaje: "Sushi UAN Gobernadores\n-300\n\nEmiliano zapata\n50"
{"esMandadito":true,"coloniaOrigen":"Gobernadores","coloniaDestino":"Emiliano Zapata","pagoOrigen":300,"pagoServicio":50,"extras":"sushi"}

Mensaje: "Miguel Hidalgo\n\nVistas\n\n50/50"
{"esMandadito":true,"coloniaOrigen":"Miguel Hidalgo","coloniaDestino":"Vistas de La Cantera","pagoOrigen":50,"pagoServicio":50,"extras":null}

Mensaje: "Mirador a lomas de la cruz enfrente 40 y 300 comida"
{"esMandadito":true,"coloniaOrigen":"El Mirador INFONAVIT","coloniaDestino":"Lomas de La Cruz","pagoOrigen":40,"pagoServicio":300,"extras":"comida"}

Mensaje: "Flores magon e insurgentes a mercado de abastos 45 y 300 comida"
{"esMandadito":true,"coloniaOrigen":"Flores Magón","coloniaDestino":"Nayarabastos","pagoOrigen":45,"pagoServicio":300,"extras":"comida"}

Mensaje: "Cd del valle a ahí mismo 00/35"
{"esMandadito":true,"coloniaOrigen":"Ciudad del Valle","coloniaDestino":"Ciudad del Valle","pagoOrigen":0,"pagoServicio":35,"extras":null}

Mensaje: "ok gracias"
{"esMandadito":false,"coloniaOrigen":null,"coloniaDestino":null,"pagoOrigen":null,"pagoServicio":null,"extras":null}

Mensaje: "quien va?"
{"esMandadito":false,"coloniaOrigen":null,"coloniaDestino":null,"pagoOrigen":null,"pagoServicio":null,"extras":null}

Ahora analiza este mensaje y responde SOLO con el JSON:
"${texto}"`
        }
      ]
    })

    const respuesta = completion.choices[0].message.content
    const json = respuesta.replace(/```json|```/g, '').trim()
    const inicio = json.indexOf('{')
    const fin = json.lastIndexOf('}')
    const jsonLimpio = json.substring(inicio, fin + 1)
    return JSON.parse(jsonLimpio)

  } catch (err) {
    console.log('Error al analizar:', err.message)
    return { esMandadito: false }
  }
}

module.exports = { analizarMensaje }