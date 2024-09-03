
import './index.css'
interface AudioVisualizerProps {
    type: "agent" | "user";
    frequencies: Float32Array[];
    gap: number;
    barWidth: number;
    minBarHeight: number;
    maxBarHeight: number
    borderRadius: number;
}

export const AudioVisualizer = (props: AudioVisualizerProps) => {
    const { frequencies, gap, barWidth, minBarHeight, maxBarHeight, borderRadius, type } = props;
    const summedFrequencies = frequencies.map((bandFrequencies) => {
        const sum = bandFrequencies.reduce((a, b) => a + b, 0)
        if (sum <= 0) { return 0 }
        return Math.sqrt(sum / bandFrequencies.length);
    });
    return <div className="audioVisualizer" style={{ gap: `${gap}px` }}>{
        summedFrequencies.map((frequency, index) => {
            const style = {
                height: minBarHeight + frequency * (maxBarHeight - minBarHeight) + "px",
                borderRadius: borderRadius + "px",
                width: barWidth + "px",
                transition: "background-color 0.35s ease-out, transform 0.25s ease-out",
            }
            return <span key={index} className={`item ${type == 'agent' ? 'agent' : 'user'}`} style={style}></span>
        })
    }</div>
}
