import React, { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useParams } from 'react-router-dom';
import myDecks1 from '../pictures/myDecks1.jpg';
import decklists1 from '../pictures/decklists1.PNG';
import deckbuilder1 from '../pictures/deckbuilder1.PNG';
import deckbuilder2 from '../pictures/deckbuilder2.PNG';
import deckbuilder3 from '../pictures/deckbuilder3.PNG';
import deckbuilder4 from '../pictures/deckbuilder4.PNG';
import deckbuilder5 from '../pictures/deckbuilder5.PNG';
import { Helmet } from 'react-helmet-async';
export default function HelpScreen() {
  const params = useParams();
  const { page } = params;
  const [key, setKey] = useState(page) || 'myDeck';
  return (
    <div>
      <Helmet>
        <title>Help</title>
      </Helmet>
      <h2>Help</h2>
      <Tabs defaultActiveKey={key} id="help-tabs" className="mb-3">
        <Tab eventKey="myDecks" title="My Decks">
          <h3>My Decks</h3>
          <div>
            "My Decks" serves as a page to show all the decks you have made.
          </div>
          <div>For this example, the user has one deck named "Test Decks".</div>
          <br></br>
          <img className="tutorial-image" src={myDecks1} alt="myDecks1"></img>
          <br></br>
          <br></br>
          <div>Each user has a limit of 15 decks.</div>
          <div>Upon clicking on a deck, the user has several options:</div>
          <div>
            1. View Deck: Opens the decklist page for the deck. User can see the
            decklist, individual card prices, and option to purchase the deck.
          </div>
          <div>
            2. Edit Deck: Opens the decklist in deck builder. Allows user to
            edit the decklist.
          </div>
          <div>3. Delete Deck: Deletes the currently selected deck.</div>
        </Tab>
        <Tab eventKey="deckBuilder" title="Deck Builder">
          <h3>Deck Builder</h3>
          <div>The Deck builder allows users to create their own Decks.</div>
          <div>
            The Deck builder follows standard Yu-Gi-Oh deck building rules:
          </div>
          <div>1. Main Deck: 40-60 Cards</div>
          <div>2. Extra Deck: 0-15 Cards</div>
          <div>3. There can only be 1-3 copies of any card in a deck</div>
          <br></br>
          <h4>Controls</h4>
          <div>Right click on a card in the decklist to remove it</div>
          <div>
            Press enter in the name textbox to save the name of the deck.
          </div>
          <br></br>
          <h4>Tutorial</h4>
          <div>1. CLick "Create new deck"</div>
          <img
            className="tutorial-image"
            src={deckbuilder1}
            alt="deck-builder1"
          ></img>
          <div>
            2. Give your deck a name, by default it is named as "New Deck"
          </div>
          <img
            className="tutorial-image"
            src={deckbuilder2}
            alt="deck-builder2"
          ></img>
          <div>
            3. Use the search feature on the right side to search for cards.
          </div>
          <img
            className="tutorial-image"
            src={deckbuilder3}
            alt="deck-builder3"
          ></img>
          <div>4. Click on a card you want to add to the deck.</div>
          <img
            className="tutorial-image"
            src={deckbuilder4}
            alt="deck-builder4"
          ></img>
          <div>
            5. There will be a card preview where the search form was, click
            "Add to Deck" to add the card to your deck.
          </div>
          <div>Or click "Back to Search" to return to the search form.</div>
          <img
            className="tutorial-image"
            src={deckbuilder5}
            alt="deck-builder5"
          ></img>
          <div>
            6. Navigate back to "My Decks", you should see your new deck.
          </div>
        </Tab>
        <Tab eventKey="decklists" title="DeckLists">
          <h3>Decklists</h3>
          <div>
            Decklists are divided into two sections: User Decklists and
            Tournament Decklists
          </div>
          <img className="tutorial-image" src={decklists1} alt="myDecks1"></img>
          <h4>User Decklists</h4>
          <div>
            These are decklists published by users. The decks are made in the
            deck builder.
          </div>
          <h4>Tournament Decklists</h4>
          <div>These are decklists from official Yu-Gi-Oh irl tournaments.</div>
          <div>
            These decklists are publicly available information from
            YugiohTopDecks.
          </div>
          <div></div>
        </Tab>
      </Tabs>
    </div>
  );
}
