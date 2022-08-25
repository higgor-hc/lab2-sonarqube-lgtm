const express = require('express');
const app = express();
const port = 3000;
var crypto = require('crypto'),
password = getPassword();

function encrypt(text){
  var cipher = crypto.createCipher('aes-256-ctr', password);
  return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
}

const db = require("./db");

// set up rate limiter: maximum of five requests per minute
var RateLimit = require('express-rate-limit');
var limiter = new RateLimit({
  windowMs: 1*60*1000, // 1 minute
  max: 5
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello World!'})
});

app.use(limiter);
app.post('/auth', async (req, res, next) => {
  const users = await db.selectUserByLogin(req.body.user, encrypt(req.body.password));
  if(users.length){
    res.send("Login Success");
  }else{
    res.send("401 - Unauthorized");
  }
});

let server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

module.exports  = server;