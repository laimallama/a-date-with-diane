const fs = require("fs");
const vm = require("vm");
const { earlyBushHouseBase } = require("./check_endings.js");

const EN_HTML = "outputs/en/dianedate_en.html";
const CN_HTML = "outputs/cn/dianedate_cn.html";
const ES_HTML = "outputs/es/dianedate_es.html";
const FR_HTML = "outputs/fr/dianedate_fr.html";
const TW_HTML = "outputs/tw/dianedate_tw.html";
const EN_GUIDE = "outputs/en/endings/dianeguide_en.txt";
const CN_GUIDE = "outputs/cn/endings/dianeguide_cn.txt";
const ES_GUIDE = "outputs/es/endings/dianeguide_es.txt";
const FR_GUIDE = "outputs/fr/endings/dianeguide_fr.txt";
const TW_GUIDE = "outputs/tw/endings/dianeguide_tw.txt";
const LEGACY_GUIDE_DIRS = [
  "outputs/en/guides",
  "outputs/cn/guides",
  "outputs/es/guides",
  "outputs/fr/guides",
];
const LEGACY_GUIDE_FILES = [
  "outputs/en/dianeguide_en.txt",
  "outputs/cn/dianeguide_cn.txt",
  "outputs/es/dianeguide_es.txt",
  "outputs/fr/dianeguide_fr.txt",
  "outputs/en/hidden_scenes_guide_en.txt",
  "outputs/cn/hidden_scenes_guide_cn.txt",
  "outputs/es/hidden_scenes_guide_es.txt",
  "outputs/fr/hidden_scenes_guide_fr.txt",
];

const common = [
  "I’m 18 or over.",
  "I've already read them. I'll get straight on with the game.",
  "When can you see her?",
];

const tuesdayShortHouse = common.concat([
  "Tuesday.",
  "On with the story!",
  "Just go there.",
  "Say let’s go in and eat, then.",
  "A bottle of Spanish Rioja (£12)",
  "Go on to the food menu.",
  "Ravioli—you’re trying to save money (£7)",
  "Begin the meal.",
  "You chat about your meal.",
  "You carry on chatting.",
  "You carry on chatting.",
  "You carry on chatting.",
  "You carry on chatting.",
  "You carry on chatting.",
  "Cheers.",
  "Yes, let’s have a sweet.",
  "Tiramisu (£5 each)",
  "The sweets are delicious and quickly eaten.",
  "Just an ordinary filter coffee (£1 each)",
  "You carry on chatting.",
  "You leave the restaurant and head into the theatre.",
  "Think about it.",
  "Or do you want to play the short version of the game?",
  "Yes, I’ll play the short version.",
  "Let’s see what happens!",
  "You find the key.",
  "You give her a kiss.",
  "You usher Diane in.",
  "A small mug of real filter coffee?",
  "You drink the coffee.",
  "What will you do next?",
  "You move to the lounge.",
  "What will you do next?",
  "So she says nothing.",
]);

const saturdayTheatre = common.concat([
  "Saturday.",
  "On with the story!",
  "Just go there.",
  "Say you wish you were on her side of the table.",
  "OK.",
  "A bottle of Italian Pinot Grigio (£10)",
  "Go on to the food menu.",
  "Tortelloni, the same as Diane (£9)",
  "Begin the meal.",
  "You chat about your meal.",
  "You carry on eating.",
  "What will it be?",
  "Ask if she wants a pee?",
  "You order two coffees.",
  "You smile at her.",
  "You head into the theatre.",
  "You head into the theatre.",
  "You watch the play.",
  "Thinking about the way you met?",
  "Concentrate on the play.",
  "Just carry on watching the play.",
  "Carry on watching the play.",
  "Carry on watching the play.",
  "Just carry on watching the play.",
  "Concentrate on the play.",
  "Concentrate on the play.",
  "You look at Diane.",
  "You chat about the play.",
  "Use a luckshot?",
  "You wait for her.",
  "You go out onto the balcony.",
  "Time to return to the play.",
  "You go back to your seats.",
  "The second act begins.",
  "Just carry on watching the play.",
  "The actress really knows how to play desperation.",
  "You’re enjoying the play.",
  "The play continues.",
  "The lights dim.",
  "The play continues.",
  "The play has almost ended.",
  "You stand up to leave the theatre.",
  "In the meantime everyone is filing out of the auditorium.",
  "Be a gentleman and ask Diane what she wants to do.",
  "You head for the stagedoor.",
  "—and head towards the stage door.",
  "You wait for Molly.",
  "You wait for Molly.",
  "You shake hands with Molly and her friend.",
]);

const saturdayHouse = saturdayTheatre.concat([
  "Which will it be?",
  "Go for the walk.",
  "You walk on.",
  "You reach the river.",
  "You say there really isn’t time.",
  "You walk on.",
  "You walk on.",
  "You walk on.",
  "What are you going to talk about?",
  "Nothing in particular.",
  "OK.",
  "You hurry up.",
  "Hurrah!",
  "You stop in your tracks.",
  "You walk on.",
  "You hurry along.",
  "You buy the drinks.",
  "You go to the bar.",
  "You chat away.",
  "You chat away.",
  "You chat on.",
  "No, I’m running out of money.",
  "No, I can’t afford it.",
  "You drink up.",
  "Yes, you’ve plenty of time.",
  "You look for the bus stop.",
  "You carry on waiting.",
  "Think about it.",
  "Get the taxi?",
  "Find a taxi.",
  "You wait.",
  "You carry on waiting.",
  "You are at the front of the queue.",
  "The taxi pulls away onto the main road.",
  "Put your arm round her?",
  "The journey continues.",
  "You’re about halfway home.",
  "Almost home.",
  "The taxi continues to your house.",
  "You get out.",
  "You find the key.",
  "You give her a kiss.",
  "They shake hands.",
  "A small mug of real filter coffee?",
  "You drink the coffee.",
  "He goes upstairs.",
  "What will you do next?",
  "So she says nothing.",
]);

const firstDrink = [
  "Offer her another drink?",
  "You go to the kitchen.",
  "Cheers!",
  "You carry on exploring and talking.",
];

const repeatDrink = [
  "Get her another drink?",
  "You go to the kitchen.",
  "Cheers!",
  "You carry on exploring and talking.",
];

const thursdayFifthBase = common.concat([
  "Thursday.",
  "On with the story!",
  "Just go there.",
  "Say you’ve really been looking forward to seeing each other again.",
  "OK.",
  "A bottle of Spanish Rioja (£12)",
  "Go on to the food menu.",
  "Ravioli—you’re trying to save money (£7)",
  "Begin the meal.",
  "You chat about your meal.",
  "You carry on chatting.",
  "You carry on chatting.",
  "You carry on chatting.",
  "You carry on chatting.",
  "You carry on chatting.",
  "Cheers.",
  "Yes, let’s have a sweet.",
  "Tiramisu (£5 each)",
  "The sweets are delicious and quickly eaten.",
  "An espresso (£1.50 each)",
  "You carry on chatting.",
  "You leave the restaurant and head into the theatre.",
  "Think about it.",
  "Or do you want to play the short version of the game?",
  "Yes, I’ll play the short version.",
  "Let’s see what happens!",
  "You find the key.",
  "You give her a kiss.",
  "You usher Diane in.",
  "A small mug of real filter coffee?",
  "You drink the coffee.",
  "What will you do next?",
  "You move to the lounge.",
  "What will you do next?",
  "So she says nothing.",
]);

const chloeBase = common.concat([
  "Tuesday.",
  "On with the story!",
  "Just go there.",
  "Say let’s go in and eat, then.",
  "A bottle of Spanish Rioja (£12)",
  "Go on to the food menu.",
  "Spaghetti bolognese (£8)",
  "Begin the meal.",
  "You chat about your meal.",
  "You concentrate on your eating.",
  "You carry on chatting.",
  "You carry on chatting.",
  "You carry on chatting.",
  "Cheers.",
  "Yes, let’s have a sweet.",
  "Tiramisu (£5 each)",
  "The sweets are delicious and quickly eaten.",
  "Just an ordinary filter coffee (£1 each)",
  "You carry on chatting.",
  "You leave the restaurant and head into the theatre.",
  "Think about it.",
  "Or do you want to play the short version of the game?",
  "Yes, I’ll play the short version.",
  "Let’s see what happens!",
  "You find the key.",
  "You give her a kiss.",
  "It’s all very civilised.",
]);

