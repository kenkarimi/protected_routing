//firebase client config file.
interface Config {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
}

const config: Config = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: ""
}

export default config;