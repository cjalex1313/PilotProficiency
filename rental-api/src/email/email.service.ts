// src/email/email.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs/promises'; // For reading template files
import * as path from 'path';
import * as Handlebars from 'handlebars'; // If using handlebars
import { ConfigDto } from 'src/config/configDto';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly defaultFrom: string;
  private readonly templatePath: string;
  private readonly config: ConfigDto;
  private readonly transporter: nodemailer.Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  >;

  constructor(
    private readonly configService: ConfigService, // Can still inject ConfigService if needed elsewhere
  ) {
    const config = configService.get<ConfigDto>('config');
    if (!config) {
      throw new Error('Config is null in EmailService');
    }
    this.config = config;
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: {
        user: config.email.user,
        pass: config.email.password,
      },
    });
    this.defaultFrom = `"${this.config.email.fromName}" <${this.config.email.fromEmail}>`;
    this.templatePath = this.config.email.templatesPath;
  }

  private async compileTemplate(
    templateName: string,
    context: object,
  ): Promise<string> {
    const filePath = path.join(
      process.cwd(),
      this.templatePath,
      `${templateName}.hbs`,
    );
    const templateContent = await fs.readFile(filePath, 'utf-8');
    const compiledTemplate = Handlebars.compile(templateContent);
    return compiledTemplate(context);
  }

  async sendEmail({
    to,
    subject,
    text,
    html,
    template,
    context,
  }: {
    to: string | string[];
    subject: string;
    text?: string; // Plain text version
    html?: string; // HTML version (can be generated from template)
    template?: string; // Name of the template file (without extension)
    context?: object; // Data for the template
  }): Promise<void> {
    let finalHtml = html;

    // If template is specified, compile it
    if (template && context) {
      finalHtml = await this.compileTemplate(template, context);
    }
    const toEmail = Array.isArray(to) ? to.join(', ') : to;
    const mailOptions: nodemailer.SendMailOptions = {
      from: this.defaultFrom,
      to: toEmail, // Nodemailer handles arrays or comma-separated strings
      subject: subject,
      text: text, // Provide plain text fallback
      html: finalHtml, // Provide HTML content
    };

    const info: any = await this.transporter.sendMail(mailOptions);
    this.logger.log(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      `Email sent successfully to ${toEmail}. Message ID: ${info.messageId}`,
    );
  }

  // Example of a specific email sending method using the generic one
  async sendUserWelcome(
    email: string,
    activationToken: string,
    userId: string,
  ) {
    const activationLink = `${this.config.auth.activationUrl}?token=${activationToken}&userId=${userId}`;
    await this.sendEmail({
      to: email,
      subject: 'Welcome to Rental! Confirm your Email',
      template: 'welcome', // Assumes welcome.hbs exists in TEMPLATE_PATH
      context: {
        url: activationLink,
        appName: this.configService.get<string>('MAIL_FROM_NAME', 'Rental'),
      },
      // Optional: Provide a plain text version as fallback
      text: `Hi,\nWelcome to Rental! Please activate your account here: ${activationLink}\nThanks,\nThe Rental Team`,
    });
  }

  async sendPasswordReset(email: string, userId: string, resetToken: string) {
    const resetLink = `${this.config.auth.resetPasswordUrl}?token=${resetToken}&userId=${userId}`;
    await this.sendEmail({
      to: email,
      subject: 'Rental - Password Reset Request',
      template: 'password-reset', // Assumes password-reset.hbs exists
      context: {
        url: resetLink,
      },
      text: `Hi,\nSomeone requested a password reset for your Rental account. Click here to reset: ${resetLink}\nIf you did not request this, please ignore this email.`,
    });
  }
}
