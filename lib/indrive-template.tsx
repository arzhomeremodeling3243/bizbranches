import React from 'react'

/**
 * Utility function to correct grammatical articles ("a" / "an") dynamically
 * based on whether the subsequent word starts with a vowel sound.
 */
export function adjustArticles(text: string): string {
  return text.replace(/\b(a|an)\b(\s+)(<strong[^>]*>|__|\*\*)?([a-zA-Z0-9_-]+)/gi, (match, article, spaces, formatting, nextWord) => {
    // Basic letter-based vowel check (a, e, i, o, u) is sufficient for PK city names (e.g. Islamabad, Abbottabad, Okara)
    const startsWithVowel = /^[aeiou]/i.test(nextWord);
    const isCapitalized = article.charAt(0) === article.charAt(0).toUpperCase();
    
    let correctArticle = article;
    if (startsWithVowel) {
      correctArticle = isCapitalized ? 'An' : 'an';
    } else {
      correctArticle = isCapitalized ? 'A' : 'a';
    }
    
    return `${correctArticle}${spaces}${formatting || ''}${nextWord}`;
  });
}

export const INDRIVE_BOILERPLATE_TEMPLATE = `### InDrive [City Name] Office, Contact, & Driver Registration Guide

Looking for the official **inDrive [City Name] office** or customer support? As a premier ride-hailing and courier service platform in Pakistan, inDrive operates extensively across [City Name], offering city rides, intercity travel, and reliable freight delivery services. 

Whether you are a passenger trying to book an affordable ride or an applicant looking for **inDrive driver registration in [City Name]**, finding localized contact details ensures smooth coordination. While most passenger queries and fare negotiations happen directly via the official mobile application, local drivers often require offline registration support, document verification, and account activation assistance.

* **Primary Service Area:** [City Name], Pakistan
* **Available Services:** City Rides, City-to-City, Courier, and Freight Delivery
* **Driver Registration Process:** Download the app, switch to "Driver Mode", select "Online Registration", and upload your CNIC, Driving License, and vehicle documents.

Need to visit or get in touch? Verify the operational status, user reviews, and map directions for independent helpline hubs and support setups in the business directory details below.`;

/**
 * Substituted template generator
 */
export function getIndriveBoilerplateText(city: string): string {
  const substituted = INDRIVE_BOILERPLATE_TEMPLATE.replace(/\[City Name\]/g, city);
  return adjustArticles(substituted);
}

/**
 * A clean React component that renders the boilerplate authority content
 * with identical styles, structures, list items, and formatting.
 */
export function IndriveBoilerplateContent({ city }: { city: string }) {
  const heading = `InDrive ${city} Office, Contact, & Driver Registration Guide`;
  
  const p1Raw = `Looking for the official **inDrive ${city} office** or customer support? As a premier ride-hailing and courier service platform in Pakistan, inDrive operates extensively across ${city}, offering city rides, intercity travel, and reliable freight delivery services.`;
  const p1 = adjustArticles(p1Raw);
  
  const p2Raw = `Whether you are a passenger trying to book an affordable ride or an applicant looking for **inDrive driver registration in ${city}**, finding localized contact details ensures smooth coordination. While most passenger queries and fare negotiations happen directly via the official mobile application, local drivers often require offline registration support, document verification, and account activation assistance.`;
  const p2 = adjustArticles(p2Raw);
  
  const bullet1Raw = `**Primary Service Area:** ${city}, Pakistan`;
  const bullet1 = adjustArticles(bullet1Raw);
  
  const bullet2 = `**Available Services:** City Rides, City-to-City, Courier, and Freight Delivery`;
  const bullet3 = `**Driver Registration Process:** Download the app, switch to "Driver Mode", select "Online Registration", and upload your CNIC, Driving License, and vehicle documents.`;
  
  const p3Raw = `Need to visit or get in touch? Verify the operational status, user reviews, and map directions for independent helpline hubs and support setups in the business directory details below.`;
  const p3 = adjustArticles(p3Raw);

  const renderFormattedText = (text: string) => {
    // Match "**text**" formatting
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="font-bold text-gray-900">{part}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="space-y-6 text-gray-600 leading-relaxed text-base">
      <h3 className="text-xl font-bold text-[#0f2b3d] mt-2 mb-4">
        {heading}
      </h3>
      <p>
        {renderFormattedText(p1)}
      </p>
      <p>
        {renderFormattedText(p2)}
      </p>
      <ul className="list-disc pl-5 space-y-2.5">
        <li>
          {renderFormattedText(bullet1)}
        </li>
        <li>
          {renderFormattedText(bullet2)}
        </li>
        <li>
          {renderFormattedText(bullet3)}
        </li>
      </ul>
      <p>
        {renderFormattedText(p3)}
      </p>
    </div>
  );
}
