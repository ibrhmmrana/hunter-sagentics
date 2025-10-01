// Mock lead data for Hunter Results
export interface Lead {
  id: string;
  title: string;
  category: string;
  city: string;
  rating: number | null;
  reviewsCount: number;
  phone: string | null;
  website: string | null;
  address: string;
  latitude: number;
  longitude: number;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  tiktok?: string;
  emails?: string[];
  openNow?: boolean;
  verified?: boolean;
  plusCode?: string;
  cid?: string;
}

const categories = ["Restaurant", "Salon", "Gym", "Dentist", "Coffee", "Bakery", "Auto repair", "Spa"];
const cities = ["Sandton", "Rosebank", "Cape Town", "Durban", "Pretoria", "Centurion", "Johannesburg"];

const firstNames = ["The", "Golden", "Royal", "Premium", "Elite", "Modern", "Classic", "Urban", "Fresh"];
const businessTypes = ["Grill", "Bistro", "Studio", "Center", "Shop", "House", "Corner", "Place", "Bar"];

export const generateMockLeads = (count: number = 60): Lead[] => {
  const leads: Lead[] = [];

  for (let i = 0; i < count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const hasWebsite = Math.random() > 0.6; // 40% without website
    const hasSocials = Math.random() > 0.5; // 50% without socials
    const hasPhone = Math.random() > 0.1; // 90% have phone
    const rating = Math.random() > 0.2 ? +(3 + Math.random() * 2).toFixed(1) : null;
    const reviewsCount = rating ? Math.floor(Math.random() * 500) : 0;

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const businessType = businessTypes[Math.floor(Math.random() * businessTypes.length)];
    const title = `${firstName} ${category === "Restaurant" ? businessType : category}`;

    const lead: Lead = {
      id: `lead-${i + 1}`,
      title,
      category,
      city,
      rating,
      reviewsCount,
      phone: hasPhone ? `+27 ${Math.floor(10 + Math.random() * 90)} ${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000 + Math.random() * 9000)}` : null,
      website: hasWebsite ? `https://www.${title.toLowerCase().replace(/\s+/g, "")}.co.za` : null,
      address: `${Math.floor(1 + Math.random() * 500)} ${["Main", "Oak", "Park", "Church", "High"][Math.floor(Math.random() * 5)]} Street, ${city}`,
      latitude: -26 + Math.random() * 2,
      longitude: 28 + Math.random() * 2,
      openNow: Math.random() > 0.3,
      verified: Math.random() > 0.5,
      cid: `cid-${Math.random().toString(36).substr(2, 9)}`,
      plusCode: `${Math.random().toString(36).substr(2, 4).toUpperCase()}+${Math.random().toString(36).substr(2, 2).toUpperCase()}`,
    };

    if (hasSocials) {
      const socialCount = Math.floor(1 + Math.random() * 3);
      const socials = ["facebook", "instagram", "twitter", "linkedin", "tiktok"];
      const selected = socials.sort(() => 0.5 - Math.random()).slice(0, socialCount);

      selected.forEach((social) => {
        const handle = title.toLowerCase().replace(/\s+/g, "");
        if (social === "facebook") lead.facebook = `https://facebook.com/${handle}`;
        if (social === "instagram") lead.instagram = `https://instagram.com/${handle}`;
        if (social === "twitter") lead.twitter = `https://twitter.com/${handle}`;
        if (social === "linkedin") lead.linkedin = `https://linkedin.com/company/${handle}`;
        if (social === "tiktok") lead.tiktok = `https://tiktok.com/@${handle}`;
      });
    }

    if (Math.random() > 0.7) {
      lead.emails = [`info@${title.toLowerCase().replace(/\s+/g, "")}.co.za`];
    }

    leads.push(lead);
  }

  return leads;
};

export const MOCK_LEADS = generateMockLeads(60);
