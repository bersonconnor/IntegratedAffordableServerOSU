import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import Select

import sys

#README: Navigate to Login page, and fail the login with a wrong username, and then check if the error message says it was due to an incorrect username entered.

#Test Dependencies: 1. register-standard.py

print("Running login-fail-incorrect-user.py")

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
    username_text_box.send_keys('wrong')
    #time.sleep(3)

    password_text_box = driver.find_element_by_id('password') 
    password_text_box.send_keys('test1234')
    time.sleep(3)

    login = driver.find_element_by_xpath('//input[@type=\'submit\']')
    login.click()
    time.sleep(3)

    #If the login fails then check reason for failure (username)
    pop_ups = driver.find_elements_by_class_name("swal-text")
    password_failure = False
    for pop_up in pop_ups:
        if pop_up.text == 'Your username does not exist.':
            password_failure = True

    assert password_failure == True

    # STOPS HERE

except Exception as ex:
    print(ex)
    print("login-fail-incorrect-user.py has failed.")
    driver.quit()
    sys.exit(-1)
    
else:
    print("login-fail-incorrect-user.py was successful.")
    driver.quit()