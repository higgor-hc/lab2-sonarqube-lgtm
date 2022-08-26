const express = require('express');
const app = express();
const port = 3000;
let crypto = require('crypto');
let RateLimitInfo = require('express-rate-limit');
let salt = 'salt';

function encrypt(text){
  let cipher = crypto.createCipheriv('aes-256-ctr', salt);
  return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
}

const db = require("./db");

let limiter = RateLimitInfo({
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