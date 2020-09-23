// Day
// Author: pjpscriv

// Millisec per Day
const day_ms = 24*60*60*1000;

// Styles
// const day_color   = "#317bea";
const transparent = "transparent";
const line_width  = 4;

// Day Colors
// const day_color   = "rgb(149, 191, 255)";
// const night_color = "rgb(46, 73, 216)";
// const bg_color    = day_color;
// const font_color  = "black"; // also border & hour

// Night Colors
const day_color   = "rgb(62, 88, 128)";
const night_color = "#222222";
const bg_color    = night_color;
const font_color  = "white"; // also border & hour

// Debug Styles
// const day_color   = "#55000088";
// const night_color = "#00005588";

// HTML Tags
const body_tag     = document.getElementsByTagName('body')[0];
const time_tag     = document.getElementById("time");
const location_tag = document.getElementById("location");
const sunrise_tag  = document.getElementById("sunrise");
const sunset_tag   = document.getElementById("sunset");
const day_tag      = document.getElementById("day");

// Globals
var here = null;
var now = new Date();
var day_move = 0;

// Helper
function addListeners(element, events, fn) {
    events.split(' ').forEach(e => element.addEventListener(e, fn, false));
}


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

// Add to UI
function add_hours(num_hours) {   
    var dp = 1000;
    var rot_segment = 2*Math.PI / num_hours;
    
    for (let i = 0; i < num_hours; i++) {    
        let rotation = (rot_segment * i);
        let y = Math.round((Math.sin(rotation) * 36.6)*dp) / dp * -1;
        let x = Math.round((Math.cos(rotation) * 36.6)*dp) / dp;

        var hour_tag = document.createElement('hour');
        hour_tag.style.transform = `translate(${y}vmin, ${x}vmin) rotate(${rotation}rad)`;
        hour_tag.style.width = line_width+"px";
        hour_tag.style.backgroundColor = font_color;
        hour_tag.id = "hour_" + i;
        day_tag.appendChild(hour_tag);
    }
}

function add_time(time, name) {

    var today = new Date()

    var tag = document.getElementById(name);
    if (tag == null) {
        tag = document.createElement(name);
    }
   
    if (name === "now" && pretty_day(time) !== pretty_day(today)) {
        tag.style.display = "none";
    } else {
        var dp = 1000;
        var ms = time.getHours()*60*60*1000;
        ms += time.getMinutes()*60*1000;
        ms += time.getSeconds()*1000;
        ms += time.getMilliseconds();

        var rotation = 2*Math.PI * (ms/day_ms);

        let y = Math.round((Math.sin(rotation) * 34.5)*dp) / dp * -1;
        let x = Math.round((Math.cos(rotation) * 34.5)*dp) / dp;

        tag.style.display = "block"
        tag.style.transform = `translate(${y}vmin, ${x}vmin) rotate(${rotation}rad)`;
        tag.style.width = line_width+"px";
        tag.className = "time";
        tag.id = name;
        day_tag.appendChild(tag);
    }
}

// Maths
function get_sun_times(here, now) {
    return SunCalc.getTimes(now, here.coords.latitude, here.coords.longitude);
}

function get_angle(date) {
    var ms = date.getHours()*60*60*1000;
    ms += date.getMinutes()*60*1000;
    ms += date.getSeconds()*1000;
    ms += date.getMilliseconds();

    var circle_percent = ms/day_ms;
    return (circle_percent * 2*Math.PI) - Math.PI/2;
}

