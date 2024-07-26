const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const indexRouter = require("./routes/index.js");
const loginRouter = require("./routes/login.js");
//const loginOauthRouter = require("./routes/loginOauth.js")
//const productsRouter = require("./routes/products");
const repasswordRouter = require("./routes/repassword");
const selroleRouter = require('./routes/selrole.js');
const postRouter = require('./routes/post.js');
const userRouter = require('./routes/user');
const joinRouter = require('./routes/join.js');
//const { swaggerUi, swaggerSpec } = require("./swagger.js");

dotenv.config();

const app = express();
const port = 3000;

app.use(session({
  secret: 'your_secret_key', // คีย์สำหรับการเข้ารหัส session
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // ถ้าใช้ https ให้เปลี่ยนเป็น true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //แก้undefinedได้
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// ตั้งค่าไดเร็กทอรีสำหรับไฟล์สาธารณะ (static files)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ตั้งค่าไดเร็กทอรีสำหรับเทมเพลต EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ตั้งค่าเส้นทาง (routes)
app.use("/post", postRouter);
app.use("/role", selroleRouter);
app.use("/repass", repasswordRouter);
app.use("/", indexRouter);
//app.use("/products", productsRouter);
app.use("/login", loginRouter);
app.use("/user", userRouter);
app.use("/join", joinRouter);

//app.use("/loginOauth", loginOauthRouter)
//app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}/`);
});
