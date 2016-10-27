QUnit.module('Jquery check');
seajs.use(['plugin/typed'],function() {

    QUnit.test('public api ', function(assert) {


        assert.ok($, 'Passed!');

        var markup = $( "<input type='text' id='inputfield' />"  ).appendTo('body');
        stop();

        // $('#inputField').on('change', function() {
        //         console.log(arguments);
        //     })
        markup.trigger('focus');
        // var e = $.Event("keypress", { keyCode: 49 });
        // $('input:first').trigger(e);

        markup.typed({
            strings: ["First sentence.", "Second sentence."],
            typeSpeed: 0
        });
        setTimeout(function() {
            console.log('inputField',markup.val());
            assert.equal(document.activeElement, markup[0], "Input was focused");
            markup.trigger('blur');
            markup.remove();
            start();
        },1500);
        
        
    });
});