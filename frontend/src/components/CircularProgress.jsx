import { useTheme } from '../theme/Theme';

export default function CircularProgress(props) {
    const { color } = useTheme()
    return (
        <div className="spinner-border" style={{ color: color.primary }} {...props}>
        </div>
    )
}
