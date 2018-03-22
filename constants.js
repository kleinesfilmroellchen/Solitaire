///// Constants

//Detects mobile devices
const IS_MOBILE = window.matchMedia("only screen and (max-width: 760px)");

//Draw size of the cards
const CARD_SIZE = 70;
//Spacing in between the cards
const CARD_SPACING = CARD_SIZE / 8;
//Round corner size of the cards
const CORNER_SIZE = 0;
//Stripe spacing. Increase to make stripes more separate
//Non-divisibles of the card size are recommended
const STRIPE_SPACING = 11;
//X Position of the final stacks
const FINAL_POS = CARD_SIZE * 4;

//Number of "working" stacks at the bottom
const STACK_COUNT = 7;

//time in milliseconds an animation takes
const ANIMATION_TIME = 500;

//loader for language: searches for any languages in the language information fields provided in navigator
const loadLang = () => supportedLocales.includes(navigator.userLanguage ||
		((navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.language) ||
		navigator.browserLanguage || navigator.systemLanguage) ?

	(navigator.userLanguage ||
		((navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.language) ||
		navigator.browserLanguage || navigator.systemLanguage) :
	"en";

//supported language locale strings
const supportedLocales = ["en", "de-DE", "de"];

//Language data object
let languageData;

//Card colors
const cCol = {
	DIAMONDS: Symbol("Diamonds"),
	CLUBS: Symbol("Clubs"),
	HEARTS: Symbol("Hearts"),
	SPADES: Symbol("Crosses"),
}

//for mouse presses
const CLICK = Symbol('click');
const DRAG = Symbol('dragging');

//for old card stack storage

const OPEN_STACK = Symbol('open stack');

//Formats a value to a nice string
const valToString = value => {
	//if value smaller than 10 add one (e.g. 9 -> 10, 6 -> 7 etc.)
	if (value < 10) return "" + (value + 1);
	return (value == 10) ? languageData["jack-short"] : (value == 11) ? languageData["queen-short"] : (value == 12) ? languageData["king-short"] : languageData["ace-short"];
};
