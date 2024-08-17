export function convertDate (timestamp) {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    return formattedDate;
}

export function convertTime (timestamp) {
    const date = new Date(timestamp);
    const formattedTime = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true, // Ensures AM/PM format
    });
    return formattedTime;

}

