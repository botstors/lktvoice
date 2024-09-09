const express = require("express");
const app = express();
const Botly = require("botly");
const https = require("https");
const axios = require('axios');
const qs = require('qs');
const { HttpsProxyAgent } = require('https-proxy-agent');

const proxies = [

    "104.239.22.69:6447:svbwigos:xp1bnp38jghd",
    "45.151.162.238:6640:svbwigos:xp1bnp38jghd",
    "94.46.206.92:6865:svbwigos:xp1bnp38jghd",
    "103.75.229.96:5844:svbwigos:xp1bnp38jghd",
    "104.143.245.172:6412:svbwigos:xp1bnp38jghd",
    "193.161.2.228:6651:svbwigos:xp1bnp38jghd",
    "103.75.229.227:5975:svbwigos:xp1bnp38jghd",
    "45.87.69.178:6183:svbwigos:xp1bnp38jghd",
    "92.119.182.25:6670:svbwigos:xp1bnp38jghd",
    "45.117.55.70:6716:svbwigos:xp1bnp38jghd",
    "84.33.236.253:6896:svbwigos:xp1bnp38jghd",
    "103.75.229.54:5802:svbwigos:xp1bnp38jghd",
    "104.239.77.148:5871:svbwigos:xp1bnp38jghd",
    "103.75.228.14:6093:svbwigos:xp1bnp38jghd",
    "104.239.20.241:6316:svbwigos:xp1bnp38jghd",
    "168.199.159.252:6313:svbwigos:xp1bnp38jghd",
    "103.75.229.246:5994:svbwigos:xp1bnp38jghd",
    "171.22.248.41:5933:svbwigos:xp1bnp38jghd",
    "84.33.236.10:6653:svbwigos:xp1bnp38jghd",
    "194.116.249.37:5888:svbwigos:xp1bnp38jghd",
    "84.33.241.22:6379:svbwigos:xp1bnp38jghd",
    "103.75.228.1:6080:svbwigos:xp1bnp38jghd",
    "104.239.23.162:5923:svbwigos:xp1bnp38jghd",
    "206.41.175.112:6325:svbwigos:xp1bnp38jghd",
    "104.239.23.18:5779:svbwigos:xp1bnp38jghd",
    "104.239.90.164:6555:svbwigos:xp1bnp38jghd",
    "216.173.123.73:6448:svbwigos:xp1bnp38jghd",
    "193.42.224.73:6274:svbwigos:xp1bnp38jghd",
    "161.123.65.112:6821:svbwigos:xp1bnp38jghd",
    "194.116.249.65:5916:svbwigos:xp1bnp38jghd",
    "64.137.62.149:5794:svbwigos:xp1bnp38jghd",
    "171.22.248.195:6087:svbwigos:xp1bnp38jghd",
    "209.99.165.65:5970:svbwigos:xp1bnp38jghd",
    "161.123.65.1:6710:svbwigos:xp1bnp38jghd",
    "103.75.228.23:6102:svbwigos:xp1bnp38jghd",
    "103.75.229.55:5803:svbwigos:xp1bnp38jghd",
    "172.98.168.148:6795:svbwigos:xp1bnp38jghd",
    "104.239.77.28:5751:svbwigos:xp1bnp38jghd",
    "64.137.59.86:6679:svbwigos:xp1bnp38jghd",
    "154.36.110.131:6785:svbwigos:xp1bnp38jghd",
    "94.46.206.221:6994:svbwigos:xp1bnp38jghd",
    "45.43.178.196:5903:svbwigos:xp1bnp38jghd",
    "168.199.209.72:6484:svbwigos:xp1bnp38jghd",
    "168.199.209.251:6663:svbwigos:xp1bnp38jghd",
    "84.33.210.40:5974:svbwigos:xp1bnp38jghd",
    "45.87.69.194:6199:svbwigos:xp1bnp38jghd",
    "45.43.178.2:5709:svbwigos:xp1bnp38jghd",
    "168.199.141.134:5886:svbwigos:xp1bnp38jghd",
    "171.22.248.120:6012:svbwigos:xp1bnp38jghd",
    "45.43.186.79:6297:svbwigos:xp1bnp38jghd",
]
const botly = new Botly({
    accessToken: process.env.token,
    verifyToken: process.env.vtoken,
    notificationType: Botly.CONST.REGULAR,
    FB_URL: "https://graph.facebook.com/v2.6/",
});

