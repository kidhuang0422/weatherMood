import axios from 'axios';

// TODO replace the key with yours
const key = '2c9392367fb26153b5cfc2263c0b29b6';
const baseUrl = `http://api.openweathermap.org/data/2.5/weather?appid=${key}`;
const forecaseUrl = `http://api.openweathermap.org/data/2.5/forecast?&appid=${key}`;

export function getWeatherGroup(code) {
    let group = 'na';
    if (200 <= code && code < 300) {
        group = 'thunderstorm';
    } else if (300 <= code && code < 400) {
        group = 'drizzle';
    } else if (500 <= code && code < 600) {
        group = 'rain';
    } else if (600 <= code && code < 700) {
        group = 'snow';
    } else if (700 <= code && code < 800) {
        group = 'atmosphere';
    } else if (800 === code) {
        group = 'clear';
    } else if (801 <= code && code < 900) {
        group = 'clouds';
    }
    return group;
}

export function getDayTxt(day){
    let Txt = '';
    if(day === 0)
        Txt = 'Sun.';
    else if(day === 1)
        Txt = 'Mon.';
    else if(day === 2)
        Txt = 'Tue.';
    else if(day === 3)
        Txt = 'Wed.';
    else if(day === 4)
        Txt = 'Thu.';
    else if(day === 5)
        Txt = 'Fri.';
    else if(day === 6)
        Txt = 'Sat.';
    return Txt;
}

export function capitalize(string) {
    return string.replace(/\b\w/g, l => l.toUpperCase());
}

let weatherSource = axios.CancelToken.source();

export function getWeather(city, unit) {
    var url = `${baseUrl}&q=${encodeURIComponent(city)}&units=${unit}`;

    console.log(`Making request to: ${url}`);

    return axios.get(url, {cancelToken: weatherSource.token}).then(function(res) {
        if (res.data.cod && res.data.message) {
            throw new Error(res.data.message);
        } else {
            // console.log(res.data.weather[0]);
            return {
                city: capitalize(city),
                code: res.data.weather[0].id,
                group: getWeatherGroup(res.data.weather[0].id),
                description: res.data.weather[0].description,
                temp: res.data.main.temp,
                unit: unit // or 'imperial'
            };
        }
    }).catch(function(err) {
        if (axios.isCancel(err)) {
            console.error(err.message, err);
        } else {
            throw err;
        }
    });
}

export function cancelWeather() {
    weatherSource.cancel('Request canceled');
}

export function getForecast(city, unit, offset) {
    // TODO
    var url = `${forecaseUrl}&q=${encodeURIComponent(city)}&units=${unit}`;

    console.log(`Making request to: ${url}`);

    return axios.get(url, {cancelToken: weatherSource.token}).then(function(res) {
        if (res.data.cod && res.data.message) {
            throw new Error(res.data.message);
        } else {
            let dtObject_0 = new Date(res.data.list[0].dt*1000);            
            let whichDate = dtObject_0.getDate() + offset;
            let maxT = -Infinity, minT = Infinity;
            let cntArr = new Array(8), codeArr = new Array(8), desArr = new Array(8);
            let weatherDay;
            cntArr.fill(0);

            for(let i = 0; i < res.data.list.length; i++){
                    let dataList = res.data.list[i];
                    let dtObject = new Date(dataList.dt*1000);

                    if(dtObject.getDate() === whichDate){
                        if(dataList.main.temp_max > maxT)
                            maxT = dataList.main.temp_max;
                        if(dataList.main.temp_min < minT)
                            minT = dataList.main.temp_min;
                        let idx = dataList.weather[0].id % 8;
                        cntArr[idx]++;
                        codeArr[idx] = dataList.weather[0].id;
                        desArr[idx] = dataList.weather[0].description;
                        weatherDay = dtObject.getDay();
                    }
                    else if(dtObject.getDate() > whichDate)
                        break;
            }
            let idx = cntArr.indexOf(Math.max(...cntArr));
            let weatherCode = codeArr[idx];
            let weatherDes = desArr[idx];

            return {
                city: capitalize(city),
                code: weatherCode,
                group: getWeatherGroup(weatherCode),
                description: weatherDes,
                tempMax: maxT,
                tempMin: minT,
                unit: unit, // or 'imperial'
                day: getDayTxt(weatherDay)
            };
        }
    }).catch(function(err) {
        if (axios.isCancel(err)) {
            console.error(err.message, err);
        } else {
            throw err;
        }
    });
}

export function cancelForecast() {
    // TODO
    weatherSource.cancel('Request canceled');
}
