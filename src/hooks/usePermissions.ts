import React from 'react';

interface IPermissions {
    videoCapture: boolean;
}

export const usePermissions = () => {
    const [permissions, setPermissions] = React.useState<IPermissions>({
        videoCapture: false,
    });

    const isAvailable = Object.values(permissions).some((item) => !item);

    const checkCameraPermissions = () => {
        // Check if the extension has permission to access the camera
        chrome.permissions.contains({ permissions: ['videoCapture'] }, async (result) => {
            const [tab] = await chrome.tabs.query({ active: true });

            chrome.scripting.executeScript<boolean[], void>({
                target: { tabId: tab.id! },
                args: [result],
                func: (val) => {
                    console.log('__DEBUG', val);
                },
            });

            if (result) {
                setPermissions((current) => ({
                    ...current,
                    videoCapture: true,
                }));
            }
        });
    };

    const requestCameraPermissions = () =>
        chrome.runtime.sendMessage({ command: 'accessCamera' }, async (r) => {
            const [tab] = await chrome.tabs.query({ active: true });

            chrome.scripting.executeScript<boolean[], void>({
                target: { tabId: tab.id! },
                args: [r],
                func: (val) => {
                    console.log('__DEBUG', val);
                },
            });

            checkCameraPermissions();
        });

    React.useEffect(() => {
        checkCameraPermissions();
    }, []);

    return { permissions, requestCameraPermissions, isAvailable };
};
