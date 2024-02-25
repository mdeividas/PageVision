import React from 'react';
import '@tensorflow/tfjs-backend-webgl';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
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
    const [isLoading, setLoading] = React.useState(true);
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
            }

            previousCategoryRef.current = category;
            cursorRef.current.style.transform = `translate(${x}px, ${y}px)`;
        }

        return handleDetection();
    };

    const setupCamera = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('Browser API navigator.mediaDevices.getUserMedia not available');
        }

        videoRef.current!.srcObject = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
        });
    };

    React.useEffect(() => {
        (async () => {
            // Setup cursor
            cursorRef.current.classList.add('__PageVision_cursor');
            document.body.appendChild(cursorRef.current);

            await setupCamera();

            detector = await handPoseDetection.createDetector(handPoseDetection.SupportedModels.MediaPipeHands, {
                runtime: 'tfjs',
                modelType: 'full',
            });

            setLoading(false);

            handleDetection();
        })();
    }, []);

    return (
        <div className="__PageVision_app">
            <button onClick={() => window.scrollTo(window.scrollX, 0)}>Click me!</button>
            {isLoading && <span>Loading...</span>}
            <video ref={videoRef} autoPlay playsInline muted width={340} height={240} />
        </div>
    );
};
