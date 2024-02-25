const APP_ID = 'PageVision_';
const PATH = 'assets/widget';

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

    insertCssTag(chrome.runtime.getURL(getSource('/css/PageVisionAssets_.css')));

    [container, createScriptTag(chrome.runtime.getURL(getSource('/js/PageVisionEntry_.js')))].forEach((node) =>
        document.body.appendChild(node),
    );
})();