const amandaBase = common.concat([
  "Saturday.",
  "On with the story!",
  "Just go there.",
  "Say you love the dress.",
  "OK.",
  "A bottle of Italian Pinot Grigio (£10)",
  "Go on to the food menu.",
  "You don’t really like Italian food, so you order a steak (£14)",
  "Well done.",
  "You take a sip of water.",
  "You chat about your meal.",
  "You carry on chatting.",
  "You carry on chatting.",
  "What will it be?",
  "Ask if she wants a pee?",
  "You order two coffees.",
  "You smile at her.",
  "You head into the theatre.",
  "You head into the theatre.",
  "You watch the play.",
  "Thinking about the way you met?",
  "Concentrate on the play.",
  "Just carry on watching the play.",
  "Carry on watching the play.",
  "Carry on watching the play.",
  "Just carry on watching the play.",
  "Concentrate on the play.",
  "Concentrate on the play.",
  "You look at Diane.",
  "You chat about the play.",
  "Use a luckshot?",
  "You wait for her.",
  "You go out onto the balcony.",
  "Time to return to the play.",
  "You go back to your seats.",
  "The second act begins.",
  "Just carry on watching the play.",
  "The actress really knows how to play desperation.",
  "You’re enjoying the play.",
  "The play continues.",
  "The lights dim.",
  "The play continues.",
  "The play has almost ended.",
  "You stand up to leave the theatre.",
  "In the meantime everyone is filing out of the auditorium.",
  "Be a gentleman and ask Diane what she wants to do.",
  "You head for the stagedoor.",
  "—and head towards the stage door.",
  "You wait for Molly.",
  "You wait for Molly.",
  "You shake hands with Molly and her friend.",
  "Which will it be?",
  "Go for the walk.",
  "You walk on.",
  "You reach the river.",
  "You say there really isn’t time.",
  "You walk on.",
  "You walk on.",
  "You walk on.",
  "What are you going to talk about?",
  "Nothing in particular.",
  "OK.",
  "You hurry up.",
  "Hurrah!",
  "You stop in your tracks.",
  "You walk on.",
  "You hurry along.",
  "You buy the drinks.",
  "No, I’ll hold onto my luckshots.",
  "You chat together.",
  "You chat away.",
  "You chat away.",
  "You chat on.",
  "No, I’m running out of money.",
  "No, I can’t afford it.",
  "You drink up.",
  "You get ready to leave.",
  "And head for the bus stop.",
  "You carry on waiting.",
  "Think about it.",
  "Get the taxi?",
  "Find a taxi.",
  "You wait.",
  "You carry on waiting.",
  "You are at the front of the queue.",
  "The taxi pulls away onto the main road.",
  "Put your arm round her?",
  "The journey continues.",
  "You’re about halfway home.",
  "Almost home.",
  "The taxi continues to your house.",
  "You get out.",
  "You find the key.",
  "You give her a kiss.",
  "You have the house to yourself.",
  "A small mug of real filter coffee?",
  "You drink the coffee.",
  "What will you do next?",
  "You move to the lounge.",
  "You think your brother has gone out with friends.",
]);

const thirdTail = [
  "Ask if she wants a pee?",
  "You put an arm round her.",
  "No, I’m happy as we are.",
  "She keeps looking at the door.",
  "She can’t sit still.",
  "She can’t sit still.",
  "Talk about stamps?",
  "You open the stamp album.",
  "She tucks one leg onto the sofa.",
  "You carry on.",
  "You put an arm round her and hug her to you.",
  "On with the stamps!",
  "You squeeze her hand.",
  "You move to a new album.",
  "You put an arm round her.",
  "You turn the pages.",
  "You hurry on with the album before she can interrupt.",
  "You carry on.",
  "You close the album.",
  "What next?",
  "She hurries from the room and up the stairs.",
  "You wait for her.",
  "Fondle her legs?",
  "She tries to break away.",
  "You wait for a reply.",
  "Hand in Hand.",
];

const fourthTail = [
  "Kiss her?",
  "Yes, I’ll play a luckshot!",
  "You wait to see what happens.",
  "We shall see!",
  "Fondle her breasts?",
  "What next?",
  "You move your hand away and down to her bottom.",
  "What next?",
  "Walk her home and hope you have some fun on the way.",
  "Of course I’ll tell her. I’m a gentleman.",
  "You get ready to leave.",
  "I’ll be a gentleman and see her home.",
  "I’ll be a gentleman and see her home.",
  "You leave the house with her.",
  "You walk past a letterbox and then a bus shelter.",
  "You walk on.",
  "You walk on.",
  "She hurries you along.",
  "Think about it.",
  "Suggest she go behind the wall?",
  "You promise.",
  "You pretend to be looking away.",
  "And she can sense how excited you are.",
];

const firstTail = [
  "Kiss her?",
  "Yes, I’ll play a luckshot!",
  "You wait to see what happens.",
  "We shall see!",
  "Fondle her breasts?",
  "You go and sit on the sofa.",
  "You put an arm round her.",
  "You get ready to walk her home.",
  "No, I don’t think I’ll mention it.",
  "I’ll be a gentleman and see her home.",
  "I’ll be a gentleman and see her home.",
  "You leave the house with her.",
  "You walk past a letterbox and then a bus shelter.",
  "You try to keep up the conversation.",
  "You hurry to catch up.",
  "You watch in wonder.",
  "What are you going to do?",
  "Offer her a tissue?",
  "You give her a tissue.",
  "A couple of minutes later she rejoins you.",
  "Think about it.",
  "Tell her it’s turned you on?",
  "You stroke her hair.",
  "You walk on.",
  "You nod.",
];

const fifthTail = [
  "Kiss her?",
  "Yes, I’ll play a luckshot!",
  "You wait to see what happens.",
  "We shall see!",
  "Fondle her bottom?",
  "Explore her legs?",
  "Think about it.",
  "Take off her skirt?",
  "Triumph!",
  "You move towards her again.",
  "You go and sit by Diane.",
  "You pick up the skirt.",
  "Hold onto the skirt?",
  "You hold onto the skirt.",
  "You hold onto the skirt.",
  "Do a deal?",
  "You hand her the skirt",
  "And you follow.",
  "She puts the seat down.",
  "You watch in wonder.",
  "You embrace.",
  "How have you done?",
];

const secondSetup = [
  "Kiss her?",
  "You kiss again, your tongues touching.",
  "You put an arm round her.",
  "All’s well with the world.",
  "Explore her breasts?",
  "Yes, I’d like to unfasten her bra.",
  "You kiss.",
  "You kiss her.",
  "You run your hand down over her tummy.",
  "You caress her breasts again.",
  "Offer her another drink?",
  "You put your arm round her.",
  "To explore?",
  "She leans closer to you.",
  "Explore her breasts?",
  "No, I won’t unfasten her bra yet.",
  "You caress her breasts again.",
  "Time for decisions on your part.",
];

const secondTail = [
  "Talk about something?",
  "Talk about toilets?",
  "You take her hand and pull her down onto your knee.",
  "You go to the kitchen.",
  "You drink your wine.",
  "You cuddle up.",
  "Yes, promise.",
  "You promise.",
  "Diane is holding on for dear life!",
  "You give her a cuddle.",
  "She shakes her head in bemusement.",
  "You give her a hug.",
  "She sits on the toilet.",
  "You wait.",
  "You breathe again.",
  "You go downstairs.",
  "—that—",
];

const loungeTail = [
  "Kiss her?",
  "You kiss again, your tongues touching.",
  "You put an arm round her.",
  "All’s well with the world.",
  "Explore her breasts?",
  "No, I won’t unfasten her bra yet.",
  "You caress her breasts again.",
  "Offer her another drink?",
  "You put your arm round her.",
  "To explore?",
  "She leans closer to you.",
  "Explore her breasts?",
  "No, I won’t unfasten her bra yet.",
  "You caress her breasts again.",
  "Offer her another drink?",
  "You put your arm round her.",
  "To explore?",
  "She leans closer to you.",
  "Explore her breasts?",
  "No, I won’t unfasten her bra yet.",
  "You caress her breasts again.",
  "Time for decisions on your part.",
  "Talk about something?",
  "Talk about toilets?",
  "You take her hand and pull her down onto your knee.",
  "You go to the kitchen.",
  "You drink your wine.",
  "You cuddle up.",
  "Pull her onto your lap and ask her to tell you.",
  "Yes, promise.",
  "She pauses.",
  "You stroke her hair.",
  "She unzips your fly.",
  "She strokes you.",
  "You let her go.",
];

