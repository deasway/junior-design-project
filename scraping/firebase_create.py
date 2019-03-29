import json

with open('data.json', 'r') as f:
    data = json.load(f)


new_json = []
for i in range(len(data)):
    entry = data[i]
    new_entry = {}

    try:
        with open('terms/{}.json'.format(entry['name']).lower(), 'r') as f:
            new_data = json.load(f)
            if new_data != {}:
                total_occ = new_data['total_occurrences']
                total_cat = new_data['total_categories']
                sorting_name = new_data['sorting_name']
                occ_yearly = new_data['occurrences_by_year']
                cat_yearly = new_data['categories_by_year']

                if entry['num_total'] != total_occ:
                    print("Data inconsistent. old total: {}, new total: {}".format(entry['num_total'], total_occ))

                new_entry['fields'] = json.dumps(total_cat)
                new_entry['first_date'] = entry['first_date']
                new_entry['merriam'] = entry['merriam']
                new_entry['name'] = entry['name']
                new_entry['sorting_name'] = sorting_name
                new_entry['num_total'] = total_occ
                new_entry['occurrences'] = json.dumps(occ_yearly)
                new_entry['oxford'] = entry['oxford']
                new_entry['fields_by_year'] = json.dumps(cat_yearly)

                new_json.append(new_entry)

            else:
                new_entry = entry
                new_entry['fields_by_year'] = "{}"
                new_entry['sorting_name'] = entry['name'].lower()
                new_entry['occurrences'] = new_entry.pop('occurences')

                new_json.append(new_entry)

    except (OSError, IOError):
        new_entry = entry
        new_entry['fields_by_year'] = "None"
        new_entry['sorting_name'] = entry['name'].lower()
        new_entry['occurrences'] = new_entry.pop('occurences')

        new_json.append(new_entry)

with open('new_firebase.json', 'w') as f:
    json.dump(new_json, f)


