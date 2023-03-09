import mongoose from 'mongoose';

const decklistSchema = new mongoose.Schema({
  name: { type: String, required: true, default: 'New Deck' },
  isUserCreated: { type: Boolean, default: false, required: true },
  isPublic: { type: Boolean, default: false },
  userEmail: { type: String },
  duelist: { type: String, required: true },
  date: { type: String },
  tournament: { type: String },
  archetype: { type: String },
  placement: { type: String },
  upvote: { type: Number, default: 0 },
  downvote: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  mainDeck: { type: Array, default: [], required: true },
  extraDeck: { type: Array, default: [], required: true },
  sideDeck: { type: Array, default: [], required: true },
});

const Decklist = mongoose.model('Decklist', decklistSchema);
export default Decklist;
