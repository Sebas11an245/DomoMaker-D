const models = require('../models');
const Domo = models.Domo;

const makerPage = async (req, res) => {
    return res.render('app');
};
const makeDomo = async (req, res) => {
    if (!req.body.name || !req.body.age || !req.body.mood) {
        return res.status(400).json({ error: 'All parameters are required!' });
    }

    const domoData = {
        name: req.body.name,
        age: req.body.age,
        mood: req.body.mood,
        owner: req.session.account._id,
    };

    try {
        const newDomo = new Domo(domoData);
        await newDomo.save();
        return res.status(201).json({ name: newDomo.name, age: newDomo.age, mood: newDomo.mood });

    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Domo already exists!' });
        }
        return res.status(500).json({ error: 'An error occured making domo!' });
    }
}

const getDomos = async (req, res) => {
    try {
        const query = { owner: req.session.account._id };
        const docs = await Domo.find(query).select('name age mood').lean().exec();

        return res.json({ domos: docs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving domos!' });
    }
};
const deleteDomo = async (req, res) => {
    try {
        await Domo.deleteOne({
            _id: req.body.id,
            owner: req.session.account._id,
        });

        return res.status(200).json({ message: 'Deleted' });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ error: 'Error deleting domo' });
    }
};

module.exports = {
    makerPage,
    makeDomo,
    getDomos,
    deleteDomo,
}