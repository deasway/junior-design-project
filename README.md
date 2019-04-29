# Space Dinosaur Project

It is a widely accepted fact that the worlds of science fiction and scientific research are related in some way. However, this relationship has proven difficult to quantify.

This project will seek to use web scraping to parse various science databases for references to science fiction works, concepts, and authors that have influenced modern technologies. This archive will then be used to produce statistical models that demonstrate how the world of speculative science fiction and modern scientific thought are hardwired at the most basic levels.

## Release Notes

### April 19, 2019
### New Software Features
* Firebase Database structure updates--now users only get data they need from the database instead of a dump
* Top K Value Dropdown updates in real time 
* Users can now add a specific subfield to the graph in both the amplitude and pie graphs
* Added a Pie Chart Alert when there is no 'by-year' info
* UI Beautification
### Bug Fixes
* Fixed issues in the Pie Chart Title
* Fixed issues with the Pie Chart Update
### Known bugs and defects
* Out of the 700 or so terms, a select handful of them may have errors in their data. This only happens with terms with only a few occurrences throughout all of history. These faulty terms are being removed as they are found.
* The database we are using to fetch the application data caps at 10 GB of downloads per month, after which the app will no longer work properly.
* Sometimes the table of contents does not load. Refreshing the page once or twice solves this problem.

### April 14, 2019
### New Software Features
* Populated a new Firebase Database
* Firebase Database Structure was rebuilt
* Code was updated in accordance with the Database Structure Changes
### Known bugs and defects
* Pie chart title not showing properly
* Pie chart update does not work when changing dates sometimes

### April 8, 2019
### New Software Features
* Finished scraping all data 
* Pie chart update with new subfield data
* Amplitude graph update with new subfield data
* Search dropdown update (End year select option automatically changes depending on start year selection)
### Bug Fixes
* Fixed issues in the Pie Chart Visualization
* Fixed Search bar issue (now apostrophe can be searched)
* The database we are using has exceeded its limit

### March 31, 2019
### New Software Features
* Scripts update to include Year and Date information
* Applying Year, Date information on the Amplitude Graph
* Front End - Search Bar Design update 
### Known bugs and defects
* Currently the Search Bar becomes unresponsive when searching with special characters
* Pie chart sometimes shows incorrect data

### March 25, 2019
### New Software Features
* Added Table of Contents 

### March 11, 2019
### New Software Features
* Implementation of fundamental Landing Page / Search Page
* Implementation of fundamental Pie Chart / Amplitude Graph

### March 4, 2019
### Bug Fixes
* Back End Debugging - Now the data fit in the Database structure

### February 17, 2019
### New Software Features
* Database set up
* Database population
### Known bugs and defects
* Not all data fit in the Database structure

### February 4, 2019
### New Software Features
* Scraper has collected most of the data needed for development

### January 28, 2019
### New Software Features
* Pulled the word data from "Brave New Words" 
* Aggregated data about a term from articles in "Web of Science"
* Created a script to get word origin information from the Merriam Webster English Dictionary API

## Installation Guide
* Pre-requisites: Internet Access and a Web Browser
* Dependent libraries that must be installed: None
* Download instructions: None
* Installation of actual application: None
* Run Instructions: This project is live at https://deasway.github.io/junior-design-project/public.
* TroubleShooting: If you encounter any problems using our web application, we recommend you to refresh the page and search again the term you are interested in. 
