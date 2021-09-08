//we can add our token here or we can just add the reference to the token. If we change the token in the future we will have to change it in two places, if we just add a reference we just change it in our env file and then we don't need to worry about changing it in other places. mapToken refers to the token that we have in the show.ejs file.
    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/streets-v10", // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 10, // starting zoom
    });
  
map.addControl(new mapboxgl.NavigationControl());

    // we make a marker then set the long latitude on that marker, then we make a pop up pass that in and then add to the map.
new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
            `<h3>${campground.title}</h3><p>${campground.location}</p>`
        )
    )
    .addTo(map);