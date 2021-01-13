# this is a demo of one path through

import time
from selenium import webdriver
from selenium.webdriver.support.ui import Select

driver = webdriver.Chrome('./chromedriver')  # List driver in folder
driver.get('https://www.healthwellfoundation.org/patients/apply/applicant-type/') # Link to Healthwell website
time.sleep(3) # Let user see changes

radio_button = driver.find_element_by_xpath('//input[@value=\'patient\']')
radio_button.click()
time.sleep(3)  # Let user see changes

continue_button = driver.find_element_by_xpath('//button[@type=\'submit\']')
continue_button.click()
time.sleep(3)

gout_button = driver.find_element_by_xpath('//input[@value=\'AP\']')
gout_button.click()
time.sleep(3)

continue_button = driver.find_element_by_xpath('//button[@type=\'submit\']')
continue_button.click()
time.sleep(3)

# this element doesn't exist
drug_button_1 = driver.find_element_by_xpath('//input[@value=\'2220531\']')
drug_button_1.click()
time.sleep(3)

insurance_button = driver.find_element_by_xpath('//input[@value=\'1\']')
insurance_button.click()
time.sleep(3)

continue_button = driver.find_element_by_xpath('//button[@type=\'submit\']')
continue_button.click()
time.sleep(3)

copay_button = driver.find_element_by_xpath('//input[@value=\'premium\']')
copay_button.click()
time.sleep(3)

continue_button = driver.find_element_by_xpath('//button[@type=\'submit\']')
continue_button.click()
time.sleep(3)

contacted_button = driver.find_element_by_xpath('//input[@value=\'1\']')
contacted_button.click()
time.sleep(3)

continue_button = driver.find_element_by_xpath('//button[@type=\'submit\']')
continue_button.click()
time.sleep(3)

agree_checkbox = driver.find_element_by_name('attest')
agree_checkbox.click()

continue_button = driver.find_element_by_xpath('//button[@type=\'submit\']')
continue_button.click()
time.sleep(3)

contacted_button = driver.find_element_by_xpath('//input[@value=\'yes\']')
contacted_button.click()
time.sleep(3)

continue_button = driver.find_element_by_xpath('//button[@type=\'submit\']')
continue_button.click()
time.sleep(3)

select = Select(driver.find_element_by_name('eligibility_state'))
select.select_by_visible_text('Ohio')

num_in_house_textbox = driver.find_element_by_name('number_in_household')
num_in_house_textbox.send_keys('3')

box = driver.find_element_by_name('annual_household_income')
box.send_keys('1000000')


continue_button = driver.find_element_by_xpath('//button[@type=\'submit\']')
continue_button.click()
time.sleep(3)
# STOPS HERE

driver.quit()
