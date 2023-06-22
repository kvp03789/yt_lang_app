import { displayFlashCardsDom } from "./domStuff";

const container = document.querySelector('.traanscript-container');
const card = document.querySelector(".card")
const cardFrontContainer = document.querySelector('.card-front');
const cardBackContainer = document.querySelector('.card-back')
const checkAnswerButton = document.querySelector('#check-answer-button')
const nextCardButton = document.querySelector('#next-card-button')
const frontCardPara = document.querySelector('.front-card-text')
const backCardPara = document.querySelector('.back-card-text')

export const cardDeck = {
    deckName: '',

    deck: [],
        //format like this: {front: 'question1', back: 'answer1'}

    counter: 0,

    populateFirstCards(){
        frontCardPara.innerText = `${this.deck[this.counter].front}`;
        backCardPara.innerText = `${this.deck[this.counter].back}`
    },

    showNextCard(){
        this.counter++;
        if(this.counter > this.deck.length - 1){
            this.counter = 0;
        }
        const frontCardPara = document.querySelector('.front-card-text')
        const backCardPara = document.querySelector('.back-card-text')
        frontCardPara.innerText = `${this.deck[this.counter].front}`;
        backCardPara.innerText = `${this.deck[this.counter].back}`
    }
}





