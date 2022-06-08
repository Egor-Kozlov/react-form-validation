import Confetti from 'react-confetti'
import useWindowSize from '../../hooks/useWindowSize'

const Salute = () => {
    const { width, height } = useWindowSize()
    return (
        <Confetti
            width={width}
            height={height}
        />
    )
}

export default Salute