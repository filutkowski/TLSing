import tls from "tls";
import validator from "validator";
import https from "https";

export const checkTLS = async (url) => {
    try {
        const port = checkPortInURL(url) || "443";
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

export const checkPortInURL = (url) => {
    if (validator.isURL(url) || validator.isIP(url)) {
        const hasPort = url.match(/:\d+$/);
        return hasPort ? hasPort[0].replace(":", "") : null;
    }
    return null;
};

export const generateMassURL = (url) => {
    const port = checkPortInURL(url);
    return port !== null ? port : isHttps(url) ? "443" : "80";
};

export const isHttps = (url) => {
    try {
        https.get(url);
        return true;
    } catch {
        return false;
    }
};

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