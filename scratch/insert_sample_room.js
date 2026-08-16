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

const sampleRoom = {
  title: "Modern 1-Bedroom Apartment with Balcony & Full Kitchen – Near Beach",
  price: 8500000,
  area: 48,
  address: "Vo Van Kiet Street",
  district: "Son Tra",
  room_type: "1-Bedroom Apartment",
  status: "trong",
  description: `🌟 LUXURY 1-BEDROOM APARTMENT FOR RENT IN SON TRA, DA NANG 🌟

📍 Location: Prime location in Son Tra District – 3 mins to My Khe Beach & Dragon Bridge. Quiet, safe & expat-friendly neighborhood.

✨ Property Highlights:
• Spacious 48m² layout featuring a private bedroom, bright open living room, full kitchen & private balcony.
• Fully Furnished: High-end wooden platform bed with premium mattress, sofa, smart TV, split air conditioners, and large floor-to-ceiling windows.
• Modern Kitchen: Induction cooktop, range hood, large refrigerator, microwave, and ample cabinet space.
• In-unit Laundry: Private Toshiba front-load washing machine included.
• Bedroom: Comfortable king bed, built-in wardrobes, and scenic green garden view through glass windows.

💡 Included Amenities & Services:
• Free High-speed Wi-Fi
• Elevator access & 24/7 Security camera system
• Housekeeping & cleaning service available on request
• Free secure motorcycle parking

💰 Monthly Rent: 8,500,000 VND / month (~$340 USD/mo)
⚡ Utilities: Electricity (3,500 VND/kWh), Water (100,000 VND/person)
📄 Lease Term: Flexible contract (6 months - 1 year or short-term).

📞 Contact Vu now for direct viewing & special offer:
• Call / WhatsApp: +84 905 123 456
• Zalo: 0905123456`,
  images: [
    "/rooms/apartment-1/room-2.jpg",
    "/rooms/apartment-1/room-3.jpg",
    "/rooms/apartment-1/room-4.jpg",
  ],
};

async function main() {
  const { data, error } = await supabase.from("rooms").insert(sampleRoom).select();
  if (error) {
    console.error("Error inserting room:", error);
  } else {
    console.log("Successfully inserted room:", data);
  }
}

main();
