//jshint esversion:6

const getDate = () => {
    const today = new Date();

    const options = {
        weekday: "long",
        month: "long",
        day: "numeric",
    };

    return today.toLocaleDateString("en-US", options);
};

const getDay = () => {
    const today = new Date();

    const options = {
        weekday: "long",
    };

    return today.toLocaleDateString("en-US", options);
};

export default {getDate, getDay};