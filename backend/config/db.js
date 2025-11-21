const mongoose = require('mongoose');

// ... dotenv.config() is already called at the top of server.js

const DB = process.env.DATABASE_LOCAL;

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('DB connection successful!');
});
