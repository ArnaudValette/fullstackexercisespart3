const mongoose = require('mongoose')
const url = process.env.MONGODB_URL
const uniqueValidator = require('mongoose-unique-validator')


mongoose.connect(url).then(() => {
    console.log('MongoDB connection successful')
}).catch(error => {
    console.log('MongoDB connection refused: ', error.message)
})

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true,
        unique: true,
    },
    number: {
        type: String,
        required: true,
        minlength:8,
    },
})
personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', { transform : (doc, newDoc) => {
    newDoc.id = doc._id.toString()
    delete newDoc._id
    delete newDoc.__v
}
})

module.exports = mongoose.model('Person', personSchema )