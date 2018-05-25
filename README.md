# Oracle DB Front End

## Introduction

As part of a project at the University of Minnesota Duluth, I was tasked with creating a web database application, so that a user could interact with a website and enter parameters to use a database instead of executing SQL queries. The project asked for a JSP/Servlet/JDBC implementation, but after confirming it was alright I decided to utilize purely Javascript web frameworks.

This Project was created with:
- AngularJS
- Angular Material
- Node.js
- Express.js
- node-oracledb

The basic "flow" of the site is somewhat simple. A user selects a pre-defined query to make and fills out the required forms and submits the request. A node server will listen for requests and process whatever request that was and return the result back to the client to display.

Important Note: Username and passwords are sent unsecurely with the requests right now. You should not model requests in a production enviroment like this.

## Installation

Clone the repository and ensure you have node.js and node-oracledb installed on your computer. Change directories to the bin folder and execute node on the www file. The default port is 3000. For testing on your local machine, you can visit localhost:3000.

The database connect url is defined in `routes/index.js`. You need to change this to whatever you connection url is for your oracle database.

## Usage

I have defined two database requests already. Trying to execute those queries on any database without modifications would of course most likely not work as they must be modified for your own database and whatever queries you want to run. You should essentially write your queries and ensure they are working, then create the necessary functions to 1) gather any required data from the user in the front end 2) execute a request 3) handle the request in the back end 4) send back a response 5) handling the response in the front end
