import React from 'react';
import { usePermissions } from './hooks/usePermissions.ts';
import './App.css';

function App() {
    const permissions = usePermissions();
    const [active, setActive] = React.useState(false);

    // const videoRef = React.useRef();

    const onToggle = () => setActive((flag) => !flag);

    // const onClick = async () => {
    //     const [tab] = await chrome.tabs.query({ active: true });
    //
    //     chrome.scripting.executeScript({
    //         target: { tabId: tab.id! },
    //         func: () => {
    //             alert('What app!');
    //         },
    //     });
    // };

    const renderEnableButton = (cta: () => void) => <button onClick={cta}>Enable</button>;

    return (
        <>
            <div>
                Camera permissions: &nbsp;
                {permissions.permissions.videoCapture ? 'OK' : renderEnableButton(permissions.requestCameraPermissions)}
                <hr />
            </div>

            <button disabled={!permissions.isAvailable} onClick={onToggle}>
                {active ? 'Turn off' : 'Turn on'}
            </button>
            <div>V:3</div>
        </>
    );
}

export default App;
