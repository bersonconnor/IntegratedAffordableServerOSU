import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import Select

import sys

#README: Navigate to Login page, and login successfully, and then change email on the account.

#Test Dependencies: 1. register-standard.py

print("Running login-success-change-email.py")

try:

    if (len(sys.argv) > 1 and sys.argv[1] == "--ci"):
        options = Options()
        options.add_argument('--headless')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-gpu')  # Last I checked this was necessary.
        driver = webdriver.Chrome(executable_path='/builds/sean/AffordableServerOSU/selenium/linux/chromedriver', chrome_options=options) # List driver in folder
    else:
        driver = webdriver.Chrome('./windows/chromedriver')  # List driver in folder
        
    driver.get('http://localhost:3000') # Link to affordable application

    time.sleep(3) # Let user see changes

    register_button = driver.find_element_by_xpath('//input[@value=\'Login\']')
    register_button.click()
    # time.sleep(3)


    username_text_box = driver.find_element_by_id('username') 
    username_text_box.send_keys('test1234')
    # time.sleep(3)

    password_text_box = driver.find_element_by_id('password') 
    password_text_box.send_keys('test1234')
    time.sleep(3)

    login = driver.find_element_by_xpath('//input[@type=\'submit\']')
    login.click()
    time.sleep(3)

    #If the user has an unverified email then hit ok button
    pop_ups = driver.find_elements_by_class_name("swal-title")
    for pop_up in pop_ups:
        if pop_up.text == 'Unverified Email':
            unverified_email_ok_button = driver.find_element_by_class_name("swal-button")
            unverified_email_ok_button.click()
            time.sleep(3)

    login = driver.find_element_by_xpath('//a[@href=\'/settings\']')
    login.click()
    time.sleep(3)

    delete_email_button = driver.find_element_by_xpath('//button[@value=\'CHANGING_EMAIL\']')
    delete_email_button.click()
    time.sleep(3)

    password_text_box = driver.find_element_by_id('new-email') 
    password_text_box.send_keys('test1@gmail.com')
    time.sleep(3)
    confirm_delete_email_button = driver.find_element_by_xpath('//button[@value=\'confirmChange\']')
    confirm_delete_email_button.click()
    time.sleep(4)

    driver.switch_to.alert.accept()
    time.sleep(3)

    #If the user has an unverified email then hit ok button
    pop_ups = driver.find_elements_by_class_name("swal-title")
    for pop_up in pop_ups:
        if pop_up.text == 'Unverified Email':
            unverified_email_ok_button = driver.find_element_by_class_name("swal-button")
            unverified_email_ok_button.click()
            time.sleep(3)

    #Check if new email change processed
    new_emails = driver.find_elements_by_class_name("headingPaddingRightSmall")
    email_change = False
    for new_email in new_emails:
        if new_email.text == 'test1@gmail.com':
            email_change = True

    assert email_change == True

    # STOPS HERE

except Exception as ex:
    print(ex)
    print("login-success-change-email.py has failed.")
    driver.quit()
    sys.exit(-1)
    
else:
    print("login-success-change-email.py was successful.")
    driver.quit()
