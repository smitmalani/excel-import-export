"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLoyaltyCard = generateLoyaltyCard;
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const loyaltyCardDestPath = './public/uploads/loyalty-cards';
fs.mkdirSync(loyaltyCardDestPath, { recursive: true });
const cardBackgroundPath = path.join(process.cwd(), 'public/bg6.jpg');
const defaultProfileImagePath = path.join(process.cwd(), 'public/default-profile.png');
async function generateLoyaltyCard(member, cardTypeName) {
    try {
        cardTypeName = 'Gold Card';
        function formatCardNumber(cardNumber) {
            const clean = cardNumber.toString().replace(/\D/g, '');
            return clean.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
        }
        let formatedNumber = formatCardNumber(member.SmartCardNumber);
        const cardOutputPath = path.join(loyaltyCardDestPath, `${member.SmartCardNumber || `member-${member.MemberID}`}-${Date.now()}.png`);
        let profileImagePath = defaultProfileImagePath;
        if (member.ProfileImageURL) {
            const actualProfilePath = path.join(process.cwd(), 'public', member.ProfileImageURL);
            if (fs.existsSync(actualProfilePath)) {
                profileImagePath = actualProfilePath;
            }
        }
        const profileImageBuffer = await sharp(profileImagePath)
            .resize(220, 220)
            .composite([
            {
                input: Buffer.from(`<svg><circle cx="${220 / 2}" cy="${220 / 2}" r="${220 / 2}" fill="white"/></svg>`),
                blend: 'dest-in',
            },
        ])
            .png()
            .toBuffer();
        const svgText = `
      <svg width="900" height="450">
        <style>
          .name { fill: #fff; font-size: 35px; font-family: Arial, sans-serif; font-weight: bold;  }
          .mobile { fill: #fff; font-size: 25px; font-family: Arial, sans-serif;  }
          .card-no {  fill: #fff; font-size: 30px; font-family: 'Courier New', monospace; letter-spacing: 5px; }
          .card-type {  fill: #fff; font-size: 25px; font-family: Arial, sans-serif;  font-weight: bold;  writing-mode: vertical-rl;  text-orientation: mixed;  }

        </style>
        <text x="90" y="250" class="name">${member.FirstName} ${member.LastName}</text>
        <text x="90" y="320" class="mobile">${member.MobileNumber}</text>
        <text x="90" y="380" class="card-no">${formatedNumber}</text>
        <text x="870" y="45" class="card-type">${cardTypeName}</text>
      </svg>
    `;
        await sharp(cardBackgroundPath)
            .composite([
            { input: profileImageBuffer, top: 200, left: 580 },
            { input: Buffer.from(svgText), top: 0, left: 0 },
        ])
            .toFile(cardOutputPath);
        return cardOutputPath.replace(/^public/, '');
    }
    catch (error) {
        console.error('Error generating loyalty card:', error);
        throw new Error('Could not generate loyalty card.');
    }
}
//# sourceMappingURL=loyalty-card.utils.js.map