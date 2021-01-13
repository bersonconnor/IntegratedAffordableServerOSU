import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import Select

import sys

#README: Login as admin. Then go to reject pending admin request for admintest1234. Then logout and make sure that the admin is not able to login.

#Test Dependencies: 1. register-admin-standard.py, 2. approve-admin.py
#Dependency note: Running this test before other admin test may break those tests as after this test admintest1234 will NOT exist.

print("Running revoke-admin-access.py")

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
    application_menu = driver.find_element_by_xpath('//a[@href=\'/revokeAccess\']')
    application_menu.click()
    time.sleep(3)

    #Reject admintest1234, need for loops to go through all approves/disproves
    reject_buttons = driver.find_elements_by_class_name("btn-danger")
    for reject_button in reject_buttons:
        #find reject button
        if reject_button.text == 'Revoke':
            #find reject button specific to admintest1234, reject admintest1234 and exit loop
            if reject_button.find_element_by_xpath('./../../td[2]').text == "admintest1234":
                print("revoked admintest1234")
                reject_button.click()
                break
    
    time.sleep(3)

    #logout, then navigate to login to check if the admin can login
    dropdowns = driver.find_elements_by_class_name("dropdown-toggle")
    for dropdown in dropdowns:
        if dropdown.text == 'admin':
            dropdown.click()

    time.sleep(3)
    sign_out_link = driver.find_element_by_link_text("Sign Out")
    sign_out_link.click()

    #login as admintest1234 to see if rejection worked
    time.sleep(3)
    username_text_box = driver.find_element_by_id('username')
    username_text_box.send_keys('admintest1234')
    # time.sleep(3)

    password_text_box = driver.find_element_by_id('password')
    password_text_box.send_keys('admintest1234')
    time.sleep(3)

    login = driver.find_element_by_xpath('//input[@type=\'submit\']')
    login.click()
    time.sleep(3)
    
    #If the login fails then check reason for failure (username - because admin username got trashed due to rejection)
    pop_ups = driver.find_elements_by_class_name("swal-text")
    password_failure = False
    for pop_up in pop_ups:
        if pop_up.text == 'Your username does not exist.':
            password_failure = True

    assert password_failure == True

    # STOPS HERE

except Exception as ex:
    print(ex)
    print("revoke-admin-access.py has failed.")
    driver.quit()
    sys.exit(-1)
    
else:
    print("revoke-admin-access.py was successful.")
    driver.quit()