const generalRoute = common.concat([
  "Tuesday.",
  "On with the story!",
  "Buy something.",
  "An overpriced bottle of water (£3)",
  "Back to store.",
  "Just head for the theatre.",
  "Say let’s go in and eat, then.",
  "A bottle of Spanish Rioja (£12)",
  "Go on to the food menu.",
  "Tortelloni, the same as Diane (£9)",
  "Begin the meal.",
  "You chat about your meal.",
  "You carry on eating.",
  "What will it be?",
  "Talk about trains?",
  "Gosh!",
  "Carry on chatting.",
  "The waiter takes away your plates.",
  "Cheers.",
  "Yes, let’s have a sweet.",
  "Panna cotta (£4 each)",
  "The sweets are quickly eaten.",
  "Just an ordinary filter coffee (£1 each)",
  "You carry on chatting.",
  "You leave the restaurant and head into the theatre.",
  "Think about it.",
  "Tell her you need to go too?",
  "She returns and you take your seats in the auditorium",
  "You watch the play.",
  "Thinking about the way you met?",
  "Concentrate on the play.",
  "Just carry on watching the play.",
  "Carry on watching the play.",
  "Carry on watching the play.",
  "Hold her hand?",
  "Carry on watching the play.",
  "Concentrate on the play.",
  "Concentrate on the play.",
  "You look at Diane.",
  "You chat about the play.",
  "Ask her if she wants a pee?",
  "You go out onto the balcony.",
  "You carry on chatting",
  "Time to return to the play",
  "You go back to your seats.",
  "The second act begins.",
  "Lean closer to her?",
  "Carry on watching the play.",
  "The actress really knows how to play desperation.",
  "You’re enjoying the play.",
  "The play continues.",
  "The lights dim.",
  "The play continues.",
  "The play has almost ended.",
  "You stand up to leave the theatre.",
  "In the meantime everyone is filing out of the auditorium.",
  "Meet Molly at the stage door and maybe have a drink somewhere else?",
  "—and head towards the stage door.",
  "You wait for Molly.",
  "You wait for Molly.",
  "You shake hands with Molly and her friend.",
  "Which will it be?",
  "Go for the walk.",
  "You walk on.",
  "You reach the river.",
  "What a good idea.",
  "You drink your coffees.",
  "She nestles closer to you.",
  "You are sitting next to Diane.",
  "You chat away.",
  "You all get up and continue your walk.",
  "You walk on.",
  "You walk on.",
  "You walk on.",
  "What are you going to talk about?",
  "Nothing in particular.",
  "OK.",
  "You hurry up.",
  "Hurrah!",
  "You walk on.",
  "You hurry along.",
  "You buy the drinks.",
  "Yes, I’ll play a luckshot.",
  "OK.",
  "She drinks her lager.",
  "You chat away.",
  "You chat away.",
  "You chat on.",
  "Yes, I’ll buy another round of drinks.",
  "It’s your round, but quite a cheap one because of the special offers.",
  "Cheers!",
  "Good idea.",
  "Return to the beer garden.",
  "You drink up.",
  "No, there isn’t really time.",
  "You look for the bus stop.",
  "You carry on waiting.",
  "Think about it.",
  "Carry on waiting for the bus?",
  "What is it to be?",
  "You want to stay and watch the girl at the next bus stop, who looks desperate.",
  "You tell Diane you can’t think of anywhere.",
  "You carry on waiting.",
  "You hadn’t expected that.",
  "Yes, I do.",
  "Where did she go?",
  "Back towards the Pavilion? Maybe she’s hoping she’ll be able to get in to use the Ladies.",
  "I won’t be able to watch her in the club, so what’s the point.",
  "Will she go left?",
  "You hurry up those steps.",
  "You watch with bated breath.",
  "She looks around.",
  "Gosh!",
  "You head home.",
  "Nevertheless—",
]);

const generalThursdayBase = generalRoute
  .slice(0, generalRoute.indexOf("Back towards the Pavilion? Maybe she’s hoping she’ll be able to get in to use the Ladies."))
  .flatMap((label) => {
    if (label === "Tuesday.") return ["Thursday."];
    if (label === "Buy something.") return ["Just go there."];
    if (["An overpriced bottle of water (£3)", "Back to store.", "Just head for the theatre."].includes(label)) return [];
    if (label === "Which will it be?") return ["What will it be?"];
    if (label === "You drink up.") return ["And then it's time to leave."];
    if (label === "Yes, you’ve plenty of time.") return ["No, there isn’t really time."];
    return [label];
  });

const generalThursdayRawRoute = generalThursdayBase
  .slice(0, generalThursdayBase.indexOf("What are you going to talk about?"))
  .concat([
    "You carry on walking.",
    "You carry on walking.",
    "Walking and chatting.",
    "Chatting and walking.",
    "Hurrah!",
    "You walk on.",
    "You hurry along.",
  ])
  .concat(generalThursdayBase.slice(generalThursdayBase.indexOf("You buy the drinks.")))
  .concat([
    "Down the subway beneath the road, that will lead her back into town?",
    "Along the passage?",
    "You pause, then move forward slowly.",
    "But then you hear footsteps again.",
    "She doesn't move.",
    "Gosh!",
    "And before you can compose yourself—",
    "You haven't won, but at least—",
  ]);

let generalThursdayNeedsBusDueButton = false;
const generalThursdayRoute = generalThursdayRawRoute.flatMap((label) => {
  if (generalThursdayNeedsBusDueButton && label === "You carry on waiting.") {
    generalThursdayNeedsBusDueButton = false;
    return ["The bus is almost due."];
  }
  if (label === "You tell Diane you can’t think of anywhere.") {
    generalThursdayNeedsBusDueButton = true;
  }
  if (label === "You hadn’t expected that.") {
    return ["The bus finally comes into sight.", label];
  }
  return [label];
});

const chloeTail = [
  "She giggles nervously.",
  "The four of you chat.",
  "She giggles nervously again.",
  "What could it be?",
  "Gosh!",
  "She giggles nervously, then bites her lips, looking round the room.",
  "You feel a bit embarrassed for Chloe, who clearly doesn’t feel she can “spend a penny” while you’re all there. So you leave now with Diane, leaving Chloe and your brother alone.",
  "You leave with Diane.",
  "No, I don’t think I’ll mention it.",
  "I’ll be a gentleman and see her home.",
  "I’ll be a gentleman and see her home.",
  "You leave the house with her.",
  "You walk past a letterbox and then a bus shelter.",
  "You walk on.",
  "You walk on.",
  "She hurries you along.",
  "You turn for home.",
  "It just seems a shame it’s all over.",
  "You step into the shadows.",
  "Yes, I’ve got one left.",
  "Carry on.",
  "Duck out of sight.",
  "And then....",
  "Gosh!",
];

const amandaTail = [
  "Curses!",
  "You and Diane introduce yourselves.",
  "You help with the drinks.",
  "Gosh!",
  "No, I’ll fetch Diane’s book.",
  "You go towards your room.",
  "You don’t want to keep Diane waiting, and you’d like to see how Amanda is getting on. So you get the book.",
  "Go back into your room?",
  "You wait to see what happens.",
  "But you’ve got a grandstand view.",
  "Don’t you wish you could watch!",
  "Yes, why not!",
  "See what happens.",
  "Gosh!",
  "You carry on watching.",
  "It’s a date!",
  "—and so—",
];

