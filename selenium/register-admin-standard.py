import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import Select

import sys

#README: Navigate to admin Registration page, and go through registration process and check for registration pop up.

#Test Dependencies: No other tests.

print("Running register-admin-standard.py")

try:

    if (len(sys.argv) > 1 and sys.argv[1] == "--ci"):
        options = Options()
        options.add_argument('--headless')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-gpu')  # Last I checked this was necessary.
        driver = webdriver.Chrome(executable_path='/builds/sean/AffordableServerOSU/selenium/linux/chromedriver', chrome_options=options) # List driver in folder
    else:
        driver = webdriver.Chrome('./windows/chromedriver')  # List driver in folder
        
    driver.get('http://localhost:3000/admin-register') # Link to affordable application
    time.sleep(3) # Let user see changes

    username_text_box = driver.find_element_by_id('username') 
    username_text_box.send_keys('admintest1234')
    #time.sleep(3)

    password_text_box = driver.find_element_by_id('password') 
    password_text_box.send_keys('admintest1234')
    #time.sleep(3)

    confirm_password_text_box = driver.find_element_by_id('confPass') 
    confirm_password_text_box.send_keys('admintest1234')
    #time.sleep(3)

    email_text_box = driver.find_element_by_id('email') 
    email_text_box.send_keys('admintest@gmail.com')
    #time.sleep(3)

    apply_now_button = driver.find_element_by_xpath('//*[@id="root"]/div/div[2]/div/div[7]/div/form/input')
    apply_now_button.click()
    time.sleep(3)

    #If pop up shows up then check if it was a successful registration
    pop_ups = driver.find_elements_by_class_name("swal-title")
    admin_register_success = False
    for pop_up in pop_ups:
        if pop_up.text == 'Thank you for registering with Affordable!':
            admin_register_success = True

    assert admin_register_success == True

    # STOPS HERE

except Exception as ex:
    print(ex)
    print("register-admin-standard.py has failed.")
    driver.quit()
    sys.exit(-1)
    
else:
    print("register-admin-standard.py was successful.")
    driver.quit()