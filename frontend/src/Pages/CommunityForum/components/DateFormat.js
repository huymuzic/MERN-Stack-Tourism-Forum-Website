import { differenceInSeconds, differenceInMinutes, differenceInHours, differenceInDays } from 'date-fns';

const formatDate = (date) => {
    const now = new Date();
    const diffInSeconds = differenceInSeconds(now, date);
    const diffInMinutes = differenceInMinutes(now, date);
    const diffInHours = differenceInHours(now, date);
    const diffInDays = differenceInDays(now, date);

    if (diffInSeconds < 60) {
        return `${diffInSeconds}s`;
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
        return `${diffInHours}h`;
    } else if (diffInDays < 30) {
        return `${diffInDays}d`;
    } else {
        return date.toLocaleString('en-US', { month: 'short', year: '2-digit' }).replace(' ', " '");
    }
};

export default formatDate;