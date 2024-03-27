'use strict'

const nodemailer = require('nodemailer')
const moment = require("moment")

const sendMail = (email, code) => {
    // const code = Math.floor(100000 + Math.random()*900000)
    // const expire_time = moment().add(2, 'minutes')

    const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.USER_GMAIL,
			pass: process.env.APP_PASSWORD,
		},
	})

    const mailOptions = {
        from: process.env.USER_GMAIL,
        to: email,
        subject: 'Yêu cầu khôi phục mật khẩu từ BKTravel',
        html: `
        <div style="max-width:500px; margin:0 auto; overflow:hidden;">
            <h3 style="text-align:center; font-weight: bolder; color:black; font-size:30px ">BKTRAVEL</h3>
            <div style="padding:10px;">
                <p style="font-weight: 700;">Xin chào!</p>
                <p style="font-size:14px;">Gần đây đã có người yêu cầu đặt lại mật khẩu cho tài khoản của bạn</p>
                <div style="text-align:center; margin-top:2rem">
                    <a>Code: ${code}</a>
                </div>
                <p>Mã này sẽ hết hạn sau 2 phút</p>
                <br />
                <p style="font-weight:700;">Bạn đã không yêu cầu thay đổi này?</p>
                <span>Nếu bạn đã không yêu cầu mật khẩu mới, hãy bỏ qua email này</span>
                
            </div>
            <br />
            <br />
            <br />
            <div style="border-top: 1px solid #ccc; text-align: center; padding-top:0.5rem; width: 100%;">
                <p>@2024 BKTRAVEL</p>
                <span>ĐỒ ÁN TỐT NGHIỆP</span>
                <br />
                <span>BKTravel Team</span>
            </div>
        </div>
       `,
    }

    transporter.sendMail(mailOptions, (err, data) => {
		if (err) {
            console.log("Error sending message: ", err)
		} else {
            console.log('Email sent: ', data.response)
        }
	})
}   

module.exports = sendMail