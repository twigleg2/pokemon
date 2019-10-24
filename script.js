var app = new Vue({
    el: '#app',
    data: {
        extension: '',
    },
    methods: {
        fetchREST() {
            var url = "https://pokeapi.co/api/v2/" + this.extension;
            console.log("URL: " + url);
            fetch(url)
                .then((data) => {
                    return (data.json());
                })
                .then((json) => {
                    console.log("JSON:");
                    console.log(json);
                    this.cities = [];
                    for (let i = 0; i < citylist.length; i++) {
                        console.log(citylist[i].city);
                        this.cities.push({ name: citylist[i].city });
                    };
                    console.log("Got Citylist");
                });
        },
    },
});