import React, { useState, useEffect, Fragment } from 'react';
import moment from 'moment-timezone';

function Countdown({airingDate, airingTime, type}) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    })

    const timezone = "GMT";
    
    useEffect(() => {
        moment.tz.setDefault(timezone);
        const timer = setTimeout(() => {
            const weekdayToday = moment().isoWeekday();    //airing anime (today e tomorrow)
            const weekdayAnime = airingDate && moment().day(airingDate); //favoritos

            const JPNTime = weekdayAnime && moment.tz(`${weekdayAnime.format().slice(0, 10)} ${airingTime}`, "Asia/Tokyo");
            const GMTTime = JPNTime && JPNTime.clone().tz(timezone).format("HH:mm");
    
            const AiringDay = moment()
                .isoWeekday(type === "today" ? weekdayToday : type === "tomorrow" && weekdayToday + 1);
                        
            const then = moment(
                type === "favoritos" ? 
                `${weekdayAnime.format().slice(0, 10)} ${GMTTime}`
                :
                `${AiringDay.format().slice(0, 10)} ${airingTime}`
                );

            const now = moment().format();

            const countdown = then.diff(now);
            const diff = moment.duration(countdown);
            const days = diff._data.days;
            const hours = diff._data.hours;
            const minutes = diff._data.minutes;
            const seconds = diff._data.seconds;

            setTimeLeft({ days: days, hours: hours, minutes: minutes, seconds: seconds })
        }, 1000);

        return () => clearTimeout(timer);

        // eslint-disable-next-line
    }, [timeLeft]);

    return (
        <Fragment>
            {   timeLeft.days > 0 || timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0 ? 
                `${timeLeft.days}d:${timeLeft.hours}h:${timeLeft.minutes}m:${timeLeft.seconds}s`
                :
                "Aired!"
            }         
        </Fragment>                      
    );
}

export default Countdown;