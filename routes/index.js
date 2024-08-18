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

router.get('/profilepage', (req,res) =>{
  res.render('pages/profilepage.ejs');
})

router.get('/mypost', (req,res) =>{
  res.render('pages/mypost.ejs');
})
router.get('/setting', (req,res) =>{
  res.render('pages/setting.ejs');
})
router.get('/search', (req, res) => {
  res.render('pages/search.ejs',{ pageTitle: 'Search' });
});
router.get('/joinclass', (req, res) => {
  const userId = req.session.user.user_id;
  res.render('pages/joinclass.ejs',{ userId,pageTitle: 'Join Class' });
});

router.get('/joinrequest', (req, res) => {
  res.render('pages/joinrequest.ejs',{ pageTitle: 'Join Class' });
});

router.get('/demonoti', (req, res) => {
  // ดึงค่า userId จาก session ที่เก็บไว้
  const userId = req.session.user.user_id;
  res.render('pages/demonoti.ejs',{ userId, pageTitle: 'Notifications' });
});

router.get('/profile/:id', (req, res) => {
  // ดึงค่า userId จาก session ที่เก็บไว้
  const userId = req.params.id;
  res.render('pages/profile.ejs', { userId: userId });
});


module.exports = router;