import { chatWithAssistant } from '../services/assistantService.js';
import { ok } from '../utils/api.js';

export async function chat(req,res){return ok(res,await chatWithAssistant(req.body))}
