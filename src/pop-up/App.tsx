import React from 'react';

export const App: React.FC = () => {
    const [enabled, setEnabled] = React.useState<boolean>(true);

    return (
        <div>
            <h1>Page Vision</h1>
            <p>Control your browser with hand gestures!</p>
            <hr />
            <div>
                Status: {enabled ? 'Enabled' : 'Disabled'} &nbsp;
                <button onClick={() => setEnabled((currentValue) => !currentValue)}>
                    {enabled ? 'Disable' : 'Enable'}
                </button>
            </div>
        </div>
    );
};
