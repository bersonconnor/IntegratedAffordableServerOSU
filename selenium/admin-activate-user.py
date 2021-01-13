import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import Select

import sys

#README: Login as admin. Then go to the "Admin deactivate user" page aka the user access page. Then activate user test1234 (this is after deactivation).
#Then try to log in as test1234 (should be successful)

#Test Dependencies: 1. register-standard.py, 2. login-success-change-password.py, 3. admin-deactivate-user.py

print("Running admin-activate-user.py")

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
    username_text_box.send_keys('admin')
    # time.sleep(3)

    password_text_box = driver.find_element_by_id('password')
    password_text_box.send_keys('password')
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

    #Go to admin registration requests page
    application_menu = driver.find_element_by_xpath('//a[@href=\'/deactivateuser\']')
    application_menu.click()
    time.sleep(3)

    #TODO: activate test1234 user and try to sign in as test1234 and see if you are able to

    #Activate test1234, need for loops to go through all users in list
    activate_buttons = driver.find_elements_by_class_name("btn-primary")
    for activate_button in activate_buttons:
        #find activate button
        if activate_button.text == 'Activate':
            #find activate button specific to test1234, activate test1234 and exit loop
            if activate_button.find_element_by_xpath('./../../td[2]').text == "test1234":
                print("activated test1234")
                activate_button.click()
                break
    
    #wait for activation to process
    time.sleep(3)

    #logout, then navigate to login to check if the test1234 can login
    dropdowns = driver.find_elements_by_class_name("dropdown-toggle")
    for dropdown in dropdowns:
        if dropdown.text == 'admin':
            dropdown.click()

    time.sleep(3)
    sign_out_link = driver.find_element_by_link_text("Sign Out")
    sign_out_link.click()

    #login as test1234 to see if activation worked
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

except Exception as ex:
    print(ex)
    print("admin-activate-user.py has failed.")
    driver.quit()
    sys.exit(-1)

else:
    print("admin-activate-user.py was successful.")
    driver.quit()
