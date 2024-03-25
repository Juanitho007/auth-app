const catchError = require("../utils/catchError");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const ResetCode = require("../models/ResetCode");

const getAll = catchError(async (req, res) => {
  if (req.user.isAdmin) {
    const results = await User.findAll();
    return res.json(results);
  } else return res.sendStatus(404);
});

const createAdmin = catchError(async (req, res) => {
  const { name, email, password } = req.body;
  const encriptedPassword = await bcrypt.hash(password, 10);
  const result = await User.create({
    name,
    email,
    password: encriptedPassword,
    isAdmin: true,
  });
  await sendEmail({
    to: email,
    subject: "Cuenta de administrador creada con éxito 🥳",
    html: `
    <div
      style="
        max-width: 600px;
        margin: 0 auto;
        padding: 40px;
        background-color: rgb(245 245, 245);
        border-radius: 40px;
        min-height: calc(100vh - 100px);
      "
      ;
    >
      <header>
        <img
          src="http://cdn.mcauto-images-production.sendgrid.net/ca3921367677ec93/67e398cb-00f7-49c6-b97f-713e4f6cfe0b/160x64.png"
        />
      </header>
      <body>
        <h1>Cuenta creada exitosamente</h1>
        <p>
Hola ${name}, tu cuenta con privilegios de administrador fue creada de manera exitosa, por lo que ahora podrás ver todos los usuarios y reportes existentes, así como gestionar todos los datos relacionados.
        </p>
        <div style=" padding-top: 20px; ">        <a
          style="
            background-color: #cc1530;
            padding: 10px;
            border-radius: 15px;
            color: white;
            list-style: none;
            text-decoration: none;
          "
          href="#"
          >Crear reporte de falla</a
        ></div>
      </body>
    </div>
    `,
  });
  return res.status(201).json(result);
});

const create = catchError(async (req, res) => {
  const { name, email, password } = req.body;
  const encriptedPassword = await bcrypt.hash(password, 10);
  const result = await User.create({
    name,
    email,
    password: encriptedPassword,
  });
  await sendEmail({
    to: email,
    subject: "Cuenta creada con éxito 🥳",
    html: `
    <div
      style="
        max-width: 600px;
        margin: 0 auto;
        padding: 40px;
        background-color: rgb(245 245, 245);
        border-radius: 40px;
        min-height: calc(100vh - 100px);
      "
      ;
    >
      <header>
        <img
          src="http://cdn.mcauto-images-production.sendgrid.net/ca3921367677ec93/67e398cb-00f7-49c6-b97f-713e4f6cfe0b/160x64.png"
        />
      </header>
      <body>
        <h1>Cuenta creada exitosamente</h1>
        <p>
        Hola ${name}, tu cuenta fue creada exitósamente, sin embargo necesitas esperar a que un administrador la active, en cuanto el proceso finalice podrás crear reportes de las fallas del omnicanal de manera fácil.
        </p>
        <div style=" padding-top: 20px; ">        <a
          style="
            background-color: #cc1530;
            padding: 10px;
            border-radius: 15px;
            color: white;
            list-style: none;
            text-decoration: none;
          "
          href="#"
          class="cta-button"
          >Crear reporte de falla</a
        ></div>

      </body>
    </div>
    `,
  });
  return res.status(201).json(result);
});

const getOne = catchError(async (req, res) => {
  if (req.user.isAdmin !== null) {
    const { id } = req.params;
    const result = await User.findByPk(id);
    if (!result) return res.sendStatus(404);
    return res.json(result);
  } else return res.sendStatus(404);
});

const remove = catchError(async (req, res) => {
  if (req.user.isAdmin) {
    const { id } = req.params;
    await User.destroy({ where: { id } });
    return res.sendStatus(204);
  } else return res.sendStatus(404);
});

