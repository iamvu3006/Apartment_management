const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const envFile = fs.readFileSync(path.join(__dirname, "../.env.local"), "utf8");
const envVars = {};
envFile.split("\n").forEach((line) => {
  const [k, v] = line.split("=");
  if (k && v) envVars[k.trim()] = v.trim();
});

const supabaseUrl = envVars["NEXT_PUBLIC_SUPABASE_URL"];
const supabaseKey = envVars["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"];

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase.from("rooms").select("*");
  console.log("Current rooms count:", data ? data.length : 0);
  if (data && data.length > 0) {
    console.log("Existing rooms:", JSON.stringify(data, null, 2));
  }
}

main();
