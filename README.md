# CoinHub

![Am I Responsive]()

**Developer: Dillon Mc Caffrey**

[Visit live website](https://ci-pp4-coinhub.herokuapp.com/)  



## Table of Contents
  - [About](#about)
  - [User Goals](#user-goals)
  - [Site Owner Goals](#site-owner-goals)
  - [User Experience](#user-experience)
  - [User Stories](#user-stories)
  - [Design](#design)
    - [Colours](#colours)
    - [Fonts](#fonts)
    - [Structure](#structure)
      - [Website pages](#website-pages)
      - [Database](#database)
    - [Wireframes](#wireframes)
  - [Technologies Used](#technologies-used)
  - [Features](#features)
  - [Validation](#validation)
  - [Testing](#testing)
    - [Manual testing](#manual-testing)
    - [Automated testing](#automated-testing)
    - [Tests on various devices](#tests-on-various-devices)
    - [Browser compatibility](#browser-compatibility)
  - [Bugs](#bugs)
  - [Heroku Deployment](#heroku-deployment)
  - [Credits](#credits)
  - [Acknowledgements](#acknowledgements)

### About

CoinHub is a educational crypto trading website, where you can view market data on each cryptocurrency and mock trade to grow your portfolio
<hr>

### User Goals

- View the markets and learn about each crypto currency
- To trade crypto currencies and build a portfolio
- Learn how the markets work and grow a pool of assets 

### Site Owner Goals

- To provide a learning experience for crypto currency markets
- To help the user to make smart buying decisions
- Provide a modern application with an easy navigation
- Fully responsive and accessible
<hr>


## User Experience

### Target Audience
- People starting off with buying and investing in crypto currencies
- Experienced traders who wish to trade crypto currencies

### User Requirements and Expectations

- Fully responsive
- Accessible
- A welcoming design
- Functional trading
- Contact information
- Accessibility

##### Back to [top](#table-of-contents)<hr>


## User Stories

### Users

1.	As a Site User I can be welcomed to the website with a landing page so that see what the website does and is about
2. As a Site User I can view the advantages of investing on this website so that know what this website offers
3. As a Site User I can view the popular crypto currency so that I know what are popular and the ones to buy
4. As a Site User I can search all the available crypto so that find the one I am looking for
5. As a Site User I can see the trending coins at the minute so that I know what coins to buy
6. As a Site User I can view the crypto markets and their data so that I know what coins to buy and their price
8. As a Site User I can view more info on the coin so that consider buying the coin
9. As a Site User I can click on a coin so that open a new page and view more about the coin
10. As a Site User I can view a list of top coins so that easily select a coin to view
11. As a Site User I can view more about each crypto so that make better decisions when buying crypto
12. As a Site User I can view the price action and history of a coin so that make better decisions when buying crypto
13. As a Site User I can log in to an account so that check my portfolio and buy and sell coins
14. As a Site User I can sign up for an account so that buy and sell coins
15. As a Site User I can view my recent transactions so that I know what I have bought
16. As a Site User I can manage my order so that I have more control over what I buy
17. As a Site User I can view the available trading pairs so that I know what coins I can buy
18. As a Site User I can see the order book so that make better decisions when buying a coin
19. As a Site User I can view the price of a coin on a trading view so that make better decisions when buying a coin
20. As a Site User I can create a market order to buy or sell so that buy or sell my asset at current market value
21. As a Site User I can create a limit order so that buy or sell an asset at the price I would like
22. As a Site User I can buy and sell my assets so that I can make or sell my investment
23. As a Site User I can view my portfolio balance so that I can view my profit and loss
24. As a Site User I can manage my assets so that I can control my account
25. As a Site User I can view my portfolio assets so that manage what assets to buy
26. As a Site User I can add coins to my portfolio so that buy other assets and coins





### Admin / Authorised User
7. As a Site Admin I can create, read, update and delete coins so that the site user can view, buy and trade the coin
27. As a Site Admin I can send users to a 404 error page so that send them back to the home page




### Projects, Epics & User Stories
- GitHub Projects was used to track all open user stories
- Epics were created using the milestones feature
- To Do, In Progress, Testing and Done headings were used in the Projects

<details><summary>Epics</summary>

![Epics]()
![Epic 1]()
![Epic 2]()
![Epic 3]()
![Epic 4]()
![Epic 5]()
![Epic 6]()
![Epic 7]()
![Epic 8]()
![Epic 9]()
![Epic 10]()
![Epic 11]()
</details>

<details><summary>User Stories</summary>

![User stories]()

</details>

<details><summary>Projects</summary>

![Projects Board]()

</details>


##### Back to [top](#table-of-contents)<hr>


## Design

### Colours

I chose light colors with a touch of dark to match the logo.
The logo is a light blue and dark blue campfire in the shape of a coin to represent the name.
Light blue and dark blue is the theme with light gray to make them stand out throughout the site

<details><summary>See colour pallet</summary>
<img src="">
</details>

### Fonts

 The fonts selected were from Google Fonts, Montserrat and Roboto wits sans-serif as a backup font.

### Structure

#### Website pages

The site was designed for the user to be familiar with the layout such as a navigation bar along the top of the pages and a hamburger menu button for smaller screen.

The footer contains a disclaimer and logo

- The site consists of the following pages:
  - Home page: To welcome the user and have call to actions to sign up
  - Sign up, sign in, sign out pages so the user can create a new account, login to their existing account and then log out of their account
  - Deposit page: User can enter a fake credit card and deposit euro into their account
  - Markets page: User can view the markets with up to date stats and data on each coin
  - Crypto details page: The user can click into a crypto currency to get advance stats and price action of each coin, it also has useful links to each coin
  - Trade page: User can view the trading pairs of each crypto so they can turn their euro deposited into crypto
  - Trading pair page: User can buy and sell crypto in these pages, see their orders, watch a candle stick chart, and view an order book
  - Contact page: The user can enter their name, email, issue and message to contact the site owner
  - Profile page: the user can view their profile and change their info and profile picture
  - Portfolio page: the user can view all of their assets and see how it is preforming in different time periods
  - 404 error page to display if a 404 error is raised

#### Database

- Built with Python and the Django framework with a database of a Postgres for the deployed Heroku version(production)

<details><summary>Show diagram</summary>
<img src="">
</details>


##### User Model
The User Model contains the following:
- user_id
- password
- last_login
- is_superuser
- username
- first_name
- last_name
- email
- is_staff
- is_active
- date_joined

##### CryptoCurrency Model
The CryptoCurrency Model contains the following:
- name
- rank
- symbol
- price
- change
- icon
- sparkline
- market_cap
- volume
- euro_trading_pair
- uuid

##### PopularCryptoCurrency Model
The PopularCryptoCurrency Model contains the following:
- rank
- name
- symbol
- price
- change
- icon
- sparkline
- market_cap
- volume

##### TopGainerCrypto Model
The TopGainerCrypto Model contains the following:
- rank
- name
- symbol
- price
- change
- icon
- sparkline
- market_cap
- volume


##### TopLoserCrypto Model
The TopLoserCrypto Model contains the following:
- rank
- name
- symbol
- price
- change
- icon
- sparkline
- market_cap
- volume

##### CryptoDetail Model
The CryptoDetail Model contains the following:
- uuid
- name
- symbol
- color
- icon
- website_url
- links
- price
- chart_1h
- chart_1d
- chart_1w
- chart_1m
- chart_1y
- chart_all
- market_cap
- fully_diluted_market_cap
- volume
- max_supply
- total_supply
- circulating_supply
- rank
- all_time_high
- ath_time_stamp
- change_1h
- change_24h
- change_7d
- ath_change
- about
- weekly_incline
- dayly_incline
- hourly_incline

##### Asset Model
The Asset Model contains the following:
- user
- name
- symbol
- iconUrl
- total_amount
- current_price
- current_change
- current_balance
- amount_history

##### Transaction Model
The Transaction Model contains the following:
- user
- time
- symbol
- type
- price
- amount
- total
- status
- transaction_uuid

##### ContactUs Model
The ContactUs Model contains the following:
- contact_id (PrimaryKey)
- name (ForeignKey)
- email (ForeignKey)
- phone (ForeignKey)
- body

##### Contact Model
The Contact Model contains the following:
- name
- email
- issue
- message
- time

##### MemberProfile Model
The MemberProfile Model contains the following:
- user
- first_name
- last_name
- profile_image
- profile_image_change


### Wireframes
The wireframes were created using Balsamiq
<details><summary></summary>
<img src="">
</details>


## Technologies Used

### Languages & Frameworks

- HTML
- CSS
- Javascript
- Python
- Django


### Libraries & Tools

- [Am I Responsive](http://ami.responsivedesign.is/)
- [Balsamiq](https://balsamiq.com/)
- [Cloudinary](https://cloudinary.com/)
- [Favicon.io](https://favicon.io)
- [Chrome dev tools](https://developers.google.com/web/tools/chrome-devtools/)
- [Font Awesome](https://fontawesome.com/)
- [Git](https://git-scm.com/)
- [GitHub](https://github.com/)
- [Google Fonts](https://fonts.google.com/)
- [Heroku Platform](https://id.heroku.com/login)
- [Postgres](https://www.postgresql.org/)
- [Summernote](https://summernote.org/)
- Validation:
  - [WC3 Validator](https://validator.w3.org/)
  - [Jigsaw W3 Validator](https://jigsaw.w3.org/css-validator/)
  - [JShint](https://jshint.com/)
  - [Lighthouse](https://developers.google.com/web/tools/lighthouse/)
  - [Wave Validator](https://wave.webaim.org/)

##### Back to [top](#table-of-contents)


## Features

## Features

### Header
- Featured on all pages
- The Logo when clicked brings the user back to the home page
- The navbar turns into a hamburger menu at smaller screens
- There is a profile button that allows users to sign in, once signed in the user can view the profile and portfolio

![Header]()

### Welcome Section
- Welcome's the user to the website
- Call to action to create an account
- User stories covered: 1

![Welcome Section]()

### Popular Section
- Display's popular crypto for the user
- User can see info and current market stats for crypto
- User has button to trade crypto
- User has button to view all markets
- User stories covered: 3

![Popular]()

### Advantages Section
- Display's info about coinhub and the advantages of choosing coinhub
- User can see why to choose coinhub
- User stories covered: 2

![Advantages]()

### Search Markets
- Display's market stats if market is up or down
- User can search for a crypto by filtering by name and symbol
- User can cancel search and clear
- User can click into searched results and view crypto detail
- User stories covered: 4

![Search Markets]()

### Trending Markets
- Display's top 3 popular crypto, top 3 gainers by market change in last 24hr, and top 3 losers by market change in last 24hr
- Displays name, price and change
- User can click into results and view crypto detail
- User stories covered: 5

![Trending Markets]()

### All Markets
- Display's crypto markets in table format
- Displays name, price and change, 24hr sparkline chart, market cap, volume
- User can click into results and view crypto detail
- User can click buy button to bring them to the trading pair against euro
- User stories covered: 6, 7, 8, 10

![All Markets]()

### Detail Heading
- Displays name of crypto
- Search feature that allows user to switch to different detail
- User stories covered: 4

![Detail Heading]()

### Detail Sidenav
- Displays navigation to parts of crypto detail
- User can return to all assets
- User stories covered: 9, 11

![Detail Sidenav]()

### Detail Price
- Displays price and price change of crypto as numbers and as a graph
- User can select which time period they want to choose, 1 hour, 1 day up to all time
- The user can hover over price chart and see the price, where the time is displayed
- The price and price change is updated to display at that current time with a crosshair to mark where the user is
- User can return to all assets
- User stories covered: 12

![Detail Price]()

### Detail Buy
- Displays call to action to trade the crypto
- Brings user to trading pair with current crypto
- Doesn't bring if user is not authenticated

![Detail Buy]()

### Detail Stats
- Displays market stats of crypto
- More indepth so user can make better decisions
- User stories covered: 6, 8, 11

![Detail Stats]()

### Detail About
- Displays info about crypto
- Gives basic explanation, creates stats in a more readable way
- Displays resources so user can learn more about each crypto
- User stories covered: 6, 8, 11

![Detail About]()

### Deposit
- User can deposit euro into their account
- They enter details then the amount the enter
- They have to enter a positve and limited to 1000000 euro each deposit

![Deposit]()

### Trading Search
- User can search for trading pairs
- The list of trading pairs gets filter based on the name and sybmol of coins

![Trading Search]()

### Trading List
- User can view trading pair list
- The list of trading pair is clickable where it takes you to the trade page
- Basic stats are displayed
- User stories covered: 17

![Trading List]()

### Trade Heading
- User can view more stats about current crypto being traded
- The user can switch to different trading pair with dropdown button

![Trade Heading]()

### Trade Candlestick
- User can view the price action of the coin in a candle stick chart
- The candle stick chart shows recent price action of a coin
- It is set to 1 minute, so each candle is 1 minute of time, if it is green that means in that minute the price raised
- If it is red the price decreased, the wick or line of a candle stick shows the highest and lowest prices in that minute
- A candle stick is always being created currently
- The user can hover and a crosshair shows the price and time of the user's cursor
- The candle stick is hovered over it shows the open, high, low and close of the price in that minute and the time
- User stories covered: 19

![Trade Candlestick]()

### Trade Buy Sell
- User can buy and sell crypto from this card
- The user can select buy or sell at top
- They then can select a limit or market order
- Limit orders allow the user to set the price they want to buy or sell the crypto at
- Market orders allow the user to buy at the current price
- If the user creates a limit order the transaction is pending and only when the requirement is hit does the transaciton go through
- A market order is fulfilled straight away
- There is inputs where the user can input the price, amount, and total
- There is also a slider where the user can drag to buy a percent of euro available or asset available depending on buy or sell order
- There is validation to stop the user from buying more than they have and also from entering negative values
- User stories covered: 16, 20, 21, 22, 26

![Trade Buy Sell]()

### Trade Order Book
- User can view an order book of simulated trades
- On the left are people creating sell orders, on the right people creating buy orders
- In the middle is the current traded price
- User stories covered: 18

![Trade Order Book]()

### Contact
- User can contact the site owner
- User can enter name, email and message and select the issues they are facing

![Contact]()

### Profile
- User can view their profile
- User can select edit profile or hover over and click profile picture to edit profile and picture

![Profile]()

### Edit Profile
- User can edit their profile by inputing into fields
- User can cancel or save by clicking buttons

![Edit Profile]()

### Edit Profile Picture
- User can edit their profile picture by uploading a picture
- User can then crop their picture to fit into square aspect ratio
- User can then view the updated picture
- User can then save or cancel the picture

![Edit Profile Picture]()

### Portfolio Price
- User can view their portfolio price
- Displays price and price change
- User can select time period to see different changes in portfolio of assets
- Price action graph is displayed to show changes over time period
- User can hover to see price and price change at different times
- User stories covered: 23

![Portfolio Price]()

### Portfolio Assets
- User can view their assets in their portfolio
- They can view the balance of each asset
- User stories covered: 25

![Portfolio Assets]()

### Logout
- User can click log out in their account
- Logout is displayed under the nav menu of profile picture

![Logout]()

### Login
- User can click log in
- Login is displayed under the nav menu of profile picture
- Displayed with form to fill out and login
- User can click remember me to remember their account
- User stories covered: 13

![Login]()

### Register
- User can click register
- Register is displayed under the nav menu of profile picture
- Displayed with form to fill out and create account
- User stories covered: 14

![Register]()


##### Back to [top](#table-of-contents)<hr>


## Validation
The W3C Markup Validation Service

### CSS Validation
The W3C Jigsaw CSS Validation Service


### JavaScript Validation

### PEP8 Validation

### Lighthouse

Performance, best practices and SEO was tested using Lighthouse.


### Wave
WAVE was used to test the websites accessibility.

##### Back to [top](#table-of-contents)<hr>


## Testing

1. Manual testing
2. Automated testing

### Manual testing

### Automated testing

- Testing was done using the built in Django module, unittest.
- Coverage was also usesd to generate a report



##### Back to [top](#table-of-contents)<hr>


## Bugs


##### Back to [top](#table-of-contents)<hr>


### Heroku Deployment

[Official Page](https://devcenter.heroku.com/articles/git) (Ctrl + click)

This application has been deployed from Github using Heroku. Here's how:

1. Create an account at heroku.com
<details>
<img src="">
</details>

2. Create an app, give it a name for such as ci-pp4-the-diplomat, and select a region
<details>
<img src="">
<img src="">
</details>

3. Under resources search for postgres, and add a Postgres database to the app
<details>
<img src="">
</details>

Heroku Postgres

1. Note the DATABASE_URL, this can be set as an environment variable in Heroku and your local deployment(env.py)
<details>
<img src="">
<img src="">
</details>

2. Install the plugins dj-database-url and psycopg2-binary.

3. Run pip3 freeze > requirements.txt so both are added to the requirements.txt file
<details>
<img src="">
</details>

4. Create a Procfile with the text: web: gunicorn the_diplomat.wsgi
<details>
<img src="">
</details>

5. In the settings.py ensure the connection is to the Heroku postgres database, no indentation if you are not using a seperate test database.
I store mine in env.py
<details>
<img src="">
<img src="">
</details>

6. Ensure debug is set to false in the settings.py file
<details>
<img src="">
</details>

7. Add localhost, and ci-pp4-the-diplomat.herokuapp.com to the ALLOWED_HOSTS variable in settings.py

8. Run "python3 manage.py showmigrations" to check the status of the migrations

9. Run "python3 manage.py migrate" to migrate the database

10. Run "python3 manage.py createsuperuser" to create a super/admin user

11. Run "python3 manage.py loaddata categories.json" on the categories file in products/fixtures to create the categories

12. Run "python3 manage.py loaddata products.json" on the products file in products/fixtures to create the products

13. Install gunicorn and add it to the requirements.txt file using the command pip3 freeze > requirements.txt

14. Disable collectstatic in Heroku before any code is pushed using the command heroku config:set DISABLE_COLLECTSTATIC=1 -a ci-pp4-the-diplomat
<details>
<img src="">
<img src="">
</details>


15. Ensure the following environment variables are set in Heroku
<details>
<img src="">
</details>

16. Connect the app to GitHub, and enable automatic deploys from main if you wish
<details>
<img src="">
<img src="">
</details>

17. Click deploy to deploy your application to Heroku for the first time

18. Click on the link provided to access the application

19. If you encounter any issues accessing the build logs is a good way to troubleshoot the issue
<hr>

### Fork Repository
To fork the repository by following these steps:
1. Go to the GitHub repository
2. Click on Fork button in upper right hand corner
<hr>

### Clone Repository
You can clone the repository by following these steps:
1. Go to the GitHub repository 
2. Locate the Code button above the list of files and click it 
3. Select if you prefere to clone using HTTPS, SSH, or Github CLI and click the copy button to copy the URL to your clipboard
4. Open Git Bash
5. Change the current working directory to the one where you want the cloned directory
6. Type git clone and paste the URL from the clipboard ($ git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY)
7.Press Enter to create your local clone.

##### Back to [top](#table-of-contents)<hr>


## Credits

### Images

Images used were sourced from Pexels.com and an AI image generator Midjourney

##### Back to [top](#table-of-contents)<hr>

## Acknowledgements

### Special thanks to the following:
- Code Institute
- My Mentor Mo Shami