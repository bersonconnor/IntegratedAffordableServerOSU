import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import Select

import sys

#README: Navigate to Registration page, and go through registration process.

#Test Dependencies: No other tests.

print("Running register-standard.py")

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

    register_button = driver.find_element_by_xpath('//input[@value=\'Register\']')
    register_button.click()
    #time.sleep(3)


    username_text_box = driver.find_element_by_id('username') 
    username_text_box.send_keys('test1234')
    #time.sleep(3)

    password_text_box = driver.find_element_by_id('password') 
    password_text_box.send_keys('test1234')
    #time.sleep(3)

    confirm_password_text_box = driver.find_element_by_id('confPass') 
    confirm_password_text_box.send_keys('test1234')
    #time.sleep(3)

    email_text_box = driver.find_element_by_id('email') 
    email_text_box.send_keys('test@gmail.com')
    #time.sleep(3)

    apply_now_button = driver.find_element_by_xpath('//*[@id="root"]/div/div[2]/div/div[7]/div/form/input')
    apply_now_button.click()
    time.sleep(3)

    assert driver.current_url == 'http://localhost:3000/application'

    # STOPS HERE

except Exception as ex:
    print(ex)
    print("register-standard.py has failed.")
    driver.quit()
    sys.exit(-1)
    
else:
    print("register-standard.py was successful.")
    driver.quit()