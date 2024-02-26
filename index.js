const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");

const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer =document.querySelector(".user-info-container");

//initially variable need

let currentTab=userTab;
const API_KEY="6f8df6fc830dd8f6258ed0a435f2c1d3";
currentTab.classList.add("current-tab");
getformSessionStorage();


function switchTab(clickedTab){
if(clickedTab != currentTab){
    currentTab.classList.remove("current-tab");
    currentTab=clickedTab;
    currentTab.classList.add("current-tab");

    if(!searchForm.classList.contains("active")){
        //kya search form wala container is invisible
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
    }else{
        //main phle search wale tab ab your weather tab ko visible krna hai
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        getformSessionStorage();
    }

}
}

userTab.addEventListener("click", ()=>{
    //pass clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click", ()=>{
    //pass clicked tab as input parameter
    switchTab(searchTab);
});

//check if cordinates are already present in session storage
function getformSessionStorage(){
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if(!localCoordinates){
    //agar local coordinates nahi mila
    grantAccessContainer.classList.add("active");
  }else{
    const coordinates=JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}


 async function fetchUserWeatherInfo(coordinates){
  const {lat, lon}=coordinates;
  //make grantcontainer invisible
  grantAccessContainer.classList.remove("active");
  //make loader visible
  loadingScreen.classList.add("active");

  //API Call
  try{
    const response= await fetch(
`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data=await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  }catch(err){
    loadingScreen.classList.remove("active");
    //hw
    
  }
}


function renderWeatherInfo(weatherInfo){
    //firstly, we have to fecth the elements

    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherdesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windsepeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]")

    //fetch values from weatherInfo object and put it UI elements

    cityName.innerText=weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=`${weatherInfo?.main?.temp}°c`;
    windspeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;


}

function getLocation()
{
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(showPosition);
  }else{
    //hw-show an alert for no geolocation support available
    
  }
}

function showPosition(position){
  const userCoordinates={
    lat:position.coords.latitude,
    lon:position.coords.longitude,
}

  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);


const searchInput=document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
e.preventDefault();
let cityName=searchInput.value;

if(cityName === "")
  return;
else
  fetchSearchWeatherInfo(cityName);

})


 async function fetchSearchWeatherInfo(city){
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");

  try{
    const response= await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
          );
          const data=await response.json();
          loadingScreen.classList.remove("active"); 
          userInfoContainer.classList.add("active");
          renderWeatherInfo(data);
  }
  catch(err){
  //hw
    console.log("API Error");
  }
}