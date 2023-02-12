import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'Danny',
      email: 'admin@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: true,
      collectionID: 1,
      deckIDs: [],
    },
    {
      name: 'John',
      email: 'user@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: false,
      collectionID: 2,
      deckIDs: [],
    },
  ],
  products: [
    {
      name: 'Ash Blossom & Joyous Spring',
      type: 'tuner monster',
      race: 'zombie',
      attribute: 'fire',
      level: 3,
      atk: 0,
      def: 1800,
      desc: `During either player's turn, when a card or effect is activated that includes any of these effects: You can discard this card; negate that effect.
- Add a card from the Deck to the hand.
- Special Summon from the Deck.
- Send a card from the Deck to the Graveyard.
You can only use this effect of "Ash Blossom & Joyous Spring" once per turn.`,
      card_sets: [
        {
          set_name: "2022 Tin of the Pharaoh's Gods",
          set_code: 'MP22-EN257',
          set_rarity: 'Prismatic Secret Rare',
          set_rarity_code: '(P5cR)',
          set_price: '0',
        },
      ],
      card_images: [
        {
          id: 1,
          image_url: 'https://images.ygoprodeck.com/images/cards/14558127.jpg',
        },
      ],
      card_prices: [
        {
          cardmarket_price: '4.42',
          tcgplayer_price: '4.84',
          ebay_price: '15.99',
          amazon_price: '28.99',
          coolstufinic_price: '9.99',
        },
      ],
    },
    {
      name: 'Tearlaments Scheiren',
      type: 'Effect Monster',
      image: '/images/p2.jpg',
      level: 4,
      atk: 1800,
      def: 1300,
      race: 'Aqua',
      attribute: 'DARK',
      archetype: 'tearlaments',
      desc: `During your Main Phase: You can Special Summon this card from your hand, and if you do, send 1 monster from your hand to the GY, then, send the top 3 cards of your Deck to the GY. If this card is sent to the GY by card effect (except during the Damage Step): You can Fusion Summon 1 Fusion Monster from your Extra Deck, by placing Fusion Materials mentioned on it from your hand, field, and/or GY, including this card from your GY, on the bottom of the Deck in any order. You can only use each effect of "Tearlaments Scheiren" once per turn.`,
      card_sets: [
        {
          set_name: 'Power of the Elements',
          set_code: 'POTE-EN014',
          set_rarity: 'Super Rare',
          set_rarity_code: '(SR)',
          set_price: '0',
        },
      ],
      card_images: [
        {
          id: 572850,
          image_url: 'https://images.ygoprodeck.com/images/cards/572850.jpg',
        },
      ],
      card_prices: [
        {
          cardmarket_price: '1.79',
          tcgplayer_price: '1.43',
          ebay_price: '1.00',
          amazon_price: '1.49',
          coolstufinic_price: '1.99',
        },
      ],
    },
    {
      name: 'Despian Quaertis',
      type: 'Fusion monster',
      atk: 2500,
      def: 2500,
      race: 'Fiend',
      attribute: 'LIGHT',
      archetype: 'Despia',
      level: 8,
      desc: `1 "Despia" monster + 1 LIGHT or DARK monster
During the Main Phase (Quick Effect): You can change the ATK of all monsters currently on the field to 0 until the end of this turn, except Level 8 or higher Fusion Monsters. If this face-up card in its owner's control leaves the field because of an opponent's card effect: You can add to your hand, or Special Summon, 1 "Fallen of Albaz" or 1 "Despia" monster, from your Deck. You can only use each effect of "Despian Quaeritis" once per turn.`,
      card_sets: [
        {
          set_name: "2022 Tin of the Pharaoh's Gods",
          set_code: 'MP22-EN141',
          set_rarity: 'Prismatic Secret Rare',
          set_rarity_code: '(PScR)',
          set_price: '0',
        },
        {
          set_name: 'Dawn of Majesty',
          set_code: 'DAMA-EN034',
          set_rarity: 'Ultra Rare',
          set_rarity_code: '(UR)',
          set_price: '15.31',
        },
      ],
      card_images: [
        {
          id: 72272462,
          image_url: 'https://images.ygoprodeck.com/images/cards/72272462.jpg',
        },
      ],
      card_prices: [
        {
          cardmarket_price: '0.71',
          tcgplayer_price: '0.59',
          ebay_price: '1.99',
          amazon_price: '0.25',
          coolstufinic_price: '1.99',
        },
      ],
    },
    {
      name: 'The Dark Magicians',
      type: 'Fusion Monster',
      price: 8.15,
      atk: 2800,
      def: 2300,
      level: 8,
      race: 'Spellcaster',
      attribute: 'DARK',
      archetype: 'Dark Magician',
      desc: `"Dark Magician" or "Dark Magician Girl" + 1 Spellcaster monster Once per turn, if a Spell/Trap Card or effect is activated (except during the Damage Step): You can draw 1 card, then if it was a Spell/Trap, you can Set it, and if it was a Trap or Quick-Play Spell, you can activate it this turn. If this card is destroyed: You can Special Summon both 1 "Dark Magician" and 1 "Dark Magician Girl" from your hand, Deck, and/or GY.`,
      card_sets: [
        {
          set_name: 'Battle of Chaos',
          set_code: 'BACH-EN100',
          set_rarity: 'Starlight Rare',
          set_rarity_code: '(StR)',
          set_price: '528.29',
        },
        {
          set_name: 'Legendary Duelists: Magical Hero',
          set_code: 'LED6-EN001',
          set_rarity: 'Ultra Rare',
          set_rarity_code: '(UR)',
          set_price: '56.88',
        },
      ],
      card_images: [
        {
          id: 50237654,
          image_url: 'https://images.ygoprodeck.com/images/cards/50237654.jpg',
        },
      ],
      card_prices: [
        {
          cardmarket_price: '7.73',
          tcgplayer_price: '8.85',
          ebay_price: '12.99',
          amazon_price: '11.80',
          coolstufinic_price: '8.99',
        },
      ],
    },
  ],
};

export default data;
