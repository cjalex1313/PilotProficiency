import { registerAs } from '@nestjs/config';
import { ConfigDto } from './configDto';

export default registerAs('config', (): ConfigDto => {
  return {
    port: parseInt(process.env.PORT ?? '3000', 10) || 3000,
    database: {
      connectionString: process.env.DB_CONNECTIONSTRING ?? '',
    },
    email: {
      host: process.env.MAIL_HOST ?? '',
      port: parseInt(process.env.MAIL_PORT ?? '-1'),
      user: process.env.MAIL_USER ?? '',
      password: process.env.MAIL_PASSWORD ?? '',
      fromName: process.env.MAIL_FROM_NAME ?? '',
      fromEmail: process.env.MAIL_FROM_EMAIL ?? '',
      secure: process.env.MAIL_SECURE == 'true',
      templatesPath: process.env.TEMPLATE_PATH ?? './templates',
    },
    auth: {
      activationUrl: process.env.ACTIVATION_URL ?? 'http://localhost',
      resetPasswordUrl: process.env.RESET_PASSWORD_URL ?? 'http://localhost',
    },
    admin: {
      email: process.env.ADMIN_EMAIL ?? '',
      password: process.env.ADMIN_PASSWORD ?? '',
    },
  };
});
