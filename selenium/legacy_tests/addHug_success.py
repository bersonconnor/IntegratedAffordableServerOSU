import time
from selenium import webdriver
from selenium.webdriver.support.ui import Select

driver = webdriver.Chrome('./chromedriver')  # List driver in folder
driver.get('http://localhost:3000') # Link to affordable application

time.sleep(1) # Let user see changes

register_button = driver.find_element_by_xpath('//input[@value=\'Login\']')
register_button.click()
# time.sleep(3)


username_text_box = driver.find_element_by_id('username')
username_text_box.send_keys('amarean')
# time.sleep(3)

password_text_box = driver.find_element_by_id('password')
password_text_box.send_keys('capstone1')
time.sleep(1)

login = driver.find_element_by_xpath('//input[@type=\'submit\']')
login.click()
time.sleep(1)
driver.switch_to.alert.accept()
time.sleep(1)

org_menu =driver.find_element_by_id('representing')
org_menu.send_keys('Sample-VerifiedTestOrg')
time.sleep(3)
#accept confirmation dialog
confirm_org = driver.find_element_by_xpath('//button[@class=\'swal-button swal-button--confirm\']')
confirm_org.click()
time.sleep(1)

hug = driver.find_element_by_xpath('//a[@href=\'/hug\']')
hug.click()
time.sleep(3)

hug_name = driver.find_element_by_id('Name')
hug_name.send_keys('Mothers Helping Mothers')
time.sleep(1)

hug_cat = driver.find_element_by_id('hugCat')
hug_cat.send_keys('Medical Care')
time.sleep(1)

med_cat = driver.find_element_by_id('medCat')
med_cat.send_keys('Prenatal Care')
time.sleep(1)

purpose = driver.find_element_by_id('Purpose')
purpose.send_keys('Help unemployed women receive prenatal care')
time.sleep(1)

diagnosis_option = driver.find_element_by_id('yesDiagnosis')
diagnosis_option.click()

diagnosisName = driver.find_element_by_xpath('//input[@placeholder=\'Type a diagnosis\']')
diagnosisName.send_keys('Pregnancy')
time.sleep(1)

pre_option = driver.find_element_by_xpath('//input[@name=\'noPrescription\']')
pre_option.send_keys("0")
pre_option.click()
time.sleep(1)

nextButton = driver.find_element_by_id('nextButton')
nextButton.click()
time.sleep(1)

age = driver.find_element_by_id('Age')
age.send_keys('Less than')
time.sleep(1)

age = driver.find_element_by_id('AgeHigh')
age.send_keys('30')

sex = driver.find_element_by_id('Sex')
sex.send_keys('Female')

location = driver.find_element_by_id('Location')
location.send_keys('State')
time.sleep(1)

addressLine1 = driver.find_element_by_id('Address-Line-1')
addressLine1.send_keys('410 Buckeye Lane')
time.sleep(1)

city = driver.find_element_by_id('city')
city.send_keys('Columbus')

state = driver.find_element_by_id('state')
state.send_keys('Ohio')

zip = driver.find_element_by_id('zip')
zip.send_keys('43210')
time.sleep(1)

ethnicity = driver.find_element_by_id('ethnicity')
ethnicity.send_keys('Hispanic or Latino')
time.sleep(1)

firstLanguage = driver.find_element_by_id('firstLanguage')
firstLanguage.send_keys('Spanish')

citizenship = driver.find_element_by_id('citizenship')
citizenship.send_keys('Citizen')
time.sleep(1)

militaryService = driver.find_element_by_id('militaryService')
militaryService.send_keys('NA')

employment = driver.find_element_by_id('employment')
employment.send_keys('Unemployed More than 6 Months')
time.sleep(1)

income = driver.find_element_by_id('income')
income.send_keys('Less than')

incomeHigh = driver.find_element_by_id('incomeHigh')
incomeHigh.send_keys('20000')
time.sleep(1)

insurance = driver.find_element_by_id('insurance')
insurance.send_keys('Uninsured')

marriageStatus = driver.find_element_by_id('marriageStatus')
marriageStatus.send_keys('Single')
time.sleep(1)

dependents = driver.find_element_by_id('dependents')
dependents.send_keys('Range')

dependents = driver.find_element_by_id('dependentsLow')
dependents.send_keys('0')

dependents = driver.find_element_by_id('dependentsHigh')
dependents.send_keys('6')
time.sleep(1)

nextButton = driver.find_element_by_id('nextButton')
nextButton.click()
time.sleep(1)

selectCandidateOption = driver.find_element_by_id('yesSelect')
selectCandidateOption.click()
time.sleep(1)

docAppOption = driver.find_element_by_id('yesDocApp')
docAppOption.click()

socialSecurityOption = driver.find_element_by_id('Social Security Card')
socialSecurityOption.click()
time.sleep(1)

healthInsuranceOption = driver.find_element_by_id('Health Insurance Card')
healthInsuranceOption.click()
time.sleep(1)

medInfoOption = driver.find_element_by_id('yesMedInfo')
medInfoOption.click()

medInfoDoc = driver.find_element_by_id('addMedicalInfo')
medInfoDoc.click()
time.sleep(1)

docName = driver.find_element_by_id('Document')
docName.send_keys('Doctor Note')
time.sleep(1)

nextButton = driver.find_element_by_id('nextButton')
nextButton.click()
time.sleep(1)

dateStart = driver.find_element_by_id('dateStart')
dateStart.send_keys('12/12/2019')

dateEnd= driver.find_element_by_id('dateEnd')
dateEnd.send_keys('04/06/2020')
time.sleep(1)

fundraisingOptions= driver.find_element_by_id('Fundraising-Options')
fundraisingOptions.send_keys('Multiple Donors')
time.sleep(1)

hugDistribution= driver.find_element_by_id('HUG-Distribution-Timeline')
hugDistribution.send_keys('Immediate')

fundingPerPerson= driver.find_element_by_id('Funding-Per-Person')
fundingPerPerson.send_keys('500')
time.sleep(1)

numberSupported= driver.find_element_by_id('Number-Supported-')
numberSupported.send_keys('20')

totalHugBudget= driver.find_element_by_id('Total-HUG-Budget')
totalHugBudget.send_keys('10000')
time.sleep(1)

sponsorContribution= driver.find_element_by_id('Sponsor-Contribution')
sponsorContribution.send_keys('1000')

hugDistribution= driver.find_element_by_id('HUG-Distribution')
hugDistribution.send_keys('Together')
time.sleep(1)

paymentMethod= driver.find_element_by_id('Payment-Method')
paymentMethod.send_keys('Check')
time.sleep(1)

createHug = driver.find_element_by_id('createHug')
createHug.click()
time.sleep(6)


driver.quit()
