export interface AppConfig {
  port: number;
  database: {
    uri: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  superAdmin: {
    email: string;
    password: string;
    allowSeeding: boolean;
  };
}
