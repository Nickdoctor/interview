## Corpay Interview: Timesheet App
This react based app was created in part of an interview assignment from 4/9/25-4/13/25. 


# Description
This app is to simulate a Timesheet service that employees are able to sign up/sign into, log hours, rates, dates, and pay for work. These time sheets can then be saved and loaded for reference at a different time period. 

# Requirements
-Create a web-based timesheet application.
-Users should be able to enter a date and number of minutes (here on referred to as a "line item")
-A timesheet can have one or many "line items"
-A timesheet will have a "Description" field for free-form text
-There should be a "total time" calculated for each timesheet by adding all the minutes of "line items".
-Users should be able to enter a "rate".
-There should be a "total cost" calculated by multiplying "total time" by "rate"
-Users should be able to save a timesheet and view it later

# Evaluation Criteria
-Your code will be evaluated using the following criterias
-Using the best practices and convention of your chosen language/software stack
-Leveraging popular tools and libraries of your chosen language/software stack
-Good coding style: formatting, proper naming of variables and functions, etc...
-Logical database design
-Properly implementing the requirements
-The program runs...

# Bonus Points
-Including Automated Tests
-Using an HTML/CSS framework
-Implementing authentication
-Includes installation instructions
-Using source control and leaving good git commit messages
-Deploying the app to a platform like Heroku, AWS, Azure so we can see it in action

# Installation Instructions
git clone https://github.com/Nickdoctor/interview.git
cd interview
npm install

# Contributing
This project was done in part of an interview process for Corpay, all work was done by
Nicolas Gugliemo

# Contact
ngugliemo@csus.edu
https://github.com/Nickdoctor
Please email if you have any questions about this project or what I learned!

# Testing
Testing was attempted to be done with JEST, however an issue with "Cannot find module 'react-router-dom'"
Researching the issue returns various fixes, however it seemed non would have jest find this module. The
module was reinstalled, cache was cleared, manual pointing to the file under package.json... nothing. Hopefully I can figure this out in figure commits. 

# Deployment
This project was deployed on Vercel : https://interview-beryl.vercel.app/

# Technologies Used
-React.js
-Bootstrap 
-JEST
-Vercel
-Supabase
-Node.js