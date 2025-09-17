const puzzles = [
    {
        solution: {
            'WHODUNIT?': ['Chinatown', 'Se7en', 'Decision to Leave', 'The Girl with the Dragon Tattoo'],
            'ACTOR PLAYING TWINS': ['Sinners', 'The Parent Trap', 'The Prestige', 'Adaptation'],
            'STARRING: JAMIE LEE CURTIS': ['Halloween', 'Knives Out', 'Freaky Friday', 'EEAAO'],
            'DIRECTOR: BONG JOON HO': ['Parasite', 'Mickey 17', 'The Host', 'Snowpiercer']
        },
        words: ['Chinatown', 'Se7en', 'Decision to Leave', 'The Girl with the Dragon Tattoo', 'Sinners', 'The Parent Trap', 'The Prestige', 'Adaptation', 'Halloween', 'Knives Out', 'Freaky Friday', 'EEAAO', 'Parasite', 'Mickey 17', 'The Host', 'Snowpiercer'],
    },
    // You can add more puzzles here in the future.
];

const wordImages = {
    // This object is currently empty but will be useful if you decide to add images later.
    'Chinatown': 'images_01/Chinatown.jpg',
    'Se7en': 'images_01/Se7en.jpg',
    'Adaptation': 'images_01/Adaptation.jpg',
    'Decision to Leave': 'images_01/Decision_to_Leave.jpg',
    'EEAAO': 'images_01/EEAAO.jpg',
    'Freaky Friday': 'images_01/Freaky_Friday.jpg',
    'Halloween': 'images_01/Halloween.jpg',
    'Knives Out': 'images_01/Knives_Out.jpg',
    'Mickey 17': 'images_01/Mickey_17.jpg',
    'Parasite': 'images_01/Parasite.jpg',
    'Snowpiercer': 'images_01/Snowpiercer.jpg',
    'Sinners': 'images_01/Sinners.jpg',
    'The Parent Trap': 'images_01/The_Parent_Trap.jpg',
    'The Prestige': 'images_01/The_Prestige.jpg',
    'The Host': 'images_01/The_Host.jpg',
    'The Girl with the Dragon Tattoo': 'images_01/The_Girl_with_the_Dragon_Tattoo.jpg',
    // ... add more image paths here
};

export { puzzles, wordImages };