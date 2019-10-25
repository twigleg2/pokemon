var app = new Vue({
    el: '#app',
    data: {
        sprite: '',
        choices: [],
        message: '',
        ready: false,
        pokedexSize: 0,
        difficulties: ['easy', 'hard'],
        difficulty: 0,
        visible: true,
    },
    created: function () {
        //get the national pokedex size
        this.GET("pokedex/1", this.setPokedexSize);
    },
    computed: {
        getDifficulty() {
            return this.difficulties[this.difficulty];
        },
    },
    methods: {
        async GET(apiParam, exec) {
            var url = "https://pokeapi.co/api/v2/" + apiParam;
            console.log("URL: " + url);
            try {
                let response = await axios.get(url);
                let json = response.data;
                console.log(json);
                if (exec) {
                    console.log("executing");
                    exec(json);
                }
                return new Promise((resolve, reject) => resolve());
            }
            catch (error) {
                console.log(error);
            }
        },
        async getRound() {
            let apiParam = "pokemon/";
            this.ready = false;
            this.message = '';
            this.sprite = '';
            this.choices = [];
            this.setVisibility();

            await Promise.all([
                this.GET(apiParam + this.getRandomPokedexNumber() + '/', this.getRightAnswer), // one right answer
                this.GET(apiParam + this.getRandomPokedexNumber() + '/', this.getWrongAnswer), // three wrong answers
                this.GET(apiParam + this.getRandomPokedexNumber() + '/', this.getWrongAnswer), // TODO: currently possible to get duplicates in the choices array
                this.GET(apiParam + this.getRandomPokedexNumber() + '/', this.getWrongAnswer),
            ]);
            this.shuffle();
            this.ready = true;

        },
        checkAnswer(answer) {
            this.visible = true;
            if (answer.correct) {
                this.message = "CORRECT!";
            }
            else {
                correctAnswer = this.choices.find(item => { return item.correct })
                this.message = "INCORRECT! The correct answer is " + correctAnswer.name;
            }
        },
        shuffle() {
            for (let i = this.choices.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * i)
                const temp = this.choices[i]
                this.choices[i] = this.choices[j]
                this.choices[j] = temp
            }
            console.log(this.choices);
        },
        getRandomPokedexNumber() {
            return Math.floor(Math.random() * this.pokedexSize);
        },
        getRightAnswer(json) {
            this.sprite = json.sprites.front_default;
            this.choices.push({ name: json.name, correct: true });
        },
        getWrongAnswer(json) {
            this.choices.push({ name: json.name, correct: false });
        },
        setPokedexSize(json) {
            this.pokedexSize = json.pokemon_entries.length;
        },
        changeDifficulty() {
            this.difficulty = (this.difficulty + 1) % this.difficulties.length;
        },
        setVisibility() {
            if (this.difficulty === this.difficulties.length - 1)
                this.visible = false;
        }
    },
});
