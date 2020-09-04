provider "aws" {
	region = "eu-central-1"
}

resource "aws_iam_user" "aws_user" {
  name = "iicv"
}

resource "aws_iam_access_key" "aws_user_access_key" {
  user = aws_iam_user.aws_user.name
}

resource "aws_iam_user_policy" "aws_user_policy" {
  name = "iicv_ses_user"
  user = aws_iam_user.aws_user.name

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
          "Effect": "Allow",
          "Action": "ses:SendRawEmail",
          "Resource": "*"
      }
  ]
}
EOF
}


resource "aws_ses_domain_identity" "iicv" {
  domain = "iicv.at"
}

resource "aws_ses_domain_dkim" "iicv_dkim" {
  domain = aws_ses_domain_identity.iicv.domain
}

output "AWS_ACCESS_KEY_ID" {
	value = aws_iam_access_key.aws_user_access_key.id
}

output "AWS_SECRET_ACCESS_KEY" {
	value = aws_iam_access_key.aws_user_access_key.secret
}

output "AWS_SMTP_PASSWORD" {
  value = aws_iam_access_key.aws_user_access_key.ses_smtp_password_v4
}

output "DNS_TXT_RECORD" {
  description = "Create a DNS TXT record with the name _amazonses.iicv.at and the value:"
  value = aws_ses_domain_identity.iicv.verification_token
}

output "DNS_DKIM" {
  description = "Create a DNS CNAME record for each value, with name TOKEN._domainkey.iicv.at and value TOKEN.dkim.amazonses.com"
  value = aws_ses_domain_dkim.iicv_dkim.dkim_tokens
}