const routes = {
  third: tuesdayShortHouse.concat(thirdTail),
  fourth: saturdayHouse.concat(firstDrink, flatRepeat(repeatDrink, 7), fourthTail),
  first: saturdayHouse.concat(firstDrink, flatRepeat(repeatDrink, 15), firstTail),
  fifth: thursdayFifthBase.concat(fifthTail),
  second: earlyBushHouseBase.concat(secondSetup, secondTail),
  lounge: earlyBushHouseBase.concat(loungeTail),
  general: generalRoute,
  generalThursday: generalThursdayRoute,
  chloe: chloeBase.concat(chloeTail),
  amanda: amandaBase.concat(amandaTail),
};

const guideSections = [
  { key: "common", prefix: [], route: common },
  { key: "tuesdayShortHouse", prefix: [], route: tuesdayShortHouse },
  { key: "saturdayHouse", prefix: [], route: saturdayHouse },
  { key: "earlyBushHouse", prefix: [], route: earlyBushHouseBase },
  { key: "thursdayFifthBase", prefix: [], route: thursdayFifthBase },
  { key: "chloeBase", prefix: [], route: chloeBase },
  { key: "amandaBase", prefix: [], route: amandaBase },
  { key: "thirdTail", prefix: tuesdayShortHouse, route: thirdTail },
  { key: "fourthTail", prefix: saturdayHouse.concat(firstDrink, flatRepeat(repeatDrink, 7)), route: fourthTail },
  { key: "firstTail", prefix: saturdayHouse.concat(firstDrink, flatRepeat(repeatDrink, 15)), route: firstTail },
  { key: "fifthTail", prefix: thursdayFifthBase, route: fifthTail },
  { key: "secondSetup", prefix: earlyBushHouseBase, route: secondSetup },
  { key: "secondTail", prefix: earlyBushHouseBase.concat(secondSetup), route: secondTail },
  { key: "loungeTail", prefix: earlyBushHouseBase, route: loungeTail },
  { key: "generalRoute", prefix: [], route: generalRoute },
  { key: "generalThursdayRoute", prefix: [], route: generalThursdayRoute },
  { key: "chloeTail", prefix: chloeBase, route: chloeTail },
  { key: "amandaTail", prefix: amandaBase, route: amandaTail },
  { key: "firstDrink", prefix: saturdayHouse, route: firstDrink },
  { key: "repeatDrink", prefix: saturdayHouse.concat(firstDrink), route: repeatDrink },
];

function flatRepeat(route, count) {
  return Array.from({ length: count }, () => route).flat();
}

function stripTags(text) {
  return String(text)
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\u202f/g, "\uE000")
    .replace(/\s+/g, " ")
    .replace(/\uE000/g, "\u202f")
    .trim();
}

function normalize(text) {
  return stripTags(text)
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function loadGame(htmlPath) {
  const source = fs.readFileSync(htmlPath, "utf8");
  const script = source.match(/<script>([\s\S]*?)<\/script>/i)[1];
  const initialBox = (source.match(/<div id="box">([\s\S]*?)<\/div>\s*<\/div>\s*<\/body>/i) || [null, ""])[1]
    .replace(/^\s+|\s+$/g, "");
  const box = { innerHTML: initialBox };
  const context = {
    console,
    document: {
      getElementById(id) {
        if (id !== "box") throw new Error(`unknown element ${id}`);
        return box;
      },
    },
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(script, context, { filename: htmlPath });
  return { context, box };
}

function choices(game) {
  const out = [];
  const re = /<button class=['"]choice['"] onclick=(?:"go\('([^']+)'\)"|'go\("([^"]+)"\)')>([\s\S]*?)<\/button>/g;
  let match;
  while ((match = re.exec(game.box.innerHTML))) {
    out.push({ tag: match[1] || match[2], text: stripTags(match[3]) });
  }
  return out;
}

function visibleText(game) {
  return stripTags(game.box.innerHTML);
}

function findChoice(options, label) {
  const wanted = normalize(label);
  let found = options.find((o) => normalize(o.text) === wanted);
  if (!found) {
    found = options.find(
      (o) => normalize(o.text).replace(/[.!?。！？]+$/u, "") === wanted.replace(/[.!?。！？]+$/u, ""),
    );
  }
  return found;
}

function captureLabelsAndTags(htmlPath, route) {
  const game = loadGame(htmlPath);
  const labels = [];
  const tags = [];
  for (const label of route) {
    const options = choices(game);
    const found = findChoice(options, label);
    if (!found) {
      throw new Error(
        `Choice not found in ${htmlPath}: ${label}\nAvailable:\n${options.map((o) => `- ${o.text}`).join("\n")}\n\nPage:\n${visibleText(game).slice(0, 1200)}`,
      );
    }
    labels.push(found.text);
    tags.push(found.tag);
    game.context.go(found.tag);
  }
  return { labels, tags, text: visibleText(game), vars: vars(game) };
}

function captureLabelsByTags(htmlPath, tags) {
  const game = loadGame(htmlPath);
  const labels = [];
  for (const tag of tags) {
    const options = choices(game);
    const found = options.find((o) => o.tag === tag);
    if (!found) {
      throw new Error(
        `Tag not found in ${htmlPath}: ${tag}\nAvailable:\n${options.map((o) => `- ${o.tag}: ${o.text}`).join("\n")}\n\nPage:\n${visibleText(game).slice(0, 1200)}`,
      );
    }
    labels.push(found.text);
    game.context.go(found.tag);
  }
  return { labels, text: visibleText(game), vars: vars(game) };
}

function vars(game) {
  return Object.fromEntries(game.context.gameStateVars.map((k) => [k, game.context[k]]));
}

function ending(text, lang) {
  const byLang = {
    en: [
      /TRULY, YOU HAVE WON FIRST PRIZE!/,
      /YOU HAVE WON A CONSOLATION PRIZE!/,
      /YOU HAVE WON [^!]+!/,
      /WHICH IS A PRETTY GOOD CONSOLATION PRIZE!/,
    ],
    cn: [
      /你真的(?:获得|赢得)了一等奖！/,
      /你(?:获得|赢得)了[一二三四五]等奖！/,
      /你(?:获得|赢得)了(?:一个)?安慰奖！/,
      /说起来，这也算是个相当不错的安慰奖！/,
    ],
    tw: [
      /你真的獲得了一等獎！/,
      /你獲得了[一二三四五]等獎！/,
      /你獲得了(?:一個)?安慰獎！/,
      /說起來，這也算是個相當不錯的安慰獎！/,
    ],
    es: [
      /¡VERDADERAMENTE, HAS GANADO EL PRIMER PREMIO!/,
      /¡HAS GANADO UN PREMIO DE CONSOLACIÓN!/,
      /¡HAS GANADO EL \d\.(?:er|º) PREMIO!/,
      /¡QUE NO ES MAL PREMIO DE CONSOLACIÓN!/,
    ],
    fr: [
      /VRAIMENT, VOUS AVEZ REMPORTÉ LE PREMIER PRIX\s*!/,
      /VOUS AVEZ REMPORTÉ UN (?:PRIX|LOT) DE CONSOLATION\s*!/,
      /VOUS AVEZ (?:REMPORTÉ|GAGNÉ) LE \dE PRIX\s*!/,
      /CE QUI EST UN SACRÉ LOT DE CONSOLATION\s*!/,
    ],
  };
  const patterns = byLang[lang] || byLang.en;
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }
  return "NO ENDING TEXT FOUND";
}

function buildCaptures(htmlPath, lang) {
  const captures = {};
  const tagCache = {};

  for (const section of guideSections) {
    const fullRoute = section.prefix.concat(section.route);
    if (lang === "en") {
      const captured = captureLabelsAndTags(htmlPath, fullRoute);
      captures[section.key] = captured.labels.slice(section.prefix.length);
      tagCache[section.key] = captured.tags.slice(section.prefix.length);
    } else {
      captures[section.key] = captureLabelsByTags(htmlPath, tagCache[section.key]).labels;
    }
  }

  const endings = {};
  for (const [key, route] of Object.entries(routes)) {
    const enCaptured = captureLabelsAndTags(EN_HTML, route);
    const localized = lang === "en" ? enCaptured : captureLabelsByTags(htmlPath, enCaptured.tags);
    endings[key] = ending(localized.text, lang);
    if (endings[key].includes("NO ENDING")) {
      throw new Error(`No ending detected for ${lang}:${key}\n${localized.text.slice(-1000)}`);
    }
  }
  return { captures, endings };
}

