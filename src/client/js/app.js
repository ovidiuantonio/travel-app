function getData() {
  const appid = "ovidiuantonio";
  const baseURL = "http://api.geonames.org/searchJSON?";

  const bitURL = "http://api.weatherbit.io/v2.0/forecast/daily?";
  const bitKey = "e8bf025e36934fc0aec08e26cec87147";

  const pixURL = "https://pixabay.com/api/?";
  const pixKey = "15978844-66ae615deb62b69c09eb0e5c3";

  const restURL = "https://restcountries.eu/rest/v2/name/";

  const cityInput = document.getElementById("city");

  const getWeather = async (baseURL, city, api) => {
    const url1 = `${baseURL}q=${city}&username=${api}`;
    const response = await fetch(url1);
    let jsonResponse = await response.json();
    return jsonResponse;
  };

  const getFutureWeather = async (bitURL, city, key) => {
    const url2 = `${bitURL}city=${city}&key=${key}`;
    const response = await fetch(url2);
    let jsonResponse = await response.json();
    return jsonResponse;
  };

  const getPhoto = async (pixURL, city, key) => {
    const url3 = `${pixURL}key=${key}&q=${city}&image_type=photo`;
    const response = await fetch(url3);
    let jsonResponse = await response.json();
    return jsonResponse;
  };

  const getCountryData = async (url, city) => {
    const url4 = `${url}${city}`;
    const response = await fetch(url4);
    let jsonResponse = await response.json();
    return jsonResponse;
  };

  const postData = async (data = {}) => {
    const response = await fetch("/", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };

  const updateUI = async () => {
    const res = await fetch("/trip");
    const data = await res.json();
    //GETTING THE ELEMENTS I WANT TO MODIFY

    const stateData = document.querySelector(".state");
    const tempData = document.querySelector(".temp");
    const until = document.querySelector(".until");
    const leng = document.querySelector(".length");
    const img = document.querySelector(".image img");
    const facts = document.querySelector(".facts");

    stateData.textContent = `${data.city}, ${data.country}`;
    tempData.textContent = `Min Temperature: ${data.min_temp}C - Max Temperature: ${data.max_temp}C`;
    until.textContent = `Days until trip: ${data.daysUntilTrip} days`;
    facts.textContent = `Capital: ${data.capital} - Currency: ${data.currency}`;
    leng.textContent = `3 DAYS ONLY!`;
    leng.style.color = "rgb(235, 250, 33)";

    //I UPDATE THE IMG SOURCE

    img.setAttribute("src", `${data.image}`);

    //IF THERE IS A SOURCE AND IMG DISPLAYS IT WILL BE PERFECT, BUT IF THE IMG SRC IS MISSING THE CUSTOM ERROR MESSAGE
    //WILL APPEAR

    img.setAttribute("alt", `${data.error}`);
  };

  const handleClick = async () => {
    //i GOT THE DATE ENTERED BY THE USER AND I CREATED THE CURRENT DATE IN A NEW VAR
    var dateUser = new Date(document.getElementById("date").value);
    var d = new Date().getDate();

    //I GOT THE START AND THE END DATE FOR THE TRIP

    var startDate = `${dateUser.getFullYear()}-${
      dateUser.getMonth() + 1
    }-${dateUser.getDate()}`;
    // +3 BECAUSE THE TRIP WITH TAROM AIRLINES LASTS ONLY 3 DAYS
    var endDate = `${dateUser.getFullYear()}-${dateUser.getMonth() + 1}-${
      dateUser.getDate() + 3
    }`;

    //THE NR OF DAYS UNTIL DEPARTING

    var rest = dateUser.getDate() - d;

    //I GOT THE CITY DATA

    const cityData = await getWeather(baseURL, cityInput.value, appid);
    const data = {
      lat: cityData.geonames[0].lat,
      long: cityData.geonames[0].lng,
      country: cityData.geonames[0].countryName,
      daysUntilTrip: rest,
      start: startDate,
      end: endDate,
    };

    //I GOT THE WEATHER IN THE FUTURE

    const dataFuture = await getFutureWeather(bitURL, cityInput.value, bitKey);

    //IF THE CITY PHOTO WAS AVAILABLE I USE IT, IF NOT I ADD AN ERROR MESSAGE

    const photoInfo = await getPhoto(pixURL, cityInput.value, pixKey);

    if (typeof photoInfo.hits !== "undefined" && photoInfo.hits.length > 0) {
      dataFuture["photoURL"] = photoInfo.hits[0].webformatURL;
      dataFuture["photoError"] = "";
    } else {
      dataFuture["photoURL"] = "";
      dataFuture["photoError"] =
        "Couldn't find any photo to match your destination!";
    }

    //GET FACTS ABOUT COUNTRY, EX: CURRENCY, CAPITAL

    const countryInfo = await getCountryData(restURL, data.country);

    dataFuture["capital"] = countryInfo[0].capital;
    dataFuture["currency"] = countryInfo[0].currencies[0].name;

    //MERGE THE 2 OBJECTS

    const allData = { ...data, ...dataFuture };

    //CONSOLE LOG SO I CAN LOOK BETTER AT THE DATA I GOT

    console.log(allData);

    //POST THE DATA

    await postData(allData);

    //UPDATE THE UI

    updateUI();
  };

  const ele = document.getElementById("generate");
  ele.addEventListener("click", handleClick);
}

export { getData };
export default getData;
