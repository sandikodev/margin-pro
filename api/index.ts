import { handle } from 'hono/vercel';
import app from '../dist/server/index.mjs';

export default handle(app);


