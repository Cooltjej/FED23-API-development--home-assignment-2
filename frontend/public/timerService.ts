class Timer {
    private elementId: string;
    private startTime: number;
    public duration: number;
    public elapsedTime: number;
    private intervalId: number | null;

    constructor(elementId: string, duration: number) {
        this.elementId = elementId;
        this.startTime = Date.now();
        this.duration = duration * 1000;
        this.intervalId = null;
        this.elapsedTime = 0;
    }

    start() {
        if (!this.intervalId) {
            this.intervalId = setInterval(() => {
                this.updateTime();
            }, 10);
        }
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    private updateTime() {
        this.elapsedTime = Date.now() - this.startTime;
        const remainingTime = this.duration - this.elapsedTime;

        if (remainingTime > 0 && this.elementId) {
            const element = document.getElementById(this.elementId);
            if (element) {
                element.innerText = this.formatTime(remainingTime);
            }
        } else {
            this.stop();
        }
    }

    private formatTime(time: number): string {
        const seconds = Math.floor(time / 1000);
        const milliseconds = time % 1000;
        return `${seconds}.${milliseconds}`;
    }
}

export default Timer;