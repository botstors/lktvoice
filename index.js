const express = require("express");
const app = express();
const Botly = require("botly");
const https = require("https");
const axios = require('axios');
const qs = require('qs');
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


    const msg = message.message.text;

    const run = async () => {
      const data = {
        user_id: 0,
        token: 0,
        msg: [{ content: msg, role: 'user' }],
        model: 'gpt-3.5-turbo',
      };

      try {
        const response = await axios.post(`https://www.yuxin-ai.com/fastapi/api/chat`, data, {
          headers: {
            'accept-language': 'en,ar-DZ;q=0.9,ar;q=0.8',
            'content-type': 'application/json',
          },
        });

        const lines = response.data.split('\n');
        let concatenatedContent = '';

        lines.forEach(line => {
          const match = line.match(/"content": "([^"]*)"/);
          if (match && match[1]) {
            const content = match[1];
            const decodedContent = content.replace(/\\u[\dA-F]{4}/gi, match =>
              String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16))
            );
            const processedContent = decodedContent.replace(/\\n/g, '\n');
            concatenatedContent += processedContent;
          }
        });

        botly.sendText({ id: senderId, text: concatenatedContent });

      } catch (error) {
        console.error('Error fetching data:', error);
        botly.sendText({ id: senderId, text: 'Sorry, something went wrong. Please try again later.' });
      }
    };

    run();



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
      botly.sendButtons({
    
        
      });


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
