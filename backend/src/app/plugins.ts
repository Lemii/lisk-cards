/* eslint-disable @typescript-eslint/no-empty-function */
import { Application, HTTPAPIPlugin } from 'lisk-sdk';
import { LcApiPlugin } from './plugins/lc_api/lc_api_plugin';

// @ts-expect-error Unused variable error happens here until at least one module is registered
export const registerPlugins = (app: Application): void => {
	app.registerPlugin(HTTPAPIPlugin);
	app.registerPlugin(LcApiPlugin);
};
