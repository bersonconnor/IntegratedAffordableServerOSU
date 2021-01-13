# Frontend Reduction
*The purpose of this document is to detail the work done to simplify the frontend for the COVID-19 Relief deployment. Since this is a scaled back version of Affordable, much of the functionality of the user interface needed to be reduced to reduce complexity of the site. These reductions include commenting out unnecessary components that could be used in future development or deleting broken or severely underdeveloped components from the frontend.*
## Registration and Login
* Commented out donor registration. Since the only users for the COVID-19 Relief version of Affordable are recipients, users are automatically recipient accounts upon registration
* Commented out 2FA setup. 2 Factor Authentication current does not work, and there has been talk of using another library for this feature, since this is not necessarily needed in an MVP, it has been commented out to display the setup for assistance in future development.
## Recipient UI
The following are changes made to the various subpages listed in the sidebar of the recipient user interface. 
__Note:__ Siderbar tests commented out due to changes to the updates made to the sidebar
__The affected pages include:__
* __Profile Form:__ Already been simplified by other members of the development team
* __Settings Page:__
  * __Account Tab:__
    * Password change has been left untouched. However, this functionality needs to be fixed
      * Note: The rules for a password (length, non-alphanumeric symbol, capital letter, number) that are posted in the password reset are not enforced upon registration
    * Change primary email and add and email options have been commented out. Changing an email has already been added to the the email management tab and adding a second email does not work, so both have been commented out for future development
    * The delete email button has been commented out. The change email function will also need to be fixed.
    * The account activity panel has been commented out. While it seems to be working for certain tasks, it needs to be further updated for new tasks
    * The account closer panel has been removed. This function is broken and currently crashes the server, and should probably be relegated as an admin privilege.
  * __Security Tab:__ Commented out. Many components for the security tab are either broken or not needed for an MVP. So the tab was commented out for future development
    * Removed security questions panel. No longer being used
    * The session panel and the email encryption panel were both removed. Both panels were broken and poorly designed (i.e. there is no way to save the changes made by the user to these fields). Thus, they were removed from the security tab
  * __Notifications Tab:__ Removed. There was no work done on the notifications tab beyond the transition to the notifications subpage, so the tab was removed
* __Dashboard:__ Commented out. The Grant and Service Application Tracker table does not seem to be currently working. Since the current flow includes “one grant to one recipient”, having an application table right now does not seem to make sense if the average user should only have one grant. Thus, this page will be commented out of the sidebar, to be added back in with future development.
  * Further – registration and login now routes to the application form
* __Appication Center:__ The collapsible menu has been commented out. There are many a couple options that are underdeveloped/unnecessary in this iteration, so to ease complexity the focus has been placed to the apply and search tabs
  * __Manager Tab:__ removed. This page was underdeveloped
  * __Apply Tab:__ This page is to undergo a redesign by another development team
  * __Message Tab:__ removed. This page was underdeveloped
  * __Search Tab:__ This page is to undergo a redesign by another development team
* __Medical Debt Marketplace Tab:__ removed. This page was underdeveloped and routed to an error page
* __Support Tab:__ removed. This page was underdeveloped and routed to an error page