const catchError = require("../utils/catchError");
const Report = require("../models/Report");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinary");

const getAll = catchError(async (req, res) => {
  if (req.user.isAdmin) {
    const results = await Report.findAll();
    return res.json(results);
  }
  if (!req.user.isAdmin) {
    const results = await Report.findAll({ where: { userId: req.user.id } });
    return res.json(results);
  }
});

const create = catchError(async (req, res) => {
  const userId = req.user.id;
  const { name, priority, state, description } = req.body;
  const file = req.file;
  const { url } = await uploadToCloudinary(file);
  if (!req.user.isAdmin) {
    const result = await Report.create({
      name,
      priority,
      state: "new",
      description,
      evidence:url,
      userId,
    });
  }
  if (req.user.isAdmin) {
    const result = await Report.create({
      name,
      priority,
      state,
      description,
      evidence: url,
      userId,
    });
    return res.status(201).json(result);
  }
});

const getOne = catchError(async (req, res) => {
  if (req.user.isAdmin !== null) {
    const { id } = req.params;
    const result = await Report.findByPk(id);
    if (!result) return res.sendStatus(404);
    return res.json(result);
  }
});

const remove = catchError(async (req, res) => {
  if (req.user.isAdmin !== null) {
    const { id } = req.params;
    const report = await Report.findByPk(id);
    await deleteFromCloudinary(report.evidence);
    await report.destroy();
    return res.sendStatus(204);
  }
});

const update = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await Report.update(req.body, {
    where: { id },
    returning: true,
  });
  if (result[0] === 0) return res.sendStatus(404);
  return res.json(result[1][0]);
});

module.exports = {
  getAll,
  create,
  getOne,
  remove,
  update,
};
