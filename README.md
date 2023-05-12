# EcoRoute

EcoRoute is a fullstack web application designed to help users make sustainable travel choices. With EcoRoute, users can view data on their trips’ greenhouse gas (GHG) emissions and track their progress over time. In addition to its emissions tracking features, EcoRoute also functions as a social platform where users can add friends and compare their emissions data, providing a fun and engaging way to promote sustainability.

EcoRoute was developed as a capstone project, combining the interests of civil and software engineering. The application uses a variety of technologies, including React, Flask, and PostgreSQL, to provide a seamless user experience.


## Tech Stack
------
#### Front-End
- React
- JavaScript
- React Router DOM for Client-Side Rendering
- HTML/CSS
- Bootstrap for app design

#### Back-End
- Flask
- Python
- PostgreSQL for database
- SQLAlchemy for ORM

#### APIs Used
- [React Google Maps API](https://www.npmjs.com/package/@react-google-maps/api)
- [Fuel Economy API](https://www.fueleconomy.gov/feg/ws/#vehicle)
- [AirNow API](https://docs.airnowapi.org/webservices)
- [React Chartjs 2](https://www.npmjs.com/package/react-chartjs-2)
- [Chart.js](https://www.chartjs.org/docs/latest/)
- [Apex Charts](https://apexcharts.com/)


## Installation
---
1. Clone this repository onto your local machine
2. Install dependencies with `npm install` and `pip3 install`
3. Create a PostgreSQL database
4. Run the application with `npm start` and `python3 server.py`

## Usage
---
Once you have the application up and running, create an account to get started. From there, you can add trips and view your emissions data. You can also search for other users and add them as friends to compare your emissions data. With EcoRoute, you can track your progress and work towards a more sustainable future!

## Features
---
#### Dashboard
![Dashboard](https://drive.google.com/file/d/1WfY9fChmMWztJVFDo2ad7n39hoBYs6CC/view?usp=sharing)
The dashboard is the main page of the app. Here, users can view an overview of their travel data, including total miles traveled, current Air Quality Index (AQI) based on their location, and total GHG emissions. The dashboard also includes a button that triggers the add Trip form. The last tiles display the user’s recent trips, emissions history, and a leaderboard to compare emissions against their friends.

#### New Trip
![New Trip](https://drive.google.com/file/d/1fAUlKBrRB6iI2sFLAWYVoHjo7vOKE4Xt/view?usp=sharing)
Adding a trip is a one-to-many relationship between users and trips. The Google Maps React library is used to register users' trips from point A to point B, and a formula from the Environmental Protection Agency is implemented to calculate the trip’s GHG emissions. After submitting the trip, users are redirected to the dashboard, where they can see their new data.

#### Trip Page
![Trips Page](https://drive.google.com/file/d/1PAMGAGlvgIIOs6PUSaBCjpTB1tkBdZh1/view?usp=sharing)
On the trips page, users can view all of their registered trips in a table and delete a trip if needed.

#### Friend Features
![Feed](https://drive.google.com/file/d/1Wo_e1CdJxK_8qsRJLx8qMC_vGtGmdPhk/view?usp=sharing)
![New Friend](https://drive.google.com/file/d/1O-aSFJvJ3pMlruQQQkLPI8vTB3Xp6s9P/view?usp=sharing)
![Friend Requests](https://drive.google.com/file/d/1Xfi3o4KwBbe_2iV10_QFjpmHcvOOYwow/view?usp=sharing)
![Friends](https://drive.google.com/file/d/1b8XsTMwJ_iwd27wuGRcyBnZ5_3DDIoo0/view?usp=sharing)
The next four pages are the “friend features,” which are achieved using a many-to-many self-referential relationship between user-to-user. On the feed page, users can view their friends’ added trips. On the add friend page, users can input an email to send a friend request. Users can view and respond to friend requests on the friend requests page. Finally, the view friends page displays all of a user’s friends.

#### Account Page
![Account old vehicle](https://drive.google.com/file/d/1GNcblUc4VeNmcYNI4G_YvQVoit57kYIt/view?usp=sharing)
![New Vehicle](https://drive.google.com/file/d/1gUplwuR7Klbg3_xE0V7vSGJUn_GAPTth/view?usp=sharing)
![Account new vehicle](https://drive.google.com/file/d/16qnP60sdUWR-LcZIX9bhW9Wl5nxtXEfx/view?usp=sharing)
On the account page, users can view all of their account information, and conditionally render the option to add or update a vehicle. There is a one-to-one relationship between a user and a vehicle, and the Fuel Economy API is used to find vehicle data. In the modal form, dynamically chained API calls generate the options for the next question to successfully add a vehicle to the account.