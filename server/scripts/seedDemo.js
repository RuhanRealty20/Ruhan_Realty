import 'dotenv/config';
import { connectDatabase } from '../src/config/db.js';
import { Content } from '../src/models/Content.js';
const names=['Brickell','Downtown Miami','Miami Beach','South Beach','Edgewater','Coconut Grove','Coral Gables','Key Biscayne','Fisher Island','Sunny Isles','Bal Harbour','Aventura','North Miami Beach','Fort Lauderdale'];
await connectDatabase();for(const name of names){const slug=name.toLowerCase().replaceAll(' ','-');await Content.updateOne({type:'AREA',slug},{$setOnInsert:{title:name,slug,type:'AREA',summary:`DEVELOPMENT DRAFT — ${name} area content requires factual and compliance review.`,status:'DRAFT'}},{upsert:true})}console.log('Development-only draft area records seeded. No properties, testimonials, news, or market statistics were fabricated.');process.exit(0);
