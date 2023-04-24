import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  recommendations: { type: Array, required: true },
});

const Recommendation = mongoose.model('Recommendation', recommendationSchema);
export default Recommendation;
