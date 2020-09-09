// Day
// Author: pjpscriv

function add_hours() {
    var line = 2;
    var num_hours = 24;
    var dp = 1000;
    var rot_segment = 2*Math.PI / num_hours;
    var day = document.getElementById("day");
    for (let i = 0; i < num_hours; i++) {
        let rotation = (rot_segment * i)// - (2*Math.PI/4);
        let y = Math.round((Math.sin(rotation) * 36.6)*dp) / dp * -1;
        let x = Math.round((Math.cos(rotation) * 36.6)*dp) / dp;

        var hour = document.createElement('hour');
        hour.style.transform = `translate(${y}vmin, ${x}vmin) rotate(${rotation}rad)`;
        hour.style.width = line+"px";
        hour.id = "hour_" + i;
        day.appendChild(hour);
    }
    day.style.borderWidth = line+"px";
}


function set_day_times(here, now) {
    return SunCalc.getTimes(now, here.coords.latitude, here.coords.longitude);
}

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
    var date = d.getDate();
    var month = months[d.getMonth()];
    var year = d.getFullYear();
    return pretty_time(d) + "\n" + day + ", " + date + " " + month + " " + year;
}

function pretty_location(location) {
    return `${Math.round(location.coords.latitude*100)/100}, ${Math.round(location.coords.longitude*100)/100}`
}

window.onload = () => {
    
    add_hours();
    
    // Time
    var time = document.getElementById("time");
    var location = document.getElementById("location");
    var sunrise = document.getElementById("sunrise");
    var sunset = document.getElementById("sunset");
    
    var now = new Date();
    var here = "";

    // Get Location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            here = position;
            var times = set_day_times(here, now);

            // Set Values
            location.innerHTML = pretty_location(here);
            time.innerHTML = pretty_day(now);
            sunrise.innerHTML = pretty_time(times.sunrise);
            sunset.innerHTML = pretty_time(times.sunset);
        });
    } else {
        here = "Your browser is too old to share your location :'(";
        location.innerHTML = pretty_location(here);
    }
}
