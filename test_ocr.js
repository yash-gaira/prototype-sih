const fs = require('fs');

function parseAadhaar(rawText) {
  let extracted = {
    name: "",
    dob: "",
    gender: "",
    aadhaarNumber: ""
  };

  // 1. Extract Aadhaar Number (12 digits, usually formatted as 4 4 4)
  const aadhaarMatch = rawText.match(/\d{4}\s\d{4}\s\d{4}/);
  if (aadhaarMatch) extracted.aadhaarNumber = aadhaarMatch[0];

  // 2. Extract DOB (DOB: DD/MM/YYYY or Year of Birth: YYYY)
  const dobMatch = rawText.match(/(?:DOB|Year of Birth|YOB).*?(\d{2}\/\d{2}\/\d{4}|\d{4})/i);
  if (dobMatch) extracted.dob = dobMatch[1];

  // 3. Extract Gender
  const genderMatch = rawText.match(/(Male|Female|MALE|FEMALE)/i);
  if (genderMatch) extracted.gender = genderMatch[1] === 'MALE' || genderMatch[1] === 'Male' ? 'Male' : 'Female';

  // 4. Extract Name (Usually above DOB)
  // Split into lines, clean up
  const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 2);
  let name = "";
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].toLowerCase().includes("dob") || lines[i].toLowerCase().includes("year of birth")) {
      // The name is usually the line immediately preceding DOB
      if (i > 0) {
        name = lines[i-1];
        // Clean up common OCR artifacts in name
        name = name.replace(/[^a-zA-Z\s]/g, '').trim();
      }
      break;
    }
  }
  if (name) extracted.name = name;

  return extracted;
}

const sampleOCR = `Government of India
Yash Gaira
DOB: 15/05/2000
Male
1234 5678 9012`;

console.log(parseAadhaar(sampleOCR));
