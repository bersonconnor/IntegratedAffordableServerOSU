#! sh

# Script to run all of the applicable Selenium integration tests.
# Author: Andy Zawada (atzawada@gmail.com)

set -eux

if [ -z "$1" ]
then
    PYTHON="python"
else
    PYTHON="python3"
fi 

# Run Integration Tests (previous fixed tests)
$PYTHON register-standard.py $1 #works
$PYTHON applicationpages.py $1 #works
$PYTHON login-fail-incorrect-pass.py $1 #works
$PYTHON login-fail-incorrect-user.py $1 #works
$PYTHON login-success.py $1 #works
$PYTHON login-success-change-email.py $1 #works
$PYTHON login-success-change-password.py $1 #works

# Run Integration Tests (admin tests)
$PYTHON register-admin-standard.py $1 #works - Run first time. This time for rejection
$PYTHON login-admin-fail-unapproved-admin.py $1 #works
$PYTHON reject-admin.py $1 #works
$PYTHON register-admin-standard.py $1 #works - Run second time. This time for approval
$PYTHON approve-admin.py $1 #works
$PYTHON login-admin-fail-incorrect-pass.py $1 #works
$PYTHON login-admin-fail-incorrect-user.py $1 #works
$PYTHON login-admin-success.py $1 #works
$PYTHON login-admin-success-change-email.py $1 #works
$PYTHON admin-email-to-user.py $1 #works
$PYTHON admin-deactivate-user.py $1 #works
$PYTHON admin-activate-user.py $1 #works

#Admin permissions
$PYTHON permit-all-admin-privileges.py $1 #works
$PYTHON revoke-all-admin-privileges.py $1 #works
$PYTHON permit-allow-reject-admin-requests-privilege.py $1 #works
$PYTHON revoke-allow-reject-admin-requests-privilege.py $1 #works
$PYTHON permit-set-admin-privilege.py $1 #works
$PYTHON revoke-set-admin-privilege.py $1 #works
$PYTHON permit-email-page-privilege.py $1 #works
$PYTHON revoke-email-page-privilege.py $1 #works
$PYTHON permit-user-access-page-privilege.py $1 #works
$PYTHON revoke-user-access-page-privilege.py $1 #works

#Run these tests after all other tests because these will break other tests
$PYTHON login-admin-success-change-password.py $1
$PYTHON revoke-admin-access.py $1
$PYTHON admin-security-page.py $1
$PYTHON check-admin-audit-trail.py $1

#Not applicable for current version. All tests below were moved to ./selenium/legacy_tests
# python3 addHug_success.py # not applicable for current version
# python3 dashboard-email-functions.py # not applicable for current version because of login-success-change-primary-email.py fullfills that role
# python3 healthwell.py # not applicable for current version
# python3 healthwell2.py # not applicable for current version
# python3 healthwell3.py # not appicable for current version
# python3 login-success-change-security-questions.py # not applicable for current version
# python3 login-success-delete-email.py # not applicable for current version.
# python3 organizationpages.py # not applicable for current version.
# python3 register-apply-now-custom-questions.py # not applicable for current version.
# python3 register-apply-now-standard-questions.py # not applicable for current version.
# python3 register-browse-dashboard-custom-questions.py # not applicable for current version.
# python3 register-browse-dashboard-standard-questions.py # not applicable for current version.
# python3 verifyorg_add.py # not applicable for current version.
# python3 verifyorg_fail.py # not applicable for current version.
# python3 verifyorg_success.py # not applicable for current version.

# python3 login-success-add-email.py # not able to add another email. There is only a primary in this version.
# python3 login-success-change-primary-email.py # not applicable in this version. Not able to add more than one email, therefore same as login-success-change-email.py