/**
 * Seed the countries collection with all 54 African countries.
 *
 * Usage:  npm run seed:countries
 */
import dotenv from 'dotenv';
dotenv.config();

import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../config/constants.js';
import { formatCountry } from '../models/Country.js';

// ─── Data ──────────────────────────────────────────────────────
const countriesData = [
  { name: 'Nigeria', code: 'NG', capitalCity: 'Abuja', flagEmoji: '🇳🇬', population: 223800000, officialLanguages: ['English'], description: 'The most populous country in Africa, renowned for jollof rice, suya, and a vibrant street-food culture.' },
  { name: 'Ghana', code: 'GH', capitalCity: 'Accra', flagEmoji: '🇬🇭', population: 33500000, officialLanguages: ['English'], description: 'Known for waakye, kelewele, banku, and its fierce jollof rice rivalry with Nigeria.' },
  { name: 'South Africa', code: 'ZA', capitalCity: 'Pretoria', flagEmoji: '🇿🇦', population: 60400000, officialLanguages: ['Zulu', 'Xhosa', 'Afrikaans', 'English'], description: 'A rainbow nation with braai culture, bobotie, biltong, and bunny chow.' },
  { name: 'Kenya', code: 'KE', capitalCity: 'Nairobi', flagEmoji: '🇰🇪', population: 55100000, officialLanguages: ['English', 'Swahili'], description: 'Home to nyama choma, ugali, and a thriving tea culture.' },
  { name: 'Ethiopia', code: 'ET', capitalCity: 'Addis Ababa', flagEmoji: '🇪🇹', population: 126500000, officialLanguages: ['Amharic'], description: 'Birthplace of coffee and injera, with one of the oldest culinary traditions on the continent.' },
  { name: 'Egypt', code: 'EG', capitalCity: 'Cairo', flagEmoji: '🇪🇬', population: 112700000, officialLanguages: ['Arabic'], description: 'Ancient civilisation with koshari, ful medames, and rich Middle-Eastern-influenced cuisine.' },
  { name: 'Tanzania', code: 'TZ', capitalCity: 'Dodoma', flagEmoji: '🇹🇿', population: 65500000, officialLanguages: ['Swahili', 'English'], description: 'Famous for Zanzibar spices, pilau, and ugali.' },
  { name: 'Morocco', code: 'MA', capitalCity: 'Rabat', flagEmoji: '🇲🇦', population: 37500000, officialLanguages: ['Arabic', 'Berber'], description: 'The land of tagine, couscous, and mint tea.' },
  { name: 'Cameroon', code: 'CM', capitalCity: 'Yaoundé', flagEmoji: '🇨🇲', population: 28600000, officialLanguages: ['French', 'English'], description: 'Africa in miniature — ndolé, eru, and achu soup represent its culinary diversity.' },
  { name: 'Senegal', code: 'SN', capitalCity: 'Dakar', flagEmoji: '🇸🇳', population: 17900000, officialLanguages: ['French'], description: 'Home of thiéboudienne (the original jollof) and yassa chicken.' },
  { name: 'Algeria', code: 'DZ', capitalCity: 'Algiers', flagEmoji: '🇩🇿', population: 45600000, officialLanguages: ['Arabic', 'Berber'], description: 'North African flavours with couscous, chakhchoukha, and merguez.' },
  { name: 'Uganda', code: 'UG', capitalCity: 'Kampala', flagEmoji: '🇺🇬', population: 48600000, officialLanguages: ['English', 'Swahili'], description: 'Known for matooke, rolex (egg-chapati roll), and luwombo.' },
  { name: 'Sudan', code: 'SD', capitalCity: 'Khartoum', flagEmoji: '🇸🇩', population: 48100000, officialLanguages: ['Arabic', 'English'], description: 'Traditional dishes include ful medames, kisra, and mullah.' },
  { name: 'Angola', code: 'AO', capitalCity: 'Luanda', flagEmoji: '🇦🇴', population: 36700000, officialLanguages: ['Portuguese'], description: 'Portuguese-influenced cuisine with muamba de galinha and calulu.' },
  { name: 'Mozambique', code: 'MZ', capitalCity: 'Maputo', flagEmoji: '🇲🇿', population: 33900000, officialLanguages: ['Portuguese'], description: 'Peri-peri chicken, matapa, and fresh seafood define its coastal cuisine.' },
  { name: "Côte d'Ivoire", code: 'CI', capitalCity: 'Yamoussoukro', flagEmoji: '🇨🇮', population: 28200000, officialLanguages: ['French'], description: 'Alloco, attiéké, and garba are beloved street foods.' },
  { name: 'Madagascar', code: 'MG', capitalCity: 'Antananarivo', flagEmoji: '🇲🇬', population: 30300000, officialLanguages: ['Malagasy', 'French'], description: 'Unique island cuisine featuring romazava, ravitoto, and vanilla.' },
  { name: 'Niger', code: 'NE', capitalCity: 'Niamey', flagEmoji: '🇳🇪', population: 27200000, officialLanguages: ['French'], description: 'Sahelian dishes like dambou, kilishi, and tuwo.' },
  { name: 'Burkina Faso', code: 'BF', capitalCity: 'Ouagadougou', flagEmoji: '🇧🇫', population: 22700000, officialLanguages: ['French'], description: 'Known for tô (millet porridge) and riz gras.' },
  { name: 'Mali', code: 'ML', capitalCity: 'Bamako', flagEmoji: '🇲🇱', population: 22600000, officialLanguages: ['French'], description: 'Tigadèguèna (peanut stew) and jollof rice are staples.' },
  { name: 'Malawi', code: 'MW', capitalCity: 'Lilongwe', flagEmoji: '🇲🇼', population: 20900000, officialLanguages: ['English', 'Chichewa'], description: 'Nsima with chambo fish is the national dish.' },
  { name: 'Zambia', code: 'ZM', capitalCity: 'Lusaka', flagEmoji: '🇿🇲', population: 20600000, officialLanguages: ['English'], description: 'Nshima, ifisashi, and chikanda are traditional favourites.' },
  { name: 'Chad', code: 'TD', capitalCity: "N'Djamena", flagEmoji: '🇹🇩', population: 18300000, officialLanguages: ['French', 'Arabic'], description: 'Sahelian cuisine with boule (millet ball) and daraba.' },
  { name: 'Somalia', code: 'SO', capitalCity: 'Mogadishu', flagEmoji: '🇸🇴', population: 18100000, officialLanguages: ['Somali', 'Arabic'], description: 'Canjeero, bariis iskukaris, and camel meat dishes.' },
  { name: 'Zimbabwe', code: 'ZW', capitalCity: 'Harare', flagEmoji: '🇿🇼', population: 16700000, officialLanguages: ['English', 'Shona', 'Ndebele'], description: 'Sadza, mopane worms, and matemba are iconic.' },
  { name: 'Guinea', code: 'GN', capitalCity: 'Conakry', flagEmoji: '🇬🇳', population: 14200000, officialLanguages: ['French'], description: 'Riz au gras (jollof), fouti, and maafe.' },
  { name: 'Rwanda', code: 'RW', capitalCity: 'Kigali', flagEmoji: '🇷🇼', population: 14100000, officialLanguages: ['Kinyarwanda', 'French', 'English'], description: 'Isombe, brochettes, and ubugali.' },
  { name: 'Benin', code: 'BJ', capitalCity: 'Porto-Novo', flagEmoji: '🇧🇯', population: 13700000, officialLanguages: ['French'], description: 'Birthplace of voodoo cuisine, known for akpan and klui-klui.' },
  { name: 'Burundi', code: 'BI', capitalCity: 'Gitega', flagEmoji: '🇧🇮', population: 13200000, officialLanguages: ['Kirundi', 'French', 'English'], description: 'Beans, banana, and cassava form the culinary backbone.' },
  { name: 'Tunisia', code: 'TN', capitalCity: 'Tunis', flagEmoji: '🇹🇳', population: 12500000, officialLanguages: ['Arabic'], description: 'Brik, couscous, and harissa — the heart of Maghreb cuisine.' },
  { name: 'South Sudan', code: 'SS', capitalCity: 'Juba', flagEmoji: '🇸🇸', population: 11400000, officialLanguages: ['English'], description: 'Kisra, ful, and nyama are everyday staples.' },
  { name: 'Togo', code: 'TG', capitalCity: 'Lomé', flagEmoji: '🇹🇬', population: 9100000, officialLanguages: ['French'], description: 'Fufu with peanut soup and koklo meme (grilled chicken).' },
  { name: 'Sierra Leone', code: 'SL', capitalCity: 'Freetown', flagEmoji: '🇸🇱', population: 8600000, officialLanguages: ['English'], description: 'Cassava leaves, groundnut soup, and jollof rice.' },
  { name: 'Libya', code: 'LY', capitalCity: 'Tripoli', flagEmoji: '🇱🇾', population: 7100000, officialLanguages: ['Arabic'], description: 'Bazin, sharba, and couscous bil-bosla.' },
  { name: 'Republic of the Congo', code: 'CG', capitalCity: 'Brazzaville', flagEmoji: '🇨🇬', population: 6100000, officialLanguages: ['French'], description: 'Moambe chicken, saka-saka, and fresh river fish.' },
  { name: 'Liberia', code: 'LR', capitalCity: 'Monrovia', flagEmoji: '🇱🇷', population: 5400000, officialLanguages: ['English'], description: 'Jollof rice, palava sauce, and dumboy.' },
  { name: 'Central African Republic', code: 'CF', capitalCity: 'Bangui', flagEmoji: '🇨🇫', population: 5500000, officialLanguages: ['French', 'Sango'], description: 'Gozo (cassava paste) and kanda (meatballs in sauce).' },
  { name: 'Mauritania', code: 'MR', capitalCity: 'Nouakchott', flagEmoji: '🇲🇷', population: 4900000, officialLanguages: ['Arabic'], description: 'Thiéboudienne, mechoui, and Saharan tea culture.' },
  { name: 'Eritrea', code: 'ER', capitalCity: 'Asmara', flagEmoji: '🇪🇷', population: 3700000, officialLanguages: ['Tigrinya', 'Arabic', 'English'], description: 'Injera, tsebhi, and kitcha fit-fit.' },
  { name: 'Namibia', code: 'NA', capitalCity: 'Windhoek', flagEmoji: '🇳🇦', population: 2600000, officialLanguages: ['English'], description: 'Kapana (street meat), oshifima, and potjiekos.' },
  { name: 'Gambia', code: 'GM', capitalCity: 'Banjul', flagEmoji: '🇬🇲', population: 2700000, officialLanguages: ['English'], description: 'Domoda (peanut stew) and benachin (one-pot rice).' },
  { name: 'Botswana', code: 'BW', capitalCity: 'Gaborone', flagEmoji: '🇧🇼', population: 2600000, officialLanguages: ['English', 'Setswana'], description: 'Seswaa, bogobe, and morogo.' },
  { name: 'Gabon', code: 'GA', capitalCity: 'Libreville', flagEmoji: '🇬🇦', population: 2400000, officialLanguages: ['French'], description: 'Nyembwe chicken, odika, and smoked fish dishes.' },
  { name: 'Lesotho', code: 'LS', capitalCity: 'Maseru', flagEmoji: '🇱🇸', population: 2300000, officialLanguages: ['Sesotho', 'English'], description: 'Papa (maize porridge), moroho, and motoho.' },
  { name: 'Guinea-Bissau', code: 'GW', capitalCity: 'Bissau', flagEmoji: '🇬🇼', population: 2100000, officialLanguages: ['Portuguese'], description: 'Caldo de mancarra and jollof-style rice dishes.' },
  { name: 'Equatorial Guinea', code: 'GQ', capitalCity: 'Malabo', flagEmoji: '🇬🇶', population: 1700000, officialLanguages: ['Spanish', 'French', 'Portuguese'], description: 'Succotash, pepesoup, and plantain-based dishes.' },
  { name: 'Mauritius', code: 'MU', capitalCity: 'Port Louis', flagEmoji: '🇲🇺', population: 1300000, officialLanguages: ['English'], description: 'Dholl puri, mine frit, and gateau piment — a fusion island.' },
  { name: 'Eswatini', code: 'SZ', capitalCity: 'Mbabane', flagEmoji: '🇸🇿', population: 1200000, officialLanguages: ['Swazi', 'English'], description: 'Emasi (fermented milk), sishwala, and incwancwa.' },
  { name: 'Djibouti', code: 'DJ', capitalCity: 'Djibouti', flagEmoji: '🇩🇯', population: 1100000, officialLanguages: ['French', 'Arabic'], description: 'Skoudehkaris (spiced rice with lamb) and fah-fah soup.' },
  { name: 'Comoros', code: 'KM', capitalCity: 'Moroni', flagEmoji: '🇰🇲', population: 900000, officialLanguages: ['Comorian', 'Arabic', 'French'], description: 'Langouste à la vanille and pilao — Swahili-Arab fusion.' },
  { name: 'Cabo Verde', code: 'CV', capitalCity: 'Praia', flagEmoji: '🇨🇻', population: 600000, officialLanguages: ['Portuguese'], description: 'Cachupa (corn and bean stew) is the national dish.' },
  { name: 'São Tomé and Príncipe', code: 'ST', capitalCity: 'São Tomé', flagEmoji: '🇸🇹', population: 230000, officialLanguages: ['Portuguese'], description: 'Calulu, chocolate-based dishes, and tropical fruits.' },
  { name: 'Seychelles', code: 'SC', capitalCity: 'Victoria', flagEmoji: '🇸🇨', population: 100000, officialLanguages: ['Seychellois Creole', 'English', 'French'], description: 'Grilled fish, octopus curry, and ladob dessert.' },
  { name: 'Democratic Republic of the Congo', code: 'CD', capitalCity: 'Kinshasa', flagEmoji: '🇨🇩', population: 102300000, officialLanguages: ['French'], description: 'Moambe, fufu, and pondu (cassava leaves) drive its hearty cuisine.' },
];

