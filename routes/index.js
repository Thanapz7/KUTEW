const express = require("express")
const router = express.Router();

router.get('/', (req, res) => {
    res.render('pages/login.ejs');
  });

router.get('/home', (req, res) => {
    res.render('pages/home.ejs', { pageTitle: 'Home' });
  });

  router.get('/selrole', (req, res) => {
    res.render('pages/selrole.ejs');
  });

  router.get('/create-post', (req, res) => {
    res.render('pages/createpost.ejs');
  });

  router.get('/search', (req, res) => {
    res.render('pages/search.ejs',{ pageTitle: 'Search' });
  });

  router.get('/profilepage', (req, res) => {
    res.render('pages/profilepage.ejs');
  });

  router.get('/notification', (req, res) => {
    res.render('pages/notification.ejs', { pageTitle: 'Notification' });
  });

  router.get('/joinrequest', (req, res) => {
    res.render('pages/joinrequest.ejs', { pageTitle: 'My Post' });
  });

router.get('/register', (req,res) =>{
  res.render('pages/register.ejs');
})

router.get('/payment', (req,res) =>{
  res.render('pages/payment.ejs',{ pageTitle: 'Payment' });
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