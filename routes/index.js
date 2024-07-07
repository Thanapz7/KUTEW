const express = require("express")
const router = express.Router();

router.get('/', (req, res) => {
    res.render('pages/login.ejs');
  });

router.get('/home', (req, res) => {
    res.render('pages/home.ejs');
  });

  router.get('/selrole', (req, res) => {
    res.render('pages/selrole.ejs');
  });

router.get('/register', (req,res) =>{
  res.render('pages/register.ejs');
})

router.get('/joinclass', (req,res) =>{
  res.render('pages/joinclass.ejs');
})

router.get('/repassword', (req,res) =>{
  res.render('pages/repassword.ejs');
})

router.get('/newpassword', (req,res) =>{
  res.render('pages/newpassword.ejs');
})

module.exports = router;