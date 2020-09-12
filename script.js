// Day
// Author: pjpscriv

// Prettifiers
function pretty_time(d) {
    var hr = d.getHours();
    var min = d.getMinutes();
    if (min < 10) {
        min = "0" + min;
    }
    var ampm = "am";
    if( hr > 12 ) {
        hr -= 12;
        ampm = "pm";
    }
    return hr + ":" + min + ampm;
}
function pretty_day(d) {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var day = days[d.getDay()];
    var date = d.getDate();
    var month = months[d.getMonth()];
    var year = d.getFullYear();
    return day + ", " + date + " " + month + " " + year;
}
function pretty_location(location) {
    return `${Math.round(location.coords.latitude*100)/100}, ${Math.round(location.coords.longitude*100)/100}`
}

function add_hours() {
    
    var num_hours = 24;
    
    var line_width = 2;
    var dp = 1000;
    var rot_segment = 2*Math.PI / num_hours;
    var day = document.getElementById("day");
    for (let i = 0; i < num_hours; i++) {
        
        let rotation = (rot_segment * i);
        let y = Math.round((Math.sin(rotation) * 36.6)*dp) / dp * -1;
        let x = Math.round((Math.cos(rotation) * 36.6)*dp) / dp;

        var hour = document.createElement('hour');
        hour.style.transform = `translate(${y}vmin, ${x}vmin) rotate(${rotation}rad)`;
        hour.style.width = line_width+"px";
        hour.id = "hour_" + i;
        day.appendChild(hour);
    }
    day.style.borderWidth = line_width+"px";
}

function get_day_times(here, now) {
    return SunCalc.getTimes(now, here.coords.latitude, here.coords.longitude);
}

function get_angle(date) {
    var day_ms = 24*60*60*1000;
    var ms = date.getHours()*60*60*1000;
    ms += date.getMinutes()*60*1000;
    ms += date.getSeconds()*1000;
    ms += date.getMilliseconds();

    var circle_percent = ms/day_ms;
    return (circle_percent * 2*Math.PI) - Math.PI/2;
}

function add_now(day, time) {
    var now = document.createElement('now');

    var line_width = 2;
    var dp = 1000;

    var day_ms = 24*60*60*1000;
    var ms = time.getHours()*60*60*1000;
    ms += time.getMinutes()*60*1000;
    ms += time.getSeconds()*1000;
    ms += time.getMilliseconds();

    var rotation = 2*Math.PI * (ms/day_ms);

    let y = Math.round((Math.sin(rotation) * 34.8)*dp) / dp * -1;
    let x = Math.round((Math.cos(rotation) * 34.8)*dp) / dp;

    now.style.transform = `translate(${y}vmin, ${x}vmin) rotate(${rotation}rad)`;
    now.style.width = line_width+"px";
    now.id = "now";
    day.appendChild(now);
}

window.onload = () => {
    
    var now = new Date();
    var here = "";
    var night_color = "#222222 50%";
    var day_color = "#3E465C 50%";
    var transparent = "transparent 50%";
    
    var time = document.getElementById("time");
    var location = document.getElementById("location");
    var sunrise = document.getElementById("sunrise");
    var sunset = document.getElementById("sunset");
    var day = document.getElementById("day");
    
    add_hours();
    add_now(day, now);

    // Get Location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            here = position;
            var times = get_day_times(here, now);
            console.log(times);

            // Set Values
            location.innerHTML = pretty_location(here);
            time.innerHTML = pretty_day(now);
            sunrise.innerHTML = pretty_time(times.sunrise);
            sunset.innerHTML = pretty_time(times.sunset);

            // Set Gradients
            var time_diff = times.sunset - times.sunrise;

            var sunrise_angle = get_angle(times.sunrise);
            var sunset_angle = get_angle(times.sunset);

            var half_day = 12*60*60*1000;
            
            if (time_diff > half_day) {
                // Longer Day
                gradient = `linear-gradient(${sunrise_angle}rad, ${transparent}, ${day_color}),
                            linear-gradient(${sunset_angle}rad, ${night_color}, ${transparent})`;
            } else {
                // Longer Night
                gradient = `linear-gradient(${sunrise_angle}rad, ${night_color}, ${transparent}), 
                            linear-gradient(${sunset_angle}rad, ${transparent}, ${night_color})`
            }

            day.style.backgroundImage = gradient;

        });
    } else {
        here = "Your browser is too old to share your location :'(";
        location.innerHTML = pretty_location(here);
    }
}
