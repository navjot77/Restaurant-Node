const nodemailer=require('nodemailer');
const pug=require('pug');
const html2text=require('html-to-text');
const juice=require('juice');



const transporter=nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth:{
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});



function getHTML(filename,options={}){

    const html=pug.renderFile(`${__dirname}/../views/email/${filename}.pug`,options);
    const htmlcss=juice(html);
    return htmlcss;
}


exports.sendData= async(options)=> {

    const html=getHTML(options.filename, options);
    const hText=html2text.fromString(html);

    transporter.sendMail({
        to: 'navjot.chakal@yahoo.com',
        from: 'navjot.chakal@yahoo.com',
        subject: 'TESTING SENDING MAIL',
        html,
        text: hText
    }, (error, info) => {
        if (error) {
            console.log("SENDING MAIL.. ERROR", error);
        }
        else {
            console.log("Sending MAIL responded with : ", info.response)
        }
    });

};