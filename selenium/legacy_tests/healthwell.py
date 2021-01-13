# this is a demo of one path through

import time
from selenium import webdriver
from selenium.webdriver.support.ui import Select

driver = webdriver.Chrome('./chromedriver')  # List driver in folder
driver.get('https://www.healthwellfoundation.org/patients/apply/applicant-type/') # Link to Healthwell website
time.sleep(3) # Let user see changes

radio_button = driver.find_element_by_xpath('//input[@value=\'proxy\']')
radio_button.click()
close_button = driver.find_element_by_xpath('//a[@class=\'btn simplemodal-close\']')
close_button.click()
time.sleep(3) # Let user see changes

continue_button = driver.find_element_by_xpath('//button[@type=\'submit\']')
continue_button.click()
time.sleep(3)

firstname_textbox = driver.find_element_by_name('proxy_first_name')
lastname_textbox = driver.find_element_by_name('proxy_last_name')
email_textbox = driver.find_element_by_name('proxy_email')
phone_textbox = driver.find_element_by_name('proxy_phone')
relationship_select = Select(driver.find_element_by_name('proxy_relationship'))
firstname_textbox.send_keys('Jeff')
lastname_textbox.send_keys('Gotgout')
email_textbox.send_keys('goutman69@gmail.com')
phone_textbox.send_keys('6142359190')
relationship_select.select_by_visible_text('Parent')
time.sleep(3)

continue_button = driver.find_element_by_xpath('//button[@type=\'submit\']')
continue_button.click()
time.sleep(3)

agree_checkbox = driver.find_element_by_name('attest')
agree_checkbox.click()
time.sleep(3)

continue_button = driver.find_element_by_xpath('//button[@type=\'submit\']')
continue_button.click()
time.sleep(3)

gout_button = driver.find_element_by_xpath('//input[@value=\'CG\']')
gout_button.click()
time.sleep(3)

continue_button = driver.find_element_by_xpath('//button[@type=\'submit\']')
continue_button.click()
time.sleep(3)

# this element doesn't exist
drug_button_1 = driver.find_element_by_xpath('//input[@value=\'2220496\']')
drug_button_1.click()
time.sleep(3)

insurance_button = driver.find_element_by_xpath('//input[@value=\'1\']')
insurance_button.click()
time.sleep(3)

continue_button = driver.find_element_by_xpath('//button[@type=\'submit\']')
continue_button.click()
time.sleep(3)

medicare_button = driver.find_element_by_xpath('//input[@value=\'1\']')
medicare_button.click()
time.sleep(3)

continue_button = driver.find_element_by_xpath('//button[@type=\'submit\']')
continue_button.click()
time.sleep(3)

copay_button = driver.find_element_by_xpath('//input[@value=\'copay\']')
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
box.send_keys('30000')

continue_button = driver.find_element_by_xpath('//button[@type=\'submit\']')
continue_button.click()
time.sleep(3)

select = Select(driver.find_element_by_name('patient_gender'))
select.select_by_visible_text('Male')

box = driver.find_element_by_name('patient_first_name')
box.send_keys('John')

box = driver.find_element_by_name('patient_last_name')
box.send_keys('Doe')

box = driver.find_element_by_name('ssn_1')
box.send_keys('297')

box = driver.find_element_by_name('ssn_2')
box.send_keys('02')

box = driver.find_element_by_name('ssn_3')
box.send_keys('2386')

select = Select(driver.find_element_by_name('dob_month'))
select.select_by_visible_text('Jan')

select = Select(driver.find_element_by_name('dob_day'))
select.select_by_visible_text('1')

select = Select(driver.find_element_by_name('dob_year'))
select.select_by_visible_text('1969')

box = driver.find_element_by_name('patient_phone')
box.send_keys('6142359190')

box = driver.find_element_by_name('patient_address')
box.send_keys('123 Test St')

box = driver.find_element_by_name('patient_city')
box.send_keys('Columbus')

box = driver.find_element_by_name('patient_zip')
box.send_keys('43201')

select = Select(driver.find_element_by_name('patient_state'))
select.select_by_visible_text('Ohio')

continue_button = driver.find_element_by_xpath('//button[@type=\'submit\']')
continue_button.click()
time.sleep(3)

continue_button = driver.find_element_by_xpath('//button[@type=\'submit\']')
continue_button.click()
time.sleep(3)

select = Select(driver.find_element_by_name('primary_insurance_type'))
select.select_by_visible_text('Medicare')

box = driver.find_element_by_name('primary_insurance_policy_holder_name')
box.send_keys('John Doe')

box = driver.find_element_by_name('primary_insurance_policy_number')
box.send_keys('123456')

box = driver.find_element_by_name('primary_insurance_company')
box.send_keys('Fake Inc')

continue_button = driver.find_element_by_xpath('//button[@type=\'submit\']')
continue_button.click()
time.sleep(3)

continue_button = driver.find_element_by_xpath('//button[@type=\'submit\']')
continue_button.click()
time.sleep(3)

# STOPS HERE

driver.quit()