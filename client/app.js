const express = require('express');
const app = express();
const cors = require('cors', { origin: '*' })

app.use(cors({ origin: '*' }));
app.use(express.static('public'))

console.log("bye")

//routes
app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/index.html');
});

//Listen on port 5000
server = app.listen( process.env.PORT || 5000);