const update = catchError(async (req, res) => {
  if (req.user.isAdmin) {
    const { id } = req.params;
    const { name, email, isAdmin } = req.body;
    const result = await User.update(
      { name, email, isAdmin },
      {
        where: { id },
        returning: true,
      }
    );
    if (isAdmin) {
      await sendEmail({
        to: email,
        subject: "Recibiste privilegios de administrador 🥳",
        html: `
    <div
      style="
        max-width: 600px;
        margin: 0 auto;
        padding: 40px;
        background-color: rgb(245 245, 245);
        border-radius: 40px;
        min-height: calc(100vh - 100px);
      "
      ;
    >
      <header>
        <img
          src="http://cdn.mcauto-images-production.sendgrid.net/ca3921367677ec93/67e398cb-00f7-49c6-b97f-713e4f6cfe0b/160x64.png"
        />
      </header>
      <body>
        <h1>Cuenta con nuevos privilegios.</h1>
        <p>
        Hola ${name}, tu cuenta recibió privilegios de administrador, por lo que ahora podrás ver todos los usuarios y reportes existentes, así como gestionar todos los datos relacionados.
        </p>
        <div style=" padding-top: 20px; ">        <a
          style="
            background-color: #cc1530;
            padding: 10px;
            border-radius: 15px;
            color: white;
            list-style: none;
            text-decoration: none;
          "
          href="#"
          class="cta-button"
          >Crear reporte de falla</a
        ></div>

      </body>
    </div>
    `,
      });
    }
    if (!isAdmin) {
      await sendEmail({
        to: email,
        subject: "Cuenta activada con éxito 🥳",
        html: `
    <div
      style="
        max-width: 600px;
        margin: 0 auto;
        padding: 40px;
        background-color: rgb(245 245, 245);
        border-radius: 40px;
        min-height: calc(100vh - 100px);
      "
      ;
    >
      <header>
        <img
          src="http://cdn.mcauto-images-production.sendgrid.net/ca3921367677ec93/67e398cb-00f7-49c6-b97f-713e4f6cfe0b/160x64.png"
        />
      </header>
      <body>
        <h1>Cuenta activada exitosamente</h1>
        <p>
        Hola ${name}, tu cuenta fue activada existosamente, ahora puedes crear reportes de las fallas del omnicanal de manera fácil.
        </p>
        <div style=" padding-top: 20px; ">        <a
          style="
            background-color: #cc1530;
            padding: 10px;
            border-radius: 15px;
            color: white;
            list-style: none;
            text-decoration: none;
          "
          href="#"
          class="cta-button"
          >Crear reporte de falla</a
        ></div>

      </body>
    </div>
    `,
      });
    }
    if (result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
  } else return res.sendStatus(404);
});

const login = catchError(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ message: "Credenciales invalidas" });
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid)
    return res.status(401).json({ message: "Credenciales invalidas" });
  const token = jwt.sign({ user }, process.env.TOKEN_SECRET, {
    expiresIn: "1d",
  });
  return res.json({ user, token });
});

const getLoggedUser = catchError(async (req, res) => {
  return res.json(req.user);
});

const resetPassword = catchError(async (req, res) => {
  const { baseUrl, email } = req.body;
  const result = await User.findOne({ where: { email: email } });
  if (!result) return res.sendStatus(404);
  const code = require("crypto").randomBytes(64).toString("hex");
  const link = `${baseUrl}/${code}`;
  await ResetCode.create({
    code,
    userId: result.id,
  });
  await sendEmail({
    to: email,
    subject: "Restablecer contraseña 🔒",
    html: `
    <div
      style="
        max-width: 600px;
        margin: 0 auto;
        padding: 40px;
        background-color: rgb(245 245, 245);
        border-radius: 40px;
        min-height: calc(100vh - 100px);
      "
      ;
    >
      <header>
        <img
          src="http://cdn.mcauto-images-production.sendgrid.net/ca3921367677ec93/67e398cb-00f7-49c6-b97f-713e4f6cfe0b/160x64.png"
        />
      </header>
      <body>
        <h1>Has solicitado restablecer tu contraseña</h1>
        <p>
Hola ${result.name}, recientemente recibimos una solicitud para restablecer tu contraseña por favor dale click al botón o visita el siguiente enlace:
<br>
<a href="${link}" >${link}</a>
        </p>
        <div style=" padding-top: 20px; ">        <a
          style="
            background-color: #cc1530;
            padding: 10px;
            border-radius: 15px;
            color: white;
            list-style: none;
            text-decoration: none;
          "
          href="${link}"
          >Restablecer contraseña</a
        ></div>
      </body>
    </div>
    `,
  });
  return res.status(201).json(result);
});

const changePassword = catchError(async (req, res) => {
  const { code } = req.params;
  const resetCode = await ResetCode.findOne({ where: { code: code } });
  if (!resetCode) return res.status(401).json({ message: "Código inválido" });
  const { baseUrl, password } = req.body;
  const encriptedPassword = await bcrypt.hash(password, 10);
  const user = await User.update(
    { password: encriptedPassword },
    {
      where: { id: resetCode.userId },
      returning: true,
    }
  );
  await resetCode.destroy();
  await sendEmail({
    to: user[1][0].email,
    subject: "Tu contraseña se cambió exitosamente 😊",
    html: `
    <div
      style="
        max-width: 600px;
        margin: 0 auto;
        padding: 40px;
        background-color: rgb(245 245, 245);
        border-radius: 40px;
        min-height: calc(100vh - 100px);
      "
      ;
    >
      <header>
        <img
          src="http://cdn.mcauto-images-production.sendgrid.net/ca3921367677ec93/67e398cb-00f7-49c6-b97f-713e4f6cfe0b/160x64.png"
        />
      </header>
      <body>
        <h1>Tienes una nueva contraseña</h1>
        <p>
Hola ${user[1][0].name}, tu contraseña se cambió correctamente, inicia sesión y continua navegando en la página:

        </p>
        <div style=" padding-top: 20px; ">        <a
          style="
            background-color: #cc1530;
            padding: 10px;
            border-radius: 15px;
            color: white;
            list-style: none;
            text-decoration: none;
          "
          href="${baseUrl}"
          >Ir al Inicio</a
        ></div>
      </body>
    </div>
    `,
  });
  return res.json(user[1][0]);
});

module.exports = {
  getAll,
  create,
  createAdmin,
  getOne,
  remove,
  update,
  login,
  getLoggedUser,
  resetPassword,
  changePassword,
};
