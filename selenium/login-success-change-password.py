import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import Select

import sys

#README: Navigate to Login page, and login successfully, and then change password on the account. Then login with new password to verify the change worked.

#Test Dependencies: 1. register-standard.py

print("Running login-success-change-password.py")

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

    #change password
    change_password_button = driver.find_element_by_id('changePasswordBtn')
    time.sleep(3)
    change_password_button.click()
    time.sleep(4)

    old_password_text_box = driver.find_element_by_id('current-pw') 
    old_password_text_box.send_keys('test1234')
    time.sleep(3)

    new_password_1_text_box = driver.find_element_by_id('new-pw-1') 
    new_password_1_text_box.send_keys('Test1234!')
    time.sleep(3)

    confirm_password_text_box = driver.find_element_by_id('new-pw-2') 
    confirm_password_text_box.send_keys('Test1234!')
    time.sleep(3)

    reset_password_button = driver.find_element_by_id('resetPasswordBtn')
    reset_password_button.click()
    time.sleep(3)

    #Process the change password pop up
    pop_ups = driver.find_elements_by_class_name("swal-title")
    for pop_up in pop_ups:
        if pop_up.text == 'Password Updated':
            unverified_email_ok_button = driver.find_element_by_class_name("swal-button")
            unverified_email_ok_button.click()
            time.sleep(3)

    #logout and log in with new password to verify that the change occured
    dropdowns = driver.find_elements_by_class_name("dropdown-toggle")
    for dropdown in dropdowns:
        if dropdown.text == 'test1234':
            dropdown.click()

    time.sleep(3)
    sign_out_link = driver.find_element_by_link_text("Sign Out")
    sign_out_link.click()

    #login as test1234 to see if approval worked
    time.sleep(3)
    username_text_box = driver.find_element_by_id('username')
    username_text_box.send_keys('test1234')
    # time.sleep(3)

    password_text_box = driver.find_element_by_id('password')
    password_text_box.send_keys('Test1234!')
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
        if dropdown.text == 'test1234':
            username_match = True

    assert username_match == True

    # STOPS HERE
    

except Exception as ex:
    print(ex)
    print("login-success-change-password.py has failed.")
    driver.quit()
    sys.exit(-1)

else:
    print("login-success-change-password.py was successful.")
    driver.quit()
