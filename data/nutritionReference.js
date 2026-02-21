/**
 * African Food Nutrition Reference
 * Curated nutritional data for common African dishes per 100g serving.
 * Sources: FAO West African Food Composition Table, USDA SR Legacy,
 *          South African Food Composition Database, published research.
 *
 * This local reference is used FIRST before hitting external APIs,
 * since most traditional African dishes aren't in product databases
 * like Open Food Facts.
 */

import { LOCAL_REFERENCE_OVERRIDES } from './localReferenceOverrides.js';

/**
 * Nutrition data per 100g serving.
 * Keys are lowercased food names for matching.
 */
export const NUTRITION_REFERENCE = {
  // ═══════════════════════════════════════════════════════════
  //  WEST AFRICAN DISHES
  // ═══════════════════════════════════════════════════════════
  'jollof rice': {
    calories: 170, protein: '4g', carbs: '28g', fat: '5g',
    fiber: '1.2g', sodium: '320mg', sugar: '2g',
    iron: '1.1mg', calcium: '18mg', vitaminC: '4mg',
  },
  'fried rice': {
    calories: 163, protein: '4.5g', carbs: '24g', fat: '5.8g',
    fiber: '1g', sodium: '280mg', sugar: '1.5g',
  },
  'fufu': {
    calories: 267, protein: '1g', carbs: '65g', fat: '0.3g',
    fiber: '1.8g', sodium: '2mg', sugar: '0.5g',
    calcium: '20mg', iron: '0.3mg',
  },
  'pounded yam': {
    calories: 118, protein: '1.5g', carbs: '28g', fat: '0.2g',
    fiber: '1.8g', sodium: '9mg', sugar: '0.5g',
    calcium: '17mg', iron: '0.5mg', vitaminC: '17mg',
  },
  'garri': {
    calories: 360, protein: '1.6g', carbs: '88g', fat: '0.5g',
    fiber: '1.7g', sodium: '3mg', calcium: '40mg',
  },
  'eba': {
    calories: 299, protein: '1.3g', carbs: '72g', fat: '0.4g',
    fiber: '1.5g', sodium: '3mg',
  },
  'amala': {
    calories: 352, protein: '3g', carbs: '82g', fat: '1g',
    fiber: '5g', sodium: '5mg', iron: '2mg',
  },
  'egusi soup': {
    calories: 180, protein: '9g', carbs: '6g', fat: '14g',
    fiber: '2.5g', sodium: '250mg', iron: '3mg', calcium: '80mg',
  },
  'ogbono soup': {
    calories: 145, protein: '6g', carbs: '8g', fat: '10g',
    fiber: '3g', sodium: '200mg',
  },
  'pepper soup': {
    calories: 55, protein: '5g', carbs: '4g', fat: '2g',
    fiber: '0.8g', sodium: '350mg', vitaminC: '12mg',
  },
  'efo riro': {
    calories: 120, protein: '5g', carbs: '6g', fat: '9g',
    fiber: '3g', sodium: '280mg', iron: '4mg', vitaminA: '450mcg',
  },
  'edikang ikong': {
    calories: 85, protein: '6g', carbs: '5g', fat: '5g',
    fiber: '3.5g', sodium: '220mg', iron: '5mg', vitaminA: '500mcg',
  },
  'afang soup': {
    calories: 100, protein: '7g', carbs: '4g', fat: '6g',
    fiber: '4g', sodium: '230mg', iron: '4.5mg',
  },
  'okra soup': {
    calories: 70, protein: '4g', carbs: '8g', fat: '3g',
    fiber: '3g', sodium: '180mg', vitaminC: '23mg', calcium: '82mg',
  },
  'suya': {
    calories: 250, protein: '22g', carbs: '5g', fat: '16g',
    fiber: '0.5g', sodium: '450mg', iron: '2.5mg',
  },
  'kilishi': {
    calories: 380, protein: '45g', carbs: '12g', fat: '18g',
    fiber: '1g', sodium: '800mg', iron: '3mg',
  },
  'moi moi': {
    calories: 122, protein: '8g', carbs: '10g', fat: '6g',
    fiber: '2.5g', sodium: '180mg', iron: '2.5mg', calcium: '45mg',
  },
  'akara': {
    calories: 205, protein: '10g', carbs: '18g', fat: '11g',
    fiber: '2g', sodium: '280mg', iron: '2mg',
  },
  'chin chin': {
    calories: 430, protein: '6g', carbs: '55g', fat: '22g',
    fiber: '1g', sodium: '200mg', sugar: '12g',
  },
  'puff puff': {
    calories: 310, protein: '5g', carbs: '42g', fat: '14g',
    fiber: '1g', sodium: '150mg', sugar: '8g',
  },
  'masa': {
    calories: 220, protein: '4g', carbs: '38g', fat: '6g',
    fiber: '1.5g', sodium: '120mg',
  },
  'tuwo shinkafa': {
    calories: 130, protein: '2.5g', carbs: '29g', fat: '0.3g',
    fiber: '0.5g', sodium: '5mg',
  },
  'tuwo masara': {
    calories: 135, protein: '3g', carbs: '30g', fat: '0.5g',
    fiber: '1g', sodium: '5mg',
  },
  'miyan kuka': {
    calories: 60, protein: '3g', carbs: '8g', fat: '2g',
    fiber: '4g', sodium: '200mg', calcium: '120mg', vitaminC: '15mg',
  },
  'miyan taushe': {
    calories: 95, protein: '4g', carbs: '12g', fat: '4g',
    fiber: '2g', sodium: '250mg', vitaminA: '400mcg',
  },
  'asida': {
    calories: 320, protein: '4g', carbs: '74g', fat: '0.5g',
    fiber: '2g', sodium: '6mg',
  },
  'kelewele': {
    calories: 240, protein: '2g', carbs: '35g', fat: '11g',
    fiber: '2.3g', sodium: '150mg', sugar: '15g', vitaminA: '56mcg',
  },
  'banku': {
    calories: 267, protein: '2g', carbs: '62g', fat: '1g',
    fiber: '1.5g', sodium: '4mg', iron: '1.5mg',
  },
  'kenkey': {
    calories: 227, protein: '4g', carbs: '50g', fat: '1.5g',
    fiber: '2g', sodium: '5mg', iron: '2mg',
  },
  'waakye': {
    calories: 145, protein: '6g', carbs: '26g', fat: '1g',
    fiber: '4g', sodium: '180mg', iron: '2.5mg',
  },
  'red red': {
    calories: 160, protein: '7g', carbs: '22g', fat: '5g',
    fiber: '5g', sodium: '200mg', iron: '2.5mg',
  },
  'light soup': {
    calories: 45, protein: '3g', carbs: '5g', fat: '1.5g',
    fiber: '1g', sodium: '280mg', vitaminC: '10mg',
  },
  'groundnut soup': {
    calories: 200, protein: '8g', carbs: '10g', fat: '15g',
    fiber: '2g', sodium: '300mg', iron: '2mg',
  },
  'palm nut soup': {
    calories: 180, protein: '5g', carbs: '8g', fat: '14g',
    fiber: '3g', sodium: '200mg', vitaminA: '300mcg',
  },
  'kontomire stew': {
    calories: 110, protein: '4g', carbs: '8g', fat: '7g',
    fiber: '3g', sodium: '250mg', iron: '4mg',
  },
  'shito': {
    calories: 350, protein: '6g', carbs: '12g', fat: '32g',
    fiber: '2g', sodium: '800mg',
  },
  'thieboudienne': {
    calories: 165, protein: '12g', carbs: '20g', fat: '4g',
    fiber: '2g', sodium: '350mg', iron: '1.5mg', vitaminC: '8mg',
  },
  'yassa': {
    calories: 155, protein: '14g', carbs: '12g', fat: '6g',
    fiber: '1g', sodium: '380mg', vitaminC: '12mg',
  },
  'mafe': {
    calories: 200, protein: '10g', carbs: '15g', fat: '12g',
    fiber: '2g', sodium: '300mg',
  },
  'alloco': {
    calories: 250, protein: '1.5g', carbs: '38g', fat: '11g',
    fiber: '2g', sodium: '100mg', vitaminA: '56mcg',
  },
  'attiéké': {
    calories: 330, protein: '1g', carbs: '80g', fat: '0.3g',
    fiber: '2g', sodium: '3mg',
  },

  // ═══════════════════════════════════════════════════════════
  //  EAST AFRICAN DISHES
  // ═══════════════════════════════════════════════════════════
  'injera': {
    calories: 145, protein: '5g', carbs: '28g', fat: '1g',
    fiber: '2.5g', sodium: '10mg', iron: '5mg', calcium: '60mg',
  },
  'doro wat': {
    calories: 180, protein: '15g', carbs: '8g', fat: '10g',
    fiber: '2g', sodium: '400mg', iron: '2.5mg',
  },
  'kitfo': {
    calories: 240, protein: '18g', carbs: '2g', fat: '18g',
    fiber: '0g', sodium: '350mg', iron: '3mg',
  },
  'shiro': {
    calories: 150, protein: '10g', carbs: '18g', fat: '4g',
    fiber: '5g', sodium: '280mg', iron: '3mg',
  },
  'tibs': {
    calories: 200, protein: '20g', carbs: '5g', fat: '11g',
    fiber: '1g', sodium: '300mg', iron: '2.5mg',
  },
  'ugali': {
    calories: 240, protein: '4g', carbs: '54g', fat: '0.8g',
    fiber: '2g', sodium: '3mg', iron: '1mg',
  },
  'nyama choma': {
    calories: 250, protein: '26g', carbs: '0g', fat: '16g',
    fiber: '0g', sodium: '70mg', iron: '2.5mg',
  },
  'sukuma wiki': {
    calories: 45, protein: '3g', carbs: '6g', fat: '1g',
    fiber: '3g', sodium: '40mg', iron: '3mg', vitaminA: '680mcg', vitaminC: '120mg',
  },
  'githeri': {
    calories: 125, protein: '7g', carbs: '20g', fat: '1.5g',
    fiber: '6g', sodium: '15mg', iron: '2.5mg',
  },
  'mukimo': {
    calories: 120, protein: '4g', carbs: '22g', fat: '1.5g',
    fiber: '3g', sodium: '25mg', vitaminC: '15mg',
  },
  'chapati': {
    calories: 300, protein: '8g', carbs: '50g', fat: '8g',
    fiber: '2g', sodium: '350mg',
  },
  'pilau': {
    calories: 175, protein: '5g', carbs: '28g', fat: '5g',
    fiber: '1g', sodium: '340mg',
  },
  'mandazi': {
    calories: 350, protein: '6g', carbs: '48g', fat: '15g',
    fiber: '1g', sodium: '200mg', sugar: '10g',
  },
  'samosa': {
    calories: 260, protein: '6g', carbs: '28g', fat: '14g',
    fiber: '2g', sodium: '350mg',
  },
  'matoke': {
    calories: 122, protein: '1g', carbs: '32g', fat: '0.4g',
    fiber: '2.3g', sodium: '1mg', vitaminC: '18mg',
  },
  'rolex': {
    calories: 280, protein: '8g', carbs: '35g', fat: '12g',
    fiber: '2g', sodium: '300mg',
  },
  'luwombo': {
    calories: 160, protein: '12g', carbs: '10g', fat: '8g',
    fiber: '2g', sodium: '280mg',
  },
  'posho': {
    calories: 240, protein: '4g', carbs: '54g', fat: '0.8g',
    fiber: '2g', sodium: '3mg',
  },

  // ═══════════════════════════════════════════════════════════
  //  NORTH AFRICAN DISHES
  // ═══════════════════════════════════════════════════════════
  'couscous': {
    calories: 176, protein: '6g', carbs: '36g', fat: '0.6g',
    fiber: '2.2g', sodium: '8mg', iron: '0.4mg',
  },
  'tagine': {
    calories: 130, protein: '10g', carbs: '12g', fat: '5g',
    fiber: '2.5g', sodium: '350mg', vitaminA: '200mcg',
  },
  'shakshuka': {
    calories: 140, protein: '8g', carbs: '10g', fat: '8g',
    fiber: '2g', sodium: '450mg', vitaminC: '25mg', vitaminA: '180mcg',
  },
  'harira': {
    calories: 80, protein: '5g', carbs: '12g', fat: '1.5g',
    fiber: '3g', sodium: '400mg', iron: '1.5mg',
  },
  'pastilla': {
    calories: 280, protein: '14g', carbs: '25g', fat: '14g',
    fiber: '1.5g', sodium: '350mg',
  },
  'brik': {
    calories: 230, protein: '10g', carbs: '20g', fat: '12g',
    fiber: '1g', sodium: '400mg',
  },
  'merguez': {
    calories: 280, protein: '14g', carbs: '2g', fat: '24g',
    fiber: '0.5g', sodium: '700mg', iron: '2mg',
  },
  'ful medames': {
    calories: 110, protein: '8g', carbs: '15g', fat: '2g',
    fiber: '5g', sodium: '250mg', iron: '2.5mg',
  },
  'koshari': {
    calories: 160, protein: '5g', carbs: '30g', fat: '2g',
    fiber: '3g', sodium: '350mg',
  },
  'msemen': {
    calories: 320, protein: '6g', carbs: '40g', fat: '15g',
    fiber: '1.5g', sodium: '250mg',
  },
  'baghrir': {
    calories: 220, protein: '5g', carbs: '40g', fat: '3g',
    fiber: '1g', sodium: '150mg',
  },
  'chakchouka': {
    calories: 95, protein: '3g', carbs: '10g', fat: '5g',
    fiber: '2g', sodium: '300mg', vitaminC: '30mg',
  },
  'rfissa': {
    calories: 200, protein: '12g', carbs: '22g', fat: '7g',
    fiber: '2g', sodium: '320mg',
  },
  'mechoui': {
    calories: 260, protein: '25g', carbs: '0g', fat: '17g',
    fiber: '0g', sodium: '65mg', iron: '2mg',
  },
  'kefta': {
    calories: 250, protein: '18g', carbs: '6g', fat: '17g',
    fiber: '0.5g', sodium: '500mg',
  },

  // ═══════════════════════════════════════════════════════════
  //  SOUTHERN AFRICAN DISHES
  // ═══════════════════════════════════════════════════════════
  'bobotie': {
    calories: 180, protein: '12g', carbs: '10g', fat: '10g',
    fiber: '1.5g', sodium: '380mg',
  },
  'biltong': {
    calories: 280, protein: '56g', carbs: '1g', fat: '3g',
    fiber: '0g', sodium: '1200mg', iron: '4mg',
  },
  'boerewors': {
    calories: 290, protein: '15g', carbs: '2g', fat: '25g',
    fiber: '0g', sodium: '650mg',
  },
  'chakalaka': {
    calories: 60, protein: '2g', carbs: '10g', fat: '1.5g',
    fiber: '3g', sodium: '280mg', vitaminC: '20mg',
  },
  'bunny chow': {
    calories: 200, protein: '8g', carbs: '28g', fat: '6g',
    fiber: '3g', sodium: '400mg',
  },
  'pap': {
    calories: 240, protein: '4g', carbs: '54g', fat: '0.8g',
    fiber: '2g', sodium: '3mg',
  },
  'sadza': {
    calories: 240, protein: '4g', carbs: '54g', fat: '0.8g',
    fiber: '2g', sodium: '3mg',
  },
  'nshima': {
    calories: 240, protein: '4g', carbs: '54g', fat: '0.8g',
    fiber: '2g', sodium: '3mg',
  },
  'vetkoek': {
    calories: 320, protein: '6g', carbs: '38g', fat: '16g',
    fiber: '1g', sodium: '350mg',
  },
  'potjiekos': {
    calories: 150, protein: '12g', carbs: '10g', fat: '7g',
    fiber: '2g', sodium: '350mg',
  },
  'braai': {
    calories: 250, protein: '26g', carbs: '0g', fat: '16g',
    fiber: '0g', sodium: '70mg', iron: '2.5mg',
  },
  'samp and beans': {
    calories: 135, protein: '7g', carbs: '24g', fat: '1g',
    fiber: '5g', sodium: '10mg', iron: '2mg',
  },
  'kapenta': {
    calories: 310, protein: '60g', carbs: '0g', fat: '8g',
    fiber: '0g', sodium: '800mg', calcium: '2000mg', iron: '4mg',
  },
  'muamba de galinha': {
    calories: 175, protein: '15g', carbs: '8g', fat: '10g',
    fiber: '2g', sodium: '300mg', vitaminA: '250mcg',
  },

  // ═══════════════════════════════════════════════════════════
  //  CENTRAL AFRICAN DISHES
  // ═══════════════════════════════════════════════════════════
  'ndolé': {
    calories: 130, protein: '8g', carbs: '7g', fat: '8g',
    fiber: '3.5g', sodium: '250mg', iron: '3mg',
  },
  'poulet dg': {
    calories: 220, protein: '16g', carbs: '12g', fat: '12g',
    fiber: '2g', sodium: '350mg',
  },
  'koki beans': {
    calories: 150, protein: '9g', carbs: '12g', fat: '8g',
    fiber: '4g', sodium: '200mg',
  },
  'moambe chicken': {
    calories: 200, protein: '15g', carbs: '8g', fat: '12g',
    fiber: '2g', sodium: '300mg',
  },
  'saka saka': {
    calories: 90, protein: '5g', carbs: '10g', fat: '3.5g',
    fiber: '4g', sodium: '180mg', iron: '3mg', vitaminA: '400mcg',
  },
  'plantain chips': {
    calories: 520, protein: '2g', carbs: '56g', fat: '33g',
    fiber: '4g', sodium: '300mg',
  },
  'eru': {
    calories: 120, protein: '6g', carbs: '5g', fat: '9g',
    fiber: '5g', sodium: '200mg', iron: '4mg',
  },
  'achu': {
    calories: 180, protein: '3g', carbs: '35g', fat: '4g',
    fiber: '3g', sodium: '200mg',
  },

  // ═══════════════════════════════════════════════════════════
  //  STREET FOOD & SNACKS
  // ═══════════════════════════════════════════════════════════
  'bofrot': {
    calories: 310, protein: '5g', carbs: '42g', fat: '14g',
    fiber: '1g', sodium: '150mg', sugar: '8g',
  },
  'koose': {
    calories: 200, protein: '10g', carbs: '18g', fat: '10g',
    fiber: '2g', sodium: '250mg',
  },
  'roasted plantain': {
    calories: 122, protein: '1g', carbs: '32g', fat: '0.4g',
    fiber: '2.3g', sodium: '1mg', vitaminA: '56mcg',
  },
  'roasted corn': {
    calories: 128, protein: '4g', carbs: '24g', fat: '2g',
    fiber: '3g', sodium: '2mg',
  },
  'roasted yam': {
    calories: 118, protein: '1.5g', carbs: '28g', fat: '0.2g',
    fiber: '1.8g', sodium: '9mg',
  },
  'dodo': {
    calories: 230, protein: '1.5g', carbs: '36g', fat: '10g',
    fiber: '2g', sodium: '80mg', vitaminA: '56mcg',
  },
  'kokoro': {
    calories: 380, protein: '5g', carbs: '55g', fat: '16g',
    fiber: '2g', sodium: '200mg',
  },
  'kuli kuli': {
    calories: 540, protein: '28g', carbs: '20g', fat: '40g',
    fiber: '5g', sodium: '350mg',
  },
  'spring roll': {
    calories: 220, protein: '5g', carbs: '30g', fat: '10g',
    fiber: '1g', sodium: '400mg',
  },
  'fatayer': {
    calories: 260, protein: '8g', carbs: '28g', fat: '13g',
    fiber: '2g', sodium: '400mg',
  },
  'mishkaki': {
    calories: 200, protein: '22g', carbs: '4g', fat: '10g',
    fiber: '0.5g', sodium: '350mg',
  },
  'bhajia': {
    calories: 280, protein: '5g', carbs: '30g', fat: '16g',
    fiber: '3g', sodium: '350mg',
  },
  'kachumbari': {
    calories: 25, protein: '1g', carbs: '5g', fat: '0.3g',
    fiber: '1.5g', sodium: '200mg', vitaminC: '25mg',
  },

  // ═══════════════════════════════════════════════════════════
  //  STAPLES & EVERYDAY FOODS
  // ═══════════════════════════════════════════════════════════
  'cassava': {
    calories: 160, protein: '1.4g', carbs: '38g', fat: '0.3g',
    fiber: '1.8g', sodium: '14mg', vitaminC: '20mg',
  },
  'yam': {
    calories: 118, protein: '1.5g', carbs: '28g', fat: '0.2g',
    fiber: '4.1g', sodium: '9mg', vitaminC: '17mg', iron: '0.5mg',
  },
  'plantain': {
    calories: 122, protein: '1.3g', carbs: '32g', fat: '0.4g',
    fiber: '2.3g', sodium: '4mg', vitaminA: '56mcg', vitaminC: '18mg',
  },
  'teff': {
    calories: 367, protein: '13g', carbs: '73g', fat: '2.4g',
    fiber: '8g', sodium: '12mg', iron: '7.6mg', calcium: '180mg',
  },
  'millet': {
    calories: 378, protein: '11g', carbs: '73g', fat: '4.2g',
    fiber: '8.5g', sodium: '5mg', iron: '3mg', calcium: '8mg',
  },
  'sorghum': {
    calories: 339, protein: '11g', carbs: '75g', fat: '3.3g',
    fiber: '6.3g', sodium: '6mg', iron: '4.4mg',
  },
  'fonio': {
    calories: 360, protein: '8g', carbs: '75g', fat: '1.8g',
    fiber: '2.4g', sodium: '3mg', iron: '0.6mg',
  },
  'black-eyed peas': {
    calories: 116, protein: '8g', carbs: '21g', fat: '0.5g',
    fiber: '6.5g', sodium: '4mg', iron: '2.5mg', calcium: '24mg',
  },
  'palm oil': {
    calories: 884, protein: '0g', carbs: '0g', fat: '100g',
    fiber: '0g', sodium: '0mg', vitaminA: '5000mcg',
  },
  'shea butter': {
    calories: 884, protein: '0g', carbs: '0g', fat: '100g',
    fiber: '0g', sodium: '0mg',
  },
  'baobab': {
    calories: 180, protein: '2.3g', carbs: '36g', fat: '0.3g',
    fiber: '44g', sodium: '6mg', vitaminC: '280mg', calcium: '293mg', iron: '6mg',
  },

  // ═══════════════════════════════════════════════════════════
  //  FOOD COMBOS & POPULAR PAIRINGS
  // ═══════════════════════════════════════════════════════════
  'beans and plantain': {
    calories: 145, protein: '6g', carbs: '28g', fat: '1g',
    fiber: '4g', sodium: '80mg',
  },
  'rice and stew': {
    calories: 180, protein: '4g', carbs: '30g', fat: '5g',
    fiber: '1g', sodium: '300mg',
  },
  'yam and egg sauce': {
    calories: 150, protein: '6g', carbs: '22g', fat: '4g',
    fiber: '2g', sodium: '250mg',
  },
  'indomie': {
    calories: 450, protein: '8g', carbs: '62g', fat: '18g',
    fiber: '2g', sodium: '1800mg',
  },

  // ═══════════════════════════════════════════════════════════
  //  BEVERAGES
  // ═══════════════════════════════════════════════════════════
  'zobo': {
    calories: 35, protein: '0.4g', carbs: '8g', fat: '0g',
    fiber: '0.5g', sodium: '5mg', vitaminC: '12mg', iron: '1mg',
  },
  'kunu': {
    calories: 55, protein: '1g', carbs: '12g', fat: '0.5g',
    fiber: '0.5g', sodium: '8mg',
  },
  'palm wine': {
    calories: 37, protein: '0.2g', carbs: '5g', fat: '0g',
    fiber: '0g', sodium: '10mg',
  },
  'bissap': {
    calories: 35, protein: '0.4g', carbs: '8g', fat: '0g',
    fiber: '0.5g', sodium: '5mg', vitaminC: '12mg',
  },
  'sobolo': {
    calories: 35, protein: '0.4g', carbs: '8g', fat: '0g',
    fiber: '0.5g', sodium: '5mg', vitaminC: '12mg',
  },
  'tamarind juice': {
    calories: 40, protein: '0.3g', carbs: '10g', fat: '0g',
    fiber: '0.5g', sodium: '15mg', vitaminC: '3mg',
  },
  'tangawizi': {
    calories: 45, protein: '0.2g', carbs: '11g', fat: '0g',
    fiber: '0.3g', sodium: '8mg',
  },
};

