const express = require("express")
const router = express.Router();

router.get('/', (req, res) => {
    res.render('pages/login.ejs');
  });

router.get('/home', (req, res) => {
   if (!req.session.user) {
    return res.status(401).json({ error: 'User not logged in' });
  }
  res.render('pages/home.ejs');
  });

  router.get('/selrole', (req, res) => {
    res.render('pages/selrole.ejs');
  });

router.get('/register', (req,res) =>{
  res.render('pages/register.ejs');
})

router.get('/repassword', (req,res) =>{
  res.render('pages/repassword.ejs');
})

router.get('/newpassword', (req,res) =>{
  res.render('pages/newpassword.ejs');
})

router.get('/registteacher', (req,res) =>{
  res.render('pages/registteacher.ejs');
})

router.get('/regisstu', (req,res) =>{
  res.render('pages/regisstu.ejs');
})

router.get('/createpost', (req,res) =>{
  res.render('pages/createpost.ejs');
})

module.exports = router;