import React from 'react';
import './App.css';

export const App: React.FC = () => {
    const [enabled, setEnabled] = React.useState<boolean>(true);

    const toggleAvailability = async () => {
        await chrome.storage.local.set({ enabled: !enabled });

        setEnabled(!enabled);
    };

    React.useEffect(() => {
        (async () => {
            const result = await chrome.storage.local.get('enabled');

            setEnabled(result.enabled);
        })();
    }, []);

    return (
        <div className="app">
            <h1>Page Vision</h1>
            <p>Control your browser with hand gestures!</p>
            <hr />
            <div>
                Status: {enabled ? 'Enabled' : 'Disabled'} &nbsp;
                <button onClick={toggleAvailability}>{enabled ? 'Disable' : 'Enable'}</button>
            </div>
            <hr />
            If you liked this project and want to explore the details further, you can check out:
            <hr />
            This experimental project explores the use of AI.
            <ul>
                <li>We don't collect any data for analytics.</li>
                <li>We're using AI on the client side, meaning that video captions are not sent anywhere.</li>
            </ul>
        </div>
    );
};
