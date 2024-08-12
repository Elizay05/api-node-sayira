const mongoose = require('mongoose');
require('dotenv').config();

const URI = `mongodb+srv://${process.env.USERBD}:${process.env.PASSWORDBD}@adso2669736.kxt4qr6.mongodb.net/${process.env.BD}?retryWrites=true&w=majority`;

mongoose.connect(URI);

module.exports = mongoose;
