import * as alt from 'alt-client';
import { AthenaClient } from '../../../client/api/athena';
import { TfcPoliceWebViewEvents } from '../shared/viewInfo';

let players: alt.Player[];

class TfcPoliceWebView {
    /**
     * Opens the WebView.
     * The function call is from the server-side.
     *
     * @static
     * @param {alt.Player[]} _players
     * @return {*}
     * @memberof ExampleWebView
     */
    static open(_players: alt.Player[]) {
        players = _players;
        if (AthenaClient.webview.isAnyMenuOpen(true)) {
            return;
        }

        AthenaClient.webview.ready(TfcPoliceWebViewEvents.ViewName, TfcPoliceWebView.ready);
        AthenaClient.webview.open([TfcPoliceWebViewEvents.ViewName], true, TfcPoliceWebView.close);
        AthenaClient.webview.focus();
        AthenaClient.webview.showCursor(true);
        alt.toggleGameControls(false);
        alt.Player.local.isMenuOpen = true;
    }

    /**
     * A ready event to send the data up to the WebView.
     *
     * @static
     * @memberof ExampleWebView
     */
    static ready() {
        AthenaClient.webview.emit(TfcPoliceWebViewEvents.ClientToWebView.LOAD_PLAYERS, players);
    }

    /**
     * Called when the WebView event is closed.
     *
     * @static
     * @memberof ExampleWebView
     */
    static close() {
        players = undefined;
        AthenaClient.webview.unfocus();
        AthenaClient.webview.showCursor(false);
        alt.toggleGameControls(true);
        alt.Player.local.isMenuOpen = false;
    }
}

alt.onServer(TfcPoliceWebViewEvents.ClientServer.OPEN, TfcPoliceWebView.open);
