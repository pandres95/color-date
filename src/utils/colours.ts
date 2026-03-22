type CityColour = { name: string; hex: string; frequency: number };
type CityData = Record<"Bogota" | "Toulouse", CityColour[]>;

const COLOUR_DATA: CityData = {
	Bogota: [
		{ name: "Ladrillo Santafé", hex: "#B24231", frequency: 9 }, // Extremadamente común
		{ name: "Gris Concreto", hex: "#808080", frequency: 8 },
		{ name: "Verde Sabana", hex: "#4B7B4B", frequency: 6 },
		{ name: "Amarillo Tránsito", hex: "#F0C808", frequency: 4 }, // Taxis, señales
		{ name: "Azul Puerta Colonial", hex: "#2B5B84", frequency: 3 }, // La Candelaria
		{ name: "Fucsia Bugambilia", hex: "#D11149", frequency: 2 }, // Raro, requiere buscar flores o grafitis
	],
	Toulouse: [
		{ name: "Ladrillo Rosa / Brique", hex: "#CC7766", frequency: 9 }, // La Ville Rose
		{ name: "Gris Pizarra", hex: "#708090", frequency: 7 }, // Techos de zinc
		{ name: "Verde Postigo", hex: "#2F4F4F", frequency: 5 }, // Puertas y ventanas típicas
		{ name: "Azul Garonne", hex: "#5A9EBA", frequency: 4 }, // Reflejos del río, postigos claros
		{ name: "Amarillo Pastel", hex: "#F4E087", frequency: 3 }, // Detalles arquitectónicos
		{ name: "Violeta Toulousain", hex: "#7A4B94", frequency: 2 }, // Emblema de la ciudad, difícil en la calle
	],
};

/**
 * Generates a weighted colour challenge based on city data priorities.
 * Prioritizes colours with lower urban frequency to increase challenge.
 * * @param city - The user's city ('Bogota' or 'Toulouse')
 * @returns An object containing the name and hex code of the selected colour
 */
export function generateTargetColour(city: "Bogota" | "Toulouse"): {
	name: string;
	hex: string;
} {
	const palette = COLOUR_DATA[city];

	// Nivel base para invertir el peso (frecuencia máxima + 1 para evitar peso 0)
	const MAX_FREQUENCY = 11;
	let totalWeight = 0;

	// Calcular los pesos invertidos (Ej: frecuencia 9 -> peso 2. Frecuencia 2 -> peso 9)
	const weightedPalette = palette.map((colour) => {
		const weight = MAX_FREQUENCY - colour.frequency;
		totalWeight += weight;
		return { ...colour, weight };
	});

	// Generar un valor aleatorio dentro del peso total acumulado
	let randomVal = Math.random() * totalWeight;

	// Iterar hasta encontrar el rango ponderado donde cae el valor aleatorio
	for (const colour of weightedPalette) {
		randomVal -= colour.weight;
		if (randomVal <= 0) {
			return { name: colour.name, hex: colour.hex };
		}
	}

	// Fallback de seguridad (nunca debería alcanzarse por la matemática, pero TS lo exige)
	return { name: palette[0].name, hex: palette[0].hex };
}
