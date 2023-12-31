const express = require('express');
//const morgan = require('morgan');
const app = express();
const port = 3000;
const connect = require("./schemas");
connect();

//const customLogFormat = ':method :url :status :res[content-length] - :response-time ms';
//app.use(morgan('combined'));

const jwt = require('jsonwebtoken');
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const Error = require("./schemas/Error.js");
const Access = require("./schemas/access.js");

const CommentRouter = require("./routes/comment.js");
const postRouter = require("./routes/post.js");
const userRouter = require("./routes/user.js");
const loginRouter = require("./routes/login.js");

const {Common} = require("./routes/Class/Common.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const { swaggerUi, specs } = require("./routes/swagger/swagger.js");

const {final} = require("./routes/Class/Final.js");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use((req, res, next) => {
    const date = new Date();
    const clientIp = req.ip;
    const proxyIps = req.ips;
    const {password, ...paramsWithoutPassword} = req.body;
    const method = req.method;
    const url = req.url;
    const agent = req.headers['user-agent'];

    try {
        const user = jwt.verify(req.cookies.jwt, SECRET_KEY).user_id;

        if(!Common.isEmpty(user)){
            // 나중에 Access에 대해서 필요한 것인가에 대해서 생각은 해봐야할듯?
            // 쿼리 스트링으로 들어오는 변수는 제외했네
            Access.create({
                "user"    : user,
                "method"  : method,
                "agent"   : agent,
                "params"  : paramsWithoutPassword,
                "url"     : url,
                "clientIp": clientIp,
                "proxyIp" : proxyIps
            });
        }

    } catch(err){
        // 요청에 대한 db 에러는 처리 안하고 그대로 넘어가야할 것 같은데
        // Client 요청을 insert 하는 과정에서 나는 서버 에러가 Client 요청에 영향을 끼치면 안되지 않나?
        // next(err);
        // return;
    }

    const keys = Object.keys(paramsWithoutPassword);
    var params = "";

    if(keys.length !== 0){
        params = "=============== [ Parameters ] ===============\n";

        keys.forEach((key) => {
            const value = paramsWithoutPassword[key];
            params += `\t${key} = ${value}\n`;
        });
    }

    console.log(`
    =============== [${method}] ${url} ===============
    date     : ${date}
    agent    : ${agent}
    client Ip: ${clientIp}
    proxy Ips: ${proxyIps}
    ${params}
    `);
    
    next();
});

app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/comment", CommentRouter);
app.use("/log", loginRouter);

// GET 요청 처리
app.get('/', (req, res) => {
    res.send('Hello World (GET)!');
});

// POST 요청 처리
// redirect는 GET아닌가? 왜 여기로 들어오지???
app.post('/', (req, res) => {
    res.send('Hello World (POST)!');
});

//  404 responses
app.use(function(req, res, next) {
    res.status(404).send("404 Not Found");
});

// error-handling middleware
app.use((err, req, res, next) => {
    const clientIp = req.ip;
    const proxyIps = req.ips;

    console.log(err.stack);

    try {
        Error.create({
          "url"     : req.url,
          "method"  : req.method,
          "clientIp": clientIp,
          "proxyIp" : proxyIps,
          "name"    : err.name,
          "msg"     : err.stack,
          "stack"   : err.message
        })
    } catch(err){

    }

    res.json({"success": false, "msg": err.message})
       .status(500)
       .send(err.message);
})

app.listen(port, () => {
    console.log(`서버가 port number: ${port} 에서 실행 중입니다.`);
});