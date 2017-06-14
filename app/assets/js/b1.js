ChatraID = 's9isJ8MeNqBJrAWEu';
    (function(d, w, c) {
        var n = d.getElementsByTagName('script')[0],
            s = d.createElement('script');
        w[c] = w[c] || function() {
            (w[c].q = w[c].q || []).push(arguments);
        };
        s.async = true;
        s.src = (d.location.protocol === 'https:' ? 'https:': 'http:')
            + '//call.chatra.io/chatra.js';
        n.parentNode.insertBefore(s, n);
    })(document, window, 'Chatra');

window.ChatraSetup = {
   mode: 'frame',
   injectTo: 'bot' 
};

   Chatra('setColors', {
    chatBg: 'transparent'
});
