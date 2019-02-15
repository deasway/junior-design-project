import json
import argparse
import urllib.request
import re
import csv
import requests
import time

def search_both(term):
    search_mw_term(term)
    search_ox_term(term)
# Searches for a term in Merriam-Webster and prints the date, if one exists
def search_mw_term(term):
    query = term.strip().replace(" ", "_").lower()
    url = "https://dictionaryapi.com/api/v3/references/collegiate/json/"+query+"?key="+mw_key
    response = urllib.request.urlopen(url)
    data = json.load(response)
    try:
        print("Merriam-Webster: First known use: " + data[0]['date'])
    except:
                print("Merriam-Webster: First known use: No known date")

# Searches for a term in Oxford English Dictionary and prints the etymology, if
# one exists
def search_ox_term(term):
    query = term.strip().replace(" ", "_").replace("-", "_").lower()
    url = url = 'https://od-api.oxforddictionaries.com:443/api/v1/entries/en/' + query
    r = requests.get(url, headers = {'app_id': oxford_app_id, 'app_key': oxford_key})
    try:
        # print("code {}\n".format(r.status_code))
        # print("text \n" + r.text)
        print("Oxford: " + r.json()["results"][0]["lexicalEntries"][0]["entries"][0]["etymologies"][0])
        # print("json \n" + json.dumps(r.json()))
    except:
        print("Oxford: No etymology found for " + term)


# Attempts to get the origin information about a term from both MW and Oxford,
# taking the word bank from the entries of BNW. WARNING: Do not run for high values
# of k or Oxford's API service will throttle you. Recommended to run words in batches
# and stagger requests.
def search_k_terms(k):
    with open("word_bank.csv", "r") as f:
        reader = csv.reader(f)
        flag = 0
        for row in reader:
            if flag > k:
                break
            print("Word data for " + row[0] + "---------------------------")
            query = row[0].strip().replace(" ", "+").lower()
            url = "https://dictionaryapi.com/api/v3/references/collegiate/json/"+query+"?key="+mw_key
            response = urllib.request.urlopen(url)
            data = json.load(response)
            try:
                print("First known use: " + data[0]['date'])
            except:
                print("First known use: No known date")

            query = row[0].strip().replace(" ", "_").replace("-", "_").lower()
            url = url = 'https://od-api.oxforddictionaries.com:443/api/v1/entries/en/' + query
            r = requests.get(url, headers = {'app_id': oxford_app_id, 'app_key': oxford_key})
            try:
                # print("code {}\n".format(r.status_code))
                # print("text \n" + r.text)
                print(r.json()["results"][0]["lexicalEntries"][0]["entries"][0]["etymologies"][0])
                # print("json \n" + json.dumps(r.json()))
            except:
                print("No etymology found for " + row[0])

            print("\n\n")

            flag+= 1

def search_all_terms():
    with open("braveNewWords.csv", "r") as f, open("word_origin.csv", "w") as d:
        reader = csv.reader(f)
        writer = csv.writer(d)
        for row in reader:
            print("Word data for " + row[0] + "---------------------------")
            query = row[0].strip().replace(" ", "+").lower()
            url = "https://dictionaryapi.com/api/v3/references/collegiate/json/"+query+"?key="+mw_key
            response = urllib.request.urlopen(url)
            data = json.load(response)
            mw = ""
            try:
                mw = data[0]['date']
            except:
                mw = "X"

            query = row[0].strip().replace(" ", "_").replace("-", "_").lower()
            url = url = 'https://od-api.oxforddictionaries.com:443/api/v1/entries/en/' + query
            r = requests.get(url, headers = {'app_id': oxford_app_id, 'app_key': oxford_key})
            ox = ""
            try:
                # print("code {}\n".format(r.status_code))
                # print("text \n" + r.text)
                ox =r.json()["results"][0]["lexicalEntries"][0]["entries"][0]["etymologies"][0]
                # print("json \n" + json.dumps(r.json()))
            except:
                ox = "X"

            print("\n\n")
            writer.writerow([row[0], mw, ox])
            time.sleep(5)




#API KEYS. REMOVE BEFORE PUSHING TO GITHUB-----------------
mw_key = "a"
oxford_app_id = "a"
oxford_key = "a"
#----------------------------------------------------------------------------

search_all_terms()





