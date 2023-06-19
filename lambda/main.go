package main

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"html/template"
	"log"
	"net/smtp"
	"os"
)

type EmailData struct {
	ServiceCount   int       `json:"-"`
	TotalPrice     string    `json:"totalPrice"`
	Services       []Service `json:"services"`
	BillingAddress string    `json:"billingAddress"`
}

type Service struct {
	Quantity int    `json:"quantity"`
	Name     string `json:"name"`
	Price    string `json:"price"`
}

type EmailRequest struct {
	To      string    `json:"to"`
	Data    EmailData `json:"data"`
	Subject string    `json:"subject"`
}

const (
	// SMTPServer Gmail
	SMTPServer = "smtp.gmail.com"
	// SMTPPort Gmail
	SMTPPort    = "587"
	AddressFrom = "maxim@thegaas.co"
)

func validateRequest(emailRequest *EmailRequest) error {
	if emailRequest.To == "" || emailRequest.Subject == "" {
		return fmt.Errorf("to and subject are required")
	}

	if emailRequest.Data.TotalPrice == "" || len(emailRequest.Data.Services) == 0 || emailRequest.Data.BillingAddress == "" {
		return fmt.Errorf("data is invalid")
	}

	return nil
}

func decodeBody(encodedBody string) (string, error) {
	decodedBody, err := base64.StdEncoding.DecodeString(encodedBody)
	if err != nil {
		return "", err
	}
	return string(decodedBody), nil
}

func setupHeaders(emailRequest *EmailRequest) map[string]string {
	headers := make(map[string]string)
	headers["From"] = AddressFrom
	headers["To"] = emailRequest.To
	headers["Subject"] = emailRequest.Subject
	return headers
}

func composeMessage(headers map[string]string, body string) string {
	message := ""

	for k, v := range headers {
		message += fmt.Sprintf("%s: %s\r\n", k, v)
	}

	message += "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"
	message += "\r\n" + body

	return message
}

func sendEmail(to string, message string) error {
	smtpPassword := os.Getenv("SMTP_PASSWORD")
	auth := smtp.PlainAuth("", AddressFrom, smtpPassword, SMTPServer)
	return smtp.SendMail(fmt.Sprintf("%s:%s", SMTPServer, SMTPPort), auth, AddressFrom, []string{to}, []byte(message))
}

func HandleRequest(request events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	var response events.APIGatewayV2HTTPResponse
	var emailRequest EmailRequest

	if request.RequestContext.HTTP.Method != "POST" {
		response.StatusCode = 405
		response.Body = `{"message": "Method not allowed"}`
		return response, nil
	}

	err := json.Unmarshal([]byte(request.Body), &emailRequest)
	if err != nil {
		log.Printf("unmarshal error: %s", err)
		response.StatusCode = 400
		response.Body = `{"message": "Invalid request body"}`
		return response, nil
	}

	err = validateRequest(&emailRequest)
	if err != nil {
		log.Printf("validation error: %s", err)
		response.StatusCode = 400
		response.Body = `{"message": "Invalid request body"}`
		return response, nil
	}

	// Count the number of services
	emailRequest.Data.ServiceCount = len(emailRequest.Data.Services)

	body, err := getEmailBody(emailRequest.Data)
	if err != nil {
		log.Printf("template error: %s", err)
		response.StatusCode = 400
		response.Body = `{"message": "Failed to generate email body"}`
		return response, nil
	}

	headers := setupHeaders(&emailRequest)
	message := composeMessage(headers, body)

	err = sendEmail(emailRequest.To, message)
	if err != nil {
		log.Printf("smtp error: %s", err)
		response.StatusCode = 500
		response.Body = `{"message": "Failed to send email"}`
		return response, nil
	}

	response.StatusCode = 200
	response.Body = `{"message": "Email sent successfully"}`

	return response, nil
}

