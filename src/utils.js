/**
 * @description
 * This function determines the groupings for the GBM
 * @returns {Object} - The groupings for the GBM
 */
export const getGroupings = async () => {
    let groupings = {
      'duwende': [],
      'aswang': [],
      'mariaMakiling': [],
      'idiyanale': [],
      'mapulon': []
    }

    // Get the attendee information from the table
    const response = await fetch('https://l11sh25g55.execute-api.us-east-1.amazonaws.com/get-attendee-info', {
      method: 'GET',
    });

    if (response.ok) {
      const data = await response.json();
      
      // Set the maximum group size
      const maxGroupSize = Math.ceil(data.length / 5);

      for (let i = 0; i < data.length; i++) {
        const fullName = data[i]['firstName'] + ' ' + data[i]['lastName'];
        const ranking = data[i]['ranking'];
        for (let j = 0; j < 5; j++) {
          const figure = data[i]['ranking'][j];
          if (groupings[figure].length < maxGroupSize) {
            groupings[figure].push(fullName);
            break;
          }
        }
      }

      console.log(groupings)
      return groupings; // Assuming the response contains the list of attendees
  } else {
      console.error('Error fetching attendee information:', response.statusText);
      return null;
  }
}
    

/**
 * @description
 * This function calculates the figure alignment ranking
 * @param {Object} data - The data submitted
 */

export const getAlignmentRanking = (data) => {
    const { superpower, freeTime, hpHouse, lifetime, trolley } = data;

    let rankings = {
        'duwende': 0,
        'aswang': 0,
        'mariaMakiling': 0,
        'idiyanale': 0,
        'mapulon': 0
    }

    // Update the rankings based on the answers
    const updateRanking = (answer, rankings) => {
        switch (answer) {
            case 'Invisibility':
            case 'TikTok or Instagram Reels':
            case 'Slytherin':
            case 'Bring justice to the world':
                rankings.duwende += 1;
                break;
            case 'Shapeshift into anyone or anything':
            case 'Among Us':
            case 'I’d rather work for Voldemort':
            case 'Become the most powerful person on the planet':
                rankings.aswang += 1;
                break;
            case 'Supernaturally good looking':
            case 'Hinge':
            case 'Hufflepuff':
            case 'Find true love':
                rankings.mariaMakiling += 1;
                break;
            case 'Ultra-intellect':
            case 'Read a book':
            case 'Ravenclaw':
            case 'Make a seven-figure salary':
                rankings.idiyanale += 1;
                break;
            case 'Control the four elements: water, air earth and fire (like the Avatar)':
            case 'Go outside':
            case 'Gryffindor':
            case 'Become one with nature':
                rankings.mapulon += 1;
                break;
            default:
                break;
        }
    };

    updateRanking(superpower, rankings);
    updateRanking(freeTime, rankings);
    updateRanking(hpHouse, rankings);
    updateRanking(lifetime, rankings);
    updateRanking(trolley, rankings);

    // Update scores for trolley problem
    if (trolley === 'Pull the lever') {
        rankings.duwende += 2;
        rankings.aswang += 2;
    } else if (trolley === 'Do nothing') {
        rankings.idiyanale += 2;
        rankings.mariaMakiling += 2;
        rankings.mapulon += 2;
    }

    const sortedRankings = Object.fromEntries(
        Object.entries(rankings).sort(([, v1], [, v2]) => v1 - v2)
    );

    
    // Get the top 5 rankings in the form of an array with only the figures
    let rankingArray = Object.entries(sortedRankings).map(([key]) => key);
    rankingArray = rankingArray.reverse();

    return rankingArray;

}

/**
 * @description
 * This function handles the data from submitting the form
 *  
 * @param {Object} data - The data submitted
 */
export const handleData = async (data) => {

    const { firstName, lastName, gtEmail, year, mailingList, superpower, freeTime, hpHouse, lifetime, trolley } = data;

    // Check if the data is valid
    if (!firstName) { return "Please enter your first name."; }
    if (!lastName) { return 'Please enter your last name.'; }
    if (!gtEmail) { return 'Please enter your GT email.';  }
    if (!year) { return 'Please select your year.'; }
    if (!mailingList) { return 'Please select if you would like to join our mailing list.'; }
    if (!superpower) { return 'Please select a superpower.'; }
    if (!freeTime) { return 'Please select what you would do with an hour of free time.'; }
    if (!hpHouse) { return 'Please select a Harry Potter house.'; }
    if (!lifetime) { return 'Please select one thing to happen in your lifetime.'; }
    if (!trolley) { return 'Please select what you would do with the trolley.'; }

    let result = getAlignmentRanking(data);
    let email = gtEmail;

    // Get the attendee information from the table
    const response = await fetch('https://l11sh25g55.execute-api.us-east-1.amazonaws.com/get-attendee-info', {
      method: 'GET',
    });

    if (response.ok) {
      const data = await response.json();
      
      for (let i = 0; i < data.length; i++) {
        if (data[i]['email'] === email) {
            return 'You have already submitted your information.';
        }
      }

    } else {
        console.error('Error fetching attendee information:', response.statusText);
    }

    try {
        const response = await fetch('https://l11sh25g55.execute-api.us-east-1.amazonaws.com/submit-form', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            year,
            mailingList,
            result
          })
        });

        console.log(response)
    
        if (response.ok) {
          return 'Information submitted successfully!'
        } else {
          return 'Error submitting information.';
        }
      } catch (error) {
        console.error('Error:', error);
        return 'Error submitting information.';
      }
}