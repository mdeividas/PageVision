const PREFIX = 'PageVision_';

const TYPES = {
    AVAILABILITY_REQUEST: `${PREFIX}:AVAILABILITY:REQUEST`,
    AVAILABILITY_RESPONSE: `${PREFIX}:AVAILABILITY:RESPONSE`,
};

// Instead of having logic spread between different parts of the application
// we could have event manager, that sends a message and return response in async/await way

const sendMessage = (type: string, payload?: Record<string, unknown>) =>
    window.postMessage({
        type,
        ...(payload || {}),
    });

const requestAvailability = () => sendMessage(TYPES.AVAILABILITY_REQUEST);

export const messaging = {
    requestAvailability,
    TYPES,
};
