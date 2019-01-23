
# coding: utf-8

# In[183]:


import requests
from requests_html import HTMLSession
import re
import csv


# In[184]:


def findYear(text):
    yearPattern = re.compile("[1,2][0-9][0-9][0-9]")
    year = yearPattern.search(text)
    if year:
        return year.group()
    return None


# In[185]:


def scraper():
    #These are the url fragments of the Brave New Words database
    #Currently it is accessing the free, restricted version bc GT
    #library access is broke. So we're losing out on a bunch of entries.
    #TODO: implement GT library login for full dataset - This problem
    #      is bc of the Shibboleth authentication system
    url_A = "http://www.oxfordreference.com/browse?btog=chap&page="
    url_B = "&pageSize=100&sort=titlesort&source=%2F10.1093%2Facref%2F9780195305678.001.0001%2Facref-9780195305678"
    base_selector = "#abstract_link"
    entry_dict = {}
    for i in range(1, 10):
        page_num = i
        url = url_A + str(page_num) + url_B
        base_page = HTMLSession().get(url)
        for j in range(1, 101):
            try:
                entry_num = j + 100*(i - 1)
                selector = base_selector + str(entry_num)
                entry = base_page.html.find(selector)[0]
                entry_name = entry.text
                entry_id = entry.attrs['href']
                entry_id = re.sub("\?.*", "", entry_id)
                entry_id = re.sub("abstract", "abstract_full_", entry_id)
                entry_id = entry_id[1:]
                entry_xpath_A = "//*[@id=\""
                entry_xpath_B = "\"]/abstract/p"
                entry_xpath = entry_xpath_A + entry_id + entry_xpath_B
                entry_desc = base_page.html.xpath(entry_xpath)[0].text
                entry_year = findYear(entry_desc)
                if entry_year:
                    entry_dict[entry_name] = str(entry_year)
                print("Entry #" + str(entry_num) + ": " + entry_name)
                print("\t id= " + entry_id)
                print("\t desc= " + entry_desc)
                print("\t year= " + str(entry_year))
            except Exception as e:
                print(e)
                print("Exited inner loop at Entry #" + str(entry_num) + ", Page #" + str(page_num))
                print("Beginning Page #" + str(page_num + 1))
                break
    return entry_dict


# In[186]:


data_dict = scraper()

#len(data_dict)

with open('braveNewWords.csv', 'w', encoding="utf-8") as f:
    writer = csv.writer(f)
    for row in data_dict.items():
        writer.writerow(row)

