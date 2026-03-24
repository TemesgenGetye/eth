/**
 * Ethiopia: region → cities (nested). Extend `COUNTRY_REGION_CITIES` for more countries.
 */
export const ETHIOPIA_BY_REGION: Record<string, readonly string[]> = {
  'Addis Ababa': ['Addis Ababa'],
  Oromia: [
    'Adama',
    'Jimma',
    'Shashamane',
    'Bishoftu',
    'Nekemte',
    'Ambo',
    'Asella',
    'Robe',
    'Dembi Dollo',
    'Goba',
    'Bule Hora',
  ],
  Amhara: [
    'Bahir Dar',
    'Gondar',
    'Dessie',
    'Debre Markos',
    'Debre Tabor',
    'Woldia',
    'Lalibela',
    'Debre Birhan',
    'Kombolcha',
    'Sekota',
  ],
  Tigray: [
    'Mekelle',
    'Adigrat',
    'Axum',
    'Shire',
    'Humera',
    'Adwa',
    'Abi Adi',
  ],
  'Southern Nations, Nationalities, and Peoples (SNNP)': [
    'Hawassa',
    'Arba Minch',
    'Dilla',
    'Wolaita Sodo',
    'Hosanna',
    'Jinka',
    'Yirgalem',
    'Mizan Teferi',
    'Bonga',
  ],
  Sidama: ['Hawassa', 'Yirgalem', 'Aleta Wondo'],
  Somali: ['Jigjiga', 'Gode', 'Kebri Dehar', 'Degehabur', 'Shilabo'],
  Afar: ['Semera', 'Asayita', 'Awash', 'Dubti', 'Logiya'],
  'Benishangul-Gumuz': ['Assosa', 'Metekel', 'Bambasi', 'Kamashi'],
  Gambela: ['Gambela', 'Abobo', 'Itang'],
  Harari: ['Harar'],
  'Dire Dawa': ['Dire Dawa'],
} as const;

/** Country → region → cities (array-of-arrays shape as nested records). */
export const COUNTRY_REGION_CITIES = {
  Ethiopia: ETHIOPIA_BY_REGION,
} as const;

export type CountryCode = keyof typeof COUNTRY_REGION_CITIES;

export const CITY_FILTER_ALL = 'All Cities';

const ALL_CITIES_SENTINELS = new Set([
  CITY_FILTER_ALL,
  'All Cities (UAE)',
  '',
]);

/** Regions with city lists for UI (stable order). */
export function getRegionEntriesForCountry(
  country: CountryCode = 'Ethiopia',
): [string, readonly string[]][] {
  const regions = COUNTRY_REGION_CITIES[country];
  if (!regions) return [];
  return Object.entries(regions);
}

/** Unique city names for selects (e.g. post ad). */
export function getFlatCityListForCountry(country: CountryCode = 'Ethiopia'): string[] {
  const regions = COUNTRY_REGION_CITIES[country];
  const unique = new Set<string>();
  for (const cities of Object.values(regions)) {
    for (const c of cities) unique.add(c);
  }
  return Array.from(unique).sort((a, b) => a.localeCompare(b));
}

export function isAllCitiesFilterValue(
  city: string | undefined | null,
): boolean {
  if (city == null) return true;
  return ALL_CITIES_SENTINELS.has(city.trim());
}
