
# coding: utf-8

# In[76]:


import re
import csv
import selenium
from selenium import webdriver
from selenium.webdriver import ActionChains
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import json
from bs4 import BeautifulSoup



# In[78]:
def main():

    words = getWordsFromJson()

    no_results_dict = {}
    no_results = []
    #advanced search page
    for term in words:
        browser = goToNewSearch()
        term_json = getDataFor(term, browser)
        with open('terms/{}.json'.format(term), 'w') as f:
            if term_json:
                json.dump(term_json, f)
            else:
                json.dump(no_results_dict, f)
                no_results.append(term)
        print("Search completed for", term)
        time.sleep(30)
    print(no_results)



#assumes the browser is at the advanced page default
def getDataFor(term, browser):
    # clear search text
    browser.find_element_by_id('value(input1)').clear()
    # input basic search query
    browser.find_element_by_id('value(input1)').send_keys("TS=({})".format(term))
    # hit search
    browser.find_element_by_id('search-button').click()
    time.sleep(4)

    try:
        # get total hits of a term
        total_occ = browser.find_element_by_id('hitCount').get_attribute("innerText").replace(',', '')
    except selenium.common.exceptions.NoSuchElementException:  # this will happen when the search returns no results
        browser.quit()
        return None

    # if the term has hits
    if not (total_occ == '0'):
        # go to results
        browser.find_element_by_id('hitCount').click()
        time.sleep(3)

        try:
            # go to years and scrape
            dates_element = browser.find_elements_by_class_name('link-style1')[0]  # this whole if else section is kind of magic ghetto stuff. It's hard to explain but it works
            if dates_element.get_attribute('id') == "PublicationYear":
                browser.find_elements_by_class_name('link-style1')[0].click()
                years_data = getYearsData(browser)
                time.sleep(3)

                # go to cat and scrape
                cats_element = browser.find_elements_by_class_name('link-style1')[0]
                if cats_element.get_attribute('id') == "JCRCategories":
                    browser.find_elements_by_class_name('link-style1')[0].click()
                    time.sleep(3)
                    categories_data = getTotalCategoriesData(browser)
                else:
                    categories_data = carefulExtractCats(browser)
            else:
                years_data = carefulExtractDates(browser)

                cats_element = browser.find_elements_by_class_name('link-style1')[0]
                if cats_element.get_attribute('id') == "JCRCategories":
                    browser.find_elements_by_class_name('link-style1')[0].click()
                    time.sleep(3)
                    categories_data = getTotalCategoriesData(browser)
                else:
                    categories_data = carefulExtractCats(browser)
        except: # this happens when neither list is large enough to warrant a 'more options' link
            years_data = carefulExtractDates(browser)
            categories_data = carefulExtractCats(browser)
    else:
        browser.quit()
        return None

    yearsToSearch = list(years_data.keys())

    browser.quit()
    granular_cat_data = getGranularData(term, yearsToSearch)

    entry = dict()
    entry['total_occurrences'] = total_occ
    entry['occurrences_by_year'] = years_data
    entry['total_categories'] = categories_data
    entry['sorting_name'] = term
    entry['categories_by_year'] = granular_cat_data

    return entry

# extracts cats straight from the sidebar list
def carefulExtractCats(browser):
    catData = {}
    labels = browser.find_elements_by_tag_name('label')
    for l in labels:
        if l.get_attribute('for') and "JCRCategories_" in l.get_attribute('for'):
            data = l.get_attribute('innerText').replace(',', '').replace(')', '').split('(')
            cat, num_occurrences = data[0], data[1]
            catData[cat] = num_occurrences
    return catData

# extracts dates straight from the sidebar list
def carefulExtractDates(browser):
    yearsData = {}
    labels = browser.find_elements_by_tag_name('label')
    for l in labels:
        if l.get_attribute('for') and "PublicationYear_" in l.get_attribute('for'):
            data = l.get_attribute('innerText').replace('(', '').replace(')', '').replace(',', '').split(' ')
            date, num_occurrences = data[0], data[1]
            yearsData[date] = num_occurrences
    return yearsData

# the subroutine needed to get cat data per year. it takes advantage of WoS advanced searching capabilities
def getGranularData(term, yearsToSearch):
    browser = goToNewSearch()
    searchURL = browser.current_url
    granular = {}
    for year in yearsToSearch:
        browser.find_element_by_id('value(input1)').clear()
        browser.find_element_by_id('value(input1)').send_keys("TS=({}) AND PY=({})".format(term, year))
        browser.find_element_by_id('search-button').click()
        time.sleep(4)

        total_occ = browser.find_element_by_id('hitCount').get_attribute("innerText").replace(',', '')
        if not (total_occ == '0'):
            # go to results
            browser.find_element_by_id('hitCount').click()
            time.sleep(3)
        categories_data = None
        try:
            cats_element = browser.find_elements_by_class_name('link-style1')[0]
            if cats_element.get_attribute('id') == "JCRCategories":
                browser.find_elements_by_class_name('link-style1')[0].click()
                time.sleep(3)
                categories_data = getTotalCategoriesData(browser)
            else:
                categories_data = carefulExtractCats(browser)
        except:
            categories_data = carefulExtractCats(browser)

        granular[year] = categories_data
        browser.get(searchURL)
        time.sleep(2)
    browser.quit()

    return granular



#gets the distribution of categories of a term
def getTotalCategoriesData(browser):
    catData = {}
    labels = browser.find_elements_by_tag_name('label')
    for l in labels:
        if l.get_attribute('for') and "TASCA_" in l.get_attribute('for'):
            data = l.get_attribute('innerText').replace(',', '').replace(')', '').split('(')
            cat, num_occurrences = data[0], data[1]
            catData[cat] = num_occurrences
    return catData


#gets the occurences for every year
def getYearsData(browser):
    yearsData = {}
    labels = browser.find_elements_by_tag_name('label')
    for l in labels:
        if l.get_attribute('for') and "IY_" in l.get_attribute('for'):
            data = l.get_attribute('innerText').replace('(', '').replace(')', '').replace(',', '').split(' ')
            date, num_occurrences = data[0], data[1]
            yearsData[date] = num_occurrences
    return yearsData


#starts a new session and goes to advanced search
def goToNewSearch():
    driverPath = "PATH TO DRIVER"
    options = webdriver.ChromeOptions()
    options.add_argument("--incognito")
    # browser = webdriver.Chrome("/Users/alan/Documents/School/scraping/chromedriver")
    browser = webdriver.Chrome(driverPath, chrome_options=options)
    # browser.get("https://apps.webofknowledge.com/WOS_AdvancedSearch_input.do?SID=6BkXJNkmbpAHOaGXYHh&product=WOS&search_mode=AdvancedSearch")
    browser.get("https://apps.webofknowledge.com")
    time.sleep(1)
    browser.find_element_by_css_selector("[title*='Use Advanced Search to Narrow Your Search to Specific Criteria']").click()
    return browser


def getWordsFromJson():
    with open('data.json', 'r') as f:
        data = json.load(f)
        words = []
        for entry in data:
            words.append(entry['sorting_name'])
    return words




main()

