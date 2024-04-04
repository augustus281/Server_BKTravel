import flask
import csv
from flask import Flask, render_template, request
import difflib
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
import random

# df2 = pd.read_csv("./model/data.csv")
count = CountVectorizer(stop_words="vietnames")
count_matrix = count.fit_transform()



