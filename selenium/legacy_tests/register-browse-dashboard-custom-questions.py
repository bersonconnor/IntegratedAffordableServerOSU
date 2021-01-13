import time
from selenium import webdriver
from selenium.webdriver.support.ui import Select

driver = webdriver.Chrome('./chromedriver')  # List driver in folder
driver.get('http://localhost:3000') # Link to affordable application
time.sleep(3) # Let user see changes

register_button = driver.find_element_by_xpath('//input[@value=\'Register\']')
register_button.click()
#time.sleep(3)


username_text_box = driver.find_element_by_id('username') 
username_text_box.send_keys('test123')
#time.sleep(3)

password_text_box = driver.find_element_by_id('password') 
password_text_box.send_keys('test123')
#time.sleep(3)

confirm_password_text_box = driver.find_element_by_id('conf_pass') 
confirm_password_text_box.send_keys('test123')
#time.sleep(3)

email_text_box = driver.find_element_by_id('email') 
email_text_box.send_keys('buckeyes4733@gmail.com')
#time.sleep(3)

security_question_1_dropdown_text_box = driver.find_element_by_class_name('react-select-2-input') 
security_question_1_dropdown_text_box.send_keys('Create custom question\n')
# time.sleep(3)
# security_question_2_dropdown_text_box.send_keys('What does the fox say?\n')
security_question_1_question = driver.find_element_by_id('customQuestion1')
security_question_1_question.click
security_question_1_question.send_keys('What does the fox say?')
# time.sleep(3)
security_question_1_answer = driver.find_element_by_id('security1ans') 
security_question_1_answer.click
security_question_1_answer.send_keys('Please give me an A!')
#time.sleep(3)

security_question_2_dropdown_text_box = driver.find_element_by_id('react-select-3-input') 
# security_question_2_dropdown_text_box.send_keys('How many days until the semester is over?\n')
security_question_2_dropdown_text_box.send_keys('Create custom question\n')
security_question_2_question = driver.find_element_by_id('customQuestion2')
security_question_2_question.click
# time.sleep(3)
security_question_2_question.send_keys('How many days until the semester is over?')
security_question_2_answer = driver.find_element_by_id('security2ans') 
security_question_2_answer.send_keys('More than enough!')
# time.sleep(3)

security_question_3_dropdown_text_box = driver.find_element_by_id('react-select-4-input')
security_question_3_dropdown_text_box.send_keys('Create custom question\n')
security_question_3_question = driver.find_element_by_id('customQuestion3')
security_question_3_question.click
time.sleep(3)
security_question_3_question.send_keys('Who is winning Super Bowl LIV?') 
# security_question_3_dropdown_text_box.send_keys('Who is winning Super Bowl LIV?\n')
security_question_3_answer = driver.find_element_by_id('security3ans') 
security_question_3_answer.send_keys('The Cincinnati Bengals!!')
time.sleep(3)

time.sleep(3)
email_alert = driver.find_element_by_xpath(('//button[text()="OK"]'))
email_alert.click
time.sleep(1)
# driver.switch_to.alert.accept()

email_alert_button = driver.find_element_by_xpath(('//button[text()="OK"]'))
email_alert_button.click()

time.sleep(3)

browse_dashboard_button = driver.find_element_by_xpath('//input[@value=\'Browse Dashboard\']')
browse_dashboard_button.click()
# time.sleep(3)
driver.switch_to.alert.accept()
time.sleep(3)

# STOPS HERE

driver.quit()