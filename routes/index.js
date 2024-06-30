const express = require("express")
const router = express.Router();

router.get('/', (req, res) => {
    res.render('login.ejs');
  });

router.get('/home', (req, res) => {
    res.render('home.ejs');
  });

router.get('/register', (req,res) =>{
  res.render('register.ejs');
})

router.get('/repassword', (req,res) =>{
  res.render('repassword.ejs');
})

router.get('/newpassword', (req,res) =>{
  res.render('newpassword.ejs');
})

module.exports = router;