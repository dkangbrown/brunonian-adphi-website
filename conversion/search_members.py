import os
import sys
import re
import json

json_members = ""
sorted_grad = ""
sorted_pledge = ""

def init_search(filepath):
    file = open(filepath, "r")
    json_members = json.load(file)
    for m in json_members

def search_by_name(name):
    if json_members == "":
        return
    for m in json_members:
        if m['Name'] == name:
            return m

def get_pledge_year(year):


def get_grad_year(year):


    
    
