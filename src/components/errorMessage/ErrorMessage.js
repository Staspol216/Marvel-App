import img from './error.gif'

const ErrorMessage = () => {
    return (
        <img style={{ display: 'block', width: "250px", height: "250px", objectFit: 'containt', margin: "0 auto" }} src={img} alt="Error" />
    )
}

export default ErrorMessage;