import { idxProvider } from '../integrations/idx/index.js';
import { ok } from '../utils/api.js';
export async function list(req,res){return ok(res,await idxProvider.search(req.query))}
export async function get(req,res){return ok(res,await idxProvider.getBySlug(req.params.slug))}
