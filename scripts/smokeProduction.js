import assert from 'node:assert/strict';

Object.assign(process.env,{
  NODE_ENV:'production',MONGODB_URI:'mongodb://127.0.0.1:27017/ruhan_realty_smoke',FRONTEND_URL:'https://ruhanrealty.com',ALLOWED_ORIGINS:'https://ruhanrealty.com',
  JWT_ACCESS_SECRET:'smoke-access-secret-32-characters-minimum',JWT_REFRESH_SECRET:'smoke-refresh-secret-different-32-chars',EMAIL_PROVIDER:'console',IDX_PROVIDER:'unconfigured',AI_PROVIDER:'disabled',
});
const [{app},{default:request}]=await Promise.all([import('../server/src/app.js'),import('supertest')]);
const home=await request(app).get('/');
assert.equal(home.status,200);assert.match(home.text,/Your Miami Real Estate Connection/);assert.match(home.text,/rel="canonical" href="https:\/\/ruhanrealty.com\/"/);
const about=await request(app).get('/about');
assert.equal(about.status,200);assert.match(about.text,/About the Miami Real Estate Advisor/);assert.match(about.text,/https:\/\/ruhanrealty.com\/about/);
const admin=await request(app).get('/admin/login');
assert.equal(admin.status,200);assert.match(admin.headers['x-robots-tag'],/noindex/);
const missing=await request(app).get('/definitely-not-a-page');
assert.equal(missing.status,404);
const readiness=await request(app).get('/api/v1/health');
assert.equal(readiness.status,503);assert.equal(readiness.body.data.database,'degraded');
console.log('Production server smoke test passed (routes, SEO HTML, noindex, 404 and readiness).');
