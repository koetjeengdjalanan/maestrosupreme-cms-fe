import dayjs from 'dayjs';

export const dateTimeFormat = date => {
    return dayjs(Number(date)).format('ddd, D MMM YYYY');
};
