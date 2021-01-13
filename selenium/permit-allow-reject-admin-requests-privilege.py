import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import Select

import sys

#README: Login as admin. Then go to admin privileges page. Give the allow/reject admin requests privilege to admintest1234.
#Then this test will log in as admintest1234 and see if they can navigate to the admin registration request page.

#Test Dependencies: 1. register-admin-standard.py, 2. approve-admin.py

print("Running permit-allow-reject-admin-requests-privilege.py")

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

    #Permit allow/reject admin request privilege for admintest1234
    permit_allow_reject_admin_req_button = driver.find_element_by_xpath('//*[@title="Permit: allowRejectAdminRegistration"]')
    if permit_allow_reject_admin_req_button.find_element_by_xpath('./../../td[2]').text == "admintest1234":
        permit_allow_reject_admin_req_button.click()
        print("permitted allow/remove admin request privilege")
        time.sleep(1)

    #logout, then navigate to login to check if the admin can login
    dropdowns = driver.find_elements_by_class_name("dropdown-toggle")
    for dropdown in dropdowns:
        if dropdown.text == 'admin':
            dropdown.click()

    time.sleep(3)
    sign_out_link = driver.find_element_by_link_text("Sign Out")
    sign_out_link.click()

    #login as admintest1234 to see if approval worked
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
    
    #If the user has an unverified email then hit ok button
    pop_ups = driver.find_elements_by_class_name("swal-title")
    for pop_up in pop_ups:
        if pop_up.text == 'Unverified Email':
            unverified_email_ok_button = driver.find_element_by_class_name("swal-button")
            unverified_email_ok_button.click()
            time.sleep(3)
 
    #Go to admin registration requests page
    application_menu = driver.find_element_by_xpath('//a[@href=\'/requests\']')
    application_menu.click()
    time.sleep(3)

    assert driver.current_url == 'http://localhost:3000/requests'

    # STOPS HERE

except Exception as ex:
    print(ex)
    print("permit-allow-reject-admin-requests-privilege.py has failed.")
    driver.quit()

else:
    print("permit-allow-reject-admin-requests-privilege.py was successful.")
    driver.quit()
