import { env } from 'libs/utils/env';

export const jwtConstants = {
  secret: env.JWT_SECRET || 'shabalapulla',
  adminSecret: env.ADMIN_JWT_SECRET || 'hunternunter',
};
