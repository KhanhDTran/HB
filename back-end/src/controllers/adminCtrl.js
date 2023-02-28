import { delay } from "../utils/commonUtils.js";
import Patient from "../schemas/Patient.js";
import User from "../schemas/User.js";
import Specialty from "../schemas/Specialty.js";
import Clinic from "../schemas/Clinic.js";
import Lab from "../schemas/Laboratory.js";
import Doctor from "../schemas/Doctor.js";
import Service from "../schemas/Service.js";
import Schedule from "../schemas/Schedule.js";

// ----------------------------Schedule--------------------------------------------

export async function upsertSchedule(req, res) {
  await delay(1000);
  if (!req.body.clinic && !req.body.lab)
    return res.status(400).json({ msg: "Thiếu thông tin" });
  try {
    if (req.body.lab) {
    } else {
      if (req.body.clinic)
        await Schedule.deleteMany({ doctor: data.clinic, date: data.date });
      if (req.body.lab)
        await Schedule.deleteMany({ doctor: data.lab, date: data.date });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ msg: `Đã xóa không thành công bác sĩ chuyên khoa ` });
  }
  return res.status(200).json({ msg: `Đã xóa thành công bác sĩ chuyên khoa ` });
}

// ----------------------------Schedule--------------------------------------------

// ----------------------------Doctor--------------------------------------------

export async function editDoctor(req, res) {
  await delay(1000);
  console.log(req.body._id);

  if (!req.body.name || !req.body.specialty || !req.body.clinic)
    return res.status(400).json({ msg: "Thiếu thông tin" });
  try {
    await Doctor.updateOne(
      { _id: req.body._id },
      {
        name: req.body.name,
        age: req.body.age,
        address: req.body.address,
        phone: req.body.phone,
        email: req.body.email,
        position: req.body.position,
        description: req.body.description,
        image: req.body.image,
        specialty: req.body.specialty,
        clinic: req.body.clinic,
      }
    );
    await Clinic.updateMany(
      { doctor: req.body._id },
      { $unset: { doctor: "" } }
    );
    let clinic = await Clinic.findById(req.body.clinic);
    clinic.set({ doctor: req.body._id });
    console.log(clinic.doctor);
    await clinic.save();
  } catch (e) {
    console.log(e);
    return res.status(400).json({ msg: `Đã lưu thay đổi không thành công` });
  }
  return res.status(200).json({ msg: `Đã lưu thay đổi thành công` });
}

export async function deleteDoctor(req, res) {
  await delay(1000);
  if (!req.query._id || !req.query.clinicId)
    return res.status(400).json({ msg: "Thiếu thông tin" });
  try {
    await Doctor.deleteOne({ _id: req.query._id });
    await Clinic.updateMany(
      { _id: req.query.clinicId },
      { $unset: { doctor: "" } }
    );
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ msg: `Đã xóa không thành công bác sĩ chuyên khoa ` });
  }
  return res.status(200).json({ msg: `Đã xóa thành công bác sĩ chuyên khoa ` });
}

export async function createDoctor(req, res) {
  await delay(1000);
  try {
    if (!req.body.name || !req.body.specialty || !req.body.clinic)
      return res.status(400).json({ msg: "Thiếu thông tin" });
    let newDoctor = new Doctor({
      name: req.body.name,
      age: req.body.age,
      address: req.body.address,
      phone: req.body.phone,
      email: req.body.email,
      position: req.body.position,
      description: req.body.description,
      image: req.body.image,
      specialty: req.body.specialty,
      clinic: req.body.clinic,
    });
    let clinic = await Clinic.findById(req.body.clinic);
    clinic.doctor = newDoctor._id;
    await newDoctor.save();
    await clinic.save();
  } catch (e) {
    return res.status(400).json({ msg: `Đã có lỗi xảy ra!` });
  }
  return res.status(200).json({ msg: `Đã tạo thành công bác sĩ chuyên khoa` });
}

// ----------------------------Doctor--------------------------------------------

// ----------------------------------- Lab -----------------------------------------

export async function editLab(req, res) {
  await delay(1000);
  if (!req.body._id || !req.body.user)
    return res.status(400).json({ msg: "Thiếu thông tin" });
  try {
    await Lab.updateOne(
      { _id: req.body._id },
      {
        name: req.body.name,
        room: req.body.room,
        address: req.body.address,
        hospital: req.body.hospital,
        province: req.body.province,
        image: req.body.image,
        description: req.body.description,
        type: req.body.type,
      }
    );
    await User.updateOne(
      { _id: req.body.user._id },
      {
        username: req.body.user.username,
        password: req.body.user.password,
      }
    );
  } catch (e) {
    console.log(e);
    return res.status(400).json({ msg: `Đã lưu thay đổi không thành công` });
  }
  return res.status(200).json({ msg: `Đã lưu thay đổi thành công` });
}

export async function createLab(req, res) {
  await delay(1000);
  if (!req.body.username || !req.body.password || !req.body.name)
    return res.status(400).json({ msg: "Thiếu thông tin" });
  let checkUser = await User.findOne({ username: req.body.username });
  let checkLab = await Lab.findOne({ name: req.body.name });
  if (checkUser)
    return res.status(400).json({ msg: `Tên tài khoản đã tồn tại` });
  if (checkLab)
    return res.status(400).json({ msg: `Tên phòng khám lâm sàng đã tồn tại` });
  let newUser = new User({
    username: req.body.username,
    password: req.body.password,
    role: "lab",
  });

  let newLab = new Lab({
    user: newUser._id,
    name: req.body.name,
    room: req.body.room,
    address: req.body.address,
    hospital: req.body.hospital,
    province: req.body.province,
    image: req.body.image,
    description: req.body.description,
    type: req.body.type,
  });
  newUser.lab = newLab._id;
  try {
    await newLab.save();
    await newUser.save();
  } catch (e) {
    return res.status(400).json({ msg: `Đã có lỗi xảy ra!` });
  }
  return res
    .status(200)
    .json({ msg: `Đã tạo thành công phòng khám chuyên khoa` });
}

