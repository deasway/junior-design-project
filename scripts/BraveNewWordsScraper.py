#!/usr/bin/env python
# coding: utf-8

# In[85]:


import requests
from requests_html import HTMLSession
import re
import csv

def findYear(text):
    yearPattern = re.compile("[1,2][0-9][0-9][0-9]")
    year = yearPattern.search(text)
    if year:
        return year.group()
    return None

def scraper():
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
                entry_href = entry.attrs["href"]
                entry_url = "http://www.oxfordreference.com" + entry_href
                entry_page = HTMLSession().get(entry_url)
                sel = ".prosequoteType > p:nth-child(1)"
                try:
                    first_year = entry_page.html.find(sel)[0].text
                except Exception as e:
                    print(e)
                    print("On Entry #" + str(entry_num))
                    first_year = ""
                first_year = findYear(first_year)
                if first_year:
                    entry_dict[entry_name] = str(first_year)
                print("Entry #" + str(entry_num) + ": " + entry_name)
                print("\t year= " + str(first_year))
            except Exception as e:
                print(e)
                print("Exited inner loop at Entry #" + str(entry_num) + ", Page #" + str(page_num))
                print("Beginning Page #" + str(page_num + 1))
                break
    return entry_dict

data_dict = scraper()

with open('braveNewWords.csv', 'w', encoding="utf-8") as f:
    writer = csv.writer(f)
    for row in data_dict.items():
        writer.writerow(row)