func getEmailBody(data EmailData) (string, error) {
	const emailTemplate = `<!DOCTYPE html>
	<html lang="">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<style type="text/css">
			body {
				width: 100% !important;
				-webkit-text-size-adjust: 100%;
				-ms-text-size-adjust: 100%;
				margin: 0;
				padding: 0;
			}
	
			/* Ensure padding doesn't affect width */
			.ExternalClass {
				width: 100%;
			}
	
			.ExternalClass,
			.ExternalClass p,
			.ExternalClass span,
			.ExternalClass font,
			.ExternalClass td,
			.ExternalClass div {
				line-height: 100%;
			}
	
			/* Prevent Webkit platforms from changing default text sizes */
			.ExternalClass,
			.ExternalClass p,
			.ExternalClass span,
			.ExternalClass font,
			.ExternalClass td,
			.ExternalClass div {
				line-height: 100%;
			}
	
			/* Force Hotmail to display emails at full width */
			.ReadMsgBody {
				width: 100%;
				background-color: #f8f8f8;
			}
	
			/* Prevent Webkit and Windows Mobile platforms from changing default font sizes */
			body {
				font-size: 100%;
				font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
			}
		</style>
		<title></title>
	</head>
	<body style="margin:0; background-color:#000000">
	<div style="padding:24px;">
		<img src="https://d262mborv4z66f.cloudfront.net/disrapt.png" width="24" height="24" alt="disrapt"
			 style="display:block; border:0; margin:0; padding:0;"/>
		<h2 style="color:#ffffff; font-size:28px; font-weight:normal; padding:0; margin: 24px 0 0; line-height: 36px">
			Thank you for ordering a service
			from Disrapt.Collective. We have received your message and will contact you on the next business
			day.
		</h2>
		<table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
			<tr>
				<td style="text-align: left; width: 50%;">
					<h4 style="color:#ffffff; font-size:16px; font-weight:bold; padding:0; margin: 20px 0 0; line-height: 36px">
						You’ve ordered {{.ServiceCount}} services
					</h4>
				</td>
				<td style="text-align: right; width: 50%;">
					<h4 style="color:#ffffff; font-size:16px; font-weight:bold; padding:0; margin: 20px 0 0; line-height: 36px">
						$2450
					</h4>
				</td>
			</tr>
		</table>
	
		<div style="width: 100%; height: 1px; background-color: rgba(255,255,255,0.28); margin: 20px 0 0;"></div>
		<table width="100%" cellpadding="0" cellspacing="0" border="0">
			{{range .Services}}
			<tr>
				<td style="text-align: left; width: 50%;">
					<table cellpadding="0" cellspacing="0" border="0">
						<tr>
							<td style="padding-right: 8px;">
								<p style="color:#ffffff; font-size:16px; font-weight:normal; padding:0; margin: 20px 0 0; line-height: 36px">
									×{{.Quantity}}
								</p>
							</td>
							<td>
								<p style="color:#ffffff; font-size:16px; font-weight:normal; padding:0; margin: 20px 0 0; line-height: 36px">
									{{.Name}}
								</p>
							</td>
						</tr>
					</table>
				</td>
				<td style="text-align: right; width: 50%;">
					<p style="color:#ffffff; font-size:16px; font-weight:normal; padding:0; margin: 20px 0 0; line-height: 36px">
						{{.Price}}
					</p>
				</td>
			</tr>
			{{end}}
		</table>
		<p style="color:#ffffff; font-size:16px; font-weight:normal; padding:0; margin: 16px 0 0; line-height: 36px">
			Billing address: {{.BillingAddress}}
		</p>
		<div style="width: 100%; height: 200px;"></div>
		<img src="https://d262mborv4z66f.cloudfront.net/heart.png" width="28" height="24" alt="disrapt"
			 style="display:block; border:0; margin:0; padding:0;"/>
		<h1 style="color:#ffffff; font-size:28px; font-weight:normal; padding:0; margin: 12px 0 0; line-height: 36px">
			Sincerely, Nikita Axel,
		</h1>
		<h1 style="color:#ffffff; font-size:28px; font-weight:normal; padding:0; margin: 0; line-height: 36px">
			Founder of Disrapt Co.
		</h1>
	</div>
	</body>
	</html>`

	t, err := template.New("email").Parse(emailTemplate)
	if err != nil {
		return "", err
	}

	var buf bytes.Buffer
	if err := t.Execute(&buf, data); err != nil {
		return "", err
	}

	return buf.String(), nil
}

func main() {
	lambda.Start(HandleRequest)
}
