import tls from "tls";
import validator from "validator";
import https from "https";

// Sprawdza certyfikat TLS strony
import tls from "tls";
import validator from "validator";

export const checkTLS = async (url) => {
    try {
        const port = checkPortInURL(url) || "443"; // Domyślny port TLS
        if (!port || port === "80") return false;


            const socket = tls.connect({ host: url, port }, () => {
                const cert = socket.getPeerCertificate();
                socket.end();

                return cert && cert.valid_to ? socket.authorized : false
            });

            socket.on("error", () => {
                return false;
            });
        
    } catch (error) {
        return false;
    }
};

// Sprawdza, czy URL zawiera port
export const checkPortInURL = (url) => {
    if (validator.isURL(url) || validator.isIP(url)) {
        const hasPort = url.match(/:\d+$/);
        return hasPort ? hasPort[0].replace(":", "") : null;
    }
    return null;
};

// Sprawdza, jaki port powinna mieć strona
export const generateMassURL = (url) => {
    const port = checkPortInURL(url);
    return port !== null ? port : isHttps(url) ? "443" : "80";
};

// Sprawdza, czy strona działa na HTTPS
export const isHttps = (url) => {
    try {
        https.get(url);
        return true;
    } catch {
        return false;
    }
};

// Sprawdza, czy strona działa na HTTP
export const isHttp = (url) => {
    return !isHttps(url);
};

const table = {
    checkTLS,
    generateMassURL,
    checkPortInURL,
    isHttps,
    isHttp
};

export default table;