// Listeners
function add_listeners() {
    // Click Listeners
    addListeners(document.getElementById('time'), 'click', () => {
        day_move = 0;
        update_ui();
    });
    addListeners(document.getElementById('previous_day'), 'click', () => {
        day_move -= 1;
        update_ui();
    });
    addListeners(document.getElementById('next_day'), 'click', () => {
        day_move += 1;
        update_ui();
    });

    addListeners(document.getElementById('lat_up'), 'click', () => {
        here = {
            coords: {
                latitude: Math.min(here.coords.latitude + 1, 90),
                longitude: here.coords.longitude
            }
        }
        update_ui()
    });
    addListeners(document.getElementById('lat_down'), 'click', () => {
        here = {
            coords: {
                latitude: Math.max(here.coords.latitude - 1, -90),
                longitude: here.coords.longitude
            }
        }
        update_ui()
    });
    addListeners(document.getElementById('location'), 'click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                here = position;
                update_ui();
            });
        } else {
            here = "Your browser is too old to share your location :'(";
            location_tag.innerHTML = here;
        }
    });

    // Hold Listeners
    var backward_interval = '';
    addListeners(document.getElementById('fast_backward'), 'mousedown touchstart', (e) => {
        backward_interval = setInterval(() => {
            day_move -= 1;
            update_ui();
        }, 20);
    });
    addListeners(document.getElementById('fast_backward'), 'mouseleave mouseup touchend', (e) => {
        clearInterval(backward_interval);
    });

    var forward_interval = '';
    addListeners(document.getElementById('fast_forward'), 'mousedown touchstart', (e) => {
        forward_interval = setInterval(() => {
            day_move += 1;
            update_ui();
        }, 20);
    });
    addListeners(document.getElementById('fast_forward'), 'mouseleave mouseup touchend', (e) => {
        clearInterval(forward_interval);
    });
}


function update_ui() {

    if (here == null || day_move == null) {
        return;
    }

    now = new Date(Date.now() + (day_move*day_ms));
    var times = get_sun_times(here, now);
    // console.log(times);

    // Set Values
    time_tag.innerHTML     = pretty_day(now);
    location_tag.innerHTML = pretty_location(here);
    var gradient;

    // Check day has sunrise & sunset
    if (!isNaN(times.sunrise) && !isNaN(times.sunset)) {
        sunrise_tag.innerHTML  = pretty_time(times.sunrise);
        sunset_tag.innerHTML   = pretty_time(times.sunset);

        // Set Gradients
        var sunrise_angle = get_angle(times.sunrise);
        var sunset_angle  = get_angle(times.sunset);
        if ((times.sunset - times.sunrise) > (day_ms / 2)) {
            // Longer Day
            gradient = `linear-gradient(${sunrise_angle}rad, ${transparent} 50%, ${day_color} 50%),
                        linear-gradient(${sunset_angle}rad, ${transparent} 50%, ${night_color} 50%)`;
        } else {
            // Longer Night
            gradient = `linear-gradient(${sunrise_angle}rad, ${night_color} 50%, ${transparent} 50%), 
                        linear-gradient(${sunset_angle}rad, ${transparent} 50%, ${night_color} 50%)`
        }
    } else {
        sunrise_tag.innerHTML = "No Sunrise";
        sunset_tag.innerHTML = "No Sunset";

        // Hack - should be a better way of doing this
        if (isNaN(times.night)) {
            gradient = `linear-gradient(0rad, ${day_color} 50%, ${day_color} 50%)`;
        } else {
            gradient = `linear-gradient(0rad, ${night_color} 50%, ${night_color} 50%)`;
        }    
    }
    day_tag.style.backgroundImage = gradient;
    // Add Times
    add_time(now, 'now');
    add_time(times.solarNoon, 'solarnoon');
    // Tomorrow's nadir for nice Daylight Savings behaviour
    add_time(new Date(times.nadir.getTime() + day_ms), 'nadir');

    console.log("Updated", pretty_day(now), pretty_time(now));
}


window.onload = () => {
    // Set Styles
    add_hours(24);
    body_tag.style.color = font_color;
    body_tag.style.backgroundColor = bg_color;
    day_tag.style.borderWidth = line_width+"px";
    day_tag.style.borderColor = font_color;
    day_tag.style.backgroundColor = day_color;

    // Listeners
    add_listeners();

    // Time
    now = new Date(Date.now() + (day_move*day_ms));
    add_time(now, 'now');

    // Location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            here = position;
            update_ui();
        });
    } else {
        here = "Your browser is too old to share your location :'(";
        location_tag.innerHTML = here;
    }

    // Update each minute
    // setInterval(() => { update_ui() }, 10*1000);
}
