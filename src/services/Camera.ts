export default class Camera {
    element: HTMLVideoElement;
    width: number;
    height: number;

    constructor(videoElement: HTMLVideoElement, width: number, height: number) {
        this.element = videoElement;
        this.width = width;
        this.height = height;
    }

    // Adjusts the video size so we can make a centered square crop without including whitespace.
    adjustVideoSize(width: number, height: number) {
        const aspectRatio = width / height;
        if (width >= height) {
            this.element.width = aspectRatio * this.element.height;
        } else if (width < height) {
            this.element.height = this.element.width / aspectRatio;
        }
    }

    async setup(): Promise<void> {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('Browser API navigator.mediaDevices.getUserMedia not available');
        }

        this.element.srcObject = await navigator.mediaDevices.getUserMedia({
            video: { width: this.width, height: this.height },
            audio: false,
        });

        return new Promise<void>((resolve) => {
            this.element.addEventListener('loadeddata', () => {
                this.adjustVideoSize(this.element.videoWidth, this.element.videoHeight);
                resolve();
            });
        });
    }
}
