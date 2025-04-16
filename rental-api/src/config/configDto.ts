export class ConfigDto {
  port: number;
  database: DatabaseConfigDto;
  email: EmailConfig;
  auth: AuthConfig;
  admin: AdminConfig;
}

export class DatabaseConfigDto {
  connectionString: string;
}

export class EmailConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  fromName: string;
  fromEmail: string;
  secure: boolean;
  templatesPath: string;
}

export class AuthConfig {
  activationUrl: string;
  resetPasswordUrl: string;
}

export class AdminConfig {
  email: string;
  password: string;
}