app.get("/", function (_req, res) {
    res.sendStatus(200);
});

app.use(express.json({ verify: botly.getVerifySignature(process.env.APP_SECRET) }));
app.use(express.urlencoded({ extended: false }));

app.use("/webhook", botly.router());

const msgDev = `مرحبا بك في بوت LktText \n الذي يقوم بتحويل المقطع الصوتي الى نص\n قم باعادة توجيه صوت من اي محادثة الى البوت وسيتم تحويل \n اذا واجهت اي مشكلة اتصل بالمطور \n حساب المطور 👇\n https://www.facebook.com/salah.louktaila`;

let msgVoice;

botly.on("message", async (senderId, message) => {
    console.log(senderId);

    if (message.message.text) {
        const msgstart = "يمكنك الان ان تسمع الكلمات بصوت وضح \n وجميل ويمكنك اختيار العديد\n من الاصوات رجال ونساء \n اختر اي شخصية لتسمع كماتك بصوتها \n الحد الاقصى 1000 حرف \n قم بمتابعة المطور 👇\n https://www.facebook.com/salah.louktaila";
        msgVoice = message.message.text.replace("صوت:", "");
        console.log(msgVoice);

        botly.sendText({
            id: senderId,
            text: msgstart,
            quick_replies: [
                botly.createQuickReply("نور", "alloy"),
                botly.createQuickReply("ايمن", "echo"),
                botly.createQuickReply("مراد", "fable"),
                botly.createQuickReply("اميرة", "nova"),
                botly.createQuickReply("سميرة", "shimmer"),
            ]
        });
    } else if (message.message.attachments && message.message.attachments[0]) {
        const attachment = message.message.attachments[0];
        if (attachment.type === "sticker") {
            botly.sendText({ id: senderId, text: "جام" });
        } else if (attachment.type === "image") {
            botly.sendText({ id: senderId, text: "image" });
        } else if (attachment.type === "audio") {
            botly.sendText({ id: senderId, text: "audio" });
        } else if (attachment.type === "video") {
            console.log(attachment);
            botly.sendText({ id: senderId, text: "فيديو" });
        }
    }
});

botly.on("postback", async (senderId, message, postback) => {
    if (message.postback) {
        if (message.postback.title === "followup") {
            botly.sendText({ id: senderId, text: "جاري العمل عليها..." });
        }
    } else {
        const validNames = ["نور", "ايمن", "مراد", "اميرة", "سميرة"];
        if (validNames.includes(message.message.text)) {
            botly.sendText({ id: senderId, text: `انتظر ${message.message.text} تقوم بارسال صوتها` });
            console.log(postback);

            TextToVoice(msgVoice, postback)
                .then(url => {
                    if (url) {
                        console.log(msgVoice);
                        botly.sendAttachment({
                            id: senderId,
                            type: Botly.CONST.ATTACHMENT_TYPE.AUDIO,
                            payload: { url: url }
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
        }
    }
});

/* ---- PING ---- */

function TextToVoice(text, nameVoicer) {
    const url = "https://ttsmp3.com/makemp3_ai.php";
    const data = qs.stringify({
        msg: text,
        lang: nameVoicer,
        speed: "1.00",
        source: "ttsmp3"
    });

    return new Promise((resolve, reject) => {
        function getRandomProxy() {
            const proxy = proxies[Math.floor(Math.random() * proxies.length)];
            const [host, port, username, password] = proxy.split(':');
            return { host, port, username, password };
        }

        const proxy = getRandomProxy();
        const agent = new HttpsProxyAgent(`http://${proxy.username}:${proxy.password}@${proxy.host}:${proxy.port}`);

        axios.post(url, data, { httpsAgent: agent })
            .then(response => {
                try {
                    const responseJson = response.data;
                    console.log("Response JSON:", responseJson.URL);
                    resolve(responseJson.URL);
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

app.get('/ping', (req, res) => {
    res.status(200).json({ message: 'Ping successful' });
});

/* ---- Start the Server ---- */

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
    keepAppRunning();
});