function numbered(lines) {
  return lines.map((line, index) => `${index + 1}. ${line}`).join("\n");
}

function plainEnglishTxt(text) {
  return text.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');
}

function writeTextFile(outPath, text, lang) {
  fs.writeFileSync(outPath, lang === "en" ? `\uFEFF${text}` : text, "utf8");
}

function bullet(lines) {
  return lines.map((line) => `- ${line}`).join("\n");
}

function section(title, body) {
  return `${title}\n${body.trim().replace(/\n{2,}/g, "\n")}\n`;
}

function englishGuide(data) {
  const c = data.captures;
  const e = data.endings;
  const parts = [];
  parts.push(`A Date with Diane - Verified Endings Guide

This guide is for the current finished HTML version. It uses visible button text only. Follow each listed route exactly. If the same button text appears several times in a row, press it that many times.

The short version is valid on Tuesday and Thursday, but only use it where this guide explicitly says to use it.
`);

  parts.push(section("BASE 1 - COMMON START", numbered(c.common)));
  parts.push(section("BASE 2 - TUESDAY SHORT ROUTE TO THE HOUSE", `Use BASE 1, then press:\n${numbered(c.tuesdayShortHouse.slice(c.common.length))}`));
  parts.push(section("BASE 3 - SATURDAY ROUTE TO THE HOUSE", `Use BASE 1, then press:\n${numbered(c.saturdayHouse.slice(c.common.length))}`));
  parts.push(section("BASE 4 - TUESDAY FULL ROUTE WITH AN EARLIER PRIVATE PEE, THEN THE HOUSE", `Use BASE 1, then press:\n${numbered(c.earlyBushHouse.slice(c.common.length))}`));
  parts.push(section("BASE 5 - THURSDAY SHORT ROUTE TO THE HOUSE", `Use BASE 1, then press:\n${numbered(c.thursdayFifthBase.slice(c.common.length))}`));
  parts.push(section("BASE 6 - TUESDAY SHORT ROUTE TO THE CHLOE HOUSE SCENE", `Use BASE 1, then press:\n${numbered(c.chloeBase.slice(c.common.length))}`));
  parts.push(section("BASE 7 - SATURDAY STEAK ROUTE TO THE AMANDA HOUSE SCENE", `Use BASE 1, then press:\n${numbered(c.amandaBase.slice(c.common.length))}`));

  parts.push(section("HOUSE DRINKING LOOP", `For fourth prize and first prize, use this loop after BASE 3.

First run this starter loop once:
${bullet(c.firstDrink)}

After that, the repeat loop becomes:
${bullet(c.repeatDrink)}

For FOURTH PRIZE, press the starter loop once, then the repeat loop 7 times.
For FIRST PRIZE, press the starter loop once, then the repeat loop 15 times.`));

  parts.push(section("THIRD PRIZE", `Use BASE 2, then press:\n${numbered(c.thirdTail)}\n\nEnding text: ${e.third}`));
  parts.push(section("FOURTH PRIZE", `Use BASE 3. Then press the starter drinking loop once and the repeat drinking loop 7 times. After the final "${c.repeatDrink.at(-1)}", press:\n${numbered(c.fourthTail)}\n\nEnding text: ${e.fourth}`));
  parts.push(section("FIRST PRIZE", `Use BASE 3. Then press the starter drinking loop once and the repeat drinking loop 15 times. After the final "${c.repeatDrink.at(-1)}", press:\n${numbered(c.firstTail)}\n\nEnding text: ${e.first}`));
  parts.push(section("FIFTH PRIZE", `Use BASE 5, then press:\n${numbered(c.fifthTail)}\n\nEnding text: ${e.fifth}`));
  parts.push(section("SECOND PRIZE", `Use BASE 4. This base is the Tuesday route where Diane has already had one private emergency pee by the riverside bushes before she comes back to your house.

From the sofa, first press this setup section:
${numbered(c.secondSetup)}

Then press:
${numbered(c.secondTail)}

Ending text: ${e.second}`));
  parts.push(section("LOUNGE STORY CONSOLATION PRIZE", `Use BASE 4. This is important: do not use the Tuesday short route here. Diane must already have had the earlier private emergency pee before she reaches your house.

From the sofa, press:
${numbered(c.loungeTail)}

Ending text: ${e.lounge}`));
  parts.push(section("CONSOLATION PRIZE - TUESDAY PAVILION ROUTE", `This route is standalone because it depends on several exact Tuesday state checks around the Pavilion. Press:\n${numbered(c.generalRoute)}\n\nEnding text: ${e.general}`));
  parts.push(section("CONSOLATION PRIZE - THURSDAY SUBWAY ROUTE", `This is a separate Thursday route to the same consolation prize screen. It requires several exact choices, including skipping the opening water purchase, blocking Diane at the Pavilion with a luckshot, and following her through the subway after she flees the bus stop. Press:\n${numbered(c.generalThursdayRoute)}\n\nEnding text: ${e.generalThursday}`));
  parts.push(section("CHLOE CONSOLATION PRIZE", `Use BASE 6. Chloe is already in the house scene. Then press:\n${numbered(c.chloeTail)}\n\nEnding text: ${e.chloe}`));
  parts.push(section("AMANDA CONSOLATION PRIZE", `Use BASE 7. Your brother has now arrived with his friends. Then press:\n${numbered(c.amandaTail)}\n\nEnding text: ${e.amanda}`));
  parts.push(`COMMON FAILURE ENDINGS
These are terminal outcomes but not prize endings:
- "I'm not over 18." ends the game at the age screen.
- Running out of money can trigger GOODBYE! THE GAME IS OVER.
- Letting intimacy fall too low can make Diane abandon the date.
- Using a luckshot when none are left can disqualify you in some branches.
- Pushing public wetting too far can end the date immediately.
`);
  return parts.join("\n").replace(/\n\n(Ending text:)/g, "\n$1").replace(/\n{3,}/g, "\n\n");
}

