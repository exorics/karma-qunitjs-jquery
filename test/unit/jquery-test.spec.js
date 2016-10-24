QUnit.module('Jquery check');
seajs.use([],function() {

    QUnit.test('public api ', function(assert) {


        assert.ok($, 'Passed!');

        var markup = $( "<input type='text' id='inputfield' />"  ).appendTo('body');
        
        markup.trigger('focus');
        markup.val('2');
        
        // var e = $.Event('keypress', { keyCode: 49 });
        // markup.trigger(e);

        markup.trigger('blur');
        console.log('111111:'+markup.val());

        markup.remove();
    });
});