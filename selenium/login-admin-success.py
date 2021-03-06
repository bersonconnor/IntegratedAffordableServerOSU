import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import Select

import sys

#README: Navigate to Login page, and login (as Admin), and then check if you logged in successfully.

#Test Dependencies: 1. register-admin-standard.py, 2. approve-admin.py

print("Running login-admin-success.py")

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
    time.sleep(3)


    username_text_box = driver.find_element_by_id('username') 
    username_text_box.send_keys('admintest1234')
    #time.sleep(3)

    password_text_box = driver.find_element_by_id('password') 
    password_text_box.send_keys('admintest1234')
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

    #Check if username is correct in username dropdown
    dropdowns = driver.find_elements_by_class_name("dropdown-toggle")
    username_match = False
    for dropdown in dropdowns:
        if dropdown.text == 'admintest1234':
            username_match = True

    assert username_match == True

    # STOPS HERE

except Exception as ex:
    print(ex)
    print("login-admin-success.py has failed.")
    driver.quit()
else:
    print("login-admin-success.py was successful.")
    driver.quit()