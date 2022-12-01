const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/noderest', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
.then(() => console.log('DB Connected'))
.catch(error => {
    console.log(`DB Connection Error: ${error.message}`);
});;

mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;

module.exports = mongoose;