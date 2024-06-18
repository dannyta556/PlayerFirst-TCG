# PlayerFirst TCG

# Description

Trading card game developers have been struggling to attract new players. There are many reasons for this, such as the lack of good advertising, the high learning curve of the games, and the high cost of entry. For those interested in the game, they need to do considerable research into the rules of the game and what cards to buy. The Yu-Gi-Oh trading card game currently has over 12,000 cards which can be overwhelming for a new player. Although there are good resources such as YouTube guides and decklists to help people get started, it takes a high level of commitment to find these resources.

A trading card game is a game where players collect cards to create customized decks of cards to challenge other players in matches. Each game has a fundamental set of rules that describes a player’s objectives, the types of cards used in the game, and the basic rules by which the cards interact. Players acquire these cards by purchasing card packs and sets or trade between each other. In Yu-Gi-Oh, a player also needs to understand the banlist, an official list of cards by Konami (the developers of Yu-Gi-Oh) which limits or restricts certain cards from being played in the game. The rulings, which are official statements issued by Konami which clarifies the interactions between cards and card effects. Finally the metagame, which refers to the decks or cards in current competitive use that are having the greatest success.

In my project, I developed a trading card store that will have all the necessary features to help ease new players into the trading card game. Besides understanding the rules of the game, it is just as important to understand deck building, where a player decides what cards to bring into a match. The system allows players to create their decks on the website and has a recommendation system to recommend compatible cards. The recommendation system uses features of a card alongside tournament decklists data to recommend the most compatible cards. Users can share their created decks with other users. Publicly available decklists from tournament play are available on the website, for users to reference or buy. A “My Collection” feature helps users keep track of what cards they own and helps in automatically calculating prices for decks.

# Features

<ol>
<li>Home Screen </li>
<li>Search Screen</li>
<li>Product Page</li>
<li>Shopping Cart</li>
<li>PayPal</li>
<li>My Collection</li>
<li>Orders</li>
<li>Create a Deck</li>
<li>Tournament Decklists</li>
<li>User Decklists</li>
<li>Card Recommendation System</li>
</ol>

# Setup Instructions

- node installed
- MongoDB installed

For getting card images

1. Get a collection of card images from YugiohProAPI
2. Place images into an images folder in the public folder

## Setup

1. cd frontend
2. npm install (may need to do npm -f install)
3. on a second terminal in the main folder, cd backend
4. npm install
5. Create a .env file in the backend folder
6. add MONGODB_URI=mongodb://localhost/PlayerFirstTCG (localhost may need to be changed to 127.0.0.1 depending on system)

## Running the Application

1. Terminal 1: cd backend
2. Terminal 1: npm start
3. Terminal 2: cd frontend
4. Terminal 2: npm start
5. Admin Login: admin@example.com password: 123456
6. User Login: user@example.com password: 123456

## Setup Database

1. While backend is running (npm start in backend folder)
2. Navigate to localhost:5000/api/seed (if you cannot connect, go to the .env file and change localhost to 127.0.0.1)
3. Navigate to localhost:5000/api/seed/import
4. Navigate to localhost:5000/api/seed/importDecklists
5. Navigate to localhost:5000/api/seed/sets
6. Navigate to localhost:5000/api/seed/recommendations
7. Navigate to localhost:5000/api/seed/articles
