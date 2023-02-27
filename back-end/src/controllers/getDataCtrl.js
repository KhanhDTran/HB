import { delay } from "../utils/commonUtils.js";
import Patient from "../schemas/Patient.js";
import Speciaalty from "../schemas/Specialty.js";
import Clinic from "../schemas/Clinic.js";

export async function getClinics(req, res) {
  let clinics = await Clinic.find().populate(["specialty", "user"]);
  return res.status(200).json({ clinics });
}

export async function getSpecialties(req, res) {
  let specialties = await Speciaalty.find();
  return res.status(200).json({ specialties });
}
