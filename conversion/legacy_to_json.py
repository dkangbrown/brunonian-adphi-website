import os
import sys
import re
import json

cleanr = re.compile('<.*?>')
def grab_all_files(file_path):
    files = []
    for filename in os.listdir(file_path):
        f = open(file_path + filename, "r")
        files.append(f.read())
    return files

def parse_text(file):
    obj = {}
    books = []
    positions = []
    for line in file.splitlines():
        tokens = line.split("::")
        if(len(tokens) != 2):
            continue
        key = tokens[0]
        text = re.sub(cleanr, '', tokens[1])
        if(key == "Book"):
            books.append(text)
        elif (key == "Officer"):
            positions.append(text)
        elif (key == "Year"):
            obj[key] = int(text)
        elif (key == "Pledge"):
            obj[key] = int(text) - 3
        else:
            obj[key] = text
    
    obj["Books"] = books
    obj["Positions"] = positions
    return obj

        
if(len(sys.argv) != 3):
    print("Usage: <this script> path_to_read path_to_write")
else:
    print("Read dir: " + sys.argv[1])
    print("Write dir: " + sys.argv[2])
    file = open(sys.argv[2], "w+")

    unformatted_members = grab_all_files(sys.argv[1])
    people = []
    for m in unformatted_members:
        people.append(parse_text(m))
    file.write(json.dumps(people, indent=4))

