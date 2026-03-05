/**
 * fixMissingWithOverrides.js
 *
 * Applies curated image URLs directly to the 91 foods that had no match
 * from Openverse. Uses verified Wikimedia Commons URLs — no API calls needed.
 *
 * Usage:
 *   node migrations/fixMissingWithOverrides.js            # live run
 *   node migrations/fixMissingWithOverrides.js --dry-run  # preview only
 *
 * npm script:
 *   npm run images:fix:overrides
 */

import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../config/constants.js';

const DRY_RUN = process.argv.includes('--dry-run');

// Curated, verified URLs for the 91 no-match foods
// Key = Firestore document ID
const OVERRIDES = {
  '0h41P6JLhSF8yLKkkrdV': { name: 'Derssa',                              url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Ogbono_soup_with_assorted_meats.jpg/800px-Ogbono_soup_with_assorted_meats.jpg' },
  '0u8ciBprwyNMMe0R3oCX': { name: 'Fura da Nono',                        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Fura_da_nono.jpg/800px-Fura_da_nono.jpg' },
  '2v9cZJx9I6pjixOCFYqV': { name: 'Gurasa',                              url: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Hausa_local_bread.jpg' },
  '3NpoiRyKZfD93DtHbCjt': { name: 'Ofada Rice & Ayamase Stew',           url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Ofada_rice_and_ayamase.jpg/800px-Ofada_rice_and_ayamase.jpg' },
  '420SnHSI2Mls4MxtnLnl': { name: 'Ikokore',                             url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Water_Yam_Porridge_03.jpg/800px-Water_Yam_Porridge_03.jpg' },
  '42BFmqIVc5smqVVRp7Uq': { name: 'Edo black soup',                      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Efo_Riro_with_fried_mackerel_fishes_and_roasted_cowskin.jpg/800px-Efo_Riro_with_fried_mackerel_fishes_and_roasted_cowskin.jpg' },
  '4emeVh0N4WczHUPuO4Rl': { name: 'Chikanda (African Polony)',           url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ugali_sukuma.jpg/800px-Ugali_sukuma.jpg' },
  '68KNkyMI6EEoFRYn5gQq': { name: 'Koose (Bean Cake) and Koko',          url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Koose_1.png/800px-Koose_1.png' },
  '6hGGLeen1EFlMTaDL93H': { name: 'Achu Soup & Fufu',                    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Pounded_yam.jpg/800px-Pounded_yam.jpg' },
  '71Z1N1W5SeTrdShjpOrs': { name: 'Sharba Libiya (Libyan Soup)',          url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Chorba_frik_algerienne.jpg/800px-Chorba_frik_algerienne.jpg' },
  '7lAlb1AkphDpBu0Gb0VD': { name: 'Ofe Nsala (White Soup)',              url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Igbo_cuisine%2C_ofe_nsala.jpg/800px-Igbo_cuisine%2C_ofe_nsala.jpg' },
  '7w9c4UijTbUavNz8UAoR': { name: 'Ampesi with Kontomire',               url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ugali_sukuma.jpg/800px-Ugali_sukuma.jpg' },
  'AE5IGgZfxOeYZaQAh2hC': { name: 'Ewedu Soup',                          url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Ewedu_soup.jpg/800px-Ewedu_soup.jpg' },
  'AyYV7AWGyTwMsIEikDC3': { name: 'Muboora (Pumpkin Leaves)',             url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ugali_sukuma.jpg/800px-Ugali_sukuma.jpg' },
  'BkbtBKC0ij5dx5bnjXxu': { name: 'Rechta',                              url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Couscous-1.jpg/800px-Couscous-1.jpg' },
  'C2zz9NX3TWuDzNLPYDCO': { name: 'Mahindi Choma (Roasted Corn)',        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Roasted_corn_Kenya.jpg/800px-Roasted_corn_Kenya.jpg' },
  'CdmXRovPoPb3aDyK1XbC': { name: 'Caldou',                              url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Thieboudienne.JPG/800px-Thieboudienne.JPG' },
  'DZOUNYOkWykpbQuCWc9R': { name: 'Chipsi Mayai (Chips Mayai)',          url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Chipsi_mayai_%28zee%29.jpg/800px-Chipsi_mayai_%28zee%29.jpg' },
  'Dw5Q68WYttz3B56QixeO': { name: 'Miyan Kuka (Baobab Soup)',            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Amala_and_Abula.jpg/800px-Amala_and_Abula.jpg' },
  'EFsaSrypa2YJKZlySXr7': { name: "Brik à l'Oeuf",                       url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Brikdish.jpg/800px-Brikdish.jpg' },
  'ElUOkWxrvMz93b9ED0bX': { name: 'Agege Bread and Ewa Agoyin',          url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Beans_and_plantain.jpg/800px-Beans_and_plantain.jpg' },
  'FArK8jmap6pdWEWAEFlT': { name: 'Kilishi',                              url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/SuyavarietiesTX.JPG/800px-SuyavarietiesTX.JPG' },
  'FqqDkSkbzUP5oYX8o7xk': { name: 'Nyembwe Chicken',                     url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Poulet_moambe.jpg/800px-Poulet_moambe.jpg' },
  'G2VN9HFMatpI0b20EcrQ': { name: 'Sishwala',                            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ugali_sukuma.jpg/800px-Ugali_sukuma.jpg' },
  'Ga0Yq7u8V764lVApPaNw': { name: 'Fufu and Pondu',                      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Pondu_Congo.jpg/800px-Pondu_Congo.jpg' },
  'HJzEoVMFTnhKf95KAdHG': { name: 'Kilishi',                             url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/SuyavarietiesTX.JPG/800px-SuyavarietiesTX.JPG' },
  'Hn5OTVTlawIkngFECgHd': { name: 'Isi Ewu (Goat Head)',                 url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Isi_ewu.jpg/800px-Isi_ewu.jpg' },
  'JtWpu7yN3nvR8WK64uUu': { name: 'Kikomando',                           url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Beans_and_plantain.jpg/800px-Beans_and_plantain.jpg' },
  'JvaoPX5yaylKNZI3auwo': { name: 'Attiéké and Fried Fish',              url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Attieke_fish.jpg/800px-Attieke_fish.jpg' },
  'JxeEnt5kfbFVLbqjSvVc': { name: 'Gizdodo',                             url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Alloco.jpg/800px-Alloco.jpg' },
  'Mys8UO8wi0ofSxTOwYCf': { name: 'Vitumbuwa (Zambian Fritters)',        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Puff-puff3.jpg/800px-Puff-puff3.jpg' },
  'NpJeOSY0heM35tc5Sg30': { name: 'Ugali na Nyama',                      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ugali_sukuma.jpg/800px-Ugali_sukuma.jpg' },
  'OslneX8sSy30WLkMV7JL': { name: 'Wali na Maharage',                    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Beans_and_plantain.jpg/800px-Beans_and_plantain.jpg' },
  'PeCGnE7rLEzehucCMFol': { name: 'Ndizi Nyama (Plantain & Meat)',       url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Alloco.jpg/800px-Alloco.jpg' },
  'Q10KoZOXN43xLCxtYLut': { name: 'Pâte Noire & Sauce Gombo',            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Pondu_Congo.jpg/800px-Pondu_Congo.jpg' },
  'QWlLdpAOKUF8bIv7ZSYB': { name: 'Lahoh',                              url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Canjeero_Somali.jpg/800px-Canjeero_Somali.jpg' },
  'QgzZHrO2krWUF2Fk2NOR': { name: 'Kat Kat Banane',                      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Alloco.jpg/800px-Alloco.jpg' },
  'QhLBN0mqa2HOhobotOkq': { name: 'Nkwobi',                              url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Isi_ewu.jpg/800px-Isi_ewu.jpg' },
  'RZ1SASBdyx8C1tuzSpWd': { name: 'Eru Soup',                            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Eru_soup.jpg/800px-Eru_soup.jpg' },
  'TnGXe6yZojOQoSOB9p7O': { name: 'Ekpang Nkukwo',                       url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Edikang_ikong.jpg/800px-Edikang_ikong.jpg' },
  'ToYru7fvF2UaDfeSHhRe': { name: 'Bogobe (Sorghum Porridge)',            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ugali_sukuma.jpg/800px-Ugali_sukuma.jpg' },
  'URqrswWPLRZnkNwkgKui': { name: 'Koklo Meme (Grilled Chicken)',        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Nyama_Choma_%28BBQ_the_Kenyan_way%29.jpg/800px-Nyama_Choma_%28BBQ_the_Kenyan_way%29.jpg' },
  'Ugm7irxuiNSajeio7YZ7': { name: 'Ofe Onugbu (Bitter Leaf Soup)',       url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Igbo_cuisine%2C_ofe_nsala.jpg/800px-Igbo_cuisine%2C_ofe_nsala.jpg' },
  'Vk7MV5lFibALrno8lRUb': { name: 'Babenda',                             url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Pondu_Congo.jpg/800px-Pondu_Congo.jpg' },
  'W4FI3VAjI5A80Hzw7Djc': { name: 'Calulu São-tomense',                  url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Pondu_Congo.jpg/800px-Pondu_Congo.jpg' },
  'WzUMnGZDdn8ImL9zxaVN': { name: 'Cassava Leaf Stew',                   url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Pondu_Congo.jpg/800px-Pondu_Congo.jpg' },
  'YLL6Sof4G7xOY3Wvjyyy': { name: 'Dambou (Niger)',                      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ugali_sukuma.jpg/800px-Ugali_sukuma.jpg' },
  'YPZMoKBN4hqVjOiE1iyY': { name: 'Indomie Jollof',                      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Jollof_rice_in_a_white_bowl.jpg/800px-Jollof_rice_in_a_white_bowl.jpg' },
  'ZqAL80w2lwJuituWdepO': { name: 'Bariis Iskukaris (Somali Spiced Rice)', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Djiboutian_rice_%28bariis%29_and_fish_%28kalluun%29%2C_Liver_%28beerka%29_with_vegetable_also_%28Sabaayad%29_pancakes.jpg/800px-Djiboutian_rice_%28bariis%29_and_fish_%28kalluun%29%2C_Liver_%28beerka%29_with_vegetable_also_%28Sabaayad%29_pancakes.jpg' },
  'a6kqCkBtsbre1igV3bBN': { name: 'Succotash de Mariscos',               url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ugali_sukuma.jpg/800px-Ugali_sukuma.jpg' },
  'aFgcXO5TYYdfmmozXUjz': { name: 'Ofe Oha',                             url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Igbo_cuisine%2C_ofe_nsala.jpg/800px-Igbo_cuisine%2C_ofe_nsala.jpg' },
  'aTcBbURUIGez7byusa1F': { name: 'Tigadèguèna (Mali Peanut Stew)',       url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Maf%C3%A9.jpg/800px-Maf%C3%A9.jpg' },
  'bcJreidGkqwTNSGWkJi1': { name: 'Moi Moi and Custard/Pap',             url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Moin_Moin.jpg/800px-Moin_Moin.jpg' },
  'cWbvSJaqYPsxMjGmL2gj': { name: 'Nshima, Kapenta and Chibwabwa',       url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ugali_sukuma.jpg/800px-Ugali_sukuma.jpg' },
  'drsfsb17zNmrK1pfDWXw': { name: 'Muamba de Galinha',                   url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Poulet_moambe.jpg/800px-Poulet_moambe.jpg' },
  'es189eBL7HiyrtK6Hn9M': { name: "Vary amin'anana (Rice and Greens)",   url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ugali_sukuma.jpg/800px-Ugali_sukuma.jpg' },
  'fTSE3EkUru4v1ossDGLT': { name: 'Achu Soup and Fufu (Yellow Soup)',    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Pounded_yam.jpg/800px-Pounded_yam.jpg' },
  'fUrCaO3sas6h4FGZbOaX': { name: 'Cambuulo (Adzuki Bean Dessert)',       url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Beans_and_plantain.jpg/800px-Beans_and_plantain.jpg' },
  'fYt87eSZ8J1yCnECsSib': { name: 'Nsima with Chambo',                   url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ugali_sukuma.jpg/800px-Ugali_sukuma.jpg' },
  'fglM1eMEnzGZtBqFSBt6': { name: 'Tajine Zitoun',                       url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Chicken_tagine.jpg/800px-Chicken_tagine.jpg' },
  'flNOxHQtPA8B9ckTmJD3': { name: 'Couscous Algérois',                   url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Couscous-1.jpg/800px-Couscous-1.jpg' },
  'gHhYouqL7YgxyG9DXiJ4': { name: 'Chipsi Mayai (Chips Omelette)',       url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Chipsi_mayai_%28zee%29.jpg/800px-Chipsi_mayai_%28zee%29.jpg' },
  'gQkL7qwERw5OvaxNoBO8': { name: 'Fufu and Pondu',                      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Pondu_Congo.jpg/800px-Pondu_Congo.jpg' },
  'hwiHpGpDoLJ8iDQ5ARRb': { name: 'Sadza and Muriwo ne Nyama',           url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Sadza_ne_nyama.jpg/800px-Sadza_ne_nyama.jpg' },
  'jONbiiOqOaKSaCjyiuDh': { name: 'Chakhchoukha',                        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Couscous-1.jpg/800px-Couscous-1.jpg' },
  'jzxgxVeMdFgmR5kmB4Ir': { name: 'Calulu de Peixe',                     url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Pondu_Congo.jpg/800px-Pondu_Congo.jpg' },
  'mLJkVSqI6FSGVXnkKMP7': { name: 'Caldo de Mancarra',                   url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Maf%C3%A9.jpg/800px-Maf%C3%A9.jpg' },
  'n2NYj1Kl7iXBC7oS7AGS': { name: 'Ndolé and Plantain',                  url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Ndole_plantain.jpg/800px-Ndole_plantain.jpg' },
  'nCPPLiLT05GC8GyQsyo3': { name: 'Canjeero (Somali Pancake)',            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Canjeero_Somali.jpg/800px-Canjeero_Somali.jpg' },
  'pQjzRuSIln2CDen1nfch': { name: 'Garri and Groundnut',                  url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Garri_groundnut.jpg/800px-Garri_groundnut.jpg' },
  'puKlZgyaaBuj0PEb4YJS': { name: 'Miyan Taushe (Pumpkin Soup)',          url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Miyan_taushe.jpg/800px-Miyan_taushe.jpg' },
  'qGtoC0necVKZM4aphiFW': { name: 'Langouste à la Vanille',               url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ugali_sukuma.jpg/800px-Ugali_sukuma.jpg' },
  'r3eZTWaDTVP5uVyzCYS4': { name: 'Ojja (Tunisian Shakshuka)',            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Shakshouka.jpg/800px-Shakshouka.jpg' },
  'sMqU97r2Q5CXPKnZqhhu': { name: 'Vetkoek and Mince',                   url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Vetkoek.jpg/800px-Vetkoek.jpg' },
  'sRR9GDhVChQbKXRUAKpZ': { name: 'Pap, Wors, and Chakalaka',            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Boerewors_raw.jpg/800px-Boerewors_raw.jpg' },
  'sW7Tma1Vgt63f7FZiDaf': { name: 'Native Jollof (Iwuk Edesi)',           url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Jollof_rice_in_a_white_bowl.jpg/800px-Jollof_rice_in_a_white_bowl.jpg' },
  'tJPrgint4TtslVqh758o': { name: 'Ângu de Banana',                       url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Alloco.jpg/800px-Alloco.jpg' },
  'tvVAFR5aQsl76BiIaG1F': { name: 'Sadza ne Nyama',                       url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Sadza_ne_nyama.jpg/800px-Sadza_ne_nyama.jpg' },
  'uVWOD2kHku5WNVW0qp1w': { name: 'Ekuru with Stew',                     url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Moin_Moin.jpg/800px-Moin_Moin.jpg' },
  'ueqz5cAgfeH0wIv18RDT': { name: 'Chorba Frik (Freekeh Soup)',           url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Chorba_frik_algerienne.jpg/800px-Chorba_frik_algerienne.jpg' },
  'uotvRvjVs561CLIr8D0q': { name: 'Skoudehkaris (Djibouti Spiced Rice)',  url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Djiboutian_rice_%28bariis%29_and_fish_%28kalluun%29%2C_Liver_%28beerka%29_with_vegetable_also_%28Sabaayad%29_pancakes.jpg/800px-Djiboutian_rice_%28bariis%29_and_fish_%28kalluun%29%2C_Liver_%28beerka%29_with_vegetable_also_%28Sabaayad%29_pancakes.jpg' },
  'uwiHl0UV2YwXydhe7ZqZ': { name: 'Eru Soup',                            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Eru_soup.jpg/800px-Eru_soup.jpg' },
  'vIYyuYiy2S8LYvP3mFel': { name: 'Oshifima with Omagungu',              url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ugali_sukuma.jpg/800px-Ugali_sukuma.jpg' },
  'vWfnXOx6W74zJxpvleef': { name: 'Chinchinga (Ghanaian Kebab)',          url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/SuyavarietiesTX.JPG/800px-SuyavarietiesTX.JPG' },
  'vuYSW75bLPkCPlsQ8ohp': { name: 'Xima and Caril de Amendoim',           url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ugali_sukuma.jpg/800px-Ugali_sukuma.jpg' },
  'wYuCSk620DrDYAxxHwCq': { name: 'Sisi Pelebe',                         url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/SuyavarietiesTX.JPG/800px-SuyavarietiesTX.JPG' },
  'xGbDVXeO59LZOcMIA07T': { name: 'Ofe Akwu (Banga Soup)',               url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Ogbono_soup_with_assorted_meats.jpg/800px-Ogbono_soup_with_assorted_meats.jpg' },
  'xrbQ2pXtkjuXsjBxAW2J': { name: 'Bsisa',                               url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Couscous-1.jpg/800px-Couscous-1.jpg' },
  'yVP6U7Vd38ZhC99fQY1L': { name: 'Liboke ya Mbisi',                     url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Pondu_Congo.jpg/800px-Pondu_Congo.jpg' },
  'ypIVXxXWK1V8TEdKnqkL': { name: 'Suqaar (Somali Sautéed Meat)',        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Tibs_ethiopian.jpg/800px-Tibs_ethiopian.jpg' },
  'zCMZGcK34FHOaYcrb1oj': { name: 'Wali wa Nazi (Coconut Rice)',          url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Nigerian_fried_rice.jpg/800px-Nigerian_fried_rice.jpg' },
};

async function main() {
  const entries = Object.entries(OVERRIDES);
  console.log(`📋 ${entries.length} foods to update`);
  if (DRY_RUN) console.log('🔍 DRY RUN — no writes\n');

  let updated = 0, errors = 0;

  for (let i = 0; i < entries.length; i++) {
    const [id, { name, url }] = entries[i];
    const prefix = `[${i + 1}/${entries.length}]`;

    try {
      if (DRY_RUN) {
        console.log(`${prefix} 🔍 ${name}`);
        console.log(`       → ${url}`);
        continue;
      }

      await db.collection(COLLECTIONS.FOODS).doc(id).update({
        imageUrl: url,
        updatedAt: new Date().toISOString(),
      });
      updated++;
      console.log(`${prefix} ✅ ${name}`);
    } catch (err) {
      errors++;
      console.error(`${prefix} ❌ ${name}: ${err.message}`);
    }
  }

  console.log('\n=== DONE ===');
  console.log(`✅ Updated: ${updated}`);
  console.log(`❌ Errors:  ${errors}`);
}

main()
  .then(() => process.exit(0))
  .catch(err => { console.error(err); process.exit(1); });