// ─── Seeder logic ──────────────────────────────────────────────
export const seedCountries = async () => {
  const collectionRef = db.collection(COLLECTIONS.COUNTRIES);

  // Clear existing data
  const existing = await collectionRef.get();
  if (!existing.empty) {
    const batch = db.batch();
    existing.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    console.log('  🗑️  Cleared existing countries');
  }

  // Insert in batch (max 500 per batch)
  const BATCH_SIZE = 500;
  const results = [];

  for (let i = 0; i < countriesData.length; i += BATCH_SIZE) {
    const batch = db.batch();
    const chunk = countriesData.slice(i, i + BATCH_SIZE);

    for (const data of chunk) {
      const formatted = formatCountry(data);
      const docRef = collectionRef.doc();
      batch.set(docRef, formatted);
      results.push({ id: docRef.id, ...formatted });
    }

    await batch.commit();
  }

  return results;
};

// ─── Run standalone ────────────────────────────────────────────
const isMainModule = process.argv[1]?.replace(/\\/g, '/').endsWith('seedCountries.js');

if (isMainModule) {
  console.log('🌍 Seeding countries…');
  seedCountries()
    .then((countries) => {
      console.log(`✅ Seeded ${countries.length} countries`);
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Error:', err.message);
      process.exit(1);
    });
}
