import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    brand: { type: String, required: false },
    category: { type: String, required: false },
    desc: { type: String, required: true },
    countInStock: { type: Number, required: false },
    rating: { type: Number, required: false },
    numReviews: { type: Number, required: false },
    type: { type: String, required: false },
    frameType: { type: String, required: false },
    level: { type: Number, required: false },
    atk: { type: Number, required: false },
    def: { type: Number, required: false },
    attribute: { type: String, required: false },
    number: { type: String, required: false },
    rarity: { type: String, required: false },
    card_sets: { type: Array, required: false },
    card_images: { type: Array, required: false },
    card_prices: { type: Array, required: false },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
