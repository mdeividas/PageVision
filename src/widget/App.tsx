import React from 'react';
import '@tensorflow/tfjs-backend-webgl';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import { messaging } from './messaging';
import {
    fireClickEvent,
    createKeyMap,
    getHandPoseEstimationsDistances,
    KMeansCentroidsSearch,
    interpolate,
} from './utils.ts';
import './App.css';

// Create a hand model detection detector instance
let detector: handPoseDetection.HandDetector;

// TODO permissions handler!
// TODO cfrs permissions
// Pop-up for enable/disable

const CATEGORIES = {
    PALM: 1,
    FIST: 0,
};

export const App: React.FC = () => {
    const previousCategoryRef = React.useRef<number>(0);
    const cursorRef = React.useRef<HTMLDivElement>(document.createElement('div'));
    const [enabled, setEnabled] = React.useState<boolean>(false);
    const [isLoading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string>();
    const videoRef = React.useRef<HTMLVideoElement>(null);

    const handleDetection = async (): Promise<void> => {
        const hands = await detector.estimateHands(videoRef.current!);

        if (hands.length > 0) {
            const data = createKeyMap(hands[0].keypoints);
            const distances = getHandPoseEstimationsDistances(data);
            const category = KMeansCentroidsSearch(distances);

            const x = interpolate(data.wrist.x, 0, 300, window.innerWidth, 0);
            const y = interpolate(data.wrist.y, 0, 240, 0, window.innerHeight);

            // This indicates that user tries to resolve click event
            if (previousCategoryRef.current === CATEGORIES.FIST && category === CATEGORIES.PALM) {
                fireClickEvent(x, y);
            } else if (category === CATEGORIES.FIST) {
                console.log('__DEBUG', 'fire scroll');
            }

            previousCategoryRef.current = category;
            cursorRef.current.style.transform = `translate(${x}px, ${y}px)`;
        }

        if (enabled) {
            return handleDetection();
        }

        return Promise.resolve();
    };

    const setupCamera = async () => {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Browser API navigator.mediaDevices.getUserMedia not available');
            }

            videoRef.current!.srcObject = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false,
            });
        } catch {
            setError('Failed to access camera');
        }
    };

    const loadModel = async () => {
        if (detector) {
            return;
        }

        try {
            detector = await handPoseDetection.createDetector(handPoseDetection.SupportedModels.MediaPipeHands, {
                runtime: 'tfjs',
                modelType: 'full',
            });
        } catch {
            setError('Failed to load a model. Please try other webpage, or contact owner');
        }
    };

    const init = async () => {
        // Setup cursor
        cursorRef.current.classList.add('__PageVision_cursor');
        document.body.appendChild(cursorRef.current);

        await setupCamera();

        await loadModel();

        setLoading(false);

        handleDetection();
    };

    React.useEffect(() => {
        if (enabled) {
            setLoading(true);
            init();
        } else {
            setError('');

            if (document.querySelector('.__PageVision_cursor')) {
                document.body.removeChild(cursorRef.current);
            }
        }
    }, [enabled]);

    React.useEffect(() => {
        const listener = (event: MessageEvent) => {
            if (event.source === window && event.data?.type === messaging.TYPES.AVAILABILITY_RESPONSE) {
                setEnabled(event.data.enabled);
            }
        };

        window.addEventListener('message', listener);

        messaging.requestAvailability();

        return () => {
            window.removeEventListener('message', listener);
        };
    }, []);

    if (!enabled) {
        return;
    }

    return (
        <div className="__PageVision_app">
            <button onClick={() => window.scrollTo(window.scrollX, 0)}>Click me!</button>
            {!error && isLoading && <div className="__PageVision_overlay">Loading...</div>}
            {error && <div className="__PageVision_overlay">{error}</div>}
            <video ref={videoRef} autoPlay playsInline muted width={340} height={240} />
        </div>
    );
};
