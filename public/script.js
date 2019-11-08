var app = new Vue({
    el: '#app',
    data: {
        sprite: '',
        choices: [],
        message: '',
        questionReady: false,
        imageReady: false,
        pokedexSize: 0,
        difficulties: ['easy', 'hard'],
        difficulty: 0,
        visible: true,
        hasAnswered: true,
        score: 0,
        highscores: {},
    },
    created: function () {
        //get the national pokedex size
        try {
            this.getPokemon("pokedex/1", this.setPokedexSize);
        }
        catch (error) {
            this.message = "Failed to load.  Try refreshing the page."
        }
        this.getHighscore();
    },
    computed: {
        getDifficulty() {
            return this.difficulties[this.difficulty];
        },
        show() {
            let qr = !!this.questionReady;
            let ir = !!this.imageReady;
            return qr && ir;
        }
    },
    methods: {
        async getPokemon(apiParam, exec) {
            var url = "https://pokeapi.co/api/v2/" + apiParam;
            console.log("URL: " + url);
            try {
                let response = await axios.get(url);
                let json = response.data;
                console.log(json);
                if (exec) {
                    exec(json);
                }
                return new Promise((resolve, reject) => resolve());
            }
            catch (error) {
                console.log(error);
                return new Promise((resolve, reject) => reject());
            }
        },
        async getHighscore() {
            var url = "http://pokemon.gavenfinch.site/highscore";
            try {
                let response = await axios.get(url);
                this.highscores = response.data;
                console.log(this.highscores);
            }
            catch (error) {
                console.log(error);
            }
        },
        async submitScore() {
            var url = "http://pokemon.gavenfinch.site/highscore";
            try {
                let response = await axios.put(url, { score: this.score, difficulty: this.difficulties[difficulty] });
                this.highscores = response.data;
            }
            catch (error) {
                console.log(error);
            }

        },
        async createRound() {
            if (!this.hasAnswered)
                return
            let apiParam = "pokemon/";
            this.questionReady = false;
            this.imageReady = false;
            this.message = 'Loading...';
            this.sprite = '';
            this.choices = [];
            this.hasAnswered = false;
            this.setVisibility();

            try {
                await Promise.all([
                    this.getPokemon(apiParam + this.getRandomPokedexNumber() + '/', this.getRightAnswer), // one right answer
                    this.getPokemon(apiParam + this.getRandomPokedexNumber() + '/', this.getWrongAnswer), // three wrong answers
                    this.getPokemon(apiParam + this.getRandomPokedexNumber() + '/', this.getWrongAnswer), // TODO: currently possible to get duplicates in the choices array
                    this.getPokemon(apiParam + this.getRandomPokedexNumber() + '/', this.getWrongAnswer),
                ]);
                this.shuffle();
                this.questionReady = true;
                this.message = "Who's that Pokémon?!"
            }
            catch (err) {
                this.message = "Failed to load."
                this.hasAnswered = true;
            }

        },
        checkAnswer(answer) {
            if (this.hasAnswered) // prevent answering the same question twice
                return;
            this.hasAnswered = true;
            this.visible = true;
            if (answer.correct) {
                this.message = "Correct!";
                this.score++;
            }
            else {
                this.submitScore();
                correctAnswer = this.choices.find(item => { return item.correct })
                this.message = "Incorrect! The correct answer is " + correctAnswer.name;
                this.score = 0;
            }
        },
        shuffle() {
            for (let i = this.choices.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * i)
                const temp = this.choices[i]
                this.choices[i] = this.choices[j]
                this.choices[j] = temp
            }
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
        },
        loaded() {
            this.imageReady = true;
            console.log("loaded");
        }
    },
});
