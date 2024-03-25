const Report = require("./Report");
const ResetCode = require("./ResetCode");
const User = require("./User");

/*Un reporte solo puede pertenecer a un usuario, pero un usuario puede tener muchos reportes */
Report.belongsTo(User);
User.hasMany(Report);

/* Relacion uno a uno */
ResetCode.belongsTo(User);
User.hasOne(ResetCode)
