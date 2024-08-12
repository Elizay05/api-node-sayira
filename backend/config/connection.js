const mongoose = require('mongoose');
require('dotenv').config();

const URI = `mongodb+srv://${process.env.USERBD}:${process.env.PASSWORDBD}@adso2669736.cdhps8h.mongodb.net/${process.env.BD}?retryWrites=true&w=majority`;

mongoose.connect(URI);

module.exports = mongoose;
