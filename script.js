const apiKey = "7de70d577a7f4af2bdb83905251404";

window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      getWeatherByCoords(lat, lon);
    });
  }
};

function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    alert("도시 이름을 입력해주세요.");
    return;
  }
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=1&lang=ko`;
  fetchWeather(url);
}

function getWeatherByCoords(lat, lon) {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=1&lang=ko`;
  fetchWeather(url);
}

function fetchWeather(url) {
  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("날씨 정보를 가져오는 데 실패했습니다.");
      return res.json();
    })
    .then(data => {
      displayWeather(data);
      displayHourly(data.forecast.forecastday[0].hour);
    })
    .catch(err => {
      document.getElementById("weatherResult").innerHTML = `<p style="color: red;">${err.message}</p>`;
    });
}

function displayWeather(data) {
  const { location, current } = data;
  const condition = current.condition.text;
  const iconUrl = `https:${current.condition.icon}`;

  document.getElementById("weatherResult").innerHTML = `
    <p><strong>${location.name}, ${location.country}</strong>의 현재 날씨</p>
    <img class="weather-icon" src="${iconUrl}" alt="날씨 아이콘">
    <p>🌤 상태: ${condition}</p>
    <p>🌡 온도: ${current.temp_c}°C (체감: ${current.feelslike_c}°C)</p>
    <p>💧 습도: ${current.humidity}%</p>
  `;

  updateBackground(condition);
}

function displayHourly(hourData) {
  const container = document.getElementById("hourlyForecast");
  const title = document.getElementById("hourlyTitle");
  container.innerHTML = '';
  title.style.display = 'block';

  hourData.forEach(hour => {
    const time = hour.time.split(' ')[1]; // 'YYYY-MM-DD HH:MM'
    const icon = `https:${hour.condition.icon}`;
    const temp = hour.temp_c;

    const card = document.createElement('div');
    card.className = 'hour-card';
    card.innerHTML = `
      <p>${time}</p>
      <img src="${icon}" alt="아이콘">
      <p>${temp}°C</p>
    `;
    container.appendChild(card);
  });
}

function updateBackground(condition) {
  const body = document.body;
  let background = '';

  if (condition.includes("맑음")) {
    background = "url('images/clear.jpg')";
  } else if (condition.includes("구름")) {
    background = "url('images/cloudy.jpg')";
  } else if (condition.includes("비")) {
    background = "url('images/rain.jpg')";
  } else if (condition.includes("눈")) {
    background = "url('images/snow.jpg')";
  } else if (condition.includes("안개")) {
    background = "url('images/mist.jpg')";
  } else {
    background = "url('images/default.jpg')";
  }

  body.style.backgroundImage = background;
}
