import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import Select

import sys

#README: Login as admin. Then go to admin privileges page. Revoke all privileges to admintest1234.
#This is a dumb test, as it will just revoke all prileges and it will just check if the buttons were pressed.

#Test Dependencies: 1. register-admin-standard.py, 2. approve-admin.py

print("Running revoke-all-admin-privileges.py")

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

    #Go to admin privileges page
    application_menu = driver.find_element_by_xpath('//a[@href=\'/privileges\']')
    application_menu.click()
    time.sleep(3)

    #Revoke all admintest1234 privileges, need for loops to go through all Permit/Revoke
    revoke_buttons = driver.find_elements_by_class_name("btn-danger")
    for revoke_button in revoke_buttons:
        #find revoke button
        if revoke_button.text == 'Revoke':
            #find revoke button specific to admintest1234, only click admintest1234 and exit loop
            if revoke_button.find_element_by_xpath('./../../td[2]').text == "admintest1234":
                #print("Revoked privelege admintest1234")
                revoke_button.click()
                time.sleep(1)

    #Check if there are any Permits left for admintest1234
    time.sleep(3)
    check_buttons = driver.find_elements_by_class_name("btn-primary")
    all_permit = True
    for check_button in check_buttons:
        if check_button.text == 'Revoke':
            if check_button.find_element_by_xpath('./../../td[2]').text == "admintest1234":
                all_permit = False

    assert all_permit == True
 

    # STOPS HERE

except Exception as ex:
    print(ex)
    print("revoke-all-admin-privileges.py has failed.")
    driver.quit()

else:
    print("revoke-all-admin-privileges.py was successful.")
    driver.quit()
