require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const Person = require('./models/persons')
const morgan = require('morgan')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('contenu', (req) => {
    if(req.method === 'POST'){
        return JSON.stringify(req.body)
    }   else{
        return '-'
    }
})

app.use(morgan((tokens,req,res) => {
    return[
        tokens.method(req,res),
        tokens.url(req,res),
        tokens.status(req,res),
        tokens.res(req,res,'content-length'), '-',
        tokens['response-time'](req,res), 'ms',
        tokens.contenu(req,res)
    ].join(' ')
}))

app.get('/info', (req, res) => {
    Person.find({}).then(persons => {
        res.send(`<div><p>There is data for ${persons.length} persons </p> <p>${new Date}</p><div>`)
    })
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (req,res, next) => {
    Person.findById(req.params.id).then(person => {
        if(person){
            res.json(person)
        }
        else{
            res.status(404).end()
        }
    } )
        .catch(error => {
            next(error)
        })
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    const person = new Person({
        name : body.name,
        number : body.number
    })

    person.save().then(saved => {
        res.json(saved.toJSON())
    })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, { new:true, runValidators :true })
        .then(updated => {
            res.json(updated)
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}


app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.error(error.message)
    if(error.name === 'CastError') {
        return res.status(400).send( { error : 'Malformatted ID' })
    }
    else if(error.name === 'ValidationError'){
        return res.status(400).json({ error: error.message })
    }
    next(error)
}


app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)

})
