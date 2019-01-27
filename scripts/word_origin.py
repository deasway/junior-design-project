import json
import argparse
import urllib.request
import re
import csv
import requests

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


#API KEYS. REMOVE BEFORE PUSHING TO GITHUB-----------------
mw_key = "a"
oxford_app_id = "b"
oxford_key = "c"
#----------------------------------------------------------------------------



search_both("aerocar")
print("\n\n")
search_both("space cadet")
print("\n\n")
search_both("vibroknife")





