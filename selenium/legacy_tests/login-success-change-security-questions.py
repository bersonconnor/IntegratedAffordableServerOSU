import time
from selenium import webdriver
from selenium.webdriver.support.ui import Select
from selenium.webdriver.common.action_chains import ActionChains

driver = webdriver.Chrome('./chromedriver')  # List driver in folder
driver.get('http://localhost:3000') # Link to affordable application

time.sleep(3) # Let user see changes

register_button = driver.find_element_by_xpath('//input[@value=\'Login\']')
register_button.click()
# time.sleep(3)


username_text_box = driver.find_element_by_id('username') 
username_text_box.send_keys('test123')
# time.sleep(3)

password_text_box = driver.find_element_by_id('password') 
password_text_box.send_keys('test123')
time.sleep(3)

login = driver.find_element_by_xpath('//input[@type=\'submit\']')
login.click()
time.sleep(3)

driver.switch_to.alert.accept()
time.sleep(3)
login = driver.find_element_by_xpath('//a[@href=\'/settings\']')
login.click()
time.sleep(3)

security_tab = driver.find_element_by_xpath('//li[@id=\'securityTab\']')
security_tab.click()
time.sleep(3)

confirm_delete_email_button = driver.find_element_by_xpath('//button[text()="Change Selected Security Question"]')
actions = ActionChains(driver)
actions.move_to_element(confirm_delete_email_button).perform()
time.sleep(1)

security_question_button = driver.find_element_by_xpath('//button[@value=\'1\']')
time.sleep(3)
security_question_button.click()

security_question_1_dropdown = driver.find_element_by_class_name('css-151xaom-placeholder')

time.sleep(3)
security_question_1_dropdown.click()
time.sleep(3)
security_question_1_dropdown_text_box = driver.find_element_by_xpath('//div[text()="What was your childhood nickname?"]')
security_question_1_dropdown_text_box.click()
# security_question_1_dropdown_text_box.click()
time.sleep(3)

password_text_box = driver.find_element_by_id('securityans') 
password_text_box.send_keys('Affordable!')
time.sleep(3)

confirm_delete_email_button = driver.find_element_by_xpath('//button[text()="Change Selected Security Question"]')
confirm_delete_email_button.click()
time.sleep(3)

time.sleep(3)

time.sleep(3)
email_alert = driver.find_element_by_xpath(('//button[text()="OK"]'))
email_alert.click
time.sleep(1)
# driver.switch_to.alert.accept()

# email_alert_button = driver.find_element_by_xpath(('//button[text()="OK"]'))
# email_alert_button.click()

time.sleep(5)

# STOPS HERE

driver.quit()