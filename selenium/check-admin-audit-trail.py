import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import Select

import sys

#README: Login as admin, and check that all of the audit trail logs have been recorded successfully.

#Test Dependencies: All of the admin test suite

print("Running check-admin-audit-trail.py")

actions = [
    "admin Reset Password of test1234",
    "admin Revoked Admin Access for admintest1234",
    "Updated Privilege deactivateUsers for: admintest1234",
    "Updated Privilege deactivateUsers for: admintest1234",
    "Updated Privilege messageUserEmailUser for: admintest1234",
    "Updated Privilege messageUserEmailUser for: admintest1234",
    "Updated Privilege setPrivileges for: admintest1234",
    "Updated Privilege setPrivileges for: admintest1234",
    "Updated Privilege allowRejectAdminRegistration for: admintest1234",
    "Updated Privilege allowRejectAdminRegistration for: admintest1234",
    "Updated Privilege readAuditTrail for: admintest1234",
    "Updated Privilege editApplications for: admintest1234",
    "Updated Privilege createRemoveOrgs for: admintest1234",
    "Updated Privilege createRemoveHugs for: admintest1234",
    "Updated Privilege deactivateUsers for: admintest1234",
    "Updated Privilege messageUserEmailUser for: admintest1234",
    "Updated Privilege managePaymentTransactions for: admintest1234",
    "Updated Privilege resetAuthInfoNonAdmin for: admintest1234",
    "Updated Privilege setPrivileges for: admintest1234",
    "Updated Privilege revokeAdminAccess for: admintest1234",
    "Updated Privilege allowRejectAdminRegistration for: admintest1234",
    "Updated Privilege readAuditTrail for: admintest1234",
    "Updated Privilege editApplications for: admintest1234",
    "Updated Privilege createRemoveOrgs for: admintest1234",
    "Updated Privilege createRemoveHugs for: admintest1234",
    "Updated Privilege deactivateUsers for: admintest1234",
    "Updated Privilege messageUserEmailUser for: admintest1234",
    "Updated Privilege managePaymentTransactions for: admintest1234",
    "Updated Privilege resetAuthInfoNonAdmin for: admintest1234",
    "Updated Privilege setPrivileges for: admintest1234",
    "Updated Privilege revokeAdminAccess for: admintest1234",
    "Updated Privilege allowRejectAdminRegistration for: admintest1234",
    "admin Reactivated User test1234",
    "admin Deactivated User test1234",
    "admin Emailed User with id 2",
    "Approved Admin Request for: admintest1234",
    "Denyed Admin Request for: admintest1234"
]

#actions = actions.reverse()

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
    application_menu = driver.find_element_by_xpath('//a[@href=\'/audittrails\']')
    application_menu.click()
    time.sleep(3)

    #Reject admintest1234, need for loops to go through all approves/disproves
    audit_trail_rows = driver.find_elements_by_tag_name("tr")
    i = 0
    for audit_trail_row in audit_trail_rows:
        cells = audit_trail_row.find_elements_by_tag_name("td")
        
        if len(cells) == 0:
            continue

        actor = cells[0].text
        action = cells[1].text
        print(action)
        
        assert actor == "admin"
        assert action == actions[i]
        i = i + 1

except Exception as ex:
    print(ex)
    print("check-admin-audit-trail.py has failed.")
    driver.quit()
    sys.exit(-1)
    
else:
    print("check-admin-audit-trail.py was successful.")
    driver.quit()