function chineseGuide(data) {
  const c = data.captures;
  const e = data.endings;
  const parts = [];
  parts.push(`与黛安约会：已验证结局攻略

本攻略对应当前完成版HTML。步骤里写的都是玩家实际能看到的按钮文字。请严格按顺序点击；如果同一句按钮连续出现几次，就连续按几次。

“短版流程”只在周二和周四可用，但只有攻略明确要求时才使用。
`);

  parts.push(section("基础路线1：通用开局", numbered(c.common)));
  parts.push(section("基础路线2：周二短版，到达家中", `先走“基础路线1”，然后按：\n${numbered(c.tuesdayShortHouse.slice(c.common.length))}`));
  parts.push(section("基础路线3：周六路线，到达家中", `先走“基础路线1”，然后按：\n${numbered(c.saturdayHouse.slice(c.common.length))}`));
  parts.push(section("基础路线4：周二完整路线，先触发一次私密紧急尿尿，再到达家中", `先走“基础路线1”，然后按：\n${numbered(c.earlyBushHouse.slice(c.common.length))}`));
  parts.push(section("基础路线5：周四短版，到达家中", `先走“基础路线1”，然后按：\n${numbered(c.thursdayFifthBase.slice(c.common.length))}`));
  parts.push(section("基础路线6：周二短版，到达克洛伊家中场景", `先走“基础路线1”，然后按：\n${numbered(c.chloeBase.slice(c.common.length))}`));
  parts.push(section("基础路线7：周六牛排路线，到达阿曼达家中场景", `先走“基础路线1”，然后按：\n${numbered(c.amandaBase.slice(c.common.length))}`));

  parts.push(section("家中喝饮料循环", `四等奖和一等奖都要在“基础路线3”之后使用这个循环。

先按一次起始循环：
${bullet(c.firstDrink)}

之后循环按钮会变成：
${bullet(c.repeatDrink)}

要拿四等奖：起始循环按1次，然后重复循环按7次。
要拿一等奖：起始循环按1次，然后重复循环按15次。`));

  parts.push(section("三等奖", `走完“基础路线2”，然后按：\n${numbered(c.thirdTail)}\n\n结局文字：${e.third}`));
  parts.push(section("四等奖", `走完“基础路线3”。然后把起始喝饮料循环按1次，重复喝饮料循环按7次。最后一次按完“${c.repeatDrink.at(-1)}”之后，继续按：\n${numbered(c.fourthTail)}\n\n结局文字：${e.fourth}`));
  parts.push(section("一等奖", `走完“基础路线3”。然后把起始喝饮料循环按1次，重复喝饮料循环按15次。最后一次按完“${c.repeatDrink.at(-1)}”之后，继续按：\n${numbered(c.firstTail)}\n\n结局文字：${e.first}`));
  parts.push(section("五等奖", `走完“基础路线5”，然后按：\n${numbered(c.fifthTail)}\n\n结局文字：${e.fifth}`));
  parts.push(section("二等奖", `走完“基础路线4”。这条基础路线的关键是：黛安在到你家之前，已经私下在河边灌木丛后面方便过一次。

到家后从沙发处先按这一段：
${numbered(c.secondSetup)}

然后按：
${numbered(c.secondTail)}

结局文字：${e.second}`));
  parts.push(section("客厅故事安慰奖", `走完“基础路线4”。注意：这里不能走周二短版。黛安必须在到你家之前已经触发过河边那次私密紧急尿尿。

到家后从沙发处按：
${numbered(c.loungeTail)}

结局文字：${e.lounge}`));
  parts.push(section("安慰奖：周二凉亭路线", `这条路线单独列出，因为它依赖周二路线里凉亭酒吧附近的几个精确状态判断。按：\n${numbered(c.generalRoute)}\n\n结局文字：${e.general}`));
  parts.push(section("安慰奖：周四地下通道路线", `这是通往同一个安慰奖画面的另一条周四路线。它需要几个精确选择，包括开场不买水、在凉亭酒吧用幸运机会阻止黛安去厕所，以及她逃离公交站后跟着她穿过地下通道。按：\n${numbered(c.generalThursdayRoute)}\n\n结局文字：${e.generalThursday}`));
  parts.push(section("克洛伊安慰奖", `走完“基础路线6”。此时克洛伊已经出现在家中场景里。然后按：\n${numbered(c.chloeTail)}\n\n结局文字：${e.chloe}`));
  parts.push(section("阿曼达安慰奖", `走完“基础路线7”。此时你弟弟已经带朋友来到家里。然后按：\n${numbered(c.amandaTail)}\n\n结局文字：${e.amanda}`));
  parts.push(`常见失败结局
这些是终止结局，但不是奖项结局：
- “我未满18岁。”会在年龄确认页直接结束。
- 钱不够时，可能触发“再见！游戏结束。”
- 亲密度太低时，黛安可能会直接结束约会。
- 在某些分支里，没有幸运机会还继续使用，可能会被取消资格。
- 如果让公开尿湿失控，也可能立刻结束约会。
`);
  return parts.join("\n").replace(/\n\n(结局文字：)/g, "\n$1").replace(/\n{3,}/g, "\n\n");
}

function taiwanGuide(data) {
  const c = data.captures;
  const e = data.endings;
  const parts = [];
  parts.push(`與黛安約會：已驗證結局攻略

本攻略對應當前完成版HTML。步驟裡寫的都是玩家實際能看到的按鈕文字。請嚴格按順序點擊；如果同一句按鈕連續出現幾次，就連續按幾次。

「短版流程」只在週二和週四可用，但只有攻略明確要求時才使用。
`);

  parts.push(section("基礎路線1：通用開局", numbered(c.common)));
  parts.push(section("基礎路線2：週二短版，到達家中", `先走「基礎路線1」，然後按：\n${numbered(c.tuesdayShortHouse.slice(c.common.length))}`));
  parts.push(section("基礎路線3：週六路線，到達家中", `先走「基礎路線1」，然後按：\n${numbered(c.saturdayHouse.slice(c.common.length))}`));
  parts.push(section("基礎路線4：週二完整路線，先觸發一次私密緊急尿尿，再到達家中", `先走「基礎路線1」，然後按：\n${numbered(c.earlyBushHouse.slice(c.common.length))}`));
  parts.push(section("基礎路線5：週四短版，到達家中", `先走「基礎路線1」，然後按：\n${numbered(c.thursdayFifthBase.slice(c.common.length))}`));
  parts.push(section("基礎路線6：週二短版，到達克洛伊家中場景", `先走「基礎路線1」，然後按：\n${numbered(c.chloeBase.slice(c.common.length))}`));
  parts.push(section("基礎路線7：週六牛排路線，到達阿曼達家中場景", `先走「基礎路線1」，然後按：\n${numbered(c.amandaBase.slice(c.common.length))}`));

  parts.push(section("家中喝飲料循環", `四等獎和一等獎都要在「基礎路線3」之後使用這個循環。

先按一次起始循環：
${bullet(c.firstDrink)}

之後循環按鈕會變成：
${bullet(c.repeatDrink)}

要拿四等獎：起始循環按1次，然後重複循環按7次。
要拿一等獎：起始循環按1次，然後重複循環按15次。`));

  parts.push(section("三等獎", `走完「基礎路線2」，然後按：\n${numbered(c.thirdTail)}\n\n結局文字：${e.third}`));
  parts.push(section("四等獎", `走完「基礎路線3」。然後把起始喝飲料循環按1次，重複喝飲料循環按7次。最後一次按完「${c.repeatDrink.at(-1)}」之後，繼續按：\n${numbered(c.fourthTail)}\n\n結局文字：${e.fourth}`));
  parts.push(section("一等獎", `走完「基礎路線3」。然後把起始喝飲料循環按1次，重複喝飲料循環按15次。最後一次按完「${c.repeatDrink.at(-1)}」之後，繼續按：\n${numbered(c.firstTail)}\n\n結局文字：${e.first}`));
  parts.push(section("五等獎", `走完「基礎路線5」，然後按：\n${numbered(c.fifthTail)}\n\n結局文字：${e.fifth}`));
  parts.push(section("二等獎", `走完「基礎路線4」。這條基礎路線的關鍵是：黛安在到你家之前，已經私下在河邊樹叢後面方便過一次。

到家後從沙發處先按這一段：
${numbered(c.secondSetup)}

然後按：
${numbered(c.secondTail)}

結局文字：${e.second}`));
  parts.push(section("客廳故事安慰獎", `走完「基礎路線4」。注意：這裡不能走週二短版。黛安必須在到你家之前已經觸發過河邊那次私密緊急尿尿。

到家後從沙發處按：
${numbered(c.loungeTail)}

結局文字：${e.lounge}`));
  parts.push(section("安慰獎：週二涼亭路線", `這條路線單獨列出，因為它依賴週二路線裡涼亭酒吧附近的幾個精確狀態判斷。按：\n${numbered(c.generalRoute)}\n\n結局文字：${e.general}`));
  parts.push(section("安慰獎：週四地下通道路線", `這是通往同一個安慰獎畫面的另一條週四路線。它需要幾個精確選擇，包括開場不買水、在涼亭酒吧用幸運機會阻止黛安去廁所，以及她逃離公車站後跟著她穿過地下通道。按：\n${numbered(c.generalThursdayRoute)}\n\n結局文字：${e.generalThursday}`));
  parts.push(section("克洛伊安慰獎", `走完「基礎路線6」。此時克洛伊已經出現在家中場景裡。然後按：\n${numbered(c.chloeTail)}\n\n結局文字：${e.chloe}`));
  parts.push(section("阿曼達安慰獎", `走完「基礎路線7」。此時你弟弟已經帶朋友來到家裡。然後按：\n${numbered(c.amandaTail)}\n\n結局文字：${e.amanda}`));
  parts.push(`常見失敗結局
這些是終止結局，但不是獎項結局：
- 「我未滿18歲。」會在年齡確認頁直接結束。
- 錢不夠時，可能觸發「再見！遊戲結束。」
- 親密度太低時，黛安可能會直接結束約會。
- 在某些分支裡，沒有幸運機會還繼續使用，可能會被取消資格。
- 如果讓公開尿濕失控，也可能立刻結束約會。
`);
  return parts.join("\n").replace(/\n\n(結局文字：)/g, "\n$1").replace(/\n{3,}/g, "\n\n");
}

