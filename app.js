var requestify = require('requestify');

var fs = require('fs');

var apiBaseUrl = 'https://api.github.com/repos/paddingme/';

var repos = [
  'paddingme.github.io',
  'Learning-HTML-CSS',
  'Learning-JavaScript',
  'DailyReading'
];


function getIssues(repo) {

  var url = apiBaseUrl + repo + '/issues?page=1&per_page=100';

  requestify.get(url).then(function(res) {

    var datas = JSON.parse(res.body);

    if (Object.prototype.toString.call(datas) === '[object Array]') {

      console.log(repo + ' 有' + datas.length + '篇文章！');

      console.log('///////////////////////////////////////////////////////////////////////////')

      datas.forEach(function(data) {

        console.log('标题:  ' + data.title);

        // 过滤题目中的空格
        data.title = data.title.replace(' ', '');
        // 将标题中的/ 替换为-
        data.title = data.title.replace('/', '-');


        // console.log('url：' + data.html_url);
        // console.log('created_at：' + data.created_at);
        // console.log('updated_at： ' + data.updated_at);

        var tags = '';

        if (data.labels.length) {
          data.labels.forEach(function(label) {
            tags = tags + '- ' + label.name + '\r\n';
          })
        } else {
          tags = '- undefined\r\n';
        }

        // console.log('tags： ' + tags);

        var sign = '\r\n 文章取自我的 Github  repos: ' + '[' + repo + '](https://github.com/paddingme/' + repo + ')， 作者：[@paddingme](http://padding.me/about.html)    \r\n原文链接：['+ data.html_url + ']('+ data.html_url + ')\r\n\r\n';

        var fileName = data.created_at.split('T')[0] + '-' + data.title + '.md';

        var fileContent = '---\r\ntitle: ' + data.title + '\r\nlayout: post\r\ntags:\r\n' + tags + '---\r\n\r\n' + sign + data.body;

        fs.writeFile('./md/' + fileName, fileContent, function(err) {
          if (err) {
            console.log(err);
          }
        });

      })
    }

  });

}

repos.forEach(getIssues);
