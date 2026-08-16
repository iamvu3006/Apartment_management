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

const anMyImages = [
  "/rooms/an-my-7/an-my-1.jpg",
  "/rooms/an-my-7/an-my-2.jpg",
  "/rooms/an-my-7/an-my-3.jpg",
  "/rooms/an-my-7/an-my-4.jpg",
  "/rooms/an-my-7/an-my-5.jpg",
];

const anMyRooms = [
  {
    title: "Brand New 1-Bedroom Apartment (2nd Floor) – An My 7 St, Next to Dragon Bridge",
    price: 15000000,
    area: 45,
    address: "An My 7 Street",
    district: "Son Tra",
    room_type: "1-Bedroom Apartment",
    status: "trong",
    description: `🌟 BRAND NEW 1-BEDROOM APARTMENT FOR RENT ON AN MY 7 STREET – NEXT TO DRAGON BRIDGE 🌟

📍 Location: 2nd Floor, An My 7 Street, Son Tra District, Da Nang – Right next to Dragon Bridge & Han River. Prime central location, 5 mins to beach.

📅 Availability: Ready for immediate move-in!

✨ Property Highlights:
• Floor & Layout: 2nd Floor – 1-Bedroom Apartment with private bathroom & open layout.
• Custom Interiors: Built-in floor-to-ceiling wardrobes, wooden platform bed with premium mattress, makeup vanity desk with mirror, and wall-mounted smart TV.
• Full Kitchen & Bath: Modern kitchen with induction cooktop, fridge, and stylish marble vanity bathroom with rain shower.
• Lighting & Climate: Recessed LED ceiling lighting & quiet air conditioner.

💰 Rent: 15,000,000 VND / month (~$600 USD/mo)

📞 Contact Vu now for direct viewing & booking:
• Call / WhatsApp: +84 905 123 456
• Zalo: 0905123456`,
    images: anMyImages,
  },
  {
    title: "Spacious 2-Bedroom Apartment (3rd Floor) – An My 7 St, Next to Dragon Bridge",
    price: 17000000,
    area: 60,
    address: "An My 7 Street",
    district: "Son Tra",
    room_type: "2-Bedroom Apartment",
    status: "trong",
    description: `🌟 BRAND NEW 2-BEDROOM APARTMENT FOR RENT ON AN MY 7 STREET – NEXT TO DRAGON BRIDGE 🌟

📍 Location: 3rd Floor, An My 7 Street, Son Tra District, Da Nang – Right next to Dragon Bridge & Han River. 5 mins to My Khe Beach.

📅 Availability: Ready for immediate move-in!

✨ Property Highlights:
• Floor & Layout: 3rd Floor – 2 Bedrooms, spacious living room, modern kitchen & full bathroom.
• Custom Interiors: High-end built-in wardrobes in both bedrooms, wooden platform beds with mattresses, vanity desks, smart TV.
• Modern Amenities: Full kitchen with fridge & cooktop, marble-top vanity bathroom with rain shower.

💰 Rent: 17,000,000 VND / month (~$680 USD/mo)

📞 Contact Vu now for direct viewing & booking:
• Call / WhatsApp: +84 905 123 456
• Zalo: 0905123456`,
    images: anMyImages,
  },
  {
    title: "Luxury 2-Bedroom Apartment (4th Floor) – An My 7 St, Next to Dragon Bridge",
    price: 17000000,
    area: 60,
    address: "An My 7 Street",
    district: "Son Tra",
    room_type: "2-Bedroom Apartment",
    status: "trong",
    description: `🌟 BRAND NEW 2-BEDROOM APARTMENT FOR RENT ON AN MY 7 STREET – NEXT TO DRAGON BRIDGE 🌟

📍 Location: 4th Floor, An My 7 Street, Son Tra District, Da Nang – Next to Dragon Bridge & Han River. Great city view & natural sunlight.

📅 Availability: Ready for immediate move-in!

✨ Property Highlights:
• Floor & Layout: 4th Floor – 2 Bedrooms, living room, full kitchen & tiled bathroom.
• Fully Furnished: Built-in wardrobes, wooden platform beds, makeup vanity, TV & split ACs.
• Services: High-speed Wi-Fi, elevator access, 24/7 security.

💰 Rent: 17,000,000 VND / month (~$680 USD/mo)

📞 Contact Vu now for direct viewing & booking:
• Call / WhatsApp: +84 905 123 456
• Zalo: 0905123456`,
    images: anMyImages,
  },
];

async function main() {
  const { data, error } = await supabase.from("rooms").insert(anMyRooms).select();
  if (error) {
    console.error("Error inserting An My 7 rooms:", error);
  } else {
    console.log("Successfully inserted An My 7 apartments:", data.length);
  }
}

main();
