import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import Select

import sys

#README: Login as admin, and reset the users password.

#Test Dependencies: 1. register-standard.py

print("Running admin-security-page.py")

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

    #Go to admin user security page
    application_menu = driver.find_element_by_xpath('//a[@href=\'/usersecurity\']')
    application_menu.click()
    time.sleep(3)

    reset_password_button = driver.find_element_by_xpath('//*[@id="root"]/div/div/div[2]/div[2]/div/table/tbody/tr[2]/td[4]/div/button')
    if driver.find_element_by_xpath('//*[@id="root"]/div/div/div[2]/div[2]/div/table/tbody/tr[2]/td[2]').text == "test1234":
        print("Reset password for test1234")
        reset_password_button.click()
    else:
        raise Exception("Unexpected user found.")
    
    time.sleep(3)

    modal = driver.find_element_by_xpath('//*[@id="root"]/div/div/div[2]/div[2]/div/table/tbody/tr[2]/td[4]/div/div[2]/div/span')
    assert modal.text == "Password Reset Email Sent!"

except Exception as ex:
    print(ex)
    print("admin-security-page.py has failed.")
    driver.quit()
    sys.exit(-1)
    
else:
    print("admin-security-page.py was successful.")
    driver.quit()
