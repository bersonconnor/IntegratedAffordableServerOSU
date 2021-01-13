## App
* Continuously pings /transaction/balance endpoint every couple seconds, this seems like a scalability problem (Possibly update on refresh only)
* When adding a TFA device during registration, the name in the google authenticator app will be the name currently in the username field, not the one that is finally created. This could be fixed by routing to a second screen after account creation to add TFA.
* When the app recieves a 401 response from the backend the app crashes. The app should redirect out to the login page instead.

## Server
* ProfileService.addTwoFactor method crashes if an apostrophe is used in the device name.
* If two factor fails during registration then the user will still be created (Possibly notify that the account is created?)