function spanishGuide(data) {
  const c = data.captures;
  const e = data.endings;
  const parts = [];
  parts.push(`Una cita con Diane - Guía verificada de finales

Esta guía corresponde a la versión HTML final actual. Solo usa el texto visible de los botones. Sigue cada ruta exactamente en este orden. Si el mismo botón aparece varias veces seguidas, púlsalo ese número de veces.

La versión corta solo está disponible el martes y el jueves, pero úsala únicamente cuando esta guía lo indique expresamente.
`);

  parts.push(section("BASE 1 - INICIO COMÚN", numbered(c.common)));
  parts.push(section("BASE 2 - RUTA CORTA DEL MARTES HASTA LA CASA", `Usa la BASE 1 y luego pulsa:\n${numbered(c.tuesdayShortHouse.slice(c.common.length))}`));
  parts.push(section("BASE 3 - RUTA DEL SÁBADO HASTA LA CASA", `Usa la BASE 1 y luego pulsa:\n${numbered(c.saturdayHouse.slice(c.common.length))}`));
  parts.push(section("BASE 4 - RUTA COMPLETA DEL MARTES CON UNA MEADA PRIVADA ANTERIOR, HASTA LA CASA", `Usa la BASE 1 y luego pulsa:\n${numbered(c.earlyBushHouse.slice(c.common.length))}`));
  parts.push(section("BASE 5 - RUTA CORTA DEL JUEVES HASTA LA CASA", `Usa la BASE 1 y luego pulsa:\n${numbered(c.thursdayFifthBase.slice(c.common.length))}`));
  parts.push(section("BASE 6 - RUTA CORTA DEL MARTES HASTA LA ESCENA DE CHLOE EN CASA", `Usa la BASE 1 y luego pulsa:\n${numbered(c.chloeBase.slice(c.common.length))}`));
  parts.push(section("BASE 7 - RUTA DEL SÁBADO CON BISTEC HASTA LA ESCENA DE AMANDA EN CASA", `Usa la BASE 1 y luego pulsa:\n${numbered(c.amandaBase.slice(c.common.length))}`));

  parts.push(section("BUCLE DE BEBIDAS EN CASA", `Para el cuarto premio y el primer premio, usa este bucle después de la BASE 3.
Primero haz una vez este bucle inicial:
${bullet(c.firstDrink)}
Después, el bucle repetido pasa a ser:
${bullet(c.repeatDrink)}
Para el CUARTO PREMIO, pulsa el bucle inicial una vez y luego el bucle repetido 7 veces.
Para el PRIMER PREMIO, pulsa el bucle inicial una vez y luego el bucle repetido 15 veces.`));

  parts.push(section("TERCER PREMIO", `Usa la BASE 2 y luego pulsa:\n${numbered(c.thirdTail)}\n\nTexto del final: ${e.third}`));
  parts.push(section("CUARTO PREMIO", `Usa la BASE 3. Luego pulsa el bucle inicial de bebidas una vez y el bucle repetido de bebidas 7 veces. Después del último “${c.repeatDrink.at(-1)}”, pulsa:\n${numbered(c.fourthTail)}\n\nTexto del final: ${e.fourth}`));
  parts.push(section("PRIMER PREMIO", `Usa la BASE 3. Luego pulsa el bucle inicial de bebidas una vez y el bucle repetido de bebidas 15 veces. Después del último “${c.repeatDrink.at(-1)}”, pulsa:\n${numbered(c.firstTail)}\n\nTexto del final: ${e.first}`));
  parts.push(section("QUINTO PREMIO", `Usa la BASE 5 y luego pulsa:\n${numbered(c.fifthTail)}\n\nTexto del final: ${e.fifth}`));
  parts.push(section("SEGUNDO PREMIO", `Usa la BASE 4. La clave de esta base es que Diane ya haya tenido una emergencia privada junto a los arbustos del río antes de llegar a tu casa.
Desde el sofá, pulsa primero esta sección preparatoria:
${numbered(c.secondSetup)}
Luego pulsa:
${numbered(c.secondTail)}
Texto del final: ${e.second}`));
  parts.push(section("PREMIO DE CONSOLACIÓN: HISTORIA DEL SALÓN", `Usa la BASE 4. Importante: aquí no uses la ruta corta del martes. Diane debe haber tenido ya aquella emergencia privada anterior antes de llegar a tu casa.
Desde el sofá, pulsa:
${numbered(c.loungeTail)}
Texto del final: ${e.lounge}`));
  parts.push(section("PREMIO DE CONSOLACIÓN: RUTA DEL MARTES DEL PAVILION", `Esta ruta se lista aparte porque depende de varios controles de estado exactos en la ruta del martes cerca del Pavilion. Pulsa:\n${numbered(c.generalRoute)}\n\nTexto del final: ${e.general}`));
  parts.push(section("PREMIO DE CONSOLACIÓN: RUTA DEL JUEVES POR EL PASO SUBTERRÁNEO", `Esta es otra ruta del jueves hacia la misma pantalla de premio de consolación. Requiere varias elecciones exactas: saltarte la compra inicial de agua, impedir con una oportunidad de suerte que Diane vaya al baño en el Pavilion y seguirla por el paso subterráneo cuando huye de la parada del autobús. Pulsa:\n${numbered(c.generalThursdayRoute)}\n\nTexto del final: ${e.generalThursday}`));
  parts.push(section("PREMIO DE CONSOLACIÓN DE CHLOE", `Usa la BASE 6. Chloe ya está en la escena de la casa. Luego pulsa:\n${numbered(c.chloeTail)}\n\nTexto del final: ${e.chloe}`));
  parts.push(section("PREMIO DE CONSOLACIÓN DE AMANDA", `Usa la BASE 7. Tu hermano ya ha llegado a casa con sus amigas. Luego pulsa:\n${numbered(c.amandaTail)}\n\nTexto del final: ${e.amanda}`));
  parts.push(`FINALES DE FRACASO COMUNES
Son finales terminales, pero no son finales con premio:
- “No soy mayor de 18.” termina el juego en la pantalla de edad.
- Quedarte sin dinero puede activar “¡ADIÓS! EL JUEGO HA TERMINADO.”
- Si la intimidad baja demasiado, Diane puede abandonar la cita.
- En algunas ramas, intentar usar una oportunidad de suerte cuando ya no te queda ninguna puede descalificarte.
- Si dejas que mojarse en público se descontrole demasiado, la cita también puede terminar de inmediato.
`);
  return parts.join("\n").replace(/\n\n(Texto del final:)/g, "\n$1").replace(/\n{3,}/g, "\n\n");
}

