import personServices from './services/person'
import {useState, useEffect} from 'react'
import './font.css'
function App() {
  const [person, setPerson] = useState([])
  const [filter, setFilter] = useState("")
  const [name, setName] = useState("")
  const [number, setNumber] = useState("")
  const [filtered, setFiltered] = useState([])
  const [errorMsg, setErrorMessage] = useState("")
  const [notification, setNotif] = useState("")

  const refreshData = () => {
    personServices.getData().then(response => {
      setPerson(response)
      setName("")
      setNumber("")
    })
  }
  const displayError = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage("")
    }, 2000);
  }
  const displayNotif = (message) => {
    setNotif(message)
    setTimeout(() => {
      setNotif("")
    }, 2000);
  }


  const handleSubmit = (event) => {
    event.preventDefault()

    const newObj = {name : name, number : number}
    const target = person.find(person => person.name === newObj.name)

    if(target){
      
      if(window.confirm(`Updating ${target.name} number ?`)){
      personServices.updatePerson(target, newObj, refreshData)
      .then(data => displayNotif(`Updated ${target.name}`))
      .catch(error => displayError(error.response.data.error))
    
      }
      else{
        refreshData()
      }
    }
    else{
    personServices.addPerson(newObj, refreshData)
    .then(result => displayNotif(`Added ${newObj.name}`))
    .catch(error => displayError(error.response.data.error))
    }
  }
  const handleDeletionOf = (person) => {
    if(window.confirm(`Do you really want to remove ${person.name} from the database ?`)){
    personServices.removePerson(person, refreshData)
    .then(data => displayNotif(`Removed ${person.name}`))
    }
  }


  const errorStyle = {
    backgroundColor : "#912460",
    color : 'white',
    borderRadius : '10px',
    margin : "50px",
    padding : "10px",
    fontFamily: "sans-serif",
    textAlign: "center"
    
  }
  
  const lStyle = { 
    listStyle : "none"
  }
  const bodyStyle = {textAlign : "center"}

  const notifStyle = {
    backgroundColor : "#18F2B2",
    color : 'white',
    borderRadius : "10px",
    margin : "10px",
    padding : "10px",
    fontFamily : "sans-serif"
  }
  
  useEffect(()=>{
    setFiltered(person.filter(person => person.name.toLowerCase().includes(filter.toLowerCase())))
  }, [filter, person])


  useEffect(()=>{
    refreshData()

  }, [])
  return (
    <div style={bodyStyle}>
      <h1>Phonebook App</h1>
      <p>filter shown with <input value={filter} onChange={(event)=>setFilter(event.target.value)}></input></p>
      <h1>Add someone </h1>
      <form onSubmit={handleSubmit}>
        <p>name:<input value={name} onChange={(event)=> setName(event.target.value)}></input></p>
        <p>number: <input value={number} onChange={(event)=> setNumber(event.target.value)}></input></p>
        <button type="submit">add</button>
      </form>

    <ul style={lStyle}>
      {filtered.map(person => <li key={person.id}>{person.name} {person.number}<button style={{marginLeft: "10px"}} onClick={()=>{handleDeletionOf(person)}}>remove</button></li>)}
    </ul>
    <span>
    <h1 style={errorMsg ? errorStyle : {}}>{errorMsg}</h1>
    <h1 style={notification ? notifStyle : {}}>{notification}</h1>
    </span>
    </div>

    
  );
}

export default App;
