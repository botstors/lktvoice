const express = require("express");
const app = express();
const Botly = require("botly");
const https = require("https");
const axios = require('axios');
const qs = require('qs');
const wikipedia = require('wikipedia');
const botly = new Botly({
  accessToken: process.env.token,
  verifyToken: process.env.vtoken,
  notificationType: Botly.CONST.REGULAR,
  FB_URL: "https://graph.facebook.com/v2.6/",
});

app.get("/", function (_req, res) { res.sendStatus(200); });

app.use(express.json({ verify: botly.getVerifySignature(process.env.APP_SECRET) }));
app.use(express.urlencoded({ extended: false }));

app.use("/webhook", botly.router());
msgDev = `مرحبا بك في بوت LktText \n الذي يقوم بتحويل  المقطع الصوتي الى نص\n قم باعادة توجيه صوت من اي محادثة الى البوت وسيتم تحويل \n اذا واجهت اي مشكلة اتصل بالمطور \n حساب المطور 👇`
botly.on("message", async (senderId, message) => {
  console.log(senderId)

  if (message.message.text) {


    if (message.message.text.startsWith("wiki:")) {
      var msg = message.message.text.replace("wiki:", "")
        (async () => {
          try {
            wikipedia.setLang('ar');
            const searchTerm = msg;
            const summary = await wikipedia.summary(searchTerm);
            botly.sendText({ id: senderId, text: summary.extract });
          } catch (error) {
            if (error.type === 'disambiguation') {
              console.log(`هناك عدة مقالات تحمل هذا الاسم '${searchTerm}': ${error.title}`);
            } else if (error.type === 'not_found') {
              console.log(`لا توجد مقالة باسم '${searchTerm}'`);
            } else {
              console.log(`حدث خطأ غير متوقع: ${error.message}`);
            }
          }
        })();

    } else {
      botly.sendButtons({
        id: senderId,
        text: msgDev,
        buttons: [
          botly.createWebURLButton("حساب المطور 💻👤", "https://www.facebook.com/salah.louktaila"),

        ]
      });

    }
   

  } else if (message.message.attachments[0].payload.sticker_id) {
    botly.sendText({ id: senderId, text: "جام" });
  } else if (message.message.attachments[0].type == "image") {
    console.log(message.message.attachments[0])

    botly.sendText({ id: senderId, text: 'انتظر جاري ترجمة' });

    console.log(message.message.attachments[0].payload.url)
    let data = qs.stringify({
      'urlImage': message.message.attachments[0].payload.url
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://471d-2a01-239-22d-ae00-00-1.ngrok-free.app/receive',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        botly.sendText({ id: senderId, text: `${JSON.stringify(response.data)}` });
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });

  } else if (message.message.attachments[0].type == "audio") {
    botly.sendText({ id: senderId, text: 'انتظر جاري معالجة' });


    let data = qs.stringify({
      'url': message.message.attachments[0].payload.url
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://471d-2a01-239-22d-ae00-00-1.ngrok-free.app/receive',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        botly.sendText({ id: senderId, text: `محتوى رسالة صوتية :${JSON.stringify(response.data)}` });
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });

   

  } else if (message.message.attachments[0].type == "video") {
    console.log(message.message.attachments[0])
    botly.sendText({ id: senderId, text: "فيديو" });
  }
});

botly.on("postback", async (senderId, message, postback) => {
  if (message.postback) {
    if (postback == "") {
      //
    } else if (postback == "") {
      //
    } else if (postback == "") {
      //
    } else if (postback == "") {
      //
    } else if (postback == "") {
      //
    } else if (postback == "") {
      //
    } else if (message.postback.title == "") {
      //
    } else if (message.postback.title == "") {
      //
    } else if (message.postback.title == "") {
      //
    } else if (message.postback.title == "") {
      //
    }
  } else {
    // Quick Reply

  }
});
/* ---- PING ---- */

function keepAppRunning() {
  setInterval(() => {
    https.get(`${process.env.RENDER_EXTERNAL_URL}/ping`, (resp) => {
      if (resp.statusCode === 200) {
        console.log('Ping successful');
      } else {
        console.error('Ping failed');
      }
    });
  }, 5 * 60 * 1000);
}

app.get('/ping', (req, res) => { res.status(200).json({ message: 'Ping successful' }); });

/* ---- PING ---- */

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
  keepAppRunning();
});
