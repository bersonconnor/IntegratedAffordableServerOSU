import time
from selenium import webdriver
from selenium.webdriver.support.ui import Select

driver = webdriver.Chrome('./chromedriver')  # List driver in folder
driver.get('http://localhost:3000') # Link to affordable application

time.sleep(1) # Let user see changes

register_button = driver.find_element_by_xpath('//input[@value=\'Login\']')
register_button.click()
# time.sleep(3)


username_text_box = driver.find_element_by_id('username')
username_text_box.send_keys('amarean')
# time.sleep(3)

password_text_box = driver.find_element_by_id('password')
password_text_box.send_keys('capstone1')
time.sleep(1)

login = driver.find_element_by_xpath('//input[@type=\'submit\']')
login.click()
time.sleep(1)
driver.switch_to.alert.accept()
time.sleep(1)

org_menu = driver.find_element_by_xpath('//a[@href=\'/organization\']')
org_menu.click()
time.sleep(1)

affiliation = driver.find_element_by_xpath('//a[@href=\'/affiliation\']')
affiliation.click()

add_org = driver.find_element_by_xpath('//a[@href=\'/affiliation/addorganization\']')
add_org.click()

#fill out form
orgname_text_box = driver.find_element_by_id('Organization-Name')
orgname_text_box.send_keys('Auxiliary of Bethesda Hospital Inc')
time.sleep(1)

addrone_box = driver.find_element_by_id('Address-Line-1')
addrone_box.send_keys('2815 S SEACREST BLVD')
time.sleep(1)

city_box = driver.find_element_by_id('City')
city_box.send_keys('Boynton Beach')
time.sleep(1)

state_box = driver.find_element_by_id('State')
state_box.send_keys('FL')
time.sleep(1)

zip_box = driver.find_element_by_id('Zip')
zip_box.send_keys('33435')
time.sleep(1)

email_box = driver.find_element_by_id('Email')
email_box.send_keys('')
time.sleep(1)

phone_box = driver.find_element_by_id('Phone-Number')
phone_box.send_keys('561-737-7733')
time.sleep(1)

fax_box = driver.find_element_by_id('Fax-Number')
fax_box.send_keys('')
time.sleep(1)

fax_box = driver.find_element_by_id('Website-URL')
fax_box.send_keys('https://www.bethesdaweb.com/')
time.sleep(1)

provider_option = driver.find_element_by_id('provider-yes')
provider_option.click()
time.sleep(1)

mission_box = driver.find_element_by_id('Mission')
mission_box.send_keys('Our mission')
time.sleep(1)

banking_option = driver.find_element_by_id('banking-no')
banking_option.click()
time.sleep(1)

agreement_option = driver.find_element_by_id('agreement-confirm')
agreement_option.click()
time.sleep(1)

allset_option = driver.find_element_by_id('allset')
allset_option.click()
time.sleep(1)

submit_button = driver.find_element_by_id('submit-button')
submit_button.click()
time.sleep(3)

confirm_add = driver.find_element_by_xpath('//button[@class=\'swal-button swal-button--confirm\']')
confirm_add.click()
time.sleep(1)

#verify org
verify_org = driver.find_element_by_xpath('//a[@href=\'/affiliation/verifyorganization\']')
verify_org.click()
time.sleep(1)

orgname_text_box = driver.find_element_by_id('Organization-Name')
orgname_text_box.send_keys('Auxiliary of Bethesda Hospital Inc')
time.sleep(1)

addrone_box = driver.find_element_by_id('Address-Line-1')
addrone_box.send_keys('2815 S SEACREST BLVD')
time.sleep(1)

city_box = driver.find_element_by_id('City')
city_box.send_keys('Boynton Beach')
time.sleep(1)

state_box = driver.find_element_by_id('State')
state_box.send_keys('FL')
time.sleep(1)

zip_box = driver.find_element_by_id('Zip')
zip_box.send_keys('33435')
time.sleep(1)

ein_box = driver.find_element_by_id('EIN')
ein_box.send_keys('596519906')
time.sleep(1)

tax_sec = driver.find_element_by_id('Tax-Section')
tax_sec.send_keys('3')
time.sleep(1)

tax_sec = driver.find_element_by_id('Tax-Section')
tax_sec.send_keys('501(c)(3)')
time.sleep(1)

irs_box = driver.find_element_by_id('IRS-Activity-Code')
irs_box.send_keys('E22I')
time.sleep(1)

verify_submit = driver.find_element_by_xpath('//input[@class=\'submit-button\']')
verify_submit.click()
time.sleep(3)
# STOPS HERE

driver.quit()
