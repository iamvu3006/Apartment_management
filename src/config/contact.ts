export interface ContactPerson {
  name: string;
  phone: string;
  displayPhone: string;
  zalo: string;
  whatsapp: string;
  facebook: string;
}

export const CONTACT_CONFIG = {
  primary: {
    name: "Vu - Da Nang Rental Specialist",
    phone: "0396730410",
    displayPhone: "+84 396 730 410",
    zalo: "0396730410",
    whatsapp: "84396730410",
    facebook: "https://www.facebook.com/ba.vu.420904",
  },
  secondary: {
    name: "Han My - Da Nang Rental Specialist",
    phone: "0945976247",
    displayPhone: "+84 945 976 247",
    zalo: "0945976247",
    whatsapp: "84945976247",
    facebook: "https://www.facebook.com/han.my.724857",
  },
  // Backward compatibility default properties
  ownerName: "Vu - Da Nang Rental Specialist",
  phone: "0396730410",
  displayPhone: "+84 396 730 410",
  zalo: "0396730410",
  whatsapp: "84396730410",
  facebook: "https://www.facebook.com/ba.vu.420904",
};
