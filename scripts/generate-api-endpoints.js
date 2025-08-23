const fs = require('fs');
const path = require('path');

const base = process.env.API_BASE_URL || 'http://localhost:4200/api';

const content = `/**
 * This file is auto-generated at build time.
 * Do NOT edit manually.
 */

export const API_BASE_URL = '${base}';

export const API_ENDPOINTS = {
  places: { list: \`\${API_BASE_URL}/cafes\` },
  auth: {
    login: \`\${API_BASE_URL}/auth/login\`,
    register: \`\${API_BASE_URL}/auth/register\`,
  },
  user: {
    me: \`\${API_BASE_URL}/users/me\`,
    settings: \`\${API_BASE_URL}/users/settings\`,
    favorites: \`\${API_BASE_URL}/users/me/favorites\`,
    publicProfile: (userId: number) => \`\${API_BASE_URL}/users/public/\${userId}\`,
  },
  reviews: { base: \`\${API_BASE_URL}/reviews\` },
  checkins: { base: \`\${API_BASE_URL}/checkins\` },
  sharedCafes: { base: \`\${API_BASE_URL}/shared-cafes\` },
  reviewLikes: { base: \`\${API_BASE_URL}/review-likes\` },
};
`;

const outPath = path.resolve(__dirname, '../src/app/environments/api-endpoints.ts');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, content, 'utf8');

console.log('✅ Generated API endpoints to', outPath);
