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

const additionalRooms = [
  {
    title: "Cozy Oceanview Studio Apartment – 2 Mins to My Khe Beach",
    price: 6500000,
    area: 35,
    address: "Ho Nghinh Street",
    district: "Son Tra",
    room_type: "Studio Apartment",
    status: "trong",
    description: `🌊 BRIGHT & MODERN STUDIO APARTMENT IN SON TRA, DA NANG 🌊

📍 Location: Ho Nghinh Street, Son Tra District – Just 200m from My Khe Beach. Surrounded by western cafes, restaurants & mini marts.

✨ Features & Amenities:
• Open-plan 35m² design with large glass windows & natural sunlight.
• Fully furnished: Queen bed, sofa, air conditioner, smart TV, clothes closet.
• Private kitchen equipped with induction stove, fridge & kitchenware.
• Private balcony with washing machine.
• High-speed Wi-Fi, elevator, 24/7 security.

💰 Monthly Rent: 6,500,000 VND / month (~$260 USD/mo)
⚡ Utilities: Electricity 3,500 VND/kWh, Water 100,000 VND/person.

📞 Contact Vu for viewing: +84 905 123 456 (WhatsApp / Zalo)`,
    images: [
      "/rooms/apartment-1/room-3.jpg",
      "/rooms/apartment-1/room-2.jpg",
      "/rooms/apartment-1/room-4.jpg",
    ],
  },
  {
    title: "Luxury 2-Bedroom Serviced Apartment in Hai Chau City Center",
    price: 11000000,
    area: 65,
    address: "Nguyen Van Linh Street",
    district: "Hai Chau",
    room_type: "2-Bedroom Apartment",
    status: "da_coc",
    description: `🏙️ ELEGANT 2-BEDROOM SERVICED APARTMENT IN CENTRAL HAI CHAU 🏙️

📍 Location: Nguyen Van Linh Street, Hai Chau District – Center of Da Nang, 5 mins drive to Da Nang Airport & Han River Bridge.

✨ Features & Amenities:
• Spacious 65m² with 2 private bedrooms, large living room & separate kitchen area.
• Fully furnished with modern furniture, wooden floors, washing machine & microwave.
• Smart TV, dual air conditioners, quiet study desk.
• Weekly housekeeping service included.

💰 Monthly Rent: 11,000,000 VND / month (~$440 USD/mo)
⚡ Status: Reserved (Deposit Received)

📞 Contact Vu for similar available units: +84 905 123 456`,
    images: [
      "/rooms/apartment-1/room-4.jpg",
      "/rooms/apartment-1/room-2.jpg",
      "/rooms/apartment-1/room-3.jpg",
    ],
  },
];

async function main() {
  const { data, error } = await supabase.from("rooms").insert(additionalRooms).select();
  if (error) {
    console.error("Error inserting additional rooms:", error);
  } else {
    console.log("Successfully inserted additional rooms:", data.length);
  }
}

main();
