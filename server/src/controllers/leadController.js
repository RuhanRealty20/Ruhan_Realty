import { audit } from '../middleware/audit.js';
import { Lead } from '../models/Lead.js';
import * as leadService from '../services/leadService.js';
import { ApiError, ok } from '../utils/api.js';

export async function create(req,res){const lead=await leadService.createLead(req.body);return res.status(201).json({success:true,data:{id:lead._id,status:lead.status}})}
export async function list(req,res){return ok(res,await leadService.listLeads(req.query))}
export async function get(req,res){const lead=await Lead.findById(req.params.id).lean();if(!lead)throw new ApiError(404,'Lead not found','NOT_FOUND');return ok(res,lead)}
export async function update(req,res){const current=await Lead.findById(req.params.id);if(!current)throw new ApiError(404,'Lead not found','NOT_FOUND');if(req.body.status&&req.body.status!==current.status){const from=current.status;current.status=req.body.status;current.activity.push({type:'STATUS_CHANGED',detail:`${from} → ${req.body.status}`,actor:req.user._id})}if(req.body.preferredContact)current.preferredContact=req.body.preferredContact;await current.save();await audit(req,'LEAD_UPDATED','Lead',current._id,req.body);return ok(res,current)}
export async function addNote(req,res){const lead=await Lead.findById(req.params.id);if(!lead)throw new ApiError(404,'Lead not found','NOT_FOUND');lead.internalNotes.push({body:req.body.note,author:req.user._id});lead.activity.push({type:'NOTE_ADDED',detail:'Internal note added',actor:req.user._id});await lead.save();await audit(req,'LEAD_NOTE_ADDED','Lead',lead._id);return res.status(201).json({success:true,data:lead})}
export async function dashboard(_req,res){return ok(res,await leadService.dashboard())}
