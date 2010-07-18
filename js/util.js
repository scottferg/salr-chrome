// Copyright (c) 2009, Scott Ferguson
// All rights reserved.
// 
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the software nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
// 
// THIS SOFTWARE IS PROVIDED BY SCOTT FERGUSON ''AS IS'' AND ANY
// EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
// WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL SCOTT FERGUSON BE LIABLE FOR ANY
// DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
// ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
// SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/**
 * Returns the current PHP page the user is on
 *
 */
function findCurrentPage() {
    // Substrings out everything after the domain, then splits on the ?
    // and takes the left-side of the result
    return (window.location.href).substr(33).split('?')[0];
}

/**
 * Returns the current forum ID
 *
 */
function findForumID() {
    // Substrings out everything after the domain, then splits on the ?,
    // defaults to the argument list (right), splits on the &, looks at the first
    // parameter in the list, and splits on the = to get the result
    var parameterList = ((window.location.href).substr(33).split('?')[1]).split('&');

    for (var parameter in parameterList) {
        var currentParam = (parameterList[parameter]).split('=');

        if (currentParam[0] == 'threadid' || currentParam[0] == 'forumid') {
            return currentParam[1]; 
        }
    }
}

/**
 * Count the total number of pages to display in page navigator
 *
 */
function countPages() {

    var index = (findCurrentPage() == 'forumdisplay.php') ? 5 : 3;

    var result;

    jQuery('.pages').each(function() {
        var text = jQuery(this).html();
        var firstIndex = text.indexOf('(');
        var endIndex = text.indexOf(')');

        result = text.substr(firstIndex + 1, endIndex - (firstIndex + 1));
    });

    return Number(result);
}

/**
 * Jumps the user to the specified page
 *
 * @param rootPageType - forumid or threadid
 * @param basePagID - ID number associated with rootPageType
 * @param page - Page number to jump to
 *
 */
function jumpToPage(rootPageType, basePageID, page) {
    location.href = 'http://forums.somethingawful.com/' + findCurrentPage() + '?' + rootPageType + '=' + basePageID + '&pagenumber=' + page;
}
