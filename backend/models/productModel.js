import mongoose from 'mongoose';
import slugify from 'slugify';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'default', required: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number },
    brand: { type: String, required: false },
    category: { type: String, required: false },
    desc: { type: String, default: 'default', required: true },
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

productSchema.pre('validate', function (next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  if (this.card_prices) {
    //this.price = parseFloat(this.card_prices[0].cardmarket_price);
    if (this.card_prices.length > 0) {
      this.price = parseFloat(Object.values(this.card_prices[0]));
    } else {
      this.price = 1.0;
    }
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
