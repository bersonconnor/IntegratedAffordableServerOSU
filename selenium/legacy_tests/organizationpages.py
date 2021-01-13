import time
from selenium import webdriver
from selenium.webdriver.support.ui import Select

driver = webdriver.Chrome('./chromedriver')  # List driver in folder
driver.get('http://localhost:3000') # Link to affordable application

time.sleep(3) # Let user see changes

register_button = driver.find_element_by_xpath('//input[@value=\'Login\']')
register_button.click()
# time.sleep(3)


username_text_box = driver.find_element_by_id('username')
username_text_box.send_keys('amarean')
# time.sleep(3)

password_text_box = driver.find_element_by_id('password')
password_text_box.send_keys('capstone1')
time.sleep(3)

login = driver.find_element_by_xpath('//input[@type=\'submit\']')
login.click()
time.sleep(3)
driver.switch_to.alert.accept()
time.sleep(3)

organization_menu = driver.find_element_by_xpath('//a[@href=\'/organization\']')
organization_menu.click()
time.sleep(3)

organization_affiliation = driver.find_element_by_xpath('//a[@href=\'/affiliation\']')
organization_affiliation.click()
time.sleep(3)



# STOPS HERE

driver.quit()
