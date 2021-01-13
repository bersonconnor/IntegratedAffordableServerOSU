import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import Select

import sys

#README: Login as admin. Then go to email page fill out email form (user,subject,email text), submit it and see if the form refreshes.
#This test does NOT check if the email was actually sent.

#Test Dependencies: 1. register-standard.py

print("Running admin-email-to-user.py")

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
    application_menu = driver.find_element_by_xpath('//a[@href=\'/email\']')
    application_menu.click()
    time.sleep(3)

    #select test1234 from dropdown
    test1234_dropdown = Select(driver.find_element_by_id("users"))
    test1234_dropdown.select_by_visible_text("test1234")

    #put in text into the subject box
    subject_text_box = driver.find_element_by_id('subject')
    subject_text_box.send_keys('subject test')

    #put in text into the email text box
    email_text_box = driver.find_element_by_id('email')
    email_text_box.send_keys('email text test')
    time.sleep(1)

    #press submit button
    submit_button = driver.find_element_by_id('submit')
    submit_button.click()
    time.sleep(1)

    #check if form is now blank
    is_blank = True
    subject_text_box = driver.find_element_by_id('subject')
    email_text_box = driver.find_element_by_id('email')

    if subject_text_box.text != "":
        is_blank = False

    if email_text_box.text != '':
        is_blank = False

    assert is_blank == True

except Exception as ex:
    print(ex)
    print("admin-email-to-user.py has failed.")
    driver.quit()
    sys.exit(-1)

else:
    print("admin-email-to-user.py was successful.")
    driver.quit()
