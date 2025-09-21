const mongoose = require('mongoose');

const uri = "mongodb+srv://<eliam>:<forme>@cluster0.xxxxx.mongodb.net/tuBase?retryWrites=true&w=majority";

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Conectado a MongoDB Atlas"))
.catch(err => console.error("❌ Error de conexión:", err));
