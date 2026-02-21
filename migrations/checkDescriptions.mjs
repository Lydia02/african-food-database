import { db } from '../config/firebase.js';

const snap = await db.collection('foods').get();
let total = snap.size;
let descOk = 0;
let descShort = 0;
let noDesc = 0;
let hasInstructions = 0;
let noInstructions = 0;

for (const doc of snap.docs) {
  const data = doc.data();
  const description = String(data.description || '').trim();

  if (!description) noDesc += 1;
  else if (description.length < 40) descShort += 1;
  else descOk += 1;

  const steps = Array.isArray(data.instructions)
    ? data.instructions.filter((step) => {
        if (!step) return false;
        if (typeof step === 'string') return step.trim().length > 0;
        if (typeof step === 'object') return String(step.description || '').trim().length > 0;
        return false;
      })
    : [];

  if (steps.length > 0) hasInstructions += 1;
  else noInstructions += 1;
}

console.log(JSON.stringify({
  total,
  descriptions: { good: descOk, short: descShort, missing: noDesc },
  instructions: { withSteps: hasInstructions, missing: noInstructions },
}, null, 2));
