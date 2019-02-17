import json

web_file = 'data.json'
origin_file = 'word_origin.json'

with open(web_file) as f:
    web_data = json.load(f)

with open(origin_file) as f:
    origin_data = json.load(f)

x = 0
output_string = "["
for lines in web_data:
    if x != 0:
        output_string += ","
    output_string += ('{"name":"%s", "first_date":"%s", "num_total":"%s", "occurences":"%s", "fields":"%s", "merriam":"%s", "oxford":"%s"}' % (web_data[x][0], web_data[x][1], web_data[x][2], web_data[x][3], web_data[x][4], origin_data[x]["Merriam Webster"], origin_data[x]["Oxford Dictionary"])).replace('"X"', '"None"')
    x += 1

output_string += "]"

text_file = open("output.json", "w")
text_file.write(output_string)
text_file.close()

print("output successfully saved to output.json")
