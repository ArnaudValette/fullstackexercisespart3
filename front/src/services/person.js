import axios from 'axios'
const baseUrl = "/api/persons"

const getData = () => {
    const request = axios.get(baseUrl)
    return request.then(res => res.data)
}

const addPerson = (newObj,callBack) => {
    const request = axios.post(baseUrl, newObj)
    return request.then(callBack)
}

const removePerson = (target, callBack) => {
    console.log(target.id)
    const request = axios.delete(`${baseUrl}/${target.id}`)
    return request.then(callBack)
}

const updatePerson = (target, newObj, callBack) => {
    const request = axios.put(`${baseUrl}/${target.id}`, newObj)
    return request.then(callBack)
}


const personServices = {getData, addPerson, removePerson, updatePerson}


export default personServices