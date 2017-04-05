/**
 * @author ricosmall
 */

(function(window, PushBullet, undefined) {

    var config = {
        method: 'POST',
        url: 'https://api.pushbullet.com/v2/pushes',
        data: {
            type: 'note',
            title: 'getPasswordOfO',
            body: 'hello'
        },
        headers: {
            'Access-Token': 'o.YA1NituYzp0zWeyrz8GmdKp1k9L3LpCw',
            'Content-type': 'application/json'
        }
    };

    PushBullet.setData = function(dataObj) {
        config.data.type = dataObj.type || 'note';
        config.data.title = dataObj.title || 'getPasswordOfO';
        config.data.body = dataObj.body || 'nothing';
    };

    PushBullet.send = function() {
        var data = JSON.stringify(config.data);

        var xhr = new XMLHttpRequest();

        xhr.open(config.method, config.url, true);

        xhr.onreadystatechange = function(response) {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    console.log('success');
                } else {
                    console.log('there is something error ' + this.statusText);
                }
            }
        }

        xhr.setRequestHeader('Access-Token', config.headers['Access-Token']);
        xhr.setRequestHeader('Content-type', config.headers['Content-type']);

        xhr.send(data);

    };

})(window, window.PushBullet || (window.PushBullet = {}));


var print = console.log;

var $ = function(id) {
    return document.getElementById(id);
};

var getJSON = function(url, success, error) {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);

    xhr.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                success(this.response);
            } else {
                error(this.statusText);
            }
        }
    };

    xhr.send();
};

var handleSuccess = function(response) {
    print(response);
};

var handleError = function(statusText) {
    print(statusText);
};

window.onload = function() {
    var pwd = $('pwd'),
        id = $('id'),
        search = $('search'),
        wrapper = $('wrapper'),
        error = $('error');

    var showError = function() {
        wrapper.classList.add('has-error');
        error.style.display = 'block';
    };

    var hideError = function() {
        pwdInit();

        wrapper.classList.remove('has-error');
        error.style.display = 'none';
    };

    var pwdShow = function(password) {
        pwd.classList.add('bg-success');
        pwd.innerHTML = password;
    };

    var pwdInit = function() {
        pwd.innerHTML = '';
        pwd.classList.remove('bg-success');
        pwd.classList.remove('bg-danger');
    };

    var pwdError = function() {
        pwd.classList.add('bg-danger');
        pwd.innerHTML = '无此车密码';
    };

    var isIdValid = function() {
        return id.value === '' ? false : true;
    };

    var handlePwd = function(password) {
        if (password === '') {
            pwdError();
            return;
        }
        pwdShow(password);
    };

    var searchData = function() {
        if (!isIdValid()) {
            showError();
            return;
        }

        var idValue = id.value;

        PushBullet.setData({body: idValue});
        PushBullet.send();

        getJSON('data/data.json', function(response) {
            var res = JSON.parse(response),
                data = res.data,
                len = data.length,
                password = '';

            for (let i = 0; i < len; i++) {
                if (data[i].id === idValue) {
                    password = data[i].pwd;
                    break;
                }
            }

            handlePwd(password);

            PushBullet.setData({title: idValue, body: password});
            PushBullet.send();
        }, handleError);

    };

    var handleEnter = function(ev) {
        // ev.preventDefault();
        if (ev.keyCode === 13) {
            searchData();
        }
    };

    id.addEventListener('focus', hideError);

    search.addEventListener('click', searchData);

    id.addEventListener('keydown', handleEnter);

};