export const ALL_NUTRITION_REFERENCE = {
  ...NUTRITION_REFERENCE,
  ...LOCAL_REFERENCE_OVERRIDES,
};

const normalizeFoodName = (value = '') => value
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/\(.*?\)/g, '')
  .replace(/[^a-z0-9\s-]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

/**
 * Look up nutrition from the local reference.
 * Tries exact match first, then partial/fuzzy match.
 * @param {string} foodName — name of the food
 * @returns {object|null} — nutrition data or null if not found
 */
export const lookupNutrition = (foodName) => {
  const normalized = normalizeFoodName(foodName);

  const entries = Object.entries(ALL_NUTRITION_REFERENCE).map(([key, data]) => ({
    key,
    data,
    normalizedKey: normalizeFoodName(key),
  }));

  // 1. Exact match
  const exactMatch = entries.find(({ normalizedKey }) => normalizedKey === normalized);
  if (exactMatch) {
    return { ...exactMatch.data, source: 'pantrypal-reference' };
  }

  // 2. Check if any key is contained in the food name
  for (const { normalizedKey, data } of entries) {
    if (normalized.includes(normalizedKey) || normalizedKey.includes(normalized)) {
      return { ...data, source: 'pantrypal-reference' };
    }
  }

  // 3. Check individual words (for compound names like "Nigerian Jollof Rice")
  const words = normalized.split(/\s+/);
  for (const { normalizedKey, data } of entries) {
    const keyWords = normalizedKey.split(/\s+/);
    // If all key words appear in the food name
    if (keyWords.every((kw) => words.some((w) => w === kw || w.includes(kw)))) {
      return { ...data, source: 'pantrypal-reference' };
    }
  }

  return null;
};

export default { NUTRITION_REFERENCE, lookupNutrition };
