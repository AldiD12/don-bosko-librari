import json

# Load the JSON data from the file
with open('assets/librat.json', 'r', encoding='utf-8') as file:  # Path to librat.json
    data = json.load(file)

# Initialize a set to store unique categories
unique_categories = set()

# Iterate through the categories in the JSON data
for category in data:
    if isinstance(data[category], list):  # Check if the category is a list
        for item in data[category]:
            if 'Kategorizimi' in item:  # Check if 'Kategorizimi' key exists
                unique_categories.add(item['Kategorizimi'])  # Add to set for uniqueness

# Convert the set to a list and print the unique categories
print(list(unique_categories))
