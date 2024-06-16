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
msgDev = `مرحبا بك في بوت LktText \n الذي يقوم بتحويل  المقطع الصوتي الى نص\n قم باعادة توجيه صوت من اي محادثة الى البوت وسيتم تحويل \n اذا واجهت اي مشكلة اتصل بالمطور \n حساب المطور 👇\n https://www.facebook.com/salah.louktaila`
let msgVoice
botly.on("message", async (senderId, message) => {
  console.log(senderId)
  
  if (message.message.text) {



    if (message.message.text.startsWith("wiki:")) {
      var msg = message.message.text.replace("wiki:", "")
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
    }

    else if (message.message.text.startsWith("صوت:")) {
      msgstart = "يمكنك الان ان تسمع الكلمات بصوت وضح \n وجميل ويمكنك اختيار العديد\n من الاصوات رجال ونساء \n اختر اي شخصية لتسمع كماتك بصوتها \n الحد الاقصى 1000 حرف \n قم بمتابعة المطور 👇\n https://www.facebook.com/salah.louktaila"
      msgVoice = message.message.text.replace("صوت:", "")
      console.log(msgVoice)
      alloy = "alloy"
      echo = "echo"
      fable = "fable"
      nova = "nova"
      shimmer = "shimmer"
      botly.sendText({
        id: senderId,
        text: msgstart,
        quick_replies: [
          botly.createQuickReply("نور", alloy),
          botly.createQuickReply("ايمن", echo),
          botly.createQuickReply("مراد", fable),
          botly.createQuickReply("اميرة", nova),
          botly.createQuickReply("سميرة", shimmer),
        ]
      });
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
console.log(`text :${msgVoice}`)
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
    
    if (message.message.text == "نور" || message.message.text == "ايمن" || message.message.text == "مراد" || message.message.text == "اميرة" || message.message.text == "سميرة") {
      botly.sendText({ id: senderId, text: `انتظر ${message.message.text} تقوم بارسل صوتها` });
      console.log(postback);



      TextToVoice(msgVoice, postback)
        .then(url => {
          if (url) {
            console.log(msgVoice)
            botly.sendAttachment({
              id: senderId,
              type: Botly.CONST.ATTACHMENT_TYPE.AUDIO,
              payload: {
                url: url
              }
            }, (err, data) => {
              if (err) {
                console.error('Error sending attachment:', err);
              } else {
                console.log('Attachment sent successfully:', data);
              }
            });

          } else {
            console.log("Failed to generate URL");
          }
        })
        .catch(error => {
          console.error("Error generating voice:", error);
        });




      /*  var echo = TextToVoice(msg, "Echo");
        var fable = TextToVoice(msg, "Fable");
        var nova = TextToVoice(msg, "Nova");
        var shimmer = TextToVoice(msg, "Shimmer");*/

    } else if (postback == "up" || postback == "down") {
      botly.sendText({ id: senderId, text: "شكرا لترك التقييم ♥" });
    } else if (postback == "followup") {
      botly.sendText({ id: senderId, text: "جاري العمل عليها..." });
    }
  }
});
/* ---- PING ---- */


function TextToVoice(text, nameVoicer) {
  const url = "https://ttsmp3.com/makemp3_ai.php";
  const data = new URLSearchParams({
    "msg": text,
    "lang": nameVoicer,
    "speed": "1.00",
    "source": "ttsmp3"
  });

  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then(response => {
        try {
          const responseJson = response.data;
          console.log("Response JSON:", responseJson["URL"]);
          resolve(responseJson["URL"]);
        } catch (error) {
          console.log("Response is not in JSON format");
          reject(error);
        }
      })
      .catch(error => {
        console.error("Error:", error);
        reject(error);
      });
  });
}


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
