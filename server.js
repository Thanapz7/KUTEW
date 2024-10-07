const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const socketIo = require('socket.io');
const http = require('http');
const socketHandler = require('./socket');
const sharedSession = require('socket.io-express-session');
const db = require("./db");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIo(server);

// ตั้งค่า session middleware
const sessionMiddleware = session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // ตั้งค่า secure เป็น true ถ้าใช้ HTTPS
});

app.use(sessionMiddleware);
// แชร์ session กับ socket.io
io.use(sharedSession(sessionMiddleware, {
  autoSave: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
// แนบ io ไปยัง req
app.use((req, res, next) => {
  req.io = io; // แนบ io ไปยัง req
  next();
});


// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/QRcode', express.static(path.join(__dirname, 'QRcode')));
app.use('/payment', express.static(path.join(__dirname, 'payment')));

// Views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
const indexRouter = require("./routes/index.js");
const loginRouter = require("./routes/login.js");
const repasswordRouter = require("./routes/repassword");
const selroleRouter = require('./routes/selrole.js');
const postRouter = require('./routes/post.js');
const userRouter = require('./routes/user');
const joinRouter = require('./routes/join.js');
const notificationRouter = require('./routes/notifications.js');
const chatRouter = require('./routes/chat.js');
const adminRouter = require('./routes/admin.js');
const commentRouter = require('./routes/comment.js');
const { swaggerUi, swaggerSpec } = require("./swagger.js");

app.use("/post", postRouter);
app.use("/role", selroleRouter);
app.use("/repass", repasswordRouter);
app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/user", userRouter);
app.use("/join", joinRouter);
app.use(notificationRouter);
app.use("/chat", chatRouter);
app.use("/admin", adminRouter);
app.use("/comment", commentRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Socket.IO setup
socketHandler(io, db);

server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}/`);
});
