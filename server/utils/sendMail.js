const { createTransport, createTestAccount, getTestMessageUrl } = require("nodemailer");
const { ErrorHandler } = require("./ErrorHandler");
const { MAIL_EMAIL, MAIL_PASSWORD, HOST, MAIL_PORT, SECURE, ENVIRONMENT, RESET_PASSWORD_PAGE } =
    process.env;

exports.sendForgotPasswordMail = async ({ name, email, token }) => {
    try {
        let account = { user: MAIL_EMAIL, pass: MAIL_PASSWORD };
        if (!MAIL_EMAIL || !MAIL_PASSWORD) account = await createTestAccount();
        const transport = await createTransport({
            host: HOST,
            port: MAIL_PORT,
            secure: SECURE === "true" ? true : false,
            auth: { user: account.user, pass: account.pass },
        });

        const information = await transport.sendMail({
            from: account.user,
            to: email,
            subject: `Reset password link shared.`,
            html: `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Reset Password</title>
                    <style>
                        html,
                        body {
                            height: 100%;
                            margin: 0;
                        }
                        body {
                            display: flex;
                        }
                        .container {
                            margin: auto auto;
                            padding: 20px;
                            max-width: 600px;
                            background-color: #f0f0f0;
                            border-radius: 8px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                            text-align: center;
                        }
                        .website {
                            margin-top: 20px;
                            line-height: 0.5;
                            color: #888;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>Password Reset</h2>
                        <p>Hello ${name},</p>
                        <p>We received a request to reset your password. Click the button below to reset it.</p>
                        <a
                            href="${RESET_PASSWORD_PAGE}/${token}"
                            style="
                                display: inline-block;
                                padding: 10px 20px;
                                background-color: #007bff;
                                color: #fff;
                                text-decoration: none;
                                border-radius: 4px;
                            ">
                            Reset Password
                        </a>
                        <p>If you didn't request a password reset, you can ignore this email.</p>
                        <div class="website">
                            <p>SHOPKART</p>
                            <p>Shop Smart, Shop at ShopKart.</p>
                        </div>
                    </div>
                </body>
            </html>
            `,
        });
        if (ENVIRONMENT === "development") console.log(await getTestMessageUrl(information));
        return;
    } catch (error) {
        return new ErrorHandler(error.message, error.code);
    }
};