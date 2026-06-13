// ───────────────────────────────────────────────────────────────
// scripts/embedProducts.js   (Week 13 — run ONCE)
//
// Generates an embedding for every product's "name + description"
// and stores it on the product document as `embedding`. After this,
// enable AI_VECTOR_SEARCH=true and create the Atlas Vector index
// (instructions in the integration guide, Week 13).
//
// Run:  node scripts/embedProducts.js
// ───────────────────────────────────────────────────────────────
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { embedText } = require('../utils/llmClient');

(async () => {
  if (!process.env.GOOGLE_API_KEY) {
    console.error('GOOGLE_API_KEY missing in .env — cannot embed.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Embedding products…');

  const products = await Product.find().select('name description embedding');
  let done = 0;

  for (const p of products) {
    if (Array.isArray(p.embedding) && p.embedding.length) {
      continue; // already embedded — skip to keep it idempotent
    }
    try {
      const text = `${p.name}. ${p.description || ''}`.slice(0, 2000);
      const vector = await embedText(text);
      p.embedding = vector;
      await p.save();
      done += 1;
      console.log(`  ✓ ${p.name}`);
      // Be gentle on the embedding API rate limit.
      await new Promise((r) => setTimeout(r, 250));
    } catch (e) {
      console.error(`  ✗ ${p.name}: ${e.message}`);
    }
  }

  console.log(`\nDone. Embedded ${done} product(s).`);
  await mongoose.disconnect();
  process.exit(0);
})();

// ── Add this field to models/Product.js (Week 13) ──────────────
//   embedding: { type: [Number], default: undefined, select: false },
//
// `select: false` keeps the big vector array out of normal API
// responses — it is only read by the $vectorSearch aggregation.
