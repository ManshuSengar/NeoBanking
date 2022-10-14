const express = require('express')
const app = express()
const PORT = process.env.PORT || 5010;
const common = require('./routes/common');
const { v4: uuidv4 } = require('uuid');
var bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors())
app.use(express.json())
app.use(express.static('public'));
app.use(bodyParser.json());
app.use('/common', common);

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.send('hello');
})
app.listen(PORT, () => {
    console.log('App running on port', PORT)
})