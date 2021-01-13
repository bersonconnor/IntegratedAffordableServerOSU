import time
from selenium import webdriver
from selenium.webdriver.support.ui import Select

driver = webdriver.Chrome('./chromedriver')  # List driver in folder
driver.get('http://localhost:3000') # Link to affordable application

time.sleep(3)  # Let user see changes

register_button = driver.find_element_by_xpath('//input[@value=\'Login\']')
register_button.click()
time.sleep(3)


username_text_box = driver.find_element_by_id('username')
username_text_box.send_keys('affordTest')
time.sleep(3)

password_text_box = driver.find_element_by_id('password')
password_text_box.send_keys('Affordtest1!')
time.sleep(3)

login = driver.find_element_by_xpath('//input[@type=\'submit\']')
login.click()
time.sleep(10)



settings_page = driver.find_element_by_xpath('//a[@href=\'/settings\']')
settings_page.click
time.sleep(3)

<<<<<<< HEAD

#old code with security questions not applicable in this version:

#add_div = driver.find_element_by_class_name('emailChangeWrapper')
#add_button = 
=======
add_div = driver.find_element_by_class_name('emailChangeWrapper')
# add_button =
>>>>>>> OSU-develop

# email_text_box = driver.find_element_by_id('email')
# email_text_box.send_keys('buckeyes4733@gmail.com')
# #time.sleep(3)

# security_question_2_dropdown_text_box = driver.find_element_by_id('react-select-2-input')
# security_question_2_dropdown_text_box.send_keys('What was the name of your first stuffed animal?\n')
# security_question_1_answer = driver.find_element_by_id('security1ans')
# security_question_1_answer.click
# security_question_1_answer.send_keys('Stinky')
# #time.sleep(3)

# security_question_2_dropdown_text_box = driver.find_element_by_id('react-select-3-input')
# security_question_2_dropdown_text_box.send_keys('What was your childhood nickname?\n')
# security_question_2_answer = driver.find_element_by_id('security2ans')
# security_question_2_answer.send_keys('Smelly')
# #time.sleep(3)

# security_question_3_dropdown_text_box = driver.find_element_by_id('react-select-4-input')
# security_question_3_dropdown_text_box.send_keys('What is the name of your favorite childhood friend?\n')
# security_question_3_answer = driver.find_element_by_id('security3ans')
# security_question_3_answer.send_keys('Musty')
# #time.sleep(3)

# browse_dashboard_button = driver.find_element_by_xpath('//input[@value=\'Browse Dashboard\']')
# browse_dashboard_button.click()
# # time.sleep(3)
# driver.switch_to.alert.accept()
# time.sleep(3)

# STOPS HERE

driver.quit()
