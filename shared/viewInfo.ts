export const TfcPoliceWebViewEvents = {
    ViewName: 'TfcPoliceWebView', // This needs to match the `.vue` file name.
    ClientServer: {
        OPEN: 'TfcPoliceWebView:webview:event:open',
        CLOSE: 'TfcPoliceWebView:webview:event:close',
    },
    ClientToWebView: {
        LOAD_PLAYERS: 'TfcPoliceWebView:webview:event:loadplayers',
    },
    ServerToWebView: {
        REFRESH_PLAYERS: 'TfcPoliceWebView:webview:event:refreshplayers',
    },
    WebViewToServer: {
        KICK_PLAYER: 'TfcPoliceWebView:webview:event:kick',
        REQUEST_REFRESH: 'TfcPoliceWebView:webview:event:requestrefresh',
    }
};