export async function deleteLab(req, res) {
  await delay(1000);
  if (!req.query._id || !req.query.user._id)
    return res.status(400).json({ msg: "Thiếu thông tin" });
  try {
    await Lab.deleteOne({ _id: req.query._id });
    await User.deleteOne({ _id: req.query.user._id });
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ msg: `Đã xóa không thành công phòng khám lâm sàng` });
  }
  return res.status(200).json({ msg: `Đã xóa thành công phòng khám lâm sàng` });
}

// ----------------------------Lab--------------------------------------------

// ----------------------------Clinic--------------------------------------------

export async function editClinic(req, res) {
  await delay(1000);
  if (!req.body._id || !req.body.user)
    return res.status(400).json({ msg: "Thiếu thông tin" });
  try {
    await Clinic.updateOne(
      { _id: req.body._id },
      {
        name: req.body.name,
        room: req.body.room,
        address: req.body.address,
        hospital: req.body.hospital,
        province: req.body.province,
        image: req.body.image,
        specialty: req.body.specialty,
      }
    );
    await User.updateOne(
      { _id: req.body.user._id },
      {
        username: req.body.user.username,
        password: req.body.user.password,
      }
    );
  } catch (e) {
    console.log(e);
    return res.status(400).json({ msg: `Đã lưu thay đổi không thành công` });
  }
  return res.status(200).json({ msg: `Đã lưu thay đổi thành công` });
}

export async function deleteClinic(req, res) {
  await delay(1000);
  if (!req.query._id || !req.query.user._id)
    return res.status(400).json({ msg: "Thiếu thông tin" });
  try {
    await Clinic.deleteOne({ _id: req.query._id });
    await User.deleteOne({ _id: req.query.user._id });
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ msg: `Đã xóa không thành công phòng khám lâm sàng` });
  }
  return res
    .status(200)
    .json({ msg: `Đã xóa thành công phòng khám chuyên khoa` });
}

export async function createClinic(req, res) {
  await delay(1000);
  if (!req.body.username || !req.body.password || !req.body.name)
    return res.status(400).json({ msg: "Thiếu thông tin" });
  let checkUser = await User.findOne({ username: req.body.username });
  let checClinic = await Clinic.findOne({ name: req.body.name });
  if (checkUser)
    return res.status(400).json({ msg: `Tên tài khoản đã tồn tại` });
  if (checClinic)
    return res
      .status(400)
      .json({ msg: `Tên phòng khám chuyên khoa đã tồn tại` });
  let newUser = new User({
    username: req.body.username,
    password: req.body.password,
    role: "clinic",
  });

  let newClinic = new Clinic({
    user: newUser._id,
    name: req.body.name,
    room: req.body.room,
    address: req.body.address,
    hospital: req.body.hospital,
    province: req.body.province,
    image: req.body.image,
    specialty: req.body.specialty,
  });
  newUser.clinic = newClinic._id;
  try {
    await newClinic.save();
    await newUser.save();
  } catch (e) {
    return res.status(400).json({ msg: `Đã có lỗi xảy ra!` });
  }

  return res
    .status(200)
    .json({ msg: `Đã tạo thành công phòng khám chuyên khoa` });
}

// ----------------------------Clinic--------------------------------------------

// ----------------------------Specialty--------------------------------------------

export async function deleteSpecialty(req, res) {
  await delay(1000);
  if (!req.query._id) return res.status(400).json({ msg: "Thiếu thông tin" });
  await Specialty.deleteOne({ _id: req.query._id });
  return res.status(200).json({ msg: `Đã xóa thành công chuyên khoa` });
}

export async function editSpecialty(req, res) {
  await delay(1000);
  if (
    !req.body._id ||
    !req.body.name ||
    !req.body.description ||
    !req.body.image
  )
    return res.status(400).json({ msg: "Thiếu thông tin" });
  let name = req.body.name.trim();
  let description = req.body.description.trim();
  let image = req.body.image.trim();
  await Specialty.updateOne(
    { _id: req.body._id },
    { name, description, image }
  );
  return res.status(200).json({ msg: `Đã lưu thay đổi thành công` });
}

export async function createSpecialty(req, res) {
  await delay(1000);
  if (!req.body.name || !req.body.description || !req.body.image)
    return res.status(400).json({ msg: "Thiếu thông tin" });
  let name = req.body.name.trim();
  let description = req.body.description.trim();
  let image = req.body.image.trim();
  let checkSpecialty = await Specialty.findOne({ name });
  if (!checkSpecialty) {
    let newSpecialty = new Specialty({
      name,
      description,
      image,
    });
    await newSpecialty.save();
    return res
      .status(200)
      .json({ msg: `Đã tạo thành công chuyên khoa: ${name}` });
  } else {
    return res
      .status(400)
      .json({ msg: `Chuyên khoa "${name}" đã tồn tại trên hệ thống` });
  }
}

// ----------------------------Specialty--------------------------------------------
