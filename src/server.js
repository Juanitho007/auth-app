const app = require('./app');
const sequelize = require('./utils/connection');

const PORT = process.env.PORT || 8080;

const main = async () => {
    try {
        sequelize.sync(/* {alter:true} */);
        console.log("DB connected");
        app.listen(PORT);
        console.log(`http:\\localhost:${PORT}`)
    } catch (error) {
        console.log(error)
    }
}

main();
