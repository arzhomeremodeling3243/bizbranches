const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../lib/static-businesses.json');
const businesses = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const index = businesses.findIndex(b => b.slug === 'shadab-group-real-estate-builders-sargodha');

if (index === -1) {
  console.error('Business not found');
  process.exit(1);
}

const existing = businesses[index];

const updated = {
  ...existing,
  businessName: "Shadab Group Real Estate & Builders",
  name: "Shadab Group Real Estate & Builders",
  slug: "shadab-group-real-estate-builders-sargodha",
  city: "Sargodha",
  category: "real-estate",
  categoryId: "real-estate",
  categorySlug: "real-estate",
  metaTitle: "Shadab Group Real Estate & Builders Sargodha | Real Estate",
  metaDescription: "Shadab Group Real Estate & Builders in Sargodha offers real estate consultancy, construction, commercial construction and property investment consultancy.",
  shortIntro: "Shadab Group Real Estate & Builders is a real estate and construction company serving customers in Sargodha, Pakistan. Established in 1990, the company provides real estate advisory and consultancy, construction services, commercial construction, and property investment consultancy.",
  description: "Shadab Group Real Estate & Builders is a real estate and construction company serving customers in Sargodha, Pakistan. Established in 1990, the company provides real estate advisory and consultancy, construction services, commercial construction, and property investment consultancy.",
  aboutHeading: "About Shadab Group Real Estate & Builders",
  aboutText: "Established in 1990, Shadab Group Real Estate & Builders provides real estate and construction services in Sargodha, Pakistan. The company offers real estate advisory and consultancy, construction services, commercial construction, and property investment consultancy.\n\nShadab Group assists clients with real estate decisions and property investment requirements, providing consultation based on their individual needs. Its construction services cover general construction requirements, including home renovation and other construction projects.\n\nThe company also provides commercial construction services for businesses and commercial property requirements. With real estate and construction services available through one company, Shadab Group aims to provide customers with an all-in-one solution for property consultation, investment guidance, and construction requirements.\n\nShadab Group Real Estate & Builders is located in Gulberg City, Sargodha, and serves customers looking for professional real estate and construction assistance in the Sargodha area.",
  services: [
    {
      title: "Real Estate Advisory & Consultancy",
      desc: "Professional real estate advisory and consultancy for customers looking for guidance with property-related decisions, buying opportunities, and real estate requirements in Sargodha."
    },
    {
      title: "Construction Services",
      desc: "Construction services for residential and general construction requirements, including home renovation, general construction, and related building projects."
    },
    {
      title: "Commercial Construction",
      desc: "Construction services for commercial properties and business-related building requirements in Sargodha."
    },
    {
      title: "Property Investment Consultancy",
      desc: "Real estate investment consultancy to help clients evaluate property investment opportunities and make informed investment decisions."
    },
    {
      title: "All-in-One Real Estate & Construction Solutions",
      desc: "Shadab Group combines real estate consultancy, property investment guidance, residential construction, home renovation, and commercial construction services in one place."
    }
  ],
  phone: "+92 305 7860084",
  address: "Shop #10–11, Shadab Real Estate, Opposite Community Office, Gulberg City, Sargodha, Pakistan",
  whatsapp: "+92 305 7860084",
  email: "shadabgrouprealestate@gmail.com",
  websiteUrl: "",
  googleBusiness: "https://share.google/c8gi6qpPRW8QLgNud",
  businessHours: [
    {
      days: "Monday – Sunday",
      hours: "10:00 AM – 09:00 PM"
    }
  ],
  openingHoursSpecification: [
    "Mo-Su 10:00-21:00"
  ],
  faqs: [
    {
      question: "Where is Shadab Group Real Estate & Builders located?",
      answer: "Shadab Group Real Estate & Builders is located at Shop #10–11, Shadab Real Estate, opposite Community Office, Gulberg City, Sargodha, Pakistan."
    },
    {
      question: "What services does Shadab Group Real Estate & Builders provide?",
      answer: "Shadab Group provides real estate advisory and consultancy, construction services, commercial construction, and property investment consultancy."
    },
    {
      question: "Does Shadab Group provide construction services in Sargodha?",
      answer: "Yes. Shadab Group provides construction services in Sargodha, including home renovation, general construction, and commercial construction services."
    },
    {
      question: "Does Shadab Group provide property investment consultancy?",
      answer: "Yes. The company provides property investment consultancy for customers seeking guidance regarding real estate investment opportunities."
    },
    {
      question: "What are the business hours of Shadab Group?",
      answer: "Shadab Group Real Estate & Builders is open from 10:00 AM to 9:00 PM, based on the business hours provided for this listing."
    },
    {
      question: "How can I contact Shadab Group Real Estate & Builders?",
      answer: "You can contact Shadab Group at +92 305 7860084 by phone or WhatsApp, or contact the business by email at shadabgrouprealestate@gmail.com."
    }
  ],
  updatedAt: new Date().toISOString()
};

businesses[index] = updated;

fs.writeFileSync(filePath, JSON.stringify(businesses, null, 2), 'utf-8');
console.log('Successfully updated Shadab Group in static-businesses.json');
