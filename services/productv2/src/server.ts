import App from '@/app';
import BrandRoute from '@brand/brand.route';
import { ValidateEnv } from '@utils/validateEnv';

ValidateEnv();

const app = new App([new BrandRoute()]);

app.listen();
