export type ColourCategory = 'Dominant' | 'Secondary' | 'Accent';

export type CityColour = { 
  name: string; 
  hex: string; 
  frequency: number; 
  category: ColourCategory;
  hint: string;
};

export type CityData = Record<'Bogotá' | 'Toulouse', CityColour[]>;

export const COLOUR_DATA: CityData = {
  Bogotá: [
    // Dominantes
    { name: 'Ladrillo Salmona', hex: '#9C453B', frequency: 9, category: 'Dominant', hint: 'Look for this in the curves of brick architecture, public libraries, or classic facades.' },
    { name: 'Gris Panza de Burro', hex: '#8D949A', frequency: 8, category: 'Dominant', hint: 'Look for this in the overcast sky, concrete structures, or rainy day reflections.' },
    
    // Secundarios
    { name: 'Verde Paramuno', hex: '#3B5E41', frequency: 6, category: 'Secondary', hint: 'Look for this in the distant mountains, native vegetation, or mossy colonial walls.' },
    { name: 'Amarillo Sabana', hex: '#E5B113', frequency: 5, category: 'Secondary', hint: 'Look for this in passing taxis, vibrant street signs, or flowering Guayacanes.' },
    
    // Acentos
    { name: 'Azul Colonial', hex: '#2A4B7C', frequency: 3, category: 'Accent', hint: 'Look for this in the heavy wooden doors and window frames of La Candelaria.' },
    { name: 'Fucsia Bugambilia', hex: '#D11149', frequency: 2, category: 'Accent', hint: 'Look for this spilling over brick walls, hanging from balconies, or in vibrant murals.' }
  ],
  Toulouse: [
    // Dominantes
    { name: 'Brique Foraine', hex: '#C26C54', frequency: 9, category: 'Dominant', hint: 'Look for this in the warm facades of the old city and historical monuments.' },
    { name: 'Gris Ardoise', hex: '#5E656D', frequency: 8, category: 'Dominant', hint: 'Look for this by looking up at the slate rooftops, domes, and metallic spires.' },
    
    // Secundarios
    { name: 'Bleu Pastel', hex: '#7A9BAB', frequency: 6, category: 'Secondary', hint: 'Look for this in historic wooden shutters, faded shop signs, or classic front doors.' },
    { name: 'Verde Garonne', hex: '#4A5D4E', frequency: 5, category: 'Secondary', hint: 'Look for this in the deep reflections of the river or the shade of plane trees along the canal.' },
    
    // Acentos
    { name: 'Jaune Tournesol', hex: '#E8C547', frequency: 3, category: 'Accent', hint: 'Look for this in painted architectural details, local florists, or sunny street corners.' },
    { name: 'Violette de Toulouse', hex: '#6B427A', frequency: 2, category: 'Accent', hint: 'Look for this in specialized boutique displays, rare flowers, or hidden street art.' }
  ]
};

/**
 * Generates a weighted colour challenge based on city data priorities.
 * Prioritizes colours with lower urban frequency to increase challenge.
 * @param city - The user's city ('Bogota' or 'Toulouse')
 * @returns An object containing the name, hex code, and hint of the selected colour
 */
export function generateTargetColour(city: "Bogota" | "Toulouse"): {
	name: string;
	hex: string;
	hint: string;
} {
	// Map internal city key to data key with accent
	const dataKey = city === "Bogota" ? "Bogotá" : "Toulouse";
	const palette = COLOUR_DATA[dataKey];

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
			return { name: colour.name, hex: colour.hex, hint: colour.hint };
		}
	}

	// Fallback de seguridad
	return { name: palette[0].name, hex: palette[0].hex, hint: palette[0].hint };
}
