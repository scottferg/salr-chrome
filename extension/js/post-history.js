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

function PostHistory(callback) {
    this.database = window.openDatabase("post_history_db", "0.1", "SALR Post History", 1024 * 1024);
    this.callback = callback || false;

    if (!this.database) {
        console.log("Error opening database");
    }

    this.initDatabase();
}

PostHistory.prototype.initDatabase = function() {
    this.database.transaction(function(query) {
        query.executeSql('CREATE TABLE threads(id INTEGER PRIMARY KEY AUTOINCREMENT, thread_id VARCHAR(25) UNIQUE)', 
            []);
    });
};

PostHistory.prototype.addThread = function(thread_id) {
    this.database.transaction(function(query) {
        query.executeSql('INSERT INTO threads(thread_id) VALUES(?)', [thread_id]);
    });
};

PostHistory.prototype.getThreadStatus = function(thread_id) {
    var that = this;

    this.database.transaction(function(query) {
        query.executeSql("SELECT * FROM threads WHERE thread_id = ?", [thread_id],
            function(transaction, result) {
                if (result.rows.length > 0) {
                    that.callback(true, thread_id);
                } else {
                    that.callback(false, thread_id);
                }
            });
    });
};
