# bfwone
bfwone.js is a dynamic loading library for js,make you html clear，include once,get js plugin dynamic 
demo page
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>BFWONE.JS DEMO PAGE</title>
    <script id="bfwone" data="dep=jquery.17&err=1" type="text/javascript" src="http://repo.bfw.wiki/bfwrepo/js/bfwone-min.js"></script>
    <script type="text/BfwJavascript">
        bready(function() {
            use(["colpick", "colpick"], function() {
                $('#picker').colpick({
                    flat: true,
                    layout: 'hex',
                    submit: 0
                });
            });
        });
    </script>
</head>
<body>
    <div id="picker">
        时间选择器
    </div>
</body>
</html>
```

