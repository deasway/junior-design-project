# Space Dinosaur Project

It is a widely accepted fact that the worlds of science fiction and scientific research are related in some way. However, this relationship has proven difficult to quantify.

This project will seek to use web scraping to parse various science databases for references to science fiction works, concepts, and authors that have influenced modern technologies. This archive will then be used to produce statistical models that demonstrate how the world of speculative science fiction and modern scientific thought are hardwired at the most basic levels.
## Installation Guide
* Pre-requisites: Internet Access and a modern Web Browser (preferrably Chrome)
* Dependent libraries that must be installed: None
* Download instructions: None
* Installation of actual application: None
* Run Instructions: This project is live at https://deasway.github.io/junior-design-project/public.
* TroubleShooting: Sometimes it may take a while for a page to load. If you find yourself waiting at a blank screen for longer than 30 seconds, refresh the page and often the problem resolves itself.
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
* Fixed issues with the Pie Chart date Update
### Known bugs and defects
* Out of the 700 or so terms, a select handful of them may have errors in their data. This only happens with terms with only a few occurrences throughout all of history. These faulty terms are being removed as they are found.
* The database we are using to fetch the application data caps at 10 GB of downloads per month, after which the app will no longer work properly (the limit is very hard to reach now).
* Sometimes the table of contents does not load. Refreshing the page once or twice solves this problem.
* Not included in the final application that was promised on the client charter: view the date a word entered the English language. Often times neither Merriam-Webster nor Oxford Dictionary had a date of origin for a certain term (especially phrases or proper nouns), and sometimes the dates between the two sources were inconsistent. 
---
### April 14, 2019
### New Software Features
* Populated a new Firebase Database
* Firebase Database Structure was rebuilt
* Code was updated in accordance with the database Structure Changes
### Bug Fixes
* Migrated data to a new database
* New database is designed more efficiently in order to minimize data usage
* Rerouted the table of contents to remove the 404 error
### Known bugs and defects
* Pie chart title not showing properly
* Pie chart update does not work when changing dates sometimes
---
### April 8, 2019
### New Software Features
* Finished scraping all data 
* Pie chart updated with new subfield data
* Amplitude graph updated with new subfield data
* Search dropdown update (End year select option automatically changes depending on start year selection)
### Bug Fixes
* Fixed issues in the Pie Chart Visualization
* Fixed Search bar issue (now apostrophe can be searched)
### Known bugs and defects
* The database we are using has exceeded its usage limit
* Clicking on a term in the table of contents when NOT hosting on a local server will cause a 404 error
---
### March 31, 2019
### New Software Features
* Scraping scripts updated to include Year and Date information
* Applied Year, Date information to the Amplitude Graph
* Front End - Search Bar Design update 
### Known bugs and defects
* Currently the Search Bar becomes unresponsive when searching with special characters
* Pie chart sometimes shows incorrect data
* Clicking on a term in the table of contents when NOT hosting on a local server will cause a 404 error
---
### March 25, 2019
### New Software Features
* Added Table of Contents 
### Known bugs and defects
* Clicking on a term in the table of contents when NOT hosting on a local server will cause a 404 error
---
### March 11, 2019
### New Software Features
* Implementation of fundamental Landing Page / Search Page
* Implementation of fundamental Pie Chart / Amplitude Graph
---
### March 4, 2019
### Bug Fixes
* Database structural updates - now all the information fits into the firebase database
---
### February 17, 2019
### New Software Features
* New firebase initialization
* Database population
### Known bugs and defects
* Not all data fit within the proposed database structure
---
### February 4, 2019
### New Software Features
* Scraper has collected most of the data needed for development
---
### January 28, 2019
### New Software Features
* Pulled the word data from Brave New Words
* Aggregated data about a term from articles in Web of Science
* Created a script to get word origin information from the Merriam Webster English Dictionary and Oxford Dictionary APIs.
---

