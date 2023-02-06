import alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { TfcPoliceWebViewServer } from './src/view';

const PLUGIN_NAME = 'TFC Police Plugin';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    TfcPoliceWebViewServer.init();
    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} Loaded.`);
});
