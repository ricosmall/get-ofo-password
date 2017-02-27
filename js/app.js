/**
 * @author ricosmall
 */

 var print = console.log;

 var $ = function(id) {
     return document.getElementById(id);
 };

 var getJSON = function(url, success, error) {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);

    xhr.onreadystatechange = function () {
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

window.onload = function () {
    var pwd = $('pwd'),
        id = $('id'),
        search = $('search'),
        wrapper = $('wrapper'),
        error = $('error');

    var showError = function () {
        wrapper.classList.add('has-error');
        error.style.display = 'block';
    };

    var hideError = function () {
        pwdInit();

        wrapper.classList.remove('has-error');
        error.style.display = 'none';
    };

    var pwdShow = function (password) {
        pwd.classList.add('bg-success');
        pwd.innerHTML = password;
    };

    var pwdInit = function () {
        pwd.innerHTML = '';
        pwd.classList.remove('bg-success');
        pwd.classList.remove('bg-danger');
    };

    var pwdError = function () {
        pwd.classList.add('bg-danger');
        pwd.innerHTML = '无此车密码';
    };

    var isIdValid = function () {
        return id.value === '' ? false : true;
    };

    var handlePwd = function (password) {
        if (password === '') {
            pwdError();
            return;
        }
        pwdShow(password);
    };

    var searchData = function () {
        if (!isIdValid()) {
            showError();
            return;
        }

        var idValue = id.value;

        getJSON('data/data.json', function (response) {
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
        }, handleError);

    }

    id.addEventListener('focus', hideError);

    search.addEventListener('click', searchData);

};
