Python 3.
Dependencies:
Selenium, Requests

(both are pip installable, however, Selenium requires a Chrome driver. download here:
http://chromedriver.chromium.org/downloads
And make sure it is in your python PATH. It is just a single .exe)

run like any old .py

BraveNewWords makes a csv with the scifi words and their date of entering the lexicon.

WOScraper doesn't output to a csv (yet) but can harvest lots of good data. See the
searchTerm and scraperMain functions for details.

For the WOScraper: You will need to input GT credentials in the code. Couldn't figure
out a way around that last night that I liked.

Also, 2FA is not automated yet - you'll have to authorize
it manually (it times out within 40 seconds or so if you don't do it).

You should see the data being scraped in real time and in the terminal. I'll be making
the scraping headless (no actual browser window) as soon as I get the 2FA stuff working.

You might also see a shitload of "NOT IMPLEMENTED" error messages in the terminal. Don't
worry about those if you do see them, they're just artifacts from the IDE I used. I'll
get rid of em later.