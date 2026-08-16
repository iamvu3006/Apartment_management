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

const phamKietRoom = {
  title: "Modern 1-Bedroom Apartment with Balcony on Pham Kiet Street",
  price: 16000000,
  area: 55,
  address: "Pham Kiet Street",
  district: "Ngu Hanh Son",
  room_type: "1-Bedroom Apartment",
  status: "trong",
  description: `🌟 MODERN 1-BEDROOM APARTMENT WITH BALCONY ON PHAM KIET STREET 🌟

📍 Location: Pham Kiet Street, Da Nang – Prime expat neighborhood near My Khe Beach. Quiet, safe & walkable to top cafes, restaurants & beach.

📅 Availability: Available for move-in from August 15th.

✨ Property Features:
• Layout: 1 Private Bedroom, Spacious Living Room, Fully Equipped Kitchen & Private Balcony.
• Fully Furnished: High-end wooden platform bed with premium mattress, comfortable sofa, flat-screen smart TV, split air conditioners, and floor-to-ceiling glass balcony doors.
• Modern Kitchen: Induction cooktop, range hood, large refrigerator, and in-unit Toshiba washing machine.
• Bedroom: Cozy design with glass window overlooking lush green plants.

💰 Pricing & Utility Fees:
• Monthly Rent: 16,000,000 VND / month (~$640 USD/mo)
• Electricity: 4,200 VND / kWh
• Water: 100,000 VND / person / month
• Service Fee: 150,000 VND / month (Includes High-speed Wi-Fi, elevator access, weekly room cleaning 1x/week, and building maintenance).

📞 Contact Vu now for viewing & booking:
• Call / WhatsApp: +84 905 123 456
• Zalo: 0905123456`,
  images: [
    "/rooms/apartment-1/room-2.jpg",
    "/rooms/apartment-1/room-3.jpg",
    "/rooms/apartment-1/room-4.jpg",
  ],
};

async function main() {
  // Delete all old records first to have clean accurate data
  await supabase.from("rooms").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  const { data, error } = await supabase.from("rooms").insert(phamKietRoom).select();
  if (error) {
    console.error("Error inserting Pham Kiet room:", error);
  } else {
    console.log("Successfully updated Supabase with Pham Kiet apartment:", data);
  }
}

main();
