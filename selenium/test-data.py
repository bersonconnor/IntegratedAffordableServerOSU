import time
import mysql.connector
from selenium import webdriver
from selenium.webdriver.support.ui import Select

mySQL_conn = mysql.connector.connect(host='localhost',database='Affordable',user='root',password='password')
cursor = mySQL_conn.cursor()
# cursor.callproc('SeleniumMultipleEmailsData')
cursor.execute(sql_emails_query)
cursor.execute(sql_authentication_information_query)
mySQL_conn.commit()
time.sleep(3) # Let user see changes

mySQL_conn.close()
