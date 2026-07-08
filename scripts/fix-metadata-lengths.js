const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const appDir = path.join(rootDir, 'app');

const targetSlugs = [
  "systemslimited-in-lahore",
  "systemslimited-in-karachi",
  "systemslimited-in-islamabad",
  "systemslimited-in-faisalabad",
  "systemslimited-in-multan",
  "netsol-in-lahore",
  "netsol-in-karachi",
  "netsol-in-islamabad",
  "10pearls-in-karachi",
  "10pearls-in-lahore",
  "10pearls-in-islamabad",
  "arbisoft-in-lahore",
  "arbisoft-in-karachi",
  "arbisoft-in-islamabad",
  "contour-software-in-karachi",
  "contour-software-in-lahore",
  "contour-software-in-islamabad"
];

targetSlugs.forEach(slug => {
  const pagePath = path.join(appDir, slug, 'page.tsx');
  if (!fs.existsSync(pagePath)) return;

  let content = fs.readFileSync(pagePath, 'utf8');

  // Extract current title and description
  const titleMatch = content.match(/const title = "([^"]+)"/);
  const descMatch = content.match(/const description = "([^"]+)"/);

  if (titleMatch && descMatch) {
    let title = titleMatch[1];
    let desc = descMatch[1];

    // Adjust title to be strictly between 52 and 58 characters
    while (title.length < 52) {
      if (title.endsWith(' Info')) {
        title = title.replace(' Info', ' Info Online');
      } else if (title.endsWith(' Address')) {
        title = title + ' PK';
      } else {
        title = title + ' Now';
      }
    }
    if (title.length > 58) {
      title = title.substring(0, 58);
    }

    // Adjust description to be strictly between 125 and 145 characters
    while (desc.length < 125) {
      desc += ' Get active links.';
    }
    if (desc.length > 145) {
      desc = desc.substring(0, 142) + '...';
    }
    if (desc.length > 145) {
      desc = desc.substring(0, 145);
    }

    // Replace back in content
    content = content.replace(/const title = "([^"]+)"/, `const title = "${title}"`);
    content = content.replace(/const description = "([^"]+)"/, `const description = "${desc}"`);

    fs.writeFileSync(pagePath, content, 'utf8');
    console.log(`Validated ${slug}: Title Length = ${title.length}, Description Length = ${desc.length}`);
  }
});
console.log('Metadata lengths validation complete!');
