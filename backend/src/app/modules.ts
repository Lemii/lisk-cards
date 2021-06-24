/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'lisk-sdk';
import { LcModule } from './modules/lc/lc_module';

export const registerModules = (app: Application): void => {
	app.registerModule(LcModule);
};