function frenchGuide(data) {
  const c = data.captures;
  const e = data.endings;
  const parts = [];
  parts.push(`Un rendez-vous avec Diane - Guide vérifié des fins

Ce guide correspond à la version HTML finale actuelle. Il utilise uniquement le texte visible des boutons. Suivez chaque route exactement dans l’ordre. Si le même bouton apparaît plusieurs fois de suite, cliquez dessus autant de fois.

La version courte n’est disponible que le mardi et le jeudi, mais ne l’utilisez que lorsque ce guide le demande explicitement.
`);

  parts.push(section("BASE 1 - DÉBUT COMMUN", numbered(c.common)));
  parts.push(section("BASE 2 - ROUTE COURTE DU MARDI JUSQU’À LA MAISON", `Utilisez la BASE 1, puis cliquez sur :\n${numbered(c.tuesdayShortHouse.slice(c.common.length))}`));
  parts.push(section("BASE 3 - ROUTE DU SAMEDI JUSQU’À LA MAISON", `Utilisez la BASE 1, puis cliquez sur :\n${numbered(c.saturdayHouse.slice(c.common.length))}`));
  parts.push(section("BASE 4 - ROUTE COMPLÈTE DU MARDI AVEC UNE PAUSE PIPI PRIVÉE PLUS TÔT, JUSQU’À LA MAISON", `Utilisez la BASE 1, puis cliquez sur :\n${numbered(c.earlyBushHouse.slice(c.common.length))}`));
  parts.push(section("BASE 5 - ROUTE COURTE DU JEUDI JUSQU’À LA MAISON", `Utilisez la BASE 1, puis cliquez sur :\n${numbered(c.thursdayFifthBase.slice(c.common.length))}`));
  parts.push(section("BASE 6 - ROUTE COURTE DU MARDI JUSQU’À LA SCÈNE DE CHLOE À LA MAISON", `Utilisez la BASE 1, puis cliquez sur :\n${numbered(c.chloeBase.slice(c.common.length))}`));
  parts.push(section("BASE 7 - ROUTE DU SAMEDI AVEC STEAK JUSQU’À LA SCÈNE D’AMANDA À LA MAISON", `Utilisez la BASE 1, puis cliquez sur :\n${numbered(c.amandaBase.slice(c.common.length))}`));

  parts.push(section("BOUCLE DES BOISSONS À LA MAISON", `Pour le quatrième prix et le premier prix, utilisez cette boucle après la BASE 3.
Commencez par faire cette boucle initiale une fois :
${bullet(c.firstDrink)}
Ensuite, la boucle répétée devient :
${bullet(c.repeatDrink)}
Pour le QUATRIÈME PRIX, cliquez une fois sur la boucle initiale, puis 7 fois sur la boucle répétée.
Pour le PREMIER PRIX, cliquez une fois sur la boucle initiale, puis 15 fois sur la boucle répétée.`));

  parts.push(section("TROISIÈME PRIX", `Utilisez la BASE 2, puis cliquez sur :\n${numbered(c.thirdTail)}\n\nTexte de fin : ${e.third}`));
  parts.push(section("QUATRIÈME PRIX", `Utilisez la BASE 3. Cliquez ensuite une fois sur la boucle initiale des boissons, puis 7 fois sur la boucle répétée. Après le dernier « ${c.repeatDrink.at(-1)} », cliquez sur :\n${numbered(c.fourthTail)}\n\nTexte de fin : ${e.fourth}`));
  parts.push(section("PREMIER PRIX", `Utilisez la BASE 3. Cliquez ensuite une fois sur la boucle initiale des boissons, puis 15 fois sur la boucle répétée. Après le dernier « ${c.repeatDrink.at(-1)} », cliquez sur :\n${numbered(c.firstTail)}\n\nTexte de fin : ${e.first}`));
  parts.push(section("CINQUIÈME PRIX", `Utilisez la BASE 5, puis cliquez sur :\n${numbered(c.fifthTail)}\n\nTexte de fin : ${e.fifth}`));
  parts.push(section("DEUXIÈME PRIX", `Utilisez la BASE 4. Le point essentiel de cette base est que Diane ait déjà eu une urgence privée près des buissons au bord de la rivière avant d’arriver chez vous.
Depuis le canapé, cliquez d’abord sur cette section préparatoire :
${numbered(c.secondSetup)}
Puis cliquez sur :
${numbered(c.secondTail)}
Texte de fin : ${e.second}`));
  parts.push(section("LOT DE CONSOLATION : HISTOIRE DU SALON", `Utilisez la BASE 4. Important : n’utilisez pas ici la route courte du mardi. Diane doit déjà avoir eu cette urgence privée avant d’arriver chez vous.
Depuis le canapé, cliquez sur :
${numbered(c.loungeTail)}
Texte de fin : ${e.lounge}`));
  parts.push(section("PRIX DE CONSOLATION : ROUTE DU MARDI AU PAVILION", `Cette route est listée séparément parce qu’elle dépend de plusieurs vérifications d’état précises près du Pavilion dans la route du mardi. Cliquez sur :\n${numbered(c.generalRoute)}\n\nTexte de fin : ${e.general}`));
  parts.push(section("PRIX DE CONSOLATION : ROUTE DU JEUDI PAR LE PASSAGE SOUTERRAIN", `Il s’agit d’une autre route du jeudi menant au même écran de prix de consolation. Elle exige plusieurs choix précis : ne pas acheter l’eau au début, utiliser une opportunité de chance pour empêcher Diane d’aller aux toilettes au Pavilion, puis la suivre dans le passage souterrain quand elle fuit l’arrêt de bus. Cliquez sur :\n${numbered(c.generalThursdayRoute)}\n\nTexte de fin : ${e.generalThursday}`));
  parts.push(section("PRIX DE CONSOLATION DE CHLOE", `Utilisez la BASE 6. Chloe est déjà présente dans la scène à la maison. Puis cliquez sur :\n${numbered(c.chloeTail)}\n\nTexte de fin : ${e.chloe}`));
  parts.push(section("PRIX DE CONSOLATION D’AMANDA", `Utilisez la BASE 7. Votre frère est maintenant arrivé avec ses amies. Puis cliquez sur :\n${numbered(c.amandaTail)}\n\nTexte de fin : ${e.amanda}`));
  parts.push(`FINS D’ÉCHEC COURANTES
Ce sont des fins terminales, mais pas des fins avec prix :
- « Je n’ai pas 18 ans. » met fin au jeu dès l’écran d’âge.
- Manquer d’argent peut déclencher « AU REVOIR ! LA PARTIE EST TERMINÉE. »
- Si l’intimité descend trop bas, Diane peut mettre fin au rendez-vous.
- Dans certaines branches, utiliser une opportunité de chance quand il n’en reste plus peut vous disqualifier.
- Si vous laissez un accident public aller trop loin, le rendez-vous peut aussi se terminer immédiatement.
`);
  return parts.join("\n").replace(/\n\n(Texte de fin :)/g, "\n$1").replace(/\n{3,}/g, "\n\n");
}

const enData = buildCaptures(EN_HTML, "en");
function buildLocalizedData(htmlPath, lang) {
  const enTags = {};
  const prefixLengths = {};
  for (const section of guideSections) {
    const fullRoute = section.prefix.concat(section.route);
    enTags[section.key] = captureLabelsAndTags(EN_HTML, fullRoute).tags;
    prefixLengths[section.key] = section.prefix.length;
  }
  const captures = {};
  for (const section of guideSections) {
    captures[section.key] = captureLabelsByTags(htmlPath, enTags[section.key]).labels.slice(prefixLengths[section.key]);
  }
  const endings = {};
  for (const [key, route] of Object.entries(routes)) {
    const tags = captureLabelsAndTags(EN_HTML, route).tags;
    const localized = captureLabelsByTags(htmlPath, tags);
    endings[key] = ending(localized.text, lang);
    if (endings[key].includes("NO ENDING")) {
      throw new Error(`No ${lang} ending detected for ${key}\n${localized.text.slice(-1000)}`);
    }
  }
  return { captures, endings };
}

const cnData = buildLocalizedData(CN_HTML, "cn");
const esData = buildLocalizedData(ES_HTML, "es");
const frData = buildLocalizedData(FR_HTML, "fr");
const twData = buildLocalizedData(TW_HTML, "tw");
[...LEGACY_GUIDE_DIRS, ...LEGACY_GUIDE_FILES].forEach((target) => {
  fs.rmSync(target, { recursive: true, force: true });
});
[EN_GUIDE, CN_GUIDE, ES_GUIDE, FR_GUIDE, TW_GUIDE].forEach((file) => {
  fs.mkdirSync(require("path").dirname(file), { recursive: true });
});

writeTextFile(EN_GUIDE, plainEnglishTxt(englishGuide(enData)), "en");
writeTextFile(CN_GUIDE, chineseGuide(cnData), "cn");
writeTextFile(ES_GUIDE, spanishGuide(esData), "es");
writeTextFile(FR_GUIDE, frenchGuide(frData), "fr");
writeTextFile(TW_GUIDE, taiwanGuide(twData), "tw");

for (const [key, route] of Object.entries(routes)) {
  const en = captureLabelsAndTags(EN_HTML, route);
  const cn = captureLabelsByTags(CN_HTML, en.tags);
  const es = captureLabelsByTags(ES_HTML, en.tags);
  const fr = captureLabelsByTags(FR_HTML, en.tags);
  const tw = captureLabelsByTags(TW_HTML, en.tags);
  console.log(`OK ${key}: EN="${ending(en.text, "en")}" CN="${ending(cn.text, "cn")}" ES="${ending(es.text, "es")}" FR="${ending(fr.text, "fr")}" TW="${ending(tw.text, "tw")}"`);
}

console.log(`Wrote ${EN_GUIDE}`);
console.log(`Wrote ${CN_GUIDE}`);
console.log(`Wrote ${ES_GUIDE}`);
console.log(`Wrote ${FR_GUIDE}`);
console.log(`Wrote ${TW_GUIDE}`);
