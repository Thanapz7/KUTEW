const express = require("express")
const router = express.Router();
const recordUserActivity = require('../middleware');

router.get('/', (req, res) => {
    res.render('pages/login.ejs',{ pageTitle: 'Login' });
  });

  router.get('/home', recordUserActivity, (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ error: 'User not logged in' });
    }
  
    res.render('pages/home.ejs', { pageTitle: 'Home' });
  });
  

  router.get('/selrole', (req, res) => {
    res.render('pages/selrole.ejs',{ pageTitle: 'Selrole' });
  });

router.get('/register', (req,res) =>{
  res.render('pages/register.ejs',{ pageTitle: 'Register' });
})

router.get('/repassword', (req,res) =>{
  res.render('pages/repassword.ejs',{ pageTitle: 'Repassword' });
})

router.get('/newpassword', (req,res) =>{
  res.render('pages/newpassword.ejs',{ pageTitle: 'Repassword' });
})

router.get('/registteacher', (req,res) =>{
  res.render('pages/registteacher.ejs',{ pageTitle: 'Register' });
})

router.get('/regisstu', (req,res) =>{
  res.render('pages/regisstu.ejs',{ pageTitle: 'Register' });
})

router.get('/createpost', (req,res) =>{
  res.render('pages/createpost.ejs',{ pageTitle: 'Creatpost' });
})

router.get('/profilepage', (req,res) =>{
  res.render('pages/profilepage.ejs',{ pageTitle: 'Profile' });
})

router.get('/mypost', (req,res) =>{
  res.render('pages/mypost.ejs',{ pageTitle: 'Mypost' });
})
router.get('/setting', (req,res) =>{
  res.render('pages/setting.ejs',{ pageTitle: 'Setting' });
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

router.get('/joinrequest/:id', (req, res) => {
  const userId = req.params.id;
  res.render('pages/joinrequest.ejs',{ userId: userId , pageTitle: 'Join Class' });
});

router.get('/notifications', (req, res) => {
  // ดึงค่า userId จาก session ที่เก็บไว้
  const userId = req.session.user.user_id;
  res.render('pages/notifications.ejs',{ userId, pageTitle: 'Notifications' });
});

router.get('/profiletutor/:id', (req, res) => {
  // ดึงค่า userId จาก session ที่เก็บไว้
  const userId = req.params.id;
  res.render('pages/profiletutor.ejs', { userId: userId, pageTitle: 'Profile' });
});

router.get('/profilestd/:id', (req, res) => {
  // ดึงค่า userId จาก session ที่เก็บไว้
  const userId = req.params.id;
  res.render('pages/profilestd.ejs', { userId: userId, pageTitle: 'Profile' });
});

router.get('/payment/:tutor_id/:post_id', (req, res) => {
  const post_id = req.params.post_id;
  const tutor_id = req.params.tutor_id;
  const userId = req.session.user.user_id;
  res.render('pages/payment.ejs',{ post_id, tutor_id, userId, pageTitle: 'Payment' });
});

router.get('/myjoin', (req, res) => {
  res.render('pages/myjoinrequested.ejs',{ pageTitle: 'Join Request' });
});

router.get('/chat', (req, res) => {
  const userId = req.session.user.user_id;
  res.render('pages/chat.ejs',{userId, pageTitle: 'Chat' });
});

router.get('/admin', (req,res) =>{
  res.render('pages/adChartHome.ejs');
})

router.get('/tutorrequest', (req,res) =>{
  res.render('pages/adTutorreq.ejs');
})

router.get('/chatadmin', (req,res) =>{
  res.render('pages/adChat.ejs');
})

router.get('/reportadmin', (req,res) =>{
  res.render('pages/adReport.ejs');
})



module.exports = router;