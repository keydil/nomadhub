async function checkModels() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.error("No API key");
    return;
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
  const res = await fetch(url);
  const data = await res.json();
  console.log(JSON.stringify(data.models.map(m => m.name), null, 2));
}

checkModels();
