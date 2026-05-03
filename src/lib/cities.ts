const baseCities: string[] = [
  "Rabat","Sale","Temara","Skhirat","Bouznika","Kenitra","Sidi Slimane","Sidi Kacem","Mohammedia","Casablanca","Benslimane","Berrechid","Settat","El Jadida","Beni Mellal","Khouribga","Fquih Ben Salah","Meknes","Fes","Ifrane","Sefrou","Azrou","Taza","Larache","Tangier","Tetouan","Fnideq","Chefchaouen","Al Hoceima","Nador","Oujda","Berkane","Taourirt","Marrakech","Chichaoua","Safi","Youssoufia","Essaouira","Agadir","Taroudant","Tiznit","Errachidia","Midelt","Tinghir","Zagora","Laayoune","Ahfir","Azilal","Boujdour","Dakhla","Dar Bouazza","Guelmim","Guercif","Imouzzer","Khemisset","Khenifra","Ksar El Kebir","Mdiq","Martil","Ouarzazate","Ouezzane","Sidi Bennour","Sidi Ifni","Tarfaya","Tamesna","Tan-Tan","Taounate",
];
export const moroccanCities: string[] = Array.from(new Set(baseCities));

// Additional service fee from Rabat (MAD) based on your screenshots
export const cityFeeFromRabat: Record<string, number> = {
  Rabat: 0,
  Sale: 0,
  Temara: 0,
  Skhirat: 0,
  Bouznika: 0,
  Kenitra: 400,
  "Sidi Slimane": 500,
  "Sidi Kacem": 600,
  Mohammedia: 400,
  Casablanca: 400,
  Benslimane: 400,
  Settat: 600,
  Berrechid: 500,
  "El Jadida": 700,
  Meknes: 500,
  Fes: 500,
  Ifrane: 600,
  Sefrou: 650,
  Azrou: 650,
  Taza: 750,
  Larache: 700,
  Tangier: 700,
  Tetouan: 700,
  Fnideq: 700,
  "Chefchaouen": 800,
  "Al Hoceima": 800,
  Nador: 900,
  Oujda: 900,
  Berkane: 900,
  Taourirt: 850,
  Marrakech: 800,
  Chichaoua: 900,
  Safi: 800,
  Youssoufia: 850,
  Essaouira: 1000,
  Agadir: 1000,
  Taroudant: 1100,
  Tiznit: 1200,
  "Beni Mellal": 600,
  Khouribga: 500,
  "Fquih Ben Salah": 600,
  Errachidia: 950,
  Midelt: 800,
  Tinghir: 1100,
  Zagora: 1200,
  Laayoune: 1500,
};

// Simple prefecture/region label to display under the city name
export const cityRegion: Record<string, string> = {
  "Rabat": "Rabat-Salé-Kénitra",
  "Sale": "Rabat-Salé-Kénitra",
  "Temara": "Rabat-Salé-Kénitra",
  "Skhirat": "Rabat-Salé-Kénitra",
  "Bouznika": "Rabat-Salé-Kénitra",
  "Kenitra": "Rabat-Salé-Kénitra",
  "Sidi Slimane": "Rabat-Salé-Kénitra",
  "Sidi Kacem": "Rabat-Salé-Kénitra",
  "Mohammedia": "Casablanca-Settat",
  "Casablanca": "Casablanca-Settat",
  "Benslimane": "Casablanca-Settat",
  "Berrechid": "Casablanca-Settat",
  "Settat": "Casablanca-Settat",
  "El Jadida": "Casablanca-Settat",
  "Larache": "Tanger-Tétouan-Al Hoceïma",
  "Tangier": "Tanger-Tétouan-Al Hoceïma",
  "Tetouan": "Tanger-Tétouan-Al Hoceïma",
  "Fnideq": "Tanger-Tétouan-Al Hoceïma",
  "Chefchaouen": "Tanger-Tétouan-Al Hoceïma",
  "Al Hoceima": "Tanger-Tétouan-Al Hoceïma",
  "Nador": "Oriental",
  "Oujda": "Oriental",
  "Berkane": "Oriental",
  "Taourirt": "Oriental",
  "Meknes": "Fès-Meknès",
  "Fes": "Fès-Meknès",
  "Ifrane": "Fès-Meknès",
  "Sefrou": "Fès-Meknès",
  "Azrou": "Fès-Meknès",
  "Taza": "Fès-Meknès",
  "Beni Mellal": "Béni Mellal-Khénifra",
  "Khouribga": "Béni Mellal-Khénifra",
  "Fquih Ben Salah": "Béni Mellal-Khénifra",
  "Khenifra": "Béni Mellal-Khénifra",
  "Marrakech": "Marrakech-Safi",
  "Chichaoua": "Marrakech-Safi",
  "Safi": "Marrakech-Safi",
  "Youssoufia": "Marrakech-Safi",
  "Essaouira": "Marrakech-Safi",
  "Agadir": "Souss-Massa",
  "Taroudant": "Souss-Massa",
  "Tiznit": "Souss-Massa",
  "Errachidia": "Drâa-Tafilalet",
  "Midelt": "Drâa-Tafilalet",
  "Tinghir": "Drâa-Tafilalet",
  "Zagora": "Drâa-Tafilalet",
  "Laayoune": "Laâyoune-Sakia El Hamra",
  "Guelmim": "Guelmim-Oued Noun",
  "Tan-Tan": "Guelmim-Oued Noun",
  "Boujdour": "Dakhla-Oued Ed-Dahab",
  "Dakhla": "Dakhla-Oued Ed-Dahab",
};

export function getFeeFromRabat(city: string): number {
  if (cityFeeFromRabat[city] !== undefined) return cityFeeFromRabat[city];
  // Fallback tiers by broad region distance when not explicitly priced
  const region = cityRegion[city] || "";
  if (region === "Rabat-Salé-Kénitra") return 0;
  if (region === "Casablanca-Settat" || region === "Fès-Meknès" || region === "Béni Mellal-Khénifra") return 500;
  if (region === "Marrakech-Safi" || region === "Tanger-Tétouan-Al Hoceïma") return 800;
  if (region === "Souss-Massa" || region === "Drâa-Tafilalet") return 1000;
  if (region === "Oriental") return 900;
  if (region === "Laâyoune-Sakia El Hamra" || region === "Guelmim-Oued Noun" || region === "Dakhla-Oued Ed-Dahab") return 1500;
  return 800; // sensible default
}
