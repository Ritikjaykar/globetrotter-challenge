import Destination from '../models/destination.js';

export const getRandomDestination = async (req, res) => {
  try {
    const used = req.query.used ? req.query.used.split(',') : [];
    const remaining = await Destination.find({ destination: { $nin: used } });

    if (remaining.length === 0) {
      return res.status(200).json({ completed: true });
    }

    const randomIndex = Math.floor(Math.random() * remaining.length);
    const newDestination = remaining[randomIndex];

    const options = await Destination.aggregate([
      { $match: { destination: { $ne: newDestination.destination } } },
      { $sample: { size: 3 } },
    ]);

    const allOptions = [...options.map(d => d.destination), newDestination.destination];
    const shuffled = allOptions.sort(() => Math.random() - 0.5);

    res.json({
      destination: newDestination,
      options: shuffled,
      completed: false,
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Server error while getting destination' });
  }
};
