import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';

export const alertError = (message) => {
    return Alert.error(`${message}`, {
        position: 'top-right',
        effect: 'slide',
        timeout: 1500
    })
}

export const alertSuccess = (message) => {
    return Alert.success(`${message}`, {
        position: 'top-right',
        effect: 'slide',
        timeout: 1500
    })
}

export const alertWarning = (message) => {
    return Alert.warning(`${message}`, {
        position: 'top-right',
        effect: 'slide',
        timeout: 1500
    })
}
