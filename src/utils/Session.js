const set = (name, value) => {
    try {
        const type = typeof value;

        switch (type) {
            case 'object':
                sessionStorage.setItem(name, JSON.stringify(value));
                break;
            default:
                sessionStorage.setItem(name, value);
        }
    } catch (error) {
        console.error(`Error saving to session storage: ${error.message}`);
    }
};

const get = (name) => {
    try {
        const storedValue = sessionStorage.getItem(name);

        if (storedValue === null) {
            return null;
        }
        let parsedValue;

        try {
            parsedValue = JSON.parse(storedValue);
        } catch (error) {
            parsedValue = storedValue;
        }

        return parsedValue;
    } catch (error) {
        console.error(`Error retrieving from session storage: ${error.message}`);
        return null;
    }
};


const session = {
    get, set
}

export default session