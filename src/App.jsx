import { useState } from 'react'
import trolleyImage from './assets/trolley.jpg' // Import the image
import './App.css'

import 'firebase/firestore';
import 'firebase/auth';

import { handleData, getGroupings, getAttendeeInfo, getRandomGroupings } from './utils.js'

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const [groupings, setGroupings] = useState({
    'duwende': [],
    'aswang': [],
    'mariaMakiling': [],
    'idiyanale': [],
    'mapulon': []
  });

  const handleSortGroups = async () => {
    const response = await getGroupings();
    if (response) {
      setGroupings(response);
    } else {
      alert('Error fetching groupings');
    }
  }

  const handleRandomSortGroups = async () => {
    const response = await getRandomGroupings();
    if (response) {
      setGroupings(response);
    } else {
      alert('Error fetching random groupings');
    }
  }

  const handleSubmit = async () => {

    setSubmitting(true);

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const gtEmail = document.getElementById('gtEmail').value;
    const year = document.querySelector('input[name="year"]:checked')?.value;
    const mailingList = document.querySelector('input[name="mailingList"]:checked')?.value;
    const superpower = document.querySelector('input[name="superpower"]:checked')?.value;
    const freeTime = document.querySelector('input[name="freeTime"]:checked')?.value;
    const hpHouse = document.querySelector('input[name="hpHouse"]:checked')?.value;
    const lifetime = document.querySelector('input[name="lifetime"]:checked')?.value;
    const trolley = document.querySelector('input[name="trolley"]:checked')?.value;

    const result = await handleData({
      firstName,
      lastName,
      gtEmail,
      year,
      mailingList,
      superpower,
      freeTime,
      hpHouse,
      lifetime,
      trolley
    });

    alert(result);
    if (result === 'Information submitted successfully!') {
      setSubmitted(true);
    }
    setSubmitting(false);
    return

  };

  const handleAdminSettings = () => {
    const password = prompt('Enter admin password (hint - its a prime number):');
    if (password === "halohalohalohalo4") { // Nice try :)
      setIsAdmin(true);
    } else {
      alert('Access denied.');
    }
  };

  const handleBackToQuiz = () => {
    setIsAdmin(false);
  };

  const handleFetchAttendees = async () => {
    const response = await getAttendeeInfo();
    if (response) {
      setAttendees(response);
    } else {
      alert('Error fetching attendee information');
    }
  };

  if (isAdmin) {
    const groups = Object.values(groupings);

    return (
      <div className="admin-container">
        <button onClick={() => handleSortGroups()}>Sort Groups</button>
        <button onClick={() => handleRandomSortGroups()}>Randomly Sort Groups</button>
        <button onClick={() => alert('Clear Table')}>Clear Table</button>
        <button onClick={() => handleFetchAttendees()}>Refresh Attendees</button>
        <button onClick={handleBackToQuiz}>Back to Quiz</button>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Group 1</th>
              <th>Group 2</th>
              <th>Group 3</th>
              <th>Group 4</th>
              <th>Group 5</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {groups.map((group, colIndex) => (
                <td key={colIndex}>
                  {group.map((name, rowIndex) => (
                    <div key={rowIndex}>{name}</div>
                  ))}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        <h3>Attendees ({attendees.length})</h3>
        <h3>
            Duwende: {(attendees.filter(att => att['ranking'][0] === 'duwende').length)} ---
            Aswang: {(attendees.filter(att => att['ranking'][0] === 'aswang').length)} ---
            Maria Makiling: {(attendees.filter(att => att['ranking'][0] === 'mariaMakiling').length)} ---
            Idiyanale: {(attendees.filter(att => att['ranking'][0] === 'idiyanale').length)} ---
            Mapulon: {(attendees.filter(att => att['ranking'][0] === 'mapulon').length)} 
        </h3>
        {attendees.map((attendee, index) => (
          <p>{attendee['firstName']} {attendee['lastName']}, {attendee['email']}, {attendee['year']}, {attendee['ranking'][0]}</p>
        ))}
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="thank-you-container">
        <h3>Thank you for submitting the quiz!</h3>
        <p>Please enjoy the food and the first activity will start soon.</p>
      </div>

    )
  }

  return (
    <>
      <h3>March GBM Sign-In and Quiz</h3>
      <div className="question">
        <label htmlFor="firstName">First Name</label>
        <input type="text" id="firstName" name="firstName" className="input-box" />
      </div>
      <div className="question">
        <label htmlFor="lastName">Last Name</label>
        <input type="text" id="lastName" name="lastName" className="input-box" />
      </div>
      <div className="question">
        <p>Year</p>
        <div className="option">
          <input type="radio" id="1stYear" name="year" value="1st Year" />
          <label htmlFor="1stYear">1st Year</label>
        </div>
        <div className="option">
          <input type="radio" id="2ndYear" name="year" value="2nd Year" />
          <label htmlFor="2ndYear">2nd Year</label>
        </div>
        <div className="option">
          <input type="radio" id="3rdYear" name="year" value="3rd Year" />
          <label htmlFor="3rdYear">3rd Year</label>
        </div>
        <div className="option">
          <input type="radio" id="4thYear" name="year" value="4th Year" />
          <label htmlFor="4thYear">4th Year</label>
        </div>
        <div className="option">
          <input type="radio" id="graduateStudent" name="year" value="Graduate Student" />
          <label htmlFor="graduateStudent">Graduate Student</label>
        </div>
      </div>
      <div className="question">
        <label htmlFor="gtEmail">GT Email</label>
        <input type="email" id="gtEmail" name="gtEmail" className="input-box" />
      </div>
      <div className="question">
        <p>Would you like to join our mailing list to receive updates about our upcoming events?</p>
        <div className="option">
          <input type="radio" id="mailingListYes" name="mailingList" value="Yes" />
          <label htmlFor="mailingListYes">Yes</label>
        </div>
        <div className="option">
          <input type="radio" id="mailingListNo" name="mailingList" value="No" />
          <label htmlFor="mailingListNo">No</label>
        </div>
        <div className="option">
          <input type="radio" id="mailingListAlready" name="mailingList" value="Already on it!" />
          <label htmlFor="mailingListAlready">Already on it!</label>
        </div>
      </div>
      <div className="question">
        <p>Choose a superpower:</p>
        <div className="option">
          <input type="radio" id="invisibility" name="superpower" value="Invisibility" />
          <label htmlFor="invisibility">Invisibility</label>
        </div>
        <div className="option">
          <input type="radio" id="shapeshift" name="superpower" value="Shapeshift into anyone or anything" />
          <label htmlFor="shapeshift">Shapeshifting</label>
        </div>
        <div className="option">
          <input type="radio" id="goodLooking" name="superpower" value="Supernaturally good looking" />
          <label htmlFor="goodLooking">Supernaturally good looking</label>
        </div>
        <div className="option">
          <input type="radio" id="ultraIntellect" name="superpower" value="Ultra-intellect" />
          <label htmlFor="ultraIntellect">Ultra-intellect</label>
        </div>
        <div className="option">
          <input type="radio" id="controlElements" name="superpower" value="Control the four elements: water, air earth and fire (like the Avatar)" />
          <label htmlFor="controlElements">Control fire, air, earth and water</label>
        </div>
      </div>
      <div className="question">
        <p>You have an hour of free time. What do you do with it?</p>
        <div className="option">
          <input type="radio" id="tiktok" name="freeTime" value="TikTok or Instagram Reels" />
          <label htmlFor="tiktok">TikTok or Instagram Reels</label>
        </div>
        <div className="option">
          <input type="radio" id="amongUs" name="freeTime" value="Among Us" />
          <label htmlFor="amongUs">Among Us</label>
        </div>
        <div className="option">
          <input type="radio" id="hinge" name="freeTime" value="Hinge" />
          <label htmlFor="hinge">Hinge</label>
        </div>
        <div className="option">
          <input type="radio" id="readBook" name="freeTime" value="Read a book" />
          <label htmlFor="readBook">Read a book</label>
        </div>
        <div className="option">
          <input type="radio" id="goOutside" name="freeTime" value="Go outside" />
          <label htmlFor="goOutside">Go outside</label>
        </div>
      </div>
      <div className="question">
        <p>Choose a Harry Potter house:</p>
        <div className="option">
          <input type="radio" id="slytherin" name="hpHouse" value="Slytherin" />
          <label htmlFor="slytherin">Slytherin</label>
        </div>
        <div className="option">
          <input type="radio" id="voldemort" name="hpHouse" value="I’d rather work for Voldemort" />
          <label htmlFor="voldemort">I’d rather work for Voldemort</label>
        </div>
        <div className="option">
          <input type="radio" id="hufflepuff" name="hpHouse" value="Hufflepuff" />
          <label htmlFor="hufflepuff">Hufflepuff</label>
        </div>
        <div className="option">
          <input type="radio" id="ravenclaw" name="hpHouse" value="Ravenclaw" />
          <label htmlFor="ravenclaw">Ravenclaw</label>
        </div>
        <div className="option">
          <input type="radio" id="gryffindor" name="hpHouse" value="Gryffindor" />
          <label htmlFor="gryffindor">Gryffindor</label>
        </div>
      </div>
      <div className="question">
        <p>Choose one thing to happen in your lifetime:</p>
        <div className="option">
          <input type="radio" id="justice" name="lifetime" value="Bring justice to the world" />
          <label htmlFor="justice">Bring justice to the world</label>
        </div>
        <div className="option">
          <input type="radio" id="powerful" name="lifetime" value="Become the most powerful person on the planet" />
          <label htmlFor="powerful">Take over the world</label>
        </div>
        <div className="option">
          <input type="radio" id="trueLove" name="lifetime" value="Find true love" />
          <label htmlFor="trueLove">Find true love</label>
        </div>
        <div className="option">
          <input type="radio" id="sevenFigures" name="lifetime" value="Make a seven-figure salary" />
          <label htmlFor="sevenFigures">Make a seven-figure salary</label>
        </div>
        <div className="option">
          <input type="radio" id="oneWithNature" name="lifetime" value="Become one with nature" />
          <label htmlFor="oneWithNature">Become one with nature</label>
        </div>
      </div>
      <div className="question">
        <img src={trolleyImage} alt="Trolley on fire" style={{ maxWidth: '300px' }} />
        <p>A trolley on fire is heading towards a forest the size of Manhattan which is 700 miles from a large city. You can pull the lever to divert it to a different track, but it will run over and burn five million dollars that would have been yours. If you don’t pull the lever, the trolley will crash into the forest and burn it to the ground. There are no people in this forest, and you would not be blamed for the forest burning down. What do you do?</p>
        <div className="option">
          <input type="radio" id="pullLever" name="trolley" value="Pull the lever" />
          <label htmlFor="pullLever">Pull the lever</label>
        </div>
        <div className="option">
          <input type="radio" id="doNothing" name="trolley" value="Do nothing" />
          <label htmlFor="doNothing">Do nothing</label>
        </div>
      </div>
      <div className="button-container">
        <button onClick={handleSubmit} disabled={submitting}>{submitting ? "Submitting..." : "Submit" }</button>
        <button onClick={handleAdminSettings}>Admin Settings</button>
      </div>
    </>
  )
}

export default App
