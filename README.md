Something Awful Last Read Extension for Chrome
==============================================

This is a port of the SALR extension for Firefox to Google Chrome. It adds a number of improvements to the Something Awful Forums on Chrome.

Installation
------------

To install, download the latest version with Chrome/Chromium.
If the downloader doesn't start automatically, drag the CRX
file into the browser window to install.

Updates will happen automatically.

Roadmap
-------

- On/off for thread highlighting
- quick reply box (on hold until extensions API supports popups)

Changelog
---------

### v0.8.0 - "Home stretch"

- Add mouse gestures (Scott Ferguson)
- Add keyboard shortcuts (Scott Ferguson)
- Fix possible form value issue in quick reply (Scott Ferguson)
- Add drop shadows to quick reply text (Scott Ferguson)

### v0.7.1 - "Fix ahoy"

- Apply BBcodes to highlighted text (Scott Ferguson)
- Add more qote parsers (Scott Ferguson)

### v0.7.0.1 - "Hotfix"
- Fix alignment of quick reply sidebar when resizing window (Scott Ferguson)

### v0.7.0 - "Hardcore Quick Reply"
- Add sidebar options for quick reply (Scott Ferguson)
- Fix breaklines when quoting in quick reply (Scott Ferguson)

### v0.6.5 - "Features ahoy"
- Add animations to quick reply box (Richard Hodgson)
- Create custom window control buttons for quick reply box (Richard Hodgson)
- A little HTML5 love for the settings page (Scott Ferguson)
- Don't bookmark a thread by default in the quick reply box (Scott Ferguson)
- Track quick reply visibility state in a more sane manner (Scott Ferguson)
- Don't erase a message draft when adding additional quotes (Scott Ferguson)
- Bind 'R' key to quick reply box (Scott Ferguson)
- Clear the message draft if the box is closed (Scott Ferguson)

### v0.6.1 - "Program it bitches"
- Add experimental quick reply box

### v0.6 - "Now we're cooking with gas"
- Add option to highlight usernames within posts (Scott Ferguson)
- Tweak manifest for when to run the content script (Scott Ferguson)
- Upgrade to latest jQuery (Scott Ferguson)
- Allow for SALR Browser Button extension to query (Scott Ferguson)

### v0.5.2 - "Fatty"

- Fix typo in settings name for OP highlighting color (Scott Ferguson)

### v0.5.2 - "Hotty"

- Fix crash when friend highlighting is enabled for a user with no friends
(Scott Ferguson)

### v0.5.1 - "Quicky"

- Fix bug where mod username highlighting broke mod post highlighting (Scott
Ferguson)
- Fix bug where usernotes was referenced with the wrong name (Scott Ferguson)

### v0.5 - "<Insert name here>"

- Cleanup how the ban history link is shown (Sebastian Paaske Tørholm)
- Add user notes (Sebastian Paaske Tørholm)
- Add custom boxing of quotes (Sebastian Paaske Tørholm)
- Make personal quote highlighting optional (Sebastian Paaske Tørholm)
- Allow highlighting of mod/admin usernames (Scott Ferguson)
- Cleanup new settings API (Scott Ferguson)

### v0.4.8 - "I'm drunk"

- Allow enabling/disabling of page navigator (Scott Ferguson)
- Experimental fix for page navigator drop-shadow ghosting (Scott Ferguson)
- Add feature to open all updated threads (Scott Ferguson)

### v0.4.7 - "Cruise Control"

- Fix navigator bug when resizing window (Sebastian Paaske Tørholm)
- Code cleanup and optimizations (Sebastian Paaske Tørholm)
- Highlight posts by friends (Sebastian Paaske Tørholm)
- Highlight posts by moderators/administrators (Sebastian Paaske Tørholm)

### v0.4.6 - "Whoops, buggy"

- Enable OP post highlighting (Sebastian Paaske Tørholm)
- Use Chrome options API for settings menu (Bill Best)
- Fix missing option parameter for custom buttons (Scott Ferguson)

### v0.4.5 - "Fine, here's the jump list"

- Add forums jump list (Sebastian Paaske Tørholm, Scott Ferguson)
- Fix possible error when using inline post counts (Scott Ferguson)

### v0.4.1 - "CM mod"

- Fix default setting for custom jump buttons (Scott Ferguson)
- Fix highlighting bug for custom jump buttons (Scott Ferguson)

### v0.4 - "Holy shit an update"

- Add option to highlight friend's posts (Sebastian Paaske Tørholm)
- Add option to display new post counts inline (Scott Ferguson)
- Add option to disable custom jump buttons (Scott Ferguson)
- Fix bug to show navigator over scrollbar (Scott Ferguson)

### v0.3.3 - "Milestones are for little girls"

- Don't display navigator if thread has one page (Scott Ferguson)
- Show 'Configure SALR' link by default (Scott Ferguson)
- Add 'Ban History' link (Scott Ferguson)

### v0.3.2 - "Fat lady"

- Dramatically reduced CRX size (Scott Ferguson)

### v0.3.1 - "Whoops, forgot to fix that"

- Fix page navigator offset when resizing window (Scott Ferguson)
- Add drop shadows to page navigator (Scott Ferguson)
- Add rounded corners to page navigator (Scott Ferguson)

### v0.3 - "Page navigator motherfucker!"

- Add page navigator (Scott Ferguson)
- Add 'Configure SALR' link (Bill Best)
- Styling tweaks in settings UI (Scott Ferguson)
- Bugfixes

### v0.2 - "Where did all this code come from?"

- Add option for embedding inline Youtube videos (Jono Taberner)
- Fix the jQuery colorpicker widget (Jono Taberner)
- Display images as inline links (Bill Best)
- Display images from inline links (Bill Best)
- Hide NWS/NMS images (Bill Best)
- Set default highlighting preferences (Scott Ferguson)
- Added update manifest (Scott Ferguson)

### v0.1 - "Initial release"

- Basic username highlighting (Scott Ferguson)
- Basic thread highlighting (Scott Ferguson)
- Hide/display header and footer ads (Scott Ferguson)
- Settings panel (Scott Ferguson)

License
-------

Copyright (c) 2009-2012 Scott Ferguson
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of the software nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY SCOTT FERGUSON ''AS IS'' AND ANY
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL SCOTT FERGUSON BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

