import React from 'react';
import '@tensorflow/tfjs-backend-webgl';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import { createKeyMap, getHandPoseEstimationsDistances, KMeansCentroidsSearch } from './utils.ts';
import './App.css';

// Create a hand model detection detector instance
let detector: handPoseDetection.HandDetector;

// TODO permissions handler!
// TODO cfrs permissions
// Pop-up for enable/disable

export const App: React.FC = () => {
    const [isLoading, setLoading] = React.useState(true);
    const videoRef = React.useRef<HTMLVideoElement>(null);

    const handleDetection = async (): Promise<void> => {
        const hands = await detector.estimateHands(videoRef.current!);

        if (hands.length > 0) {
            const data = createKeyMap(hands[0].keypoints);
            const distances = getHandPoseEstimationsDistances(data);
            const category = KMeansCentroidsSearch(distances);

            console.log('__DEBUG', category);
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
        <div className="app">
            <button onClick={() => window.scrollTo(window.scrollX, 0)}>Click me!</button>
            {isLoading && <span>Loading...</span>}
            <video className="video" ref={videoRef} autoPlay playsInline muted width={340} height={240} />
        </div>
    );
};
