import 'dotenv/config';

export class ConfigurationService {
  private readonly config = {
    hostaway: {
      baseUrl: process.env.HOSTAWAY_BASE_URL || 'https://api.hostaway.com/v1',
      apiKey: process.env.HOSTAWAY_API_KEY || 'f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152',
      accountId: process.env.HOSTAWAY_ACCOUNT_ID || '61148'
    },
    server: {
      port: parseInt(process.env.PORT || '3001'),
      nodeEnv: process.env.NODE_ENV || 'development'
    }
  };

  getHostawayConfig() {
    return this.config.hostaway;
  }

  getServerConfig() {
    return this.config.server;
  }

  getPort(): number {
    return this.config.server.port;
  }

  getNodeEnv(): string {
    return this.config.server.nodeEnv;
  }
}
