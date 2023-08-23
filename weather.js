// setting all the variable
let container = document.getElementsByClassName("container")[0];
let curr_time = document.getElementById("curr_time");
let curr_date = document.getElementById("curr_date");
let curr_temp = document.getElementById("curr_temp");
let curr_winds = document.getElementById("curr_winds");
let curr_windd = document.getElementById("curr_windd");
let hourly = document.getElementById("hourly");
let riseset = document.getElementsByClassName("riseset");
let date_daily = Array.from(document.getElementsByClassName("date"));
let rise = Array.from(document.getElementsByClassName("rise"));
let set = Array.from(document.getElementsByClassName("set"));
let uv = Array.from(document.getElementsByClassName("uv"));
let sunss = document.querySelectorAll(".icon_spin .fa-sun");
let suns = Array.from(document.getElementsByClassName("fa-sun"));
let icon_spin = Array.from(document.getElementsByClassName("icon_spin"));
let main = document.getElementsByClassName("main_content")[0];
let landing = document.getElementsByClassName("landing")[0];
let search = document.getElementById("search_id");
let nav_box = document.getElementById("navbarSupportedContent");
let input = document.getElementById("input");
let title = document.getElementById("current_a");
let loading = document.getElementsByClassName("loading")[0];



landing.style.display = "flex";
//search for coordinates according to the city name
search.addEventListener("submit", (event) => {
    loading.style.display = "flex"
    let req = new XMLHttpRequest();
    event.preventDefault()
    req.onerror = goterror;
    let city_name = document.getElementById("input").value;
    req.open("get", `city_search.php?city=${city_name}&submit=`)
    req.send();
    req.onload = getdata;
})
//getting the weather data by the coordinates
let getdata = function (event) {
    let response = JSON.parse(event.target.responseText);
    if (response.lat == undefined) {
        loading.style.display = "none"
        alert(response.message)
    }
    else {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `https://api.open-meteo.com/v1/forecast?latitude=${response.lat}&longitude=${response.lng}&hourly=temperature_2m,precipitation_probability,rain,showers,windspeed_10m&daily=sunrise,sunset,uv_index_max&timezone=auto&forecast_days=3&current_weather=true`);

        xhr.onload = function () {
            main.style.display = "flex"
            loading.style.display = "none"
            search.classList.remove("justify-content-center", "align-items-center", "w-75")
            input.value = ""
            nav_box.appendChild(search);
            title.innerText = "Current Weather" + " of " + response.city
            landing.style.display = "none"
            if (xhr.status == 200) {
                let data = JSON.parse(xhr.responseText);
                let curr = data.current_weather

                curr_date.innerText = curr.time.slice(0, 10);
                let hour = (time_curr.getHours() < 10) ? "0" + time_curr.getHours() : time_curr.getHours();
                let minute = (time_curr.getMinutes() < 10) ? "0" + time_curr.getMinutes() : time_curr.getMinutes();

                curr_time.innerText = hour + ":" + minute;
                setInterval(() => {
                    time_curr = new Date()
                    hour = (time_curr.getHours() < 10) ? "0" + time_curr.getHours() : time_curr.getHours();
                    minute = (time_curr.getMinutes() < 10) ? "0" + time_curr.getMinutes() : time_curr.getMinutes();
                    curr_time.innerText = hour + ":" + minute;
                }, 30000);
                curr_temp.innerText = curr.temperature + "°C"
                curr_winds.innerText = "Wind Speed: " + curr.windspeed
                curr_windd.innerText = "Wind Direction: " + curr.winddirection

                const data_time = [];
                data.hourly.time.forEach(time => {
                    data_time.push(time.slice(-5))
                });
                let data_preci = data.hourly.precipitation_probability;
                let data_rain = data.hourly.rain;
                let data_shower = data.hourly.showers;
                function name_day(text) {
                    let card = document.createElement("div");
                    let day = document.createElement("h4");
                    day.setAttribute("class", "text-light text-center p-2")
                    day.innerText = text;
                    card.appendChild(day);
                    hourly.appendChild(card)
                }
                let sibling = Array.from(document.querySelectorAll(".hourly_head ~ div"));
                sibling.forEach(element =>
                    element.remove())

                for (let i in data_time) {
                    if (i == 0) {
                        let day_text = "T O D A Y"
                        name_day(day_text)
                    }
                    else if (i == 24) {
                        let day_text = "T O M O R R O W"
                        name_day(day_text)
                    }
                    else if (i == 48) {
                        let day_text = "O V E R M O R R O W"
                        name_day(day_text)
                    }
                    let card = document.createElement("div");
                    let time_div = document.createElement("p");
                    time_div.setAttribute("class", "time_hourly col-3")
                    time_div.innerText = data_time[i]
                    let rain_div = document.createElement("p");
                    rain_div.innerText = data_rain[i];
                    rain_div.setAttribute("class", "rain col-3")
                    let showers_div = document.createElement("p");
                    showers_div.innerText = data_shower[i];
                    showers_div.setAttribute("class", "shower col-3")
                    let preci_div = document.createElement("p");
                    preci_div.setAttribute("class", "preci col-3")
                    preci_div.innerText = data_preci[i];
                    card.setAttribute("class", " hourly_card card text-light row align-items-center");
                    card.appendChild(time_div)
                    card.appendChild(rain_div)
                    card.appendChild(showers_div)
                    card.appendChild(preci_div)
                    hourly.appendChild(card)
                }
                let daily_rise = data.daily.sunrise
                let daily_set = data.daily.sunset
                let daily_uv = data.daily.uv_index_max

                date_daily[0].innerText = "Today"
                rise[0].innerText = daily_rise[0].slice(11) + " AM"
                set[0].innerText = daily_set[0].slice(11) + " PM"
                uv[0].innerText = "UV Index: " + daily_uv[0]
            }
        }
        xhr.send();
    }
}
let time_curr = new Date()
let goterror = function () {
    alert("An error occured")
}
//sun icon spin when mouseover
icon_spin.forEach(icon => {
    icon.addEventListener("mouseover", () => {
        icon.lastElementChild.classList.add("fa-spin")
    })
    icon.addEventListener("mouseout", () => {
        icon.lastElementChild.classList.remove("fa-spin")
    })
})