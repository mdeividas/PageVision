const APP_ID = 'PageVision_';

const createScriptTag = (src) => {
    const script = document.createElement('script');
    script.src = src;

    return script;
};

(() => {
    const container = document.createElement('div');
    container.id = APP_ID;

    const newContent = document.createTextNode('Hi there and greetings!');
    container.appendChild(newContent);

    [container, createScriptTag(chrome.runtime.getURL('dist/assets/js/PageVisionEntry_.js'))].forEach((node) =>
        document.body.appendChild(node),
    );
})();

console.log('__DEBUG', chrome.runtime.getURL('dist/assets/js/PageVisionEntry_.js'));
