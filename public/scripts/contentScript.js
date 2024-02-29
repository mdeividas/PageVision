const APP_ID = 'PageVision_';
const PATH = 'assets/widget';
const TYPES = {
    AVAILABILITY_REQUEST: `${APP_ID}:AVAILABILITY:REQUEST`,
    AVAILABILITY_RESPONSE: `${APP_ID}:AVAILABILITY:RESPONSE`,
};

const getSource = (src) => `${PATH}/${src}`;

const createScriptTag = (src) => {
    const script = document.createElement('script');
    script.src = src;

    return script;
};

const insertCssTag = (src) => {
    const link = document.createElement('link');
    link.href = src;
    link.type = 'text/css';
    link.rel = 'stylesheet';

    (document.head || document.documentElement).appendChild(link);
};

(() => {
    const container = document.createElement('div');
    container.id = APP_ID;

    insertCssTag(chrome.runtime.getURL(getSource('css/PageVisionAssets_.css')));

    [container, createScriptTag(chrome.runtime.getURL(getSource('js/PageVisionEntry_.js')))].forEach((node) =>
        document.body.appendChild(node),
    );
})();

const sendMessage = (type, payload) =>
    window.postMessage({
        type,
        ...(payload || {}),
    });

window.addEventListener('message', async (event) => {
    if (event.source === window && event.data.type && event.data.type === TYPES.AVAILABILITY_REQUEST) {
        const result = await chrome.storage.local.get('enabled');

        sendMessage(TYPES.AVAILABILITY_RESPONSE, { enabled: result.enabled });
    }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local') {
        for (let [key, { newValue }] of Object.entries(changes)) {
            if (key === 'enabled') {
                sendMessage(TYPES.AVAILABILITY_RESPONSE, { enabled: newValue });
            }
        }
    }